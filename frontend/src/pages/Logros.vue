<!-- ECODIUM - TFG Samuel Encinas -->
<!-- PÁGINA: Logros -->
<template>
  <q-page>
    <div class="q-pa-md col" >
      <q-table
        grid
        grid-header
        title-class="text-h2 text-weight-bolder text-center"
        title="Logros"
        :data="logros"
        :columns="columns"
        row-key="name"
        :props="showSpecialButton"
        :filter="filter"
        :filter-method="filtrarTaxonomia"
        :rows-per-page-options="[0]"
      >
        <template v-slot:top="props">
          <q-item class="col">
            <q-item-section avatar>
              <q-icon
                v-if="$q.dark.isActive"
                size="500%"
                name="img:icons/iconos/lightmode/logros.svg"
              />
              <q-icon v-else size="500%" name="img:icons/iconos/darkmode/logros.svg" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-h3 text-primary text-weight-bolder"
                >Logros</q-item-label
              >
            </q-item-section>
          </q-item>
          <div class="col" v-if="!showSpecialButton">
          <div class="text-overline">Logros desbloqueados</div>
            <q-linear-progress track-color="grey" v-model="logrosUsuario.length/logros.length" />
            <div class="text-overline">{{ logrosUsuario.length }} / {{ logros.length }}</div>
          </div>
          <div class="col" v-if="showSpecialButton">
                      <q-btn
            class="q-ma-lg col"
            color="primary"
            style="margin-right: 50px"
            label="Añadir nuevo logro"
            @click="card = true"
          />
          </div>
        </template>
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th>
              <q-card
                class="editor q-ma-xs q-ma-sm"
                v-show="ventanaInfoOpen"
                flat
                bordered
              >
                <q-bar class="bg-primary">
                  <q-icon name="img:icons/iconos/lightmode/logros.svg" />
                  <div class="text-bold text-white">Filtrar logros</div>

                  <q-space />

                  <q-btn
                    dense
                    flat
                    icon="minimize"
                    @click="ventanaInfoExpanded = false"
                  />
                  <q-btn
                    dense
                    flat
                    icon="crop_square"
                    @click="ventanaInfoExpanded = true"
                  />
                  <q-btn dense flat icon="close" @click="ventanaInfoOpen = false" />
                </q-bar>
                <q-slide-transition>
                  <div class="row justify-evenly" v-show="ventanaInfoExpanded">
                    <div class="q-pa-lg">
                                            <q-btn-dropdown
                        class="filter-select bg-primary"
                        label="Filtrar por estado"
                      >
                                              <q-list>
                          <q-item>
                            <q-toggle
                              v-model="filterToggles.onlyUnlocked"
                              val="unlocked"
                              label="Logros desbloqueados"
                            />
                          </q-item>
                          <q-item>
                            <q-toggle
                              v-model="filterToggles.onlyLocked"
                              val="completed"
                              label="Logros bloqueados"
                            />
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                    </div>
                    <div class="q-pa-lg">
                                            <q-btn-dropdown
                        class="filter-select bg-primary"
                        label="Filtrar por categoría"
                      >
                        <q-list>
                          <q-item>
                            <q-toggle
                              v-model="filterToggles.categoria.comun"
                              val="comun"
                            ><q-badge
                              rounded
                              color="green"
                              label="Común"
                            /></q-toggle>
                          </q-item>
                                                    <q-item>
                            <q-toggle
                              v-model="filterToggles.categoria.infrecuente"
                              val="infrecuente"
                            ><q-badge
                              rounded
                              color="cyan"
                              label="Infrecuente"
                            /></q-toggle>
                          </q-item>
                                                    <q-item>
                            <q-toggle
                              v-model="filterToggles.categoria.raro"
                              val="raro"
                            ><q-badge
                              rounded
                              color="purple"
                              label="Raro"
                            /></q-toggle>
                          </q-item>
                                                    <q-item>
                            <q-toggle
                              v-model="filterToggles.categoria.mitico"
                              val="mitico"
                            ><q-badge
                              rounded
                              color="amber"
                              text-color="black"
                              label="Mítico"
                            /></q-toggle>
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                    </div>

                    <q-input debounce="300" v-model="search" placeholder="Buscar">
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                </q-slide-transition>
              </q-card>
            </q-th>
          </q-tr>
        </template>
        <!-- PLANTILLA DE CADA ITEM --> 
        <template v-slot:item="props">
          <div class="q-pa-md col-xs-12 col-sm-4 col-md-2 col-lg-2">
            <q-card>
              <q-card-section
                  <q-img
      :class="props.row.isDesbloqueado ? '' : 'bloqueado'"
      :src="obtenerImagen(props.row.id)"
      spinner-color="white"
      style="height: 350px;"
    >              
    <q-card-section class="text-center" style="width: 100%; filter: none !important;">
                <q-badge
                  rounded
                  :color="props.row.isDesbloqueado ? 'green' : 'red'"
                  :label="props.row.isDesbloqueado ? 'Desbloqueado' : 'Bloqueado'"
                />
                <q-badge
                                class="q-ml-md"
                  rounded
                  :color="obtenerColorCategoria(props.row)"
                  :label="obtenerCategoria(props.row)"
                />
                <br />
                <div class="text-h5 text-weight-bolder">{{ props.row.nombre }}</div>
              </q-card-section>
              <q-separator />
    </q-img>
              </q-card-section>
              <q-separator />
              <q-expansion-item
                v-model="props.row.expanded"
                icon="info"
                label="Más información"
              >
                <q-card>
                  <q-card-section>
                    <div v-if="props.row.descripcion">
                      <span v-html="props.row.descripcion"></span>
                    </div>
                    <div v-if="!props.row.descripcion">
                      <i>No tiene descripción</i>
                    </div>
                    <br />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-card-actions align="center" class="box-inner">
                <q-btn
                  flat
                  color="primary"
                  v-if="!showSpecialButton"
                  label="Compartir"
                  @click="compartir(props.row.id)"
                ></q-btn>
                <q-btn
                  flat
                  color="primary"
                  v-if="showSpecialButton"
                  label="Borrar"
                ></q-btn>
                <q-btn
                  color="primary"
                  label="Editar reto"
                  v-if="showSpecialButton"
                  @click="
                    card2 = true;
                    retoEditar = props.row;
                  "
                ></q-btn>
                <q-dialog v-model="card2" @hide="obtenerLogros">
                  <modal-retos :datos="retoEditar" />
                </q-dialog>
                <q-dialog v-model="card3">
                  <q-card>
                    <q-card-section class="row items-center">
                      <q-avatar icon="delete" color="primary" text-color="white" />
                      <span class="q-ml-sm"
                        >¿Seguro que deseas eliminar el reto seleccionado?</span
                      >
                    </q-card-section>

                    <q-card-actions align="right">
                      <q-btn flat label="Cancelar" color="primary" v-close-popup />
                      <q-btn
                        flat
                        label="Eliminar"
                        color="primary"
                        v-close-popup
                        @click="eliminar"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="card" @hide="obtenerLogros">
      <modal-retos />
    </q-dialog>
  </q-page>
</template>

<script>
import axios from "axios";
import ModalRetos from "../components/ModalRetos.vue";
import { copyToClipboard } from "quasar";

export default {
  components: { ModalRetos },
  methods: {
    obtenerCategoria(logro){
      return logro.categoria == 'comun'
        ? 'Común'
        : logro.categoria == 'infrecuente'
          ? 'Infrecuente'
          : logro.categoria == 'raro'
            ? 'Raro'
            : logro.categoria == 'mitico'
              ? 'Mítico'
              : 'Común'
    },
    obtenerColorCategoria(logro){
      return {
              label: logro.categoria,
              color: logro.categoria == 'comun' 
                ? 'green'
                : logro.categoria == 'infrecuente'
                  ? 'cyan'
                  : logro.categoria == 'raro'
                    ? 'orange'
                    : logro.categoria == 'mitico'
                      ? 'red'
                      : 'grey'
            }
    },
    obtenerImagen(id) {
      const stringId = (id >= 10) ? String(id) : "0" + String(id);
      return "icons/iconos/logros/" + stringId + ".png";
    },
    mapearCategorias(categoria) {
      let arrayCategorias = [];
      if (categoria.comun === true) arrayCategorias.push('comun');
      if (categoria.infrecuente === true) arrayCategorias.push('infrecuente');
      if (categoria.raro === true) arrayCategorias.push('raro');
      if (categoria.mitico === true) arrayCategorias.push('mitico');
      return arrayCategorias;
    },
    filtrarTaxonomia(rows) {
      // Obtenemos la búsqueda, los filtros de categoria y las etiquetas si existen
      const busqueda = this.filter.search ? this.filter.search.toLowerCase() : "";
      const arrayCategorias = this.mapearCategorias(this.filter.categoria);
      // Filtramos los logros:
      const filteredRows = rows.filter((row, i) => {
        // Variable de control
        let check = false;

        //Condiciones (1: Solo disponible / 2: Solo completado / 3: Todos)
        let c1 = this.filterToggles.onlyUnlocked && row.isDesbloqueado;
        let c2 = this.filterToggles.onlyLocked && !row.isDesbloqueado;
        let c3 = c1 && c2;

        // Asumimos que es true si no hay búsqueda
        let busquedaActiva = true;
        // Y lo mismo con la categoria
        let categoriaActiva = true;
        // Si por el contrario, existe búsqueda activa, la aplicamos:
        if (busqueda !== "") {
          busquedaActiva = false;
          // Obtenemos los valores de búsqueda
          let busquedaActiva_values = Object.values(row);
          // En minúsculas para evitar errores de formato
          let busquedaActiva_lower = busquedaActiva_values.map((x) =>
            x.toString().toLowerCase()
          );
          // Y ponemos a true la búsquedaActiva si se incluye el valor en el array de valores
          for (let val = 0; val < busquedaActiva_lower.length; val++) {
            if (busquedaActiva_lower[val].includes(busqueda)) {
              busquedaActiva = true;
              break;
            }
          }
        }

        // Y lo mismo una vez más con los niveles de categoria:
        if (arrayCategorias !== [] && arrayCategorias.length > 0) {
          categoriaActiva = arrayCategorias.includes(row.categoria);
        }

        // Check será falso si no se cumplen condiciones
        check = false;

        // Si se cumple condición 1, 2 o 3 Y la búsqueda, check es true
        if (
          (c1 && busquedaActiva && categoriaActiva) ||
          (c2 && busquedaActiva && categoriaActiva) ||
          (c3 && busquedaActiva && categoriaActiva)
        ) {
          check = true;
        }

        return check;
      });

      return filteredRows;
    },
    // Carga los logros en memoria del cliente
    obtenerLogros() {
      const apiCall = "https://api.ecodium.dev/api/logros/logros/";
      axios
        .get(apiCall)
        .then((res) => {
          this.logros = res.data;
          this.logros.forEach((logro) => {
            logro.isDesbloqueado = (this.logrosUsuario.map(l => l.idLogro)).includes(logro.id);
          });
        })
        .catch((err) => {
          console.warn(err);
          this.logros = {};
        });
    },
    // Compartir un logro
    compartir(id) {
      const mensaje =
        "He encontrado este logro en ECodium | https://www.ecodium.dev/logro/" + id;
      copyToClipboard(mensaje)
        .then(() => {
        })
        .catch(() => {
          // fail
        });
    },
    // Elimina el reto seleccionado
    eliminar() {
      const apiCall = "https://api.ecodium.dev/api/retos/eliminar/" + this.retoEditar.id;
      axios
        .delete(apiCall)
        .then((res) => {
          this.obtenerLogros();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
    meta() {
    return {
      title: "ECodium | Logros",
    };
  },
  data() {
    var logros = [
      {
        id: Number,
        nombre: String,
        descripcion: String,
        categoria: String,
        recompensa: Number,
      },
    ];
    this.obtenerLogros();

    this.$store.commit("setMenuStatus", "logros");

    return {
      ventanaInfoOpen: true,
      ventanaInfoExpanded: false,
      logros,
      logrosUsuario: this.$store.state.auth.user.logros,
      retoEditar: {},
      search: "",
      filterToggles: {
        onlyUnlocked: true,
        onlyLocked: true,
        categoria: {
          comun: true,
          infrecuente: true,
          raro: true,
          mitico: true,
        },
        tags: [],
      },
      showSpecialButton: this.$store.state.auth.user.rol != "player",
      columns: [
        {
          name: "nombre",
          required: true,
          label: "Logro",
          align: "left",
          field: "nombre",
          sortable: true,
        },
        {
          name: "categoria",
          align: "center",
          label: "Categoría",
          field: "categoria",
          sortable: true,
        },
        {
          name: "recompensa",
          label: "Recompensa (XP)",
          field: "recompensa",
          sortable: true,
        },
        {
          name: "descripcion",
          label: "Descripción",
          field: "descripcion",
          sortable: true,
        }
      ],
    };
  },
  computed: {
    filter() {
      return {
        search: this.search,
        unlocked: this.filterToggles.onlyUnlocked,
        locked: this.filterToggles.onlyLocked,
        categoria: this.filterToggles.categoria
      };
    }
  }
}
</script>
<style lang="scss">
.item-box {
  border-top-left-radius: 17px;
  border-top-right-radius: 17px;
}
.q-separator {
  background-color: #1d09256b;
}
.q-separator--dark {
  background-color: #ec774582;
}

.filter-box {
  border-top: 0.1rem solid $primary;
  border-bottom: 0.1rem solid $primary;
  border-left: 0.1rem solid $primary;
  border-right: 0.1rem solid $primary;
  border-radius: 1rem;
}
.filter-select {
  text-transform: inherit;
}
.bloqueado > .q-img__image {
  -webkit-filter: contrast(1.9) grayscale(1);
  filter: contrast(1.9) grayscale(1) invert(0.4);
}
.card-box {
  border-top: 0.1rem solid $primary;
  border-bottom: 0.1rem solid $primary;
  border-left: 0.1rem solid $primary;
  border-right: 0.1rem solid $primary;
}
.editor {
  box-shadow: rgba(236, 119, 69, 0.2) 5px 5px, rgba(236, 119, 69, 0.15) 10px 10px,
    rgba(236, 119, 69, 0.1) 15px 15px, rgba(236, 119, 69, 0.05) 20px 20px,
    rgba(236, 119, 69, 0.025) 25px 25px !important;
}
</style>
