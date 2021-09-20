<!-- ECODIUM - TFG Samuel Encinas -->
<!-- PÁGINA: Comunidad -->
<template>
  <q-page>
    <q-item>
      <q-item-section avatar>
        <q-icon size="500%" name="people" />
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-h3 text-primary text-weight-bolder"
          >Comunidad</q-item-label
        >
      </q-item-section>
    </q-item>
    <q-tabs
      v-model="tab"
      active-color="primary"
      indicator-color="primary"
      align="justify"
    >
      <q-tab name="ranking" label="ranking" />
      <q-tab name="perfil" label="Mi perfil" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="ranking">
        <div class="q-pa-md">
          <q-table
            style="height: 400px"
            table-header-class="bg-primary text-weight-bolder"
            title="Ranking"
            :data="data"
            :filter="filter"
            :columns="columns"
            row-key="index"
            hide-bottom
            virtual-scroll
            @row-click="onRowClick"
            :pagination.sync="pagination"
            :rows-per-page-options="[0]"
          >
            <template v-slot:top-right>
              <q-input
                borderless
                dense
                debounce="300"
                v-model="filter"
                placeholder="Buscar"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
          </q-table>
        </div>
      </q-tab-panel>

      <q-tab-panel name="perfil" class="row justify-center">
        <modal-ver-perfil
          class="row"
          :datos="this.$store.state.auth.user.nombreUsuario"
        />
      </q-tab-panel>
    </q-tab-panels>
    <q-dialog v-model="modalActivo">
      <modal-ver-perfil :datos="usuarioSeleccionado" />
    </q-dialog>
  </q-page>
</template>

<script>
import axios from "axios";
import ModalVerPerfil from "../components/ModalVerPerfil.vue";
export default {
  components: { ModalVerPerfil },
  methods: {
    onRowClick(evt, row) {
      this.usuarioSeleccionado = row.nombreUsuario;
      
      this.modalActivo = true;
    },
    sumarDeArray(array, propiedad) {
      return array.reduce(function (r, a) {
        return r + a[propiedad];
      }, 0);
    },
    sortDataSource(source) {
      let mappedDatasource = [];
      let finalDatasource = [];
      var iterador = source.length;
      source.forEach((usuario) => {
        mappedDatasource.push({
          nombreUsuario: usuario.nombreUsuario,
          puntosXP: usuario.movimientosExp
            ? this.sumarDeArray(usuario.movimientosExp, "cantidad")
            : 0,
          rango: usuario.rank,
          nivel: usuario.nivel,
        });
      });
      const sortedDatasource = mappedDatasource.sort((a, b) =>
        a.puntosXP > b.puntosXP ? 1 : b.puntosXP > a.puntosXP ? -1 : 0
      );
      sortedDatasource.forEach((sorted) => {
        finalDatasource.push({
          posicion: iterador,
          nombreUsuario: sorted.nombreUsuario,
          puntosXP: sorted.puntosXP,
          nivel: sorted.nivel,
          rango: sorted.rango,
        });
        iterador = iterador - 1;
      });
      return finalDatasource;
    },
    getDatasource() {
      let originalSource = [];
      const apiCall = "https://api.ecodium.dev/api/auth/usuarios";
      axios
        .get(apiCall)
        .then((res) => {
          this.data = this.sortDataSource(res.data);
        })
        .catch((err) => {
          console.warn(err);
          originalSource = [];
        });
    },
  },
  meta() {
    return {
      title: "ECodium | Comunidad",
    };
  },
  data() {
    let data;
    this.getDatasource();
    this.$store.commit("setMenuStatus", "comunidad");

    return {
      data,
      filter: "",
      modalActivo: false,
      usuarioSeleccionado: "",
      tab: "ranking",
      columns: [
        {
          name: "index",
          label: "#",
          field: (row) => row.posicion,
          sortable: true,
        },
        {
          name: "name",
          required: true,
          label: "Nombre de usuario",
          align: "left",
          field: (row) => row.nombreUsuario,
          sortable: false,
        },
        {
          name: "XP",
          align: "center",
          label: "Puntos de Experiencia",
          field: (row) => row.puntosXP,
          sortable: true,
        },
        {
          name: "nivel",
          required: true,
          label: "Nivel",
          align: "left",
          field: (row) => "Nivel " + row.nivel,
          sortable: false,
        },
        {
          name: "Rango",
          align: "center",
          label: "Rango",
          field: (row) => row.rango,
          sortable: true,
        },
      ],
      pagination: {
        sortBy: "index",
        descending: false,
      },
    };
  },
};
</script>
<style lang="scss">
.title-box {
  border: 0.1rem solid $primary;
  border-radius: 1rem;
  box-shadow: 0 0 0.5rem rgba(236, 119, 69, 0.2), 0 0 0.25rem rgba(236, 119, 69, 0.4),
    0 0 1rem rgba(236, 119, 69, 0.6);
}
</style>
