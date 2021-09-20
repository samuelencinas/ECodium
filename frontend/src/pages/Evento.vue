<!-- ECODIUM - TFG Samuel Encinas -->
<!-- PÁGINA: Evento -->
<template>
  <q-page padding>
    <div class="column items-center">
      <div class="col">
        <q-card class="editor q-ma-xl q-pa-l" v-show="ventanaInfoOpen" flat bordered>
          <q-bar class="bg-primary">
            <q-icon name="img:icons/iconos/lightmode/talento.svg" />
            <div class="text-bold">{{ evento.nombre }}</div>

            <q-space />

            <q-btn dense flat icon="minimize" @click="ventanaInfoExpanded = false" />
            <q-btn dense flat icon="crop_square" @click="ventanaInfoExpanded = true" />
            <q-btn dense flat icon="close" @click="ventanaInfoOpen = false" />
          </q-bar>
          <q-slide-transition>
            <div v-show="ventanaInfoExpanded">
              <q-splitter v-model="splitterModel" style="height: 250px">
                <template v-slot:before>
                  <q-tabs v-model="tab" vertical class="text-primary">
                    <q-tab name="info" icon="lightbulb" label="Info" />
                    <q-tab name="detalles" icon="description" label="Detalles" />
                    <q-tab name="premios" icon="emoji_events" label="Premios" />
                  </q-tabs>
                </template>

                <template v-slot:after>
                  <q-tab-panels
                    v-model="tab"
                    animated
                    swipeable
                    vertical
                    transition-prev="jump-up"
                    transition-next="jump-up"
                  >
                    <q-tab-panel name="info">
                      <div class="text-h4 q-mb-md text-weight-bold text-center">
                        Info - {{ evento.nombre }}
                      </div>
                      <!-- Descripción -->
                      <div class="text-subtitle1 row">
                        <div
                          class="col-auto q-pl-lg"
                          v-html="evento.descripcion || 'Sin descripción'"
                        ></div>
                      </div>
                    </q-tab-panel>

                    <q-tab-panel name="detalles">
                      <div class="text-h4 q-mb-md text-weight-bold text-center">
                        Detalles - {{ evento.nombre }}
                      </div>
                      <div>
                        <!-- Precio -->
                        <div class="text-subtitle1 row">
                          <q-icon
                            name="shopping_cart"
                            style="font-size: 1.5rem"
                            class="text-primary"
                          />
                          <div class="col-auto q-pl-lg text-weight-light">
                            Presentar candidatura cuesta
                          </div>

                          <div class="col-auto q-pl-sm q-pr-sm text-weight-bold">
                            {{ evento.precio || 0 }}
                          </div>
                          <div class="col-auto q-pl-xs text-weight-light">
                            Pases de Acceso
                          </div>
                        </div>
                        <!-- Límite (para concursos) -->
                        <div class="text-subtitle1 row">
                          <q-icon
                            name="sports_esports"
                            style="font-size: 1.5rem"
                            class="col-auto text-primary"
                          />
                          <div class="col-auto q-pl-lg text-weight-light">
                            Nivel mínimo de acceso:
                          </div>

                          <div class="col-auto q-pl-xs text-weight-bold">
                            Nivel {{ evento.limite || 0 }}
                          </div>
                        </div>
                        <div class="text-subtitle1 row">
                          <q-icon
                            name="casino"
                            style="font-size: 1.5rem"
                            class="col-auto text-primary"
                          />
                          <div class="col-auto q-pl-lg text-weight-bold">
                            {{ calcularPremios(evento) || 0 }}
                          </div>
                          <div class="col-auto q-pl-xs text-weight-light">
                            Puntos de Experiencia en juego
                          </div>
                        </div>

                        <!-- Etiquetas -->
                        <div class="text-subtitle1 row">
                          <q-icon
                            name="local_offer"
                            style="font-size: 1.5rem"
                            class="text-primary"
                          />
                          <div class="col-auto q-pl-lg text-weight-light">
                            {{ evento.etiquetas || "Sin etiquetas" }}
                          </div>
                        </div>
                        <!-- Organizador -->
                        <div class="text-subtitle1 row">
                          <q-icon
                            name="badge"
                            style="font-size: 1.5rem"
                            class="text-primary"
                          />
                          <div class="col-auto q-pl-lg text-weight-light">
                            Organizado por:
                          </div>

                          <div class="col-auto q-pl-sm text-weight-bold">
                            {{ evento.organizador || "Organizador desconocido" }}
                          </div>
                        </div>
                      </div>
                    </q-tab-panel>
                    <q-tab-panel name="premios">
                      <div class="text-h4 q-mb-md text-weight-bold text-center">
                        Listado de premios - {{ evento.nombre }}
                      </div>
                      <q-list>
                        <q-item
                          v-for="(premio, index) in evento.premios"
                          v-bind:key="index"
                        >
                          <q-item-section left>
                            <div class="text-weight-bolder text-h6 q-pa-sm">
                              <span class="text-primary text-capitalize">
                                {{ obtenerOrdinal(Number(index + 1)) + " premio " }}
                              </span>
                              <span class="text-white">{{
                                " -  " + premio.recompensa + " Puntos de Experiencia"
                              }}</span>
                            </div>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-tab-panel>
                  </q-tab-panels>
                </template>
              </q-splitter>
            </div>
          </q-slide-transition>

          <q-separator />
        </q-card>
        <q-dialog v-model="modalCandidatura">
          <modal-candidatura :datos="this.evento" />
        </q-dialog>
        <q-dialog v-model="modalGanadores">
          <q-card style="width: 1000px">
            <q-toolbar class="bg-primary justify-center text-h5">
              <span class="text-weight-bold">Añadir nueva candidatura</span>
            </q-toolbar>
            <q-card-section class="">
              <q-form class="q-pa-md" @submit="seleccionarGanadoras">
                <div
                  class="q-pa-sm row justify-center"
                  v-for="(premio, index) in evento.premios"
                  :key="index"
                >
                  <q-select
                    filled
                    v-model="candidaturasGanadoras[index]"
                    use-input
                    class="q-mb-md"
                    fill-input
                    hide-selected
                    input-debounce="0"
                    :label="obtenerOrdinal(Number(index + 1)) + ' Premio'"
                    :rules="[(val) => !!val || 'Campo obligatorio']"
                    :options="listadoCandidaturas()"
                    :hint="
                      'Vota la candidatura que será premiada con ' +
                      premio.recompensa +
                      ' Puntos de Experiencia'
                    "
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop />
                    </template>
                    <template v-slot:hint> Escribe el título del candidatura </template>
                  </q-select>
                </div>
                <q-card-actions align="right">
                  <q-btn flat label="Cancelar" color="primary" v-close-popup />
                  <q-btn type="submit" label="Enviar" color="primary" />
                </q-card-actions>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
      <div class="col">
        <q-card class="editor" flat>
          <q-bar class="bg-primary barraMenu">
            <q-space />

            <q-space />

            <q-btn dense flat icon="minimize" @click="ventanaInfoExpanded = false" />
            <q-btn dense flat icon="crop_square" @click="ventanaInfoExpanded = true" />
            <q-btn dense flat icon="close" />
          </q-bar>
          <q-separator />

          <q-card-section horizontal>
            <q-card-section
              class="falsoIDE col-12"
              v-if="this.evento.candidaturasGanadoras.length <= 0"
            >
              <div class="text-h5 q-pa-sm text-center row justify-center">
                Candidaturas recibidas hasta ahora
                <q-btn
                  push
                  icon="add"
                  class="q-ml-lg"
                  label="Presentar candidatura"
                  v-if="!showSpecialButton"
                  color="primary"
                  @click="modalCandidatura = true"
                />
                <q-btn
                  push
                  icon="emoji_events"
                  class="q-ml-lg"
                  label="Seleccionar ganadores"
                  v-if="showSpecialButton"
                  color="primary"
                  @click="modalGanadores = true"
                />
              </div>

              <q-scroll-area
                :thumb-style="thumbStyle"
                :bar-style="barStyle"
                style="width: 100%; height: 350px"
              >
                <q-list>
                  <q-item v-if="evento.candidaturas.length <= 0">
                    No hay candidaturas presentadas hasta ahora. ¡Sé el primero!</q-item
                  >
                  <q-item
                    v-if="evento.candidaturas.length > 0"
                    v-for="candidatura in evento.candidaturas"
                    v-bind:key="candidatura.id"
                  >
                    <q-item-section left>
                      <q-item-label>{{ candidatura.titulo }}</q-item-label>
                      <q-item-label caption lines="2">{{
                        candidatura.descripcion
                      }}</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label caption class="text-weight-bold"
                        >Desarrollado por: {{ candidatura.autor }}</q-item-label
                      >
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="link" color="primary" />
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="download" color="primary" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-scroll-area>
            </q-card-section>
            <q-card-section
              class="falsoIDE col-12"
              v-if="this.evento.candidaturasGanadoras.length > 0"
            >
              <div class="text-h5 q-pa-sm text-center row justify-center">
                Candidaturas ganadoras
              </div>

              <q-scroll-area
                :thumb-style="thumbStyle"
                :bar-style="barStyle"
                style="width: 100%; height: 350px"
              >
                <q-list>
                  <q-item
                    v-for="candidatura in mapearCandidaturasGanadoras()"
                    v-bind:key="candidatura.id"
                  >
                    <q-item-section left>
                      <q-item-label>{{ candidatura.titulo }}</q-item-label>
                      <q-item-label caption lines="2">{{
                        "Premiada con " + candidatura.premio + " Puntos de Experiencia"
                      }}</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label caption class="text-weight-bold"
                        >Desarrollado por: {{ candidatura.autor }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-scroll-area>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import axios from "axios";
import ModalCandidatura from "../components/ModalCandidatura.vue";
export default {
  components: { ModalCandidatura },
  methods: {
    // Fuerza el renderizado de un componente
    forceRerender() {
      this.render = false;

      this.$nextTick(() => {
        this.render = true;
      });
    },
    // Calcula el total de XP en premios
    calcularPremios(evento) {
      var total = 0;
      evento.premios.forEach((p) => {
        total += p.recompensa;
      });
      return total;
    },
    // Obtiene el evento con id pasado como parámetro a la ruta
    obtenerEvento() {
      const axiosConfig = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://www.ecodium.dev/",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
        },
      };
      const apiCall =
        "https://api.ecodium.dev/api/eventos/evento/" + this.$route.params.id;
      axios
        .get(apiCall, axiosConfig)
        .then((res) => {
          this.evento = res.data;
          const apiCall2 =
            "https://api.ecodium.dev/api/eventos/tienePermisos/" + this.$route.params.id;
          axios
            .get(apiCall2, axiosConfig)
            .then((res2) => {
              this.showSpecialButton = res2.data;
            })
            .catch((error2) => {
              this.showSpecialButton = false;
            });
        })
        .catch((error) => {
          console.warn(error);
          this.evento = {};
        });
    },
    // Obtiene el número ordinal
    obtenerOrdinal(num) {
      var ordinales = [
        "Cero",
        "Primer",
        "Segundo",
        "Tercero",
        "Cuarto",
        "Quinto",
        "Sexto",
        "Séptimo",
        "Octavo",
        "Noveno",
        "Décimo",
      ];
      var decenas = {
        20: "Vigésimo",
        30: "Trigésimo",
        40: "Cuadragésimo",
        50: "Quincuagésimo",
      };
      if (num <= 10) {
        return ordinales[num];
      }
      if (num % 10 === 0) {
        return decenas[num];
      }
      return decenas[num - (num % 10)] + ordinales[num % 10];
    },
    // Devuelve el listado de candidaturas mapeado para el select
    listadoCandidaturas() {
      var candidaturasMap = [];
      this.evento.candidaturas.forEach((candidatura) => {
        candidaturasMap.push({
          value: candidatura.autor,
          label: candidatura.titulo + " - " + candidatura.autor,
        });
      });
      return candidaturasMap;
    },
    // Selecciona las candidaturas ganadoras
    seleccionarGanadoras() {
      const ganadoras = this.candidaturasGanadoras.map((c) => {
        return c.value;
      });
      const apiCall =
        "https://api.ecodium.dev/api/eventos/actualizar/" + this.$route.params.id;
      axios
        .put(apiCall, { candidaturasGanadoras: ganadoras })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      
    },
    // Mapea las candidaturas ganadoras
    mapearCandidaturasGanadoras() {
      var cgmap = [];
      var aux = 0;
      this.evento.candidaturasGanadoras.forEach((cg) => {
        const candidatura = this.evento.candidaturas.find((obj) => {
          return obj.autor === cg;
        });
        cgmap.push({ ...candidatura, premio: this.evento.premios[aux].recompensa });
        aux++;
      });
      return cgmap;
    },
  },
  meta() {
    return {
      title: "ECodium | Evento",
    };
  },
  data() {
    this.tema = this.$q.dark.isActive ? "yonce" : "ttcn";
    var evento = {
      id: Number,
      estado: String,
      nombre: String,
      descripcion: String,
      limite: Number,
      precio: Number,
      premios: [
        {
          puesto: Number,
          recompensa: Number,
        },
      ],
      visible: Boolean,
      fecha: Date,
      candidaturas: [
        {
          titulo: String,
          autor: String,
          descripcion: String,
          repositorio: String,
          imagenes: [String],
        },
      ],
      candidaturasGanadoras: {
        premio: Number,
        autor: String,
      },
      etiquetas: [String],
    };
    this.obtenerEvento();
    return {
      evento,
      modalCandidatura: false,
      modalGanadores: false,
      showSpecialButton: false,
      candidaturas: [
        { titulo: "Hola", descripcion: "Mundo", autor: "Zeus" },
        { titulo: "Hola", descripcion: "Mundo", autor: "Zeus" },
        { titulo: "Hola", descripcion: "Mundo", autor: "Zeus" },
      ],
      columns: [
        {
          name: "id",
          required: true,
          label: "Número de prueba",
          align: "left",
          field: (row) => row.id,
          format: (val) => `${val}`,
          classes: "ellipsis",
          style: "max-width: 100px",
          headerClasses: "bg-primary text-white",
        },
        {
          name: "input",
          required: true,
          label: "Entrada",
          align: "left",
          field: (row) => (row.entrada ? row.entrada : "????"),
          format: (val) => `${val}`,
        },
        {
          name: "output",
          required: true,
          label: "Salida",
          align: "left",
          field: (row) => (row.salida ? row.salida : "????"),
          format: (val) => `${val}`,
        },
        {
          name: "status",
          required: true,
          label: "Estado",
          align: "left",
          field: (row) => (row.superada ? "Superada" : "Pendiente"),
          format: (val) => `${val}`,
        },
      ],
      candidaturasGanadoras: [],
      splitterModel: 5,
      tab: "info",
      ventanaInfoOpen: true,
      ventanaInfoExpanded: true,

      thumbStyle: {
        right: "4px",
        borderRadius: "5px",
        backgroundColor: "#ec7745",
        width: "5px",
        opacity: 0.75,
      },

      barStyle: {
        right: "2px",
        borderRadius: "9px",
        backgroundColor: "#ec7745",
        width: "0px",
        opacity: 0.2,
      },
      render: true,
    };
  },
};
</script>

<style lang="scss">
.retCab {
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px;
  display: inline-block;
  width: 100%;
}

.CodeMirror {
  line-height: 1.5;
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
    Cantarell, "Open Sans", "Helvetica Neue", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol";
  font-weight: bolder;
  font-size: 13px;
  letter-spacing: 1.5px;
  color: $primary;
}

.barraMenu {
  font-family: "Fira Code";
}
.falsaConsola {
  font-size: 12px;
  font-weight: bolder;
  font-family: "Fira Code";
  line-height: 1.3;
  letter-spacing: 1.4px;
  white-space: pre; // or pre-line
}

.editor {
  display: inline-block;
  width: 80vw;
  margin: 15px !important;
}
.editor > .text-h6 {
  float: left;
  padding-left: 2%;
}
.editor > q-btn {
  float: left;
  bottom: 5px;
  padding-left: 2%;
}

.editor {
  box-shadow: rgba(236, 119, 69, 0.4) 5px 5px, rgba(236, 119, 69, 0.3) 10px 10px,
    rgba(236, 119, 69, 0.2) 15px 15px, rgba(236, 119, 69, 0.1) 20px 20px,
    rgba(236, 119, 69, 0.05) 25px 25px !important;
}
.detalles {
  width: 30%;
  background-color: blue;
}
.consola {
  width: 30%;
  background-color: green;
  float: right;
}
</style>
