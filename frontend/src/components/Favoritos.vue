<!-- ECODIUM - TFG Samuel Encinas -->
<!-- WEB COMPONENT: Widget de Usuarios Favoritos (para usuarios de tipo Ojeador) -->

<template>
  <q-card class="editor" flat style="height: 350px">
    <q-bar class="bg-primary barraMenu">
      <q-icon name="img:icons/iconos/lightmode/eventos.svg" />
      <div class="text-bold text-white">Usuarios favoritos</div>

      <q-space />

      <q-btn dense flat icon="minimize" @click="ventanaInfoExpanded = false" />
      <q-btn dense flat icon="crop_square" @click="ventanaInfoExpanded = true" />
      <q-btn dense flat icon="close" />
    </q-bar>
    <q-separator />

    <div class="q-pa-md justify-center">
      <q-table
        class="sticky no-shadow no-border"
        style="height: 280px"
        :data="lista"
        :columns="columnas"
        row-key="nombre"
        title="Mis usuarios favoritos"
        title-class="text-weight-bolder text-h6"
        :rows-per-page-options="[0]"
        hide-bottom
        virtual-scroll
      >
        <template v-slot:top class="bg-blue">
          <q-space />
          <q-btn dense flat icon="minimize" @click="ventanaInfoExpanded = false" />
          <q-btn dense flat icon="crop_square" @click="ventanaInfoExpanded = true" />
          <q-btn dense flat icon="close" />
        </template>

        <template v-slot:body-cell-Foto="lista">
          <q-td :props="lista">
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="obtenerFoto(lista.row)" />
                </q-avatar>
              </q-item-section>
            </q-item>
          </q-td>
        </template>
        <template v-slot:body-cell-Contacto="lista">
          <q-td :props="lista">
            <q-item>
              <q-item-section side>
                <q-btn round color="primary" icon="email" @click="modalContacto = true">
                  <q-tooltip> Contactar al usuario </q-tooltip>
                </q-btn>
              </q-item-section>
              <q-dialog v-model="modalContacto">
                <q-card style="width: 1000px">
                  <q-toolbar class="bg-primary justify-center text-h6">
                    <span class="text-weight-bold"
                      >Perfil público de {{ lista.row.nombreUsuario }}</span
                    >
                  </q-toolbar>
                  <q-card-section class="">
                    <formulario-contacto :dest="lista.row.nombreUsuario" />
                  </q-card-section>
                </q-card>
              </q-dialog>
            </q-item>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-card>
</template>

<script>
import axios from "axios";
import { date } from "quasar";
import FormularioContacto from "../components/FormularioContacto.vue";

export default {
  // name: 'ComponentName',
  components: { FormularioContacto },

  data() {
    return {
      usuarioSeleccionado: "",
      modalActivo: false,
    };
  },
  data() {
    this.obtenerLista();
    return {
      lista: [],
      columnas: [
        {
          name: "Foto",
          label: "Foto",
          field: "fotoPerfil",
          sortable: true,
          align: "left",
        },
        {
          name: "Nombre de usuario",
          label: "Nombre de usuario",
          field: "nombreUsuario",
          sortable: true,
          align: "left",
        },
        {
          name: "Contacto",
          label: "Contacto",
          field: "email",
          sortable: true,
          align: "left",
        },
      ],
      fotosPerfil: [],
      modalContacto: false,
    };
  },
  methods: {
    onRowClick(evt, row) {
      this.usuarioSeleccionado = row.nombreUsuario;
      
      this.modalActivo = true;
    },
    obtenerFoto(usuario) {
      return !!usuario.fotoPerfil && usuario.fotoPerfil !== ""
        ? "https://api.ecodium.dev/subidas/" + usuario.fotoPerfil
        : "fotoperfil.png";
    },
    obtenerLista() {
      const axiosConfig = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://www.ecodium.dev",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
        },
      };
      this.$store.state.auth.user.favoritos.forEach((fav) => {
        const apiCall1 = "https://api.ecodium.dev/api/auth/perfil/" + fav;
        axios
          .get(apiCall1, axiosConfig)
          .then((res) => {
            this.lista.push(res.data);
          })
          .catch((err) => {
            console.warn(err);
          });
      });
    },
  },
};
</script>
<style lang="scss">
.q-data-table th {
  text-align: right;
}
</style>
<!-- Estilo: Formato tabla -->
<style lang="sass">
.sticky
  height: 310px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    background-color: $primary
    font-family: "Fira Code"
    font-weight: bolder
    font-size: small

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  &.q-table--loading thead tr:last-child th
    top: 48px
</style>
