<!-- ECODIUM - TFG Samuel Encinas -->
<!-- LAYOUT principal -->
<template>
  <q-layout view="hHh Lpr lff">
    <!-- CABECERA -->
    <q-header elevated class="bg-secondary active-8" height-hint="64">
      <q-toolbar class="GPL__toolbar" style="height: 64px">
        <q-btn
          flat
          dense
          round
          v-if="!$q.screen.gt.sm"
          @click="drawer = !drawer"
          aria-label="Menu"
          icon="menu"
          class="q-mx-md"
        />

        <q-toolbar-title
          shrink
          class="row items-center no-wrap"
        >
          <img class="ml-2 logo" src="../assets/img/logo.png" />
        </q-toolbar-title>

        <q-space />
          <template v-slot:prepend>
            <q-icon color="primary" v-if="search === ''" name="search" />
            <q-icon
              v-else
              name="clear"
              color="secondary"
              class="cursor-pointer"
              @click="search = ''"
            />
          </template>
        </q-input>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn
            v-if="!this.$q.dark.isActive"
            round
            dense
            flat
            color="text-white-7"
            icon="nightlight_round"
            @click="alternarColor"
          >
            <q-tooltip>Modo oscuro</q-tooltip>
          </q-btn>
          <q-btn
            v-if="this.$q.dark.isActive"
            round
            dense
            flat
            color="text-white-7"
            icon="light_mode"
            @click="alternarColor"
          >
            <q-tooltip>Modo claro</q-tooltip>
          </q-btn>
          <q-btn-dropdown
            rounded
            dense
            flat
            class="notifications"
            no-icon-animation
            color="white"
            dropdown-icon="notifications"
          >
            <template v-slot:label>
              <q-badge color="primary" text-color="white" floating>
                {{ notificationsArray.length }}
              </q-badge>
              <q-tooltip>Notificaciones</q-tooltip>
            </template>
            <notifications-box />
          </q-btn-dropdown>
        </div>

        <div class="q-pl-sm q-gutter-sm row items-center no-wrap">
          <q-btn rounded dense flat no-wrap>
            <q-avatar size="30px">
              <img :src="fotoUsuario">
            </q-avatar>
            <q-icon name="arrow_drop_down" size="16px" />
<q-menu>
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <div class="text-h6 q-mb-md">Ajustes</div>
            <q-toggle label="No molestar" />
            <q-btn color="primary" push size="sm" @click="editarPerfil = true" label="Editar perfil" />
          </div>
          
          <q-separator vertical inset class="q-mx-lg" />

          <div class="column items-center">
            <q-avatar size="72px">
              <img :src="fotoUsuario">
            </q-avatar>

              <ul class="userbuttoninfo">
                <li class="username">
                  {{ this.$store.state.auth.user.nombreUsuario }}
                </li>
                <li class="rank">{{ this.$store.state.auth.user.rank }}</li>
              </ul>

            <q-btn
              color="primary"
              icon="logout"
              @click="cerrarSesion"
              push
              size="sm"
              v-close-popup
            />
          </div>
        </div>
      </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- BARRA LATERAL -->
 <q-drawer

        v-model="drawer"
        show-if-above
        :mini="miniState"

        @mouseover="miniState = false"
        @mouseout="miniState = true"
        mini-to-overlay

        :width="260"
        :breakpoint="500"
        
        content-class="menu bg-secondary text-white"
      >
        <q-scroll-area class="fit">
          <q-list padding>
            <!-- BOTÓN RETOS -->
            <q-item clickable v-ripple to="/inicio">
              <q-item-section avatar>
              <q-icon :class="{
                active:
                  !!this.$store.state.data.menu &&
                  this.$store.state.data.menu === 'inicio'
              }" name="img:icons/iconos/lightmode/talento.svg" />
              </q-item-section>

              <q-item-section class="text-h6 text-weight-bold">
                Inicio
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/retos">
              <q-item-section avatar>
                <q-icon :class="{
                active:
                  !!this.$store.state.data.menu &&
                  this.$store.state.data.menu === 'retos'
              }" name="img:icons/iconos/lightmode/retos.svg" />
              </q-item-section>

              <q-item-section class="text-h6">
                Retos
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/eventos">
              <q-item-section avatar>
                <q-icon :class="{
                active:
                  !!this.$store.state.data.menu &&
                  this.$store.state.data.menu === 'eventos'
              }" name="img:icons/iconos/lightmode/eventos.svg" />
              </q-item-section>

              <q-item-section class="text-h6">
                Eventos
              </q-item-section>
            </q-item>

                        <q-item clickable v-ripple to="/talleres">
              <q-item-section avatar>
                <q-icon :class="{
                active:
                  !!this.$store.state.data.menu &&
                  this.$store.state.data.menu === 'talleres'
              }" name="img:icons/iconos/lightmode/talleres.svg" />
              </q-item-section>

              <q-item-section class="text-h6">
                Talleres
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/logros">
              <q-item-section avatar>
                <q-icon :class="{
                active:
                  !!this.$store.state.data.menu &&
                  this.$store.state.data.menu === 'logros'
              }" name="img:icons/iconos/lightmode/logros.svg" />
              </q-item-section>

              <q-item-section class="text-h6">
                Logros
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/banco">
              <q-item-section avatar>
                <q-icon :class="{
                active:
                  !!this.$store.state.data.menu &&
                  this.$store.state.data.menu === 'banco'
              }" name="img:icons/iconos/lightmode/banco.svg" />
              </q-item-section>

              <q-item-section class="text-h6">
                Banco
              </q-item-section>
            </q-item>

            <q-separator color="primary" />

            <q-item clickable v-ripple to="/comunidad">
              <q-item-section avatar>
                <q-icon :class="{
                active:
                  !!this.$store.state.data.menu &&
                  this.$store.state.data.menu === 'comunidad'
              }" name="people" />
              </q-item-section>

              <q-item-section class="text-h6">
                Comunidad
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/info">
              <q-item-section avatar>
                <q-icon :class="{
                active:
                  !!this.$store.state.data.menu &&
                  this.$store.state.data.menu === 'info'
              }" name="lightbulb" />
              </q-item-section>

              <q-item-section class="text-h6">
                Sobre ECodium
              </q-item-section>
            </q-item>

          </q-list>
        </q-scroll-area>
      </q-drawer>
    <!-- PÁGINA -->
     <q-dialog v-model="editarPerfil">
            <modal-editar-perfil :datos="datosUsuario" />
     </q-dialog>
    <q-page-container class="GPL__page-container">
      <router-view />

    </q-page-container>

  </q-layout>
</template>

<script>
import NotificationsBox from '../components/NotificationsBox';
import ModalEditarPerfil from '../components/ModalEditarPerfil.vue';
export default {
  name: "MainLayout",
  components: { NotificationsBox, ModalEditarPerfil },
  computed: {
    notificationsArray(){
      return this.$store.state.data.notifications;
    }
  },
  data() {
    // Inicialización de las notificaciones
    this.$store.dispatch("initNotifications");
    // Puesta a punto del tema
    this.$q.dark.set(localStorage.getItem('isDarkTheme') === "true");
    let theme = this.$q.dark.isActive ? "yonce" : "ttcn";
    this.$store.commit("setMenuStatus", theme);
    // Saludo al usuario al entrar en la aplicación
    const saludo =
      "Hola, " +
      (this.$store.state.auth.user.nombreUsuario
        ? this.$store.state.auth.user.nombreUsuario
        : this.$store.state.auth.user.email);
    this.$q.notify({
      position: "top-right",
      message: saludo,
              actions: [
          { label: 'X', color: 'white', handler: () => { /* ... */ } }
        ]
    });
    
    return {
      datosUsuario: {
      email: this.$store.state.auth.user.email,
      password: this.$store.state.auth.user.password,
      nombreUsuario: this.$store.state.auth.user.nombreUsuario,
      fotoPerfil: this.$store.state.auth.user.fotoPerfil
      },
    editarPerfil: false,
    fotoUsuario: this.$store.state.auth.user.fotoPerfil ? "https://api.ecodium.dev/subidas/" + this.$store.state.auth.user.fotoPerfil : "fotoperfil.png",
    miniState: true,
      drawer: false,
      search: "",
      storage: 0.26,
    };
  },
  watch:{
  'this.$store.state.data.notifications'(value, oldValue) {
  }
},
  methods: {
    obtenerIcono(icon) {
      const mode = this.$q.dark.isActive ? 'lightmode' : 'darkmode';
      return "img:icons/iconos/" + mode + "/" + icon +".svg"
    },
    cerrarSesion() {
      this.$store.dispatch("LOGOUT");
      window.location.reload();
    },
    alternarColor() {
      this.$q.dark.toggle();
      this.$store.commit("setDarkTheme", this.$q.dark.isActive)
      this.$root.$emit("alternarColor");
    },
    obtenerImagen() {
      const imagenPersonalizada = this.$store.state.auth.user.fotoPerfil;
      return (imagenPersonalizada) ? "" : 'a'
    }
  }
};
</script>

<style lang="scss">
.widget-med {
}
.widget-peque {
  width: 200px;
  height: 160px;
}
.widget-xpeque {
  width: 150px;
  height: 160px;
}
.widget-xl {
  width: 600px;
  height: 350px;
}
.widget-m {
  width: 260px;
  height: 175px;
}
.widget-ml {
  width: 300px;
  height: 175px;
}
.widget-l {
  width: 300px;
  height: 350px;
}
.widget-titulo {
  width: 100%;
  height: 130px!important;
}
.q-activity {
  margin-top: 0px !important;
}
.q-btn-dropdown--simple * + .q-btn-dropdown__arrow {
  margin-left: 0px;
}
img.logo {
  padding-top: 2%;
  padding-left: 2%;
  width: 60%;
  height: auto;
  /* Recommended - Limit maximum width */
  max-width: 400px;
}
img.logo2 {
  padding-top: 4%;
  padding-left: 4%;
  width: 90%;
  height: auto;
  /* Recommended - Limit maximum width */
  max-width: 400px;
}
.sidebar {
  background-color: $secondary;
  color: white;
}

.body--dark {
  background: $secondary;
  color: white;
  .index-box {
    background: rgba(255, 255, 255, 0.1);
    border-top: 0.1rem solid $secondary;
        border-bottom: 0.1rem solid $primary;
    border-radius: 1rem;
  }
}
.body--light {
  background: #f3f3f3;
  color: black;
    .index-box {
    background: rgba(0, 0, 0, 0.1);
        border-top: 0.1rem solid $primary;
        border-bottom: 0.1rem solid $secondary;
    border-radius: 1rem;
  }
}

.userbutton {
  background: transparent;
}
        .ecodium-card {
          background:silver;
        }
.menu {
  border-right: 0.1rem solid $primary;
border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
}

.active {
  border: 0.1rem solid $primary;
  border-radius: 1rem;
  padding: 5px;
  box-shadow: 0 0 0.5rem rgba(236, 119, 69, 0.2),
    0 0 0.25rem rgba(236, 119, 69, 0.4), 0 0 1rem rgba(236, 119, 69, 0.6);
}
.userbuttoninfo {
  list-style-type: none;
  padding-top: 17%;
  padding-bottom: 0px;
  padding-right: 0px;
  padding-left: 0px;
  margin-bottom: 0px;
  margin-top: 0px;
}
.username {
  line-height: 2px;
  text-transform: none;
}
.userMenu {
  right: 0px !important;
  width: 200px !important;
}
.rank {
  line-height: 35px;
  text-align: left;
  font-size: small;
  text-transform: none;
  font-variant: small-caps;
  color: silver;
}
.q-drawer--mini{
.q-icon {
  padding: 5px;
}
}
.q-drawer{
  background: transparent!important;
.q-icon {
  padding: 5px;
}
}
@media only screen and (min-width: 769px) {
html, body {
  margin: 0; height: 100%; overflow-x: hidden;
}
}
@media only screen and (max-width: 768px) {
  html, body {
    overflow-x: hidden;
  }
  .header {
  text-align: center;
}
.widget-peque {
  transform: scale(0.8)
}
.q-drawer {
    top: 64px;
}
img.logo {
  width: 100%;
}
}
  
</style>