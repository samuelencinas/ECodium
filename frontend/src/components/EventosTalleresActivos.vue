<!-- ECODIUM - TFG Samuel Encinas -->
<!-- WEB COMPONENT: Widget de Eventos y Talleres Activos (para usuarios que no sean Organizadores) -->

<template>
  <q-card class="editor" flat style="height: 350px">
    <q-bar class="bg-primary barraMenu">
      <q-icon name="img:icons/iconos/lightmode/eventos.svg" />
      <div class="text-bold text-white">Eventos y talleres activos</div>

      <q-space />
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
        row-key="id"
        :rows-per-page-options="[0]"
        hide-bottom
        virtual-scroll
      >
        <!-- Plantilla de cada item -->
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
                <q-item-label class="text-weight-bold">{{
                  lista.row.organizador
                }}</q-item-label>
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
  // name: 'ComponentName',
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
    // Obtiene la ruta a la foto de un usuario
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
      if (item.tipo === "evento") {
        const literal1 = "Quedan ";
        const diferencia = date.getDateDiff(item.fecha, Date.now(), "days");
        const literal2 = " días para el cierre";
        return diferencia < 0
          ? "Quedan horas. ¡Date prisa!"
          : literal + diferencia + literal2;
      }
      if (item.tipo === "taller") {
        const literal = "Fecha de alta: ";
        const fecha = date.formatDate(item.fecha, "DD/MM/YYYY");
        return literal + fecha;
      }
    },
    // Obtiene la lista de eventos activos
    obtenerLista() {
      const apiCall1 = "https://api.ecodium.dev/api/eventos/eventosActivos";
      axios
        .get(apiCall1)
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
          const apiCall2 = "https://api.ecodium.dev/api/talleres/talleresRecientes";
          axios
            .get(apiCall2)
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
    background-color: $secondary

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  &.q-table--loading thead tr:last-child th
    top: 48px
</style>
