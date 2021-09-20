pragma solidity ^0.4.24;

// ----------------------------------------------------------------------------
// Smart Contract | TALENTO (Token ERC20 de Ecodium) | TFG Samuel Encinas Plaza
//
// Symbol        : TAL // Símbolo
// Name          : TALENTO - ECodium ERC20 Token Smart Contract // Nombre
// Total supply  : 100000000 // Disponibilidad inicial de tokens
// Decimals      : 2 // Número de decimales
// Owner Account : 0x4E3A3f3c9b2385B518c6Ea7eCEa777EE0a60E813 // Mi dirección de MetaMask
//
// Basado en la plantilla de Smart Contract de Juan Cruz Martinez 2020 (con licencia MIT)
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Lib: Safe Math
// ----------------------------------------------------------------------------
contract SafeMathLib {
    function safeAdd(uint256 a, uint256 b) public pure returns (uint256 c) {
        c = a + b;
        require(c >= a);
    }

    function safeSub(uint256 a, uint256 b) public pure returns (uint256 c) {
        require(b <= a);
        c = a - b;
    }

    function safeMul(uint256 a, uint256 b) public pure returns (uint256 c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }

    function safeDiv(uint256 a, uint256 b) public pure returns (uint256 c) {
        require(b > 0);
        c = a / b;
    }
}

/**
ERC Token Standard #20 Interface
https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
*/
contract ERC20Interface {
    function totalSupply() public constant returns (uint256);

    function balanceOf(address tokenOwner)
        public
        constant
        returns (uint256 balance);

    function allowance(address tokenOwner, address spender)
        public
        constant
        returns (uint256 remaining);

    function transfer(address to, uint256 tokens) public returns (bool success);

    function approve(address spender, uint256 tokens)
        public
        returns (bool success);

    function transferFrom(
        address from,
        address to,
        uint256 tokens
    ) public returns (bool success);

    event Transfer(address indexed from, address indexed to, uint256 tokens);
    event Approval(
        address indexed tokenOwner,
        address indexed spender,
        uint256 tokens
    );
}

/**
Contract function to receive approval and execute function in one call
Borrowed from MiniMeToken
*/
contract ApproveAndCallFallBack {
    function receiveApproval(
        address from,
        uint256 tokens,
        address token,
        bytes data
    ) public;
}

/**
ERC20 Token, with the addition of symbol, name and decimals and assisted token transfers
*/
contract TALToken is ERC20Interface, SafeMathLib {
    string public symbol;
    string public name;
    uint8 public decimals;
    uint256 public _totalSupply;
    uint256 public _givenSupply;
    uint256 last_mint_time;

    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowed;

    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    constructor() public {
        symbol = "TAL"; // Símbolo
        name = "TALENTO - ECodium ERC20 Token Smart Contract"; // Nombre
        decimals = 2; // Decimales
        _totalSupply = 100000000; //Tokens disponibles para repartir
        _givenSupply = 0; // Tokens repartidos
    }

    // ------------------------------------------------------------------------
    // Disponibilidad total
    // ------------------------------------------------------------------------
    function totalSupply() public constant returns (uint256) {
        return _totalSupply - balances[address(0)];
    }

    // ------------------------------------------------------------------------
    // Cantidad de tokens ya repartidos
    // ------------------------------------------------------------------------
    function getSupply() public constant returns (uint256) {
        return _givenSupply;
    }

    // ------------------------------------------------------------------------
    // Saldo del token en la dirección pasada como argumento
    // ------------------------------------------------------------------------
    function balanceOf(address tokenOwner)
        public
        constant
        returns (uint256 balance)
    {
        return balances[tokenOwner];
    }

    // ------------------------------------------------------------------------
    // Transferir de la dirección del usuario a la dirección pasada como argumento
    // - (La dirección del usuario debe tener suficientes tokens)
    // ------------------------------------------------------------------------
    function transfer(address to, uint256 tokens)
        public
        returns (bool success)
    {
        balances[msg.sender] = safeSub(balances[msg.sender], tokens);
        balances[to] = safeAdd(balances[to], tokens);
        emit Transfer(msg.sender, to, tokens);
        return true;
    }

    // ------------------------------------------------------------------------
    // Generar TALENTOS (ECodium --> BANCO --> Canjear)
    // ------------------------------------------------------------------------
    function mint(uint256 tokens) public returns (bool success) {
        // Limitar el minting de tokens a 5 minutos para no sobrecargar la red
        if (now - last_mint_time < 5 minutes) {
            return false;
        }
        require(tokens <= _totalSupply);
        balances[msg.sender] = safeAdd(balances[msg.sender], tokens); //Añadimos los tokens generados al saldo del usuario
        _totalSupply = safeSub(_totalSupply, tokens); // Restamos los tokens generados del supply disponible
        _givenSupply = safeAdd(_givenSupply, tokens); // Añadimos los tokens repartidos al supply ya repartido
        last_mint_time = now; // Guardamos la fecha del minting actual
        emit Transfer(address(0), msg.sender, tokens); // Emitimos un nuevo evento de transferencia de la direccion Genesis al usuario
        return true;
    }

    // ------------------------------------------------------------------------
    // Reducir disponibilidad de TALENTOS (ECodium --> ADMIN --> Reducir disponibilidad)
    // ------------------------------------------------------------------------
    function reduceSupply(uint256 tokens) public returns (bool success) {
        require(tokens <= _totalSupply);
        _totalSupply = safeSub(_totalSupply, tokens);
        _givenSupply = safeAdd(_givenSupply, tokens);
        emit Transfer(address(0), msg.sender, tokens);
        return true;
    }

    // ------------------------------------------------------------------------
    // Quemar TALENTOS (ECodium --> ADMIN --> Quemar)
    // ------------------------------------------------------------------------
    function burn(uint256 tokens) public returns (bool success) {
        require(tokens <= balances[msg.sender]);
        balances[msg.sender] = safeSub(balances[msg.sender], tokens);
        emit Transfer(msg.sender, address(0), tokens);
        return true;
    }

    // ------------------------------------------------------------------------
    // Transferir tokens de una dirección a otra
    // (ECodium -> TALLERES/EVENTOS -> Pagar)
    // ------------------------------------------------------------------------
    function transferFrom(
        address from,
        address to,
        uint256 tokens
    ) public returns (bool success) {
        balances[from] = safeSub(balances[from], tokens);
        allowed[from][msg.sender] = safeSub(allowed[from][msg.sender], tokens);
        balances[to] = safeAdd(balances[to], tokens);
        emit Transfer(from, to, tokens);
        return true;
    }

    // ------------------------------------------------------------------------
    // Aprobar transacción
    // ------------------------------------------------------------------------
    function approve(address spender, uint256 tokens)
        public
        returns (bool success)
    {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }

    // ------------------------------------------------------------------------
    // Devuelve la cantidad de tokens permitidos por el propietario que pueden ser transferidos
    // a la dirección pasada como argumento
    // ------------------------------------------------------------------------
    function allowance(address tokenOwner, address spender)
        public
        constant
        returns (uint256 remaining)
    {
        return allowed[tokenOwner][spender];
    }

    // ------------------------------------------------------------------------
    // Aprobar y llamar a la funci´ón cuando se apruebe
    // ------------------------------------------------------------------------
    function approveAndCall(
        address spender,
        uint256 tokens,
        bytes data
    ) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        ApproveAndCallFallBack(spender).receiveApproval(
            msg.sender,
            tokens,
            this,
            data
        );
        return true;
    }

    // ------------------------------------------------------------------------
    // No aceptar ECR
    // ------------------------------------------------------------------------
    function() public payable {
        revert();
    }
}
