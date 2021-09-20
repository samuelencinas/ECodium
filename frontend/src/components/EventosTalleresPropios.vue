<!-- ECODIUM - TFG Samuel Encinas -->
<!-- WEB COMPONENT: Widget de Eventos y Talleres Propios (para usuarios Organizadores) -->

<template>
  <q-card class="editor" flat style="height: 350px">
    <q-bar class="bg-primary barraMenu">
      <q-icon name="img:icons/iconos/lightmode/eventos.svg" />
      <div class="text-bold text-white">Eventos y talleres creados por ti</div>

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
        :rows-per-page-options="[0]"
        hide-bottom
        virtual-scroll
        @row-click="navegar"
      >
        <!-- Plantilla de cada ítem -->
        <template v-slot:body-cell-Nombre="lista">
          <q-td :props="lista">
            <q-item>
              <q-item-section>
                <q-item-label class="text-weight-bolder">{{
                  lista.row.nombre
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-td>
        </template>

        <template v-slot:body-cell-Name="lista">
          <q-td :props="lista">
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="getFoto(lista.row.organizador)" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label
                  v-if="lista.row.tipo === 'evento'"
                  class="text-weight-bold"
                  >{{
                    lista.row.candidaturas + " candidaturas presentadas"
                  }}</q-item-label
                >
                <q-item-label
                  v-if="lista.row.tipo === 'taller'"
                  class="text-weight-bold"
                  >{{ lista.row.plazas + " plazas restantes" }}</q-item-label
                >
                <q-item-label class="text-primary text-overline">{{
                  recuperarFecha(lista.row)
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-td>
        </template>

        <template v-slot:body-cell-Tipo="lista">
          <q-td :props="lista" class="text-left">
            <q-chip
              class="text-white text-capitalize"
              :label="lista.row.tipo"
              color="orange"
              v-if="lista.row.tipo === 'evento'"
            ></q-chip>
            <q-chip
              class="text-white text-capitalize"
              :label="lista.row.tipo"
              color="purple"
              v-if="lista.row.tipo === 'taller'"
            ></q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-Compartir="lista">
          <q-td :props="lista">
            <q-item>
              <q-item-section>
                <q-item-label caption class=""> <!-- Fecha-->a </q-item-label>
              </q-item-section>
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
export default {
  data() {
    this.obtenerLista();
    return {
      lista: [],
      columnas: [
        {
          name: "Nombre",
          label: "Nombre",
          field: "Nombre",
          sortable: true,
          align: "left",
        },
        {
          name: "Name",
          label: "Organizador",
          field: "name",
          sortable: true,
          align: "left",
        },
        {
          name: "Pases",
          label: "Precio",
          field: (row) => row.precio + " Pases",
          sortable: true,
          align: "right",
          classes: "text-bold",
        },
        {
          name: "Tipo",
          label: "Tipo",
          field: "Tipo",
          sortable: true,
          align: "left",
          classes: "text-bold",
        },
      ],
      fotosPerfil: [],
    };
  },
  methods: {
    // Obtiene la foto de un usuario
    getFoto(usuario) {
      var flag = false;
      var fotoFinal = "fotoperfil.png";
      this.fotosPerfil.forEach((foto) => {
        if (foto.includes(usuario) && !flag) {
          fotoFinal = foto.substring(foto.indexOf("http"), foto.length);
          flag = true;
        }
      });
      return fotoFinal;
    },
    // Obtiene la URL de la foto de un usuario
    obtenerFoto(usuario) {
      const apiCall = "https://api.ecodium.dev/api/auth/perfil/" + usuario;
      axios
        .get(apiCall)
        .then((res) => {
          const foto = !!res.data.fotoPerfil
            ? "https://api.ecodium.dev/subidas/" + res.data.fotoPerfil
            : "fotoperfil.png";

          this.fotosPerfil.push(usuario + foto);
          return foto;
        })
        .catch((err) => {
          console.warn(err);
        });
    },
    // Recupera la fecha de un evento según su tipo
    recuperarFecha(item) {
      const literal = "Fecha de alta: ";
      const fecha =
        !!item.fecha && item.fecha !== null && item.fecha !== undefined
          ? date.formatDate(item.fecha, "DD/MM/YYYY")
          : "Fecha desconocida";
      return literal + fecha;
    },
    // Navega al evento seleccionado
    navegar(evt, item) {
      const id = item.id.replace(/\D/g, "");
      const path =
        item.tipo === "evento" ? "/evento/" : item.tipo === "taller" ? "/taller/" : "";
      if (id !== "" && path !== "") {
        const url = path + id;
        this.$router.push(url);
      }
    },
    // Obtiene la lista de eventos propios
    obtenerLista() {
      const axiosConfig = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://www.ecodium.dev/",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
        },
      };
      const apiCall1 = "https://api.ecodium.dev/api/eventos/eventosPropios";
      axios
        .get(apiCall1, axiosConfig)
        .then((res) => {
          res.data.forEach((evento) => {
            this.obtenerFoto(evento.organizador);
            this.lista.push({
              id: "e" + evento.id,
              nombre: evento.nombre,
              candidaturas: evento.candidaturas.length,
              precio: evento.precio,
              tipo: "evento",
              organizador: evento.organizador,
              fecha: evento.fechaFin,
            });
          });
          const apiCall2 = "https://api.ecodium.dev/api/talleres/talleresPropios";
          axios
            .get(apiCall2, axiosConfig)
            .then((res2) => {
              res2.data.forEach((taller) => {
                
                this.obtenerFoto(taller.organizador);

                this.lista.push({
                  id: "t" + taller.id,
                  nombre: taller.nombre,
                  plazas: taller.plazas,
                  precio: taller.precio,
                  tipo: "taller",
                  organizador: taller.organizador,
                  fecha: taller.fecha,
                });
              });
            })
            .catch((err2) => {
              console.warn(err2);
            });
        })
        .catch((err) => {
          console.warn(err);
        });
    },
  },
};
</script>
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
    font-size: medium

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  &.q-table--loading thead tr:last-child th
    top: 48px
</style>
