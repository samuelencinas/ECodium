<!-- ECODIUM - TFG Samuel Encinas -->
<!-- PÁGINA: Banco (sólo visible para usuarios de tipo Jugador) -->
<template>
  <q-page class="q-pa-sm" v-if="this.$store.state.auth.user.rol.includes('player')">
    <vth-status>
      <template slot-scope="web3">
        <div>
          <!-- TÍTULO -->
          <q-item>
            <q-item-section avatar>
              <q-icon
                v-if="$q.dark.isActive"
                size="500%"
                name="img:icons/iconos/lightmode/banco.svg"
              />
              <q-icon v-else size="500%" name="img:icons/iconos/darkmode/banco.svg" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h3 text-primary text-weight-bolder"
                >Banco</q-item-label
              >
              <div class="text-h6">
                Desde aquí podrás canjear tu experiencia por Pases de Acceso o tu
                experiencia acumulada por TALENTOS (TAL), un token ERC20 de la red
                Ethereum.
              </div>
            </q-item-section>
          </q-item>
        </div>
        <div class="q-col-gutter-xs q-pa-md">
          <!--CANJEAR EXP POR TAL o PASES -->

          <div class="row justify-between">
            <!-- SE MUESTRA SI FUNCIONA WEB3 --->
            <vth-contract
              v-if="web3.account"
              v-bind:address="address"
              v-bind:abi="abi"
              ref="refContrato"
            >
              <q-card class="q-ma-md title-box">
                <q-item class="index-box">
                  <q-item-section avatar>
                    <q-icon size="400%" name="img:icons/iconos/lightmode/banco.svg" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-h5 text-weight-bolder"
                      >Canjear por Talentos (TAL)</q-item-label
                    >
                  </q-item-section>
                  <q-item-section> </q-item-section>
                  <q-card-section v-if="$q.screen.gt.md">
                    <div class="text-overline">
                      Cotización actual:
                      <div class="text-subtitle2 text-weight-bolder">
                        10 XP acumulada = 1 TAL
                      </div>
                    </div>
                  </q-card-section>
                </q-item>

                <q-card-section>
                  <q-form class="">
                    <div class="input-group row">
                      <q-input
                        class="col-4 q-pa-md"
                        disable
                        readonly
                        filled
                        suffix="XP"
                        v-model="xpDisponible"
                        hint="XP acumulada disponible para canjear"
                        style="width: 250px"
                      />
                      <q-input
                        class="col-4 q-pa-md"
                        disable
                        readonly
                        filled
                        suffix="XP"
                        v-model="xpGastada"
                        hint="XP acumulada ya canjeada"
                        style="width: 250px"
                      />
                      <q-input
                        class="col-4 q-pa-md"
                        disable
                        readonly
                        filled
                        suffix="XP"
                        v-model="xpTotal"
                        hint="Total de XP"
                        style="width: 250px"
                      />
                    </div>
                    <div class="input-group row justify-between">
                      <q-space />
                    </div>
                    <div class="input-group row justify-between">
                      <div class="text-h6">
                        ¿Cuántos puntos de experiencia quieres convertir en TALENTOS?
                      </div>
                    </div>
                    <div class="input-group row justify-between">
                      <q-space />
                    </div>
                    <div class="input-group row justify-between">
                      <q-input
                        class="col-2"
                        filled
                        suffix="XP"
                        mask="#####"
                        v-model="xpCanjear"
                      />
                      <q-slider
                        class="col-6"
                        v-model="xpCanjear"
                        :min="10"
                        :max="xpDisponible"
                        :step="1"
                      />
                      <q-btn
                        flat
                        class="col-1"
                        @click="maximoDisponible"
                        label="MAX"
                        color="primary"
                      />

                      <q-input
                        class="col-2"
                        disable
                        readonly
                        filled
                        suffix="TAL"
                        v-model="calcularTAL"
                      />
                    </div>
                    <q-dialog v-model="mostrarErrorTransferencia">
                      <q-banner inline-actions class="text-white bg-red">
                        Has cancelado la transferencia. Los tokens no han sido generados.
                        <template v-slot:action>
                          <q-btn
                            flat
                            color="white"
                            @click="this.mostrarErrorTransferencia = false"
                            label="Entendido"
                          />
                        </template>
                      </q-banner>
                    </q-dialog>
                    <div class="input-group row justify-center items-center">
                      <q-btn class="bg-primary" push @click="solicitarTransaccion">
                        Obtener TALENTOS
                      </q-btn>
                    </div>
                  </q-form>
                </q-card-section>
              </q-card>
            </vth-contract>
            <div class="q-ma-md col" v-else>
              <q-banner inline-actions class="text-white bg-red">
                <template v-slot:avatar>
                  <q-icon name="warning" color="secondary" />
                </template>
                No se ha podido conectar con la red Ethereum. Activa MetaMask, recarga la
                página o prueba más tarde.
                <template v-slot:action>
                  <q-btn flat color="white" @click="recargar" label="Recargar" />
                </template>
              </q-banner>
            </div>
            <q-card class="q-ma-md title-box">
              <q-item class="index-box">
                <q-item-section avatar>
                  <q-icon size="400%" name="img:icons/iconos/lightmode/banco.svg" />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-h5 text-weight-bolder"
                    >Canjear por Pases de Acceso</q-item-label
                  >
                </q-item-section>
                <q-card-section v-if="$q.screen.gt.md">
                  <div class="text-overline">
                    Cotización actual:
                    <div class="text-subtitle2 text-weight-bolder">15 XP = 1 Pase</div>
                  </div>
                </q-card-section>
              </q-item>

              <q-card-section>
                <q-form class="">
                  <div class="input-group row justify-between">
                    <q-input
                      class="col-4"
                      disable
                      readonly
                      filled
                      suffix="XP"
                      v-model="xpTotal"
                      hint="Total de XP que tienes actualmente"
                      style="width: 250px"
                    />
                  </div>
                  <div class="input-group row justify-between">
                    <q-space />
                  </div>
                  <div class="input-group row justify-between">
                    <div class="text-h6">
                      ¿Cuántos Pases de Acceso quieres adquirir con tus Puntos de
                      Experiencia actuales?
                    </div>
                  </div>
                  <div class="input-group row justify-between">
                    <q-space />
                  </div>
                  <div class="input-group row justify-between">
                    <q-input class="col-2" filled suffix="XP" v-model="xpCanjearPases" />
                    <q-slider
                      class="col-6"
                      v-model="xpCanjearPases"
                      :min="15"
                      :max="xpTotal"
                      :step="15"
                    />
                    <q-btn
                      flat
                      class="col-1"
                      @click="maximoDisponible"
                      label="MAX"
                      color="primary"
                    />

                    <q-input
                      class="col-2"
                      disable
                      readonly
                      filled
                      suffix="Pases"
                      v-model="calcularPases"
                    />
                  </div>
                  <q-dialog v-model="mostrarErrorTransferencia">
                    <q-banner inline-actions class="text-white bg-red">
                      Has cancelado la transferencia. Los tokens no han sido generados.
                      <template v-slot:action>
                        <q-btn
                          flat
                          color="white"
                          @click="this.mostrarErrorTransferencia = false"
                          label="Entendido"
                        />
                      </template>
                    </q-banner>
                  </q-dialog>
                  <div class="input-group row justify-center items-center">
                    <q-btn class="bg-primary" push @click="comprarPases">
                      Obtener PASES
                    </q-btn>
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </div>
          <!--HISTÓRICO DE TRANSACCIONES-->
          <q-card class="q-mt-md col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item class="bg-secondary index-box text-white">
              <q-item-section avatar>
                <q-icon size="400%" name="img:icons/iconos/lightmode/banco.svg" />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-h4 text-weight-bolder"
                  >Histórico de Transacciones</q-item-label
                >
              </q-item-section>
              <q-item-section> </q-item-section>
            </q-item>

            <q-card-section>
              <div class="q-ma-md">
                <q-table
                  title="Transacciones"
                  :data="datosTransacciones"
                  :columns="columnasTransacciones"
                  color="primary"
                  row-key="name"
                >
                  <template v-slot:top-right>
                    <q-btn
                      color="primary"
                      icon-right="archive"
                      label="Exportar a CSV"
                      no-caps
                      @click="exportarTabla"
                    />
                  </template>
                </q-table>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </vth-status>
  </q-page>
  <q-page v-else>
    <q-banner inline-actions class="text-white bg-red">
      <template v-slot:avatar>
        <q-icon name="warning" color="secondary" />
      </template>
      Página solo visible para Jugadores
      <template v-slot:action> </template>
    </q-banner>
  </q-page>
</template>

<script>
import { date, exportFile } from "quasar";
import axios from "axios";

function convertiraExcel(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted = formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

// Datos del Contract
const abi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "spender",
        type: "address",
      },
      {
        name: "tokens",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "success",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_givenSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "from",
        type: "address",
      },
      {
        name: "to",
        type: "address",
      },
      {
        name: "tokens",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "success",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "tokens",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [
      {
        name: "success",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "tokenOwner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "tokens",
        type: "uint256",
      },
    ],
    name: "reduceSupply",
    outputs: [
      {
        name: "success",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "tokens",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [
      {
        name: "success",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "a",
        type: "uint256",
      },
      {
        name: "b",
        type: "uint256",
      },
    ],
    name: "safeSub",
    outputs: [
      {
        name: "c",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "to",
        type: "address",
      },
      {
        name: "tokens",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "success",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "a",
        type: "uint256",
      },
      {
        name: "b",
        type: "uint256",
      },
    ],
    name: "safeDiv",
    outputs: [
      {
        name: "c",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "spender",
        type: "address",
      },
      {
        name: "tokens",
        type: "uint256",
      },
      {
        name: "data",
        type: "bytes",
      },
    ],
    name: "approveAndCall",
    outputs: [
      {
        name: "success",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "a",
        type: "uint256",
      },
      {
        name: "b",
        type: "uint256",
      },
    ],
    name: "safeMul",
    outputs: [
      {
        name: "c",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "tokenOwner",
        type: "address",
      },
      {
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "remaining",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "a",
        type: "uint256",
      },
      {
        name: "b",
        type: "uint256",
      },
    ],
    name: "safeAdd",
    outputs: [
      {
        name: "c",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "tokens",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "tokenOwner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "tokens",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
];
const address = "0xfcDdd725BABD13a35d4Bb9434FFdD393cd845DEc";
export default {
  meta() {
    return {
      title: "ECodium | Banco",
    };
  },
  data() {
    // Funciones auxiliares
    function sumarDeArray(array, propiedad) {
      return array.reduce(function (r, a) {
        return r + a[propiedad];
      }, 0);
    }

    function formatearNumero(num) {
      return Math.abs(num) > 999
        ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
        : Math.sign(num) * Math.abs(num);
    }
    this.inicializar();
    this.$store.commit("setMenuStatus", "banco");
    const movimientos = this.$store.state.auth.user.movimientosExp;
    const transacciones = this.$store.state.auth.user.transaccionesTal;
    const xpTotal = movimientos ? sumarDeArray(movimientos, "cantidad") : 0;
    const xpGastada = transacciones ? sumarDeArray(transacciones, "exp") : 0;
    const xpDisponible = Number(xpTotal - 0);
    return {
      address: address,
      abi: abi,
      xpDisponible: formatearNumero(xpDisponible),
      xpTotal: formatearNumero(xpTotal),
      xpGastada: formatearNumero(xpGastada),
      xpCanjear: xpDisponible,
      xpCanjearPases: 15,
      userAccount: "",
      datosTransacciones: this.$store.state.auth.user.transaccionesTal
        ? this.$store.state.auth.user.transaccionesTal
        : [],
      columnasTransacciones: [
        {
          name: "desc",
          required: true,
          label: "Fecha",
          align: "left",
          field: (row) => date.formatDate(row.fecha, "DD/MM/YYYY HH:mm"),
          sortable: true,
        },
        {
          name: "exp",
          align: "center",
          label: "Puntos de Experiencia canjeados",
          field: (row) => row.exp,
          sortable: true,
        },
        {
          name: "tal",
          label: "TAL obtenidos",
          field: (row) => row.tal,
          sortable: true,
        },
      ],
      mostrarErrorTransferencia: false,
    };
  },

  methods: {
    maximoDisponible() {
      this.xpCanjear = this.xpDisponible;
    },
    recargar() {
      location.reload();
    },
    numPases() {
      return Number(this.xpCanjearPases / 15);
    },
    async inicializar() {
      const account = ethereum
        .request({
          method: "eth_accounts",
        })
        .then((account) => {
          this.userAccount = account[0];
        });
    },
    async solicitarTransaccion() {
      const cantidad = Math.round((this.calcularTAL + Number.EPSILON) * 100) / 100;
      const talGenerados = Number(cantidad * 100);
      this.$refs.refContrato.contract
        .mint(talGenerados)
        .then((res) => {
          const uid = this.$store.state.auth.user._id;
          const apiCall = "https://api.ecodium.dev/api/auth/actualizar/" + uid;
          const transaccion = {
            exp: this.xpCanjear,
            tal: this.calcularTAL,
            fecha: Date.now(),
          };
          const transacciones = this.$store.state.auth.user.transaccionesTal;

          transacciones && transacciones !== []
            ? transacciones.push(transaccion)
            : [transaccion];
          axios
            .put(apiCall, {
              transaccionesTal: transacciones,
            })
            .then((res) => {
              console.log(res.data);
            });
        })
        .catch((err) => {
          console.err(err);
        });
    },
    comprarPases() {
      const id = this.$store.state.auth.user._id;
      const pases = !!this.$store.state.auth.user.pases
        ? this.$store.state.auth.user.pases
        : 0;
      const movimiento = {
        cantidad: Number(0 - this.xpCanjearPases),
        fecha: date.formatDate(new Date(), "YYYY-MM-DDTHH:MM:ss"),
        concepto: "Compra de " + this.numPases() + " Pases de Acceso",
      };
      const movimientos = this.$store.state.auth.user.movimientosExp;
      if (!movimientos) movimientos = [];
      movimientos.push(movimiento);

      
      movimientos.push(movimiento);
      const apiCall = "https://api.ecodium.dev/api/auth/actualizar/" + id;
      const request = {
        pases: pases + this.numPases(),
        movimientosExp: movimientos,
      };
      axios
        .put(apiCall, request)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    exportarTabla() {
      const contenido = [
        this.columnasTransacciones.map((col) => convertiraExcel(col.label)),
      ]
        .concat(
          this.datosTransacciones.map((row) =>
            this.columnasTransacciones
              .map((col) =>
                convertiraExcel(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(",")
          )
        )
        .join("\r\n");

      const status = exportFile("ecodium.csv", contenido, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "El navegador rechazó la descarga..",
          color: "negative",
          icon: "warning",
        });
      }
    },
  },
  computed: {
    calcularTAL() {
      return Number(this.xpCanjear / 10);
    },
    calcularPases() {
      return Number(this.xpCanjearPases / 15);
    },
  },
};
</script>

<style lang="scss">
.input-group {
  margin-top: 10px;
  width: 100%;
}
</style>
