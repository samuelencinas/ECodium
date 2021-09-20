<!-- ECODIUM - TFG Samuel Encinas -->
<!-- PÁGINA: Talleres -->
<template>
  <q-page>
    <div class="q-pa-md col" >
      <q-table
        grid
        grid-header
        title-class="text-h2 text-weight-bolder text-center"
        title="Talleres"
        :data="talleres"
        :columns="columns"
        row-key="name"
        :props="showSpecialButton"
        :filter="filter"
        :filter-method="filtrarTaxonomia"
        :rows-per-page-options="this.$q.screen.gt.xs ? [12] : [6]"
      >
        <template v-slot:top="props">
          <q-item class="col">
            <q-item-section avatar>
              <q-icon
                v-if="$q.dark.isActive"
                size="500%"
                name="img:icons/iconos/lightmode/talleres.svg"
              />
              <q-icon v-else size="500%" name="img:icons/iconos/darkmode/talleres.svg" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-h3 text-primary text-weight-bolder"
                >Talleres</q-item-label
              >
            </q-item-section>
          </q-item>
          <div class="col" v-if="showSpecialButton">
                      <q-btn
            class="q-ma-lg col"
            color="primary"
            style="margin-right: 50px"
            label="Añadir nuevo taller"
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
                  <q-icon name="img:icons/iconos/lightmode/talleres.svg" />
                  <div class="text-bold text-white">Filtrar talleres</div>

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
                              v-model="filterToggles.onlyAvailable"
                              val="available"
                              label="Retos disponibles"
                            />
                          </q-item>
                          <q-item>
                            <q-toggle
                              v-model="filterToggles.onlyBought"
                              val="bought"
                              label="Retos adquiridos"
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
        <!-- PLANTILLA DE CADA ITEM --> 
        <template v-slot:item="props">
               <q-dialog v-model="confirmacionAdquirir">
      <q-card>
        <q-toolbar class="bg-primary justify-center text-h5">
         <span class="text-weight-bold">{{props.row.nombre}}</span>

        </q-toolbar>
        <q-card-section class="row items-center">
          <q-avatar icon="shopping_cart" color="primary" text-color="white">
          </q-avatar>

          <span class="q-ml-sm">¿Seguro que deseas adquirir el curso por <span class="text-weight-bold"> {{props.row.precio}} Pases de Acceso </span>?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Adquirir" color="primary" v-close-popup @click="adquirir(props.row)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
          <div class="q-pa-md col-xs-12 col-sm-6 col-md-6 col-lg-4">
            <q-card>
              <q-card-section

    <q-card-section class="text-center" style="width: 100%; filter: none !important;">
                <q-badge
                  rounded
                  :color="obtenerColor(props.row)"
                  :label="obtenerEstado(props.row)"
                />

                <br />
                <div class="text-h5 text-weight-bolder">{{ props.row.nombre }}</div>

              </q-card-section>
              <q-separator />

              </q-card-section>
                    <q-item v-ripple class="row justify-between">

        <q-item-section class="items-center" avatar>

        <q-rating
        :value="!!props.row.dificultad ? props.row.dificultad : 0"
        size="1.5em"
        :color="$q.dark.isActive ? 'white' : 'black'"
        icon="gps_fixed"
        readonly
      />
                    <q-item-label overline class="q-pt-sm">Nivel: <span class="text-weight-bold text-primary">{{mapearDificultad(props.row)}}</span></q-item-label>

        </q-item-section>
                        <q-item-section class="items-center" side>
                          <q-item-label class="text-h5 text-weight-bolder text-white"> {{props.row.plazas}} </q-item-label>

                    <q-item-label overline class="text-weight-bold text-primary">Plazas disponibles</q-item-label>


        </q-item-section>

      </q-item>
                    <q-separator />             

              <q-expansion-item
                v-model="props.row.expanded"
                icon="info"
                label="Más información"
              >
                <q-card>
                  <q-card-section>
                    <q-list-items>
      <q-item>
        <q-item-section avatar>
          <q-icon color="primary" name="videogame_asset" />
        </q-item-section>
        <q-item-section class="text-weight-bold">Nivel {{props.row.nivel}}</q-item-section>
        <q-item-section side>
          <q-item-label caption>Nivel mínimo del jugador</q-item-label>
        </q-item-section>
      </q-item>
            <q-item>
        <q-item-section avatar>
          <q-icon color="primary" name="badge" />
        </q-item-section>
        <q-item-section class="text-weight-bold"> {{props.row.organizador}}</q-item-section>
        <q-item-section side>
          <q-item-label caption>Organizador del taller</q-item-label>
        </q-item-section>
      </q-item>
            <q-item>
        <q-item-section avatar>
          <q-icon color="primary" name="info" />
        </q-item-section>
                    <div v-if="props.row.descripcion">
                      <span v-html="props.row.descripcion"></span>
                    </div>
                    <div v-if="!props.row.descripcion">
                      <i>No tiene descripción</i>
                    </div>
                    </q-item-section>
      </q-item>
                  <q-item>
        <q-item-section avatar>
          <q-icon color="primary" name="tag" />
        </q-item-section>
          <q-item-label v-if="!!props.row.etiquetas && props.row.etiquetas.length > 0">
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
                      </li></ul>
          </q-item-label>
                            <q-item-label v-else>Sin etiquetas</q-item-label>
   
      </q-item>
                    </q-list-items>
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-card-actions align="center" class="box-inner">
                <q-btn
                  flat
                  color="primary"
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
                  label="Editar"
                  v-if="showSpecialButton"
                  @click="
                    card2 = true;
                    retoEditar = props.row;
                  "
                ></q-btn>
                                <q-btn
                  color="primary"
                  icon="shopping_cart"
                  v-if="!showSpecialButton && !adquirido(props.row)"
                  :label="'Adquirir - ' + props.row.precio + ' Pases'"
                  @click="confirmacionAdquirir = true;"
                ></q-btn>
                                                <q-btn
                  color="primary"
                  v-if="!showSpecialButton && adquirido(props.row)"
                  label="Acceder"
                  :to="obtenerRuta(props.row)"
                ></q-btn>
                <q-dialog v-model="card2" @hide="obtenerTalleres">
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

    <q-dialog v-model="card" @hide="obtenerTalleres">
      <modal-retos />
    </q-dialog>
  </q-page>
</template>

<script>
import axios from "axios";
import ModalRetos from "../components/ModalRetos.vue";
import { copyToClipboard } from "quasar";
import { request } from 'http';

export default {
  components: { ModalRetos },
  methods: {
    obtenerEstado(taller) {
      return this.adquirido(taller)
      ? 'Adquirido'
      : (taller.plazas == 0) 
        ? 'Cerrado'
        : (taller.plazas > 0 && taller.plazas < 3)
          ? 'Últimas plazas'
          : (this.$store.state.auth.user.nivel < taller.nivel)
            ? 'Nivel insuficiente'
            : (this.$store.state.auth.user.pases < taller.precio)
              ? 'Pases insuficientes'
              : 'Disponible'
    },
    obtenerColor(taller) {
      return this.adquirido(taller)
      ? 'blue'
      : (taller.plazas == 0) 
        ? 'red'
        : (taller.plazas > 0 && taller.plazas < 3)
          ? 'amber'
          : (this.$store.state.auth.user.nivel < taller.nivel)
            ? 'red'
            : (this.$store.state.auth.user.pases < taller.precio)
              ? 'red'
              : 'green'
    },
    filtrarTaxonomia(rows) {
      // Obtenemos la búsqueda, los filtros de categoria y las etiquetas si existen
      const busqueda = this.filter.search ? this.filter.search.toLowerCase() : "";
      // Filtramos los logros:
      const filteredRows = rows.filter((row, i) => {
        // Variable de control
        let check = false;

        //Condiciones (1: Solo disponible / 2: Solo completado / 3: Todos)
        let c1 = this.filterToggles.onlyAvailable && this.obtenerEstado(row) === 'Disponible';
        let c2 = this.filterToggles.onlyBought && this.obtenerEstado(row) === 'Adquirido';
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

        // Check será falso si no se cumplen condiciones
        check = false;

        // Si se cumple condición 1, 2 o 3 Y la búsqueda, check es true
        if (
          (c1 && busquedaActiva ) ||
          (c2 && busquedaActiva) ||
          (c3 && busquedaActiva)
        ) {
          check = true;
        }

        return check;
      });

      return filteredRows;
    },
    // Devuelve el nombre de cada nivel de dificultad
    mapearDificultad(taller) {
      switch (taller.dificultad) {
        case 1: return 'Elemental';
        case 2: return 'Principiante';
        case 3: return 'Intermedio';
        case 4: return 'Avanzado';
        case 5: return 'Experto';
        default: return 'Desconocido';
      }
    },
    // Carga los logros en memoria del cliente
    obtenerTalleres() {
      const apiCall = "https://api.ecodium.dev/api/talleres/talleres/";
      axios
        .get(apiCall)
        .then((res) => {
          this.talleres = res.data;
        })
        .catch((err) => {
          console.warn(err);
          this.talleres = {};
        });
    },
    // Genera la ruta de redirección para el acceso a un taller
    obtenerRuta(taller){
      return "/taller/" + taller.id;
    },
    // Comprueba si el taller ha sido adquirido por el usuario
    adquirido(taller) {
      const talleresUsuario = this.$store.state.auth.user.talleres;
      return !talleresUsuario || talleresUsuario === undefined || talleresUsuario.length === 0
        ? false
        : (talleresUsuario.filter(t => t.idTaller === taller.id)).length !== 0
          ? true
          : false;
    },
    // Adquiere el taller
    adquirir(taller) {
      const datosTaller = {
        idTaller: taller.id,
        fecha: Date.now(),
      };
      const talleresUsuario = this.$store.state.auth.user.talleres;
      const pases = this.$store.state.auth.user.pases;
      talleresUsuario.push(datosTaller);
      const id = this.$store.state.auth.user._id;
            const axiosConfig = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://www.ecodium.dev/",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
        },
            };
      const apiCallActualizarUsuario = "https://api.ecodium.dev/api/auth/actualizar/" + id;
      const apiCallActualizarTaller = "https://api.ecodium.dev/api/talleres/matricular/" + taller.id;
      const requestUsuario = {
        talleres: talleresUsuario,
        pases: Number(pases - taller.precio)
      };
      const requestTaller = {alumno: this.$store.state.auth.user.nombreUsuario};
      axios.put(apiCallActualizarUsuario, requestUsuario, axiosConfig).then((res1) => {
        console.log(res1);
        axios.put(apiCallActualizarTaller, requestTaller, axiosConfig).then((res2) => {
          window.location.href='/taller/' + taller.id;
        }).catch((err2) => console.log(err2));
      }).catch((err1) => console.log(err1));
    },
    // Compartir un logro
    compartir(id) {
      const mensaje =
        "He encontrado este taller en ECodium | https://www.ecodium.dev/taller/" + id;
      copyToClipboard(mensaje)
        .then(() => {
        })
        .catch(() => {
        });
    },
    // Elimina el reto seleccionado
    eliminar() {
      const apiCall = "https://api.ecodium.dev/api/retos/eliminar/" + this.retoEditar.id;
      axios
        .delete(apiCall)
        .then((res) => {
          this.obtenerTalleres();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  data() {
    var talleres = [
      {
        id: Number,
        nombre: String,
        descripcion: String,
        dificultad: String,
        precio: Number,
      },
    ];
    this.obtenerTalleres();

    this.$store.commit("setMenuStatus", "talleres");

    return {
      ventanaInfoOpen: true,
      ventanaInfoExpanded: false,
      talleres,
      logrosUsuario: this.$store.state.auth.user.logros,
      retoEditar: {},
      search: "",
      filterToggles: {
        onlyAvailable: true,
        onlyBought: true,
      },
      confirmacionAdquirir: false,
      showSpecialButton: this.$store.state.auth.user.rol[0] !== "player",
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
