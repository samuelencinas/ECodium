<!-- ECODIUM - TFG Samuel Encinas -->
<!-- PÁGINA: Retos -->
<template>
  <q-page>
    <div class="q-pa-md col" style="max-height: 5px">
      <q-table
        grid
        grid-header
        title-class="text-h2 text-weight-bolder text-center"
        :card-container-class="cardContainerClass"
        title="Retos"
        :data="retos"
        :columns="columns"
        row-key="name"
        :props="showSpecialButton"
        :filter="filter"
        :filter-method="filtrarTaxonomia"
        v-model:pagination="pagination"
        :rows-per-page-options="this.$q.screen.gt.sm ? [0] : [5]"
      >
        <template v-slot:top-left="props">
          <q-item>
            <q-item-section avatar>
              <q-icon
                v-if="$q.dark.isActive"
                size="500%"
                name="img:icons/iconos/lightmode/retos.svg"
              />
              <q-icon v-else size="500%" name="img:icons/iconos/darkmode/retos.svg" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-h3 text-primary text-weight-bolder"
                >Retos</q-item-label
              >
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:top-right="props">
          <q-btn
            class="q-ma-lg"
            color="primary"
            style="margin-right: 50px"
            v-if="showSpecialButton"
            label="Añadir nuevo reto"
            @click="card = true"
          />
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
                  <q-icon name="img:icons/iconos/lightmode/retos.svg" />
                  <div class="text-bold text-white">Filtrar retos</div>

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
                    <q-select
                      class="q-pa-md"
                      style="min-width: 200px; max-width: 300px"
                      v-model="filterToggles.tags"
                      :display-value="`${filterToggles.tags.length} etiquetas seleccionadas`"
                      filled
                      borderless
                      multiple
                      label="Etiquetas"
                      :options="posiblesEtiquetas"
                    />
                    <div class="q-pa-lg">
                      <q-btn-dropdown
                        class="filter-select bg-primary"
                        label="Filtrar por estado"
                      >
                        <q-list>
                          <q-item>
                            <q-toggle
                              v-model="filterToggles.onlyAvailable"
                              val="available"
                              label="Retos disponibles"
                            />
                          </q-item>
                          <q-item>
                            <q-toggle
                              v-model="filterToggles.onlyCompleted"
                              val="completed"
                              label="Retos resueltos"
                            />
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                    </div>
                    <div class="q-pa-lg">
                      <q-btn-dropdown
                        class="filter-select bg-primary"
                        label="Filtrar por dificultad"
                      >
                        <q-list>
                          <q-item>
                            <q-toggle
                              v-model="filterToggles.difficulty.nv1"
                              val="level1"
                              label="Muy fácil"
                            />
                          </q-item>
                          <q-item>
                            <q-toggle
                              v-model="filterToggles.difficulty.nv2"
                              val="level2"
                              label="Fácil"
                            />
                          </q-item>
                          <q-item>
                            <q-toggle
                              v-model="filterToggles.difficulty.nv3"
                              val="level3"
                              label="Moderado"
                            />
                          </q-item>
                          <q-item>
                            <q-toggle
                              v-model="filterToggles.difficulty.nv4"
                              val="level4"
                              label="Muy difícil"
                            />
                          </q-item>
                          <q-item>
                            <q-toggle
                              v-model="filterToggles.difficulty.nv5"
                              val="level5"
                              label="Extremo"
                            />
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
        <template v-slot:item="props">
          <div class="q-pa-md col-xs-12 col-sm-6 col-md-4">
            <q-card class="box">
              <q-card-section class="text-center">
                <q-badge
                  v-if="props.row.estado === 'Resuelto'"
                  rounded
                  color="green"
                  :label="props.row.estado"
                />
                <q-badge
                  v-if="props.row.estado !== 'Resuelto'"
                  rounded
                  color="red"
                  :label="props.row.estado"
                />
                <br />
                <div class="text-h5 text-weight-bolder">{{ props.row.nombre }}</div>
              </q-card-section>
              <q-separator />

              <q-card-section
                class="flex flex-center"
                :style="{ fontSize: obtenerFontsize(props.row.recompensa) + 'px' }"
              >
                <div class="text-weight-bolder">{{ props.row.recompensa }}</div>
                <div style="fontsize: 0.5em; padding-left: 0.3em">XP</div>

                <br />
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
                    <div v-if="props.row.conquistador">
                      <strong> Conquistador: </strong>
                      {{ props.row.conquistador }}
                    </div>
                    <div v-if="!props.row.conquistador">
                      <strong> Conquistador: </strong>
                      <i>Aún no ha sido conquistado</i>
                    </div>
                    <br />
                    <div>
                      <strong> Dificultad: </strong>
                      {{ obtenerDificultad(props.row.dificultad).palabra }}
                    </div>
                    <br />

                    <strong> Etiquetas: </strong>
                    <ul style="display: inline; padding-left: 5px">
                      <li
                        v-for="tag in props.row.etiquetas"
                        style="
                          display: inline;
                          padding-left: 10px !important;
                          padding-right: 10px !important;
                        "
                      >
                        <q-badge rounded color="primary" :label="tag" />
                      </li></ul
                  ></q-card-section>
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
                  color="primary"
                  label="Intentar resolver"
                  v-if="!showSpecialButton && props.row.estado === 'Disponible'"
                  :to="obtenerRuta(props.row)"
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
                <q-btn
                  color="primary"
                  label="Eliminar reto"
                  v-if="showSpecialButton"
                  @click="
                    retoEditar = props.row;
                    card3 = true;
                  "
                ></q-btn>
                <q-dialog v-model="card2" @hide="obtenerRetos">
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
    <q-dialog v-model="card" @hide="obtenerRetos">
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
    obtenerEtiquetas() {
      const apiCall = "https://api.ecodium.dev/api/retos/etiquetas/";
      axios
        .get(apiCall)
        .then((res) => {
          this.posiblesEtiquetas = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    mapearDificultad(dificultad) {
      let arrayNiveles = [];
      if (dificultad.nv1 === true) arrayNiveles.push(1);
      if (dificultad.nv2 === true) arrayNiveles.push(2);
      if (dificultad.nv3 === true) arrayNiveles.push(3);
      if (dificultad.nv4 === true) arrayNiveles.push(4);
      if (dificultad.nv5 === true) arrayNiveles.push(5);
      return arrayNiveles;
    },
    filtrarTaxonomia(rows) {
      // Obtenemos la búsqueda, los filtros de dificultad y las etiquetas si existen
      const busqueda = this.filter.search ? this.filter.search.toLowerCase() : "";
      const etiquetas = this.filter.tags
        ? this.filter.tags.map((tag) => tag.toLowerCase())
        : [];
      const arrayNiveles = this.mapearDificultad(this.filter.difficulty);
      
      // Filtramos los retos:
      const filteredRows = rows.filter((row, i) => {
        // Variable de control
        let check = false;

        //Condiciones (1: Solo disponible / 2: Solo completado / 3: Todos)
        let c1 = this.filterToggles.onlyAvailable && row.estado == "Disponible";
        let c2 = this.filterToggles.onlyCompleted && row.estado == "Resuelto";
        let c3 = c1 && c2;

        // Asumimos que es true si no hay búsqueda
        let busquedaActiva = true;
        // Y lo mismo con las etiquetas
        let etiquetasActivas = true;
        // Y, de nuevo, lo mismo con la dificultad
        let dificultadActiva = true;

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

        // Y lo mismo con las etiquetas:
        if (etiquetas !== [] && etiquetas.length > 0) {
          etiquetasActivas = row.etiquetas.some((e) =>
            this.filterToggles.tags.includes(e)
          );
        }

        // Y lo mismo una vez más con los niveles de dificultad:
        if (arrayNiveles !== [] && arrayNiveles.length > 0) {
          dificultadActiva = arrayNiveles.includes(row.dificultad);
        }

        // Check será falso si no se cumplen condiciones
        check = false;

        // Si se cumple condición 1, 2 o 3 Y la búsqueda, check es true
        if (
          (c1 && busquedaActiva && etiquetasActivas && dificultadActiva) ||
          (c2 && busquedaActiva && etiquetasActivas && dificultadActiva) ||
          (c3 && busquedaActiva && etiquetasActivas && dificultadActiva)
        ) {
          check = true;
        }

        return check;
      });

      return filteredRows;
    },
    // Obtiene los mapeos de dificultad del reto
    obtenerDificultad(nivel) {
      switch (nivel) {
        case 0:
          return {
            valor: 18,
            color: "green",
            palabra: "Muy fácil",
          };
        case 1:
          return {
            valor: 38,
            color: "yellow",
            palabra: "Fácil",
          };
        case 2:
          return {
            valor: 53,
            color: "amber",
            palabra: "Moderado",
          };
        case 3:
          return {
            valor: 67,
            color: "orange",
            palabra: "Difícil",
          };
        case 4:
          return {
            valor: 83,
            color: "red",
            palabra: "Extremo",
          };
        default:
          return {
            valor: 18,
            color: "green",
            palabra: "Fácil",
          };
      }
    },
    // Genera de forma responsive los retos por cada página
    itemsPorPagina() {
      const { screen } = this.$q;
      if (screen.lt.sm) {
        return 3;
      }
      if (screen.lt.md) {
        return 6;
      }
      return 9;
    },
    // Genera el link a la resolución del reto
    obtenerRuta(row) {
      return "/reto/" + row.id;
    },
    // Obtiene el estado de un reto (Resuelto / Disponible)
    obtenerEstado(id) {
      return !!this.$store.state.auth.user.retos.find((reto) => reto.idReto === id)
        ? "Resuelto"
        : "Disponible";
    },
    // Obtiene un tamaño de fuente en función de los puntos de XP
    obtenerFontsize(puntos) {
      if (puntos < 18) {
        return 16;
      } else if (puntos > 99) {
        return 105;
      } else {
        return puntos;
      }
    },
    // Carga los retos en memoria del cliente
    obtenerRetos() {
      const apiCall = "https://api.ecodium.dev/api/retos/retos/";
      axios
        .get(apiCall)
        .then((res) => {
          // Invertimos la respuesta de la API para mostrar los datos en formato LIFO
          this.retos = res.data.reverse();
          this.retos.forEach((reto) => {
            reto.estado = this.obtenerEstado(reto.id);
            reto.showModal = false;
          });
        })
        .catch((err) => {
          console.warn(err);
          this.reto = {};
        });
    },
    // Compartir un reto
    compartir(id) {
      const mensaje =
        "He encontrado este reto en ECodium | https://www.ecodium.dev/reto/" + id;
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
          this.obtenerRetos();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  meta() {
    return {
      title: "ECodium | Retos",
    };
  },
  data() {
    var retos = [
      {
        id: Number,
        nombre: String,
        descripcion: String,
        dificultad: Number,
        etiquetas: [String],
        recompensa: Number,
        conquistador: String,
        pruebas: [{ entrada: String, tipo: [String], id: String, salida: String }],
        showModal: Boolean,
      },
    ];
    this.obtenerRetos();
    this.obtenerEtiquetas();
    this.$store.commit("setMenuStatus", "retos");

    return {
      ventanaInfoOpen: true,
      ventanaInfoExpanded: false,
      pagination: {
        rowsPerPage: 3,
      },
      retos,
      retoEditar: {},
      card: false,
      card2: false,
      card3: false,
      search: "",
      filterToggles: {
        onlyAvailable: true,
        onlyCompleted: true,
        difficulty: {
          nv1: true,
          nv2: true,
          nv3: true,
          nv4: true,
          nv5: true,
        },
        tags: [],
      },
      showSpecialButton: this.$store.state.auth.user.rol[0] !== "player",
      columns: [
        {
          name: "nombre",
          required: true,
          label: "Reto",
          align: "left",
          field: "nombre",
          sortable: true,
        },
        {
          name: "dificultad",
          align: "center",
          label: "Dificultad",
          field: "dificultad",
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
        },
        {
          name: "etiquetas",
          label: "Etiquetas",
          field: "etiquetas",
          sortable: true,
        },
        {
          name: "conquistador",
          label: "Conquistador",
          field: "conquistador",
          sortable: true,
        },
        {
          name: "acciones",
          label: "Acciones",
          field: "acciones",
          sortable: true,
        },
      ],
      posiblesEtiquetas: [
        "Estructuras de Datos",
        "Matemáticas",
        "Lógica",
        "Recursividad",
        "Algoritmia",
        "Sencillos",
      ],
    };
  },
  computed: {
    // Establece la clase responsive de cada item
    cardContainerClass() {
      
      const clase =
        this.pagination.rowsPerPage === 9
          ? "grid-masonry grid-masonry--120 grid-masonry--"
          : "grid-masonry grid-masonry--60 grid-masonry--";
      if (this.$q.screen.gt.xs) {
        return clase + (this.$q.screen.gt.sm ? "3" : "2");
      }

      return void 0;
    },

    // Establece el límite de filas por página
    rowsPerPageOptions() {
      if (this.$q.screen.gt.xs) {
        return this.$q.screen.gt.sm ? [9] : [3, 6];
      }

      return [9];
    },
    filter() {
      return {
        search: this.search,
        available: this.filterToggles.onlyAvailable,
        completed: this.filterToggles.onlyCompleted,
        difficulty: this.filterToggles.difficulty,
        tags: this.filterToggles.tags,
      };
    },
  },
  watch: {
    "$q.screen.name"() {
      this.pagination.rowsPerPage = this.itemsPorPagina();
    },
  },
};
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
.box {
  box-shadow: 0 1px 5px #ec774521, 0 2px 2px #ec774524, 0 3px 1px -2px #ec774526 !important;
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
