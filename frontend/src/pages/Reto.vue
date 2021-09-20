<!-- ECODIUM - TFG Samuel Encinas -->
<!-- PÁGINA: Reto -->
<template>
  <q-page padding>
    <div class="column items-center">
      <div class="col">
        <q-card class="editor q-ma-xl q-pa-l" v-show="ventanaInfoOpen1" flat bordered>
          <q-bar class="bg-primary">
            <q-icon name="img:icons/iconos/lightmode/talento.svg" />
            <div class="text-bold barraMenu">Info del reto - {{ this.reto.nombre }}</div>

            <q-space />

            <q-btn dense flat icon="minimize" @click="ventanaInfoExpanded1 = false" />
            <q-btn dense flat icon="crop_square" @click="ventanaInfoExpanded1 = true" />
            <q-btn dense flat icon="close" @click="ventanaInfoOpen1 = false" />
          </q-bar>
          <q-slide-transition>
            <div v-show="ventanaInfoExpanded1">
              <q-splitter v-model="splitterModel" style="height: 250px">
                <template v-slot:before>
                  <q-tabs v-model="tab" vertical class="text-primary">
                    <q-tab name="info" icon="lightbulb" label="Info" />
                    <q-tab name="detalles" icon="description" label="Detalles" />
                    <q-tab name="pruebas" icon="analytics" label="Pruebas" />
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
                      <div class="text-h4 q-mb-md">Info - {{ reto.nombre }}</div>
                      <span class="text-weight-bolder">Descripción: </span
                      ><span v-html="reto.descripcion"></span
                    ></q-tab-panel>

                    <q-tab-panel name="detalles">
                      <div class="text-h4 q-mb-md">Detalles - {{ reto.nombre }}</div>
                      <div>
                        <!-- Dificultad -->
                        <div class="text-subtitle1 row">
                          <q-icon
                            name="shopping_cart"
                            style="font-size: 1.5rem"
                            class="text-primary"
                          />
                          <div class="col-auto q-pl-lg text-weight-light">
                            Dificultad:
                          </div>

                          <div
                            class="col-auto q-pl-sm q-pr-sm text-weight-bold"
                            :class="dificultad.color"
                          >
                            {{ dificultad.palabra || "Desconocida" }}
                          </div>
                        </div>
                        <!-- Límite (para concursos) -->
                        <div class="text-subtitle1 row">
                          <q-icon
                            name="sports_esports"
                            style="font-size: 1.5rem"
                            class="col-auto text-primary"
                          />
                          <div class="col-auto q-pl-lg text-weight-light">Pruebas:</div>

                          <div class="col-auto q-pl-xs text-weight-bold">
                            {{ reto.pruebas.length || 0 }} pruebas
                          </div>
                        </div>
                        <div class="text-subtitle1 row">
                          <q-icon
                            name="casino"
                            style="font-size: 1.5rem"
                            class="col-auto text-primary"
                          />
                          <div class="col-auto q-pl-lg text-weight-bold">
                            {{ reto.recompensa || 0 }}
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
                            <q-badge
                              rounded
                              color="primary"
                              :label="tag"
                              v-for="tag in reto.etiquetas"
                              :key="tag"
                            />
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
                            {{ reto.organizador || "Organizador desconocido" }}
                          </div>
                        </div>
                      </div>
                    </q-tab-panel>

                    <q-tab-panel name="pruebas">
                      <q-table
                        :title="'Pruebas - ' + reto.nombre"
                        :data="pruebas"
                        :columns="columns"
                        row-key="id"
                      >
                        <template v-slot:bottom> </template>
                        <template v-slot:body-cell-id="props">
                          <q-td auto-width :props="props">
                            <div>
                              {{ props.value }}
                            </div>
                          </q-td>
                        </template>
                        <template v-slot:body-cell-status="props">
                          <q-td :props="props">
                            <div>
                              <q-badge
                                :color="props.value == 'Superada' ? 'green' : 'red'"
                                :label="props.value"
                              />
                            </div>
                          </q-td>
                        </template>
                      </q-table>
                    </q-tab-panel>
                  </q-tab-panels>
                </template>
              </q-splitter>
            </div>
          </q-slide-transition>

          <q-separator />
        </q-card>
      </div>
      <div class="col">
        <q-card class="editor" flat v-show="ventanaInfoOpen2">
          <q-bar class="bg-primary barraMenu">
            <q-icon name="img:icons/iconos/lightmode/talento.svg" />
            <q-icon
              size="md"
              name="play_arrow"
              @click="ejecutar(Number(pruebaSeleccionada - 1))"
            >
              <q-tooltip> Ejecutar prueba actual </q-tooltip>
            </q-icon>
            <q-icon size="md" name="skip_next">
              <q-tooltip> Ejecutar todas las pruebas seguidas </q-tooltip>
            </q-icon>
            <q-icon size="md" name="delete" @click="limpiar">
              <q-tooltip> Limpiar consola </q-tooltip>
            </q-icon>
            <q-space />

            <q-badge>
              <div class="text-weight-bolder">
                Reto {{ $route.params.id }} - Validación de prueba:
              </div>
            </q-badge>
            <div style="width: 40%">
              <q-select
                v-model="pruebaSeleccionada"
                prefix="Prueba "
                :options="mapearPruebas()"
                borderless
              />
            </div>
            <q-space />

            <q-btn dense flat icon="minimize" @click="ventanaInfoExpanded2 = false" />
            <q-btn dense flat icon="crop_square" @click="ventanaInfoExpanded2 = true" />
            <q-btn dense flat icon="close" />
          </q-bar>
          <q-slide-transition>
            <div v-show="ventanaInfoExpanded2">
              <q-separator />

              <q-card-section horizontal>
                <q-card-section class="falsoIDE col-6">
                  <q-scroll-area
                    :thumb-style="thumbStyle"
                    :bar-style="barStyle"
                    style="width: 100%; height: 350px"
                  >
                    <codemirror
                      ref="myCm"
                      v-if="render"
                      :value="code"
                      :options="cmOptions"
                      @ready="onCmReady"
                      @focus="onCmFocus"
                      @input="onCmCodeChange"
                    >
                    </codemirror>
                  </q-scroll-area>
                </q-card-section>

                <q-separator vertical />

                <q-card-section class="falsaConsola col-6">
                  <q-scroll-area
                    :thumb-style="thumbStyle"
                    :bar-style="barStyle"
                    class="col"
                    style="width: 100%; height: 250px"
                  >
                    {{ this.outputConsola }}
                  </q-scroll-area>
                </q-card-section>
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
// require component
import { codemirror } from "vue-codemirror";

// require styles
import "codemirror/lib/codemirror.css";
import "codemirror/theme/yonce.css";
import "codemirror/theme/ttcn.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/addon/selection/active-line.js";
import axios from "axios";
export default {
  components: {
    codemirror,
  },
  created() {
    this.$root.$on("alternarColor", this.cambiarColorEditor);
  },
  beforeDestroy() {
    this.$root.$off("alternarColor", this.cambiarColorEditor);
  },
  computed: {
    codemirror() {
      return this.$refs.myCm.codemirror;
    },
  },
  methods: {
    // Comprueba si el reto ha sido conquistado y, si no, conquista el reto
    comprobarConquista() {
      if (
        !this.reto.conquistador ||
        this.reto.conquistador == "undefined" ||
        this.reto.conquistador == undefined
      ) {
        this.reto.conquistador = this.$store.state.auth.user._id;
        const apiCallConq =
          "https://api.ecodium.dev/api/retos/actualizar/" + this.$route.params.id;
        axios
          .put(apiCallConq, { conquistador: this.reto.conquistador })
          .then((res) => {})
          .catch((err) => {
            console.log("Error");
          });
      }
    },
    // Mapear pruebas
    mapearPruebas() {
      var arrayOpciones = [];
      this.pruebas.forEach((p) => {
        arrayOpciones.push(p.id);
      });
      return arrayOpciones;
    },
    // Comprueba si se han superado todas las pruebas y, si es así, añade el reto al back
    comprobarPruebas() {
      var todas = true;
      this.pruebas.forEach((prueba) => {
        if (!prueba.superada) {
          todas = false;
        }
        if (prueba.superada && todas) {
          todas = true;
        }
      });

      if (todas) {
        const apiCallUpdate =
          "https://api.ecodium.dev/api/auth/actualizar/" +
          this.$store.state.auth.user._id;
        const guardarReto = {
          idReto: this.$route.params.id,
          fecha: new Date(),
        };
        const movimiento = {
          cantidad: this.reto.recompensa,
          fecha: new Date(),
          concepto: "Resolución de reto",
        };
        if (!this.reto.retos) this.reto.retos = [];

        this.reto.retos.push(guardarReto);
        const movimientos = this.$store.state.auth.user.movimientosExp;
        if (!movimientos) movimientos = [];
        movimientos.push(movimiento);

        axios
          .put(apiCallUpdate, {
            retos: this.reto.retos,
            movimientosExp: movimientos,
          })
          .then((res) => {
            this.$store.commit("addNotification", {
              notification: "Reto resuelto",
              time: Date.now(),
            });
            this.comprobarConquista();
          })
          .catch((err) => {
            console.log("Error");
          });
      }
    },
    // Ejecuta el código del falso IDE en modo sandbox desde el backend (Solo una prueba)
    ejecutar(prueba) {
      const id = this.$route.params.id;

      const codigo = this.code;
      const pruebaSeleccionada = this.pruebas[prueba].id;
      const request = { id, pruebaSeleccionada, codigo };
      const apiCall = "https://api.ecodium.dev/api/retos/resolver/";
      axios
        .post(apiCall, request)
        .then((res) => {
          if (res.data.mensaje == "correcto") {
            const p = this.pruebas[prueba];
            p.superada = true;
            this.$set(this.pruebas[prueba], p);
            this.comprobarPruebas();
          }

          this.outputConsola += "\n" + res.data.respuesta;
        })
        .catch((err) => {
          this.outputConsola = "Error: " + err;
        });
    },
    // Ejecuta el código del falso IDE en modo sandbox desde el frontend (Todas)
    ejecutarTodo() {},
    // Limpia la consola
    limpiar() {
      this.outputConsola = "";
    },
    forceRerender() {
      // Remove my-component from the DOM
      this.render = false;

      this.$nextTick(() => {
        // Add the component back in
        this.render = true;
      });
    },
    onCmReady(cm) {},
    onCmFocus(cm) {},
    onCmCodeChange(newCode) {
      this.code = newCode;
    },
    cambiarColorEditor() {
      this.tema = this.$q.dark.isActive ? "yonce" : "ttcn";
      this.cmOptions = {
        ...this.codemirror.options,
        theme: this.$q.dark.isActive ? "yonce" : "ttcn",
      };
      this.forceRerender();
    },
    obtenerReto() {
      const apiCall = "https://api.ecodium.dev/api/retos/reto/" + this.$route.params.id;
      axios
        .get(apiCall)
        .then((res) => {
          this.obtenerDificultad(res.data.dificultad);
          this.reto = res.data;
          this.pruebas = res.data.pruebas;
          this.pruebas.map((prueba) => ({
            ...prueba,
            superada: false,
          }));
          this.pruebaSeleccionada = res.data.pruebas[0].id;
        })
        .catch((error) => {
          console.warn(error);
          this.reto = {};
        });
    },
    obtenerDificultad(nivel) {
      switch (nivel) {
        case 0:
          this.dificultad.valor = 18;
          this.dificultad.color = "text-green";
          this.dificultad.palabra = "Muy fácil";
          break;
        case 1:
          this.dificultad.valor = 38;
          this.dificultad.color = "text-yellow";
          this.dificultad.palabra = "Fácil";

          break;
        case 2:
          this.dificultad.valor = 53;
          this.dificultad.color = "text-amber";
          this.dificultad.palabra = "Moderado";

          break;
        case 3:
          this.dificultad.valor = 67;
          this.dificultad.color = "text-orange";
          this.dificultad.palabra = "Difícil";

          break;
        case 4:
          this.dificultad.valor = 83;
          this.dificultad.color = "text-red";
          this.dificultad.palabra = "Extremo";

          break;
        default:
          this.dificultad.valor = 18;
          this.dificultad.color = "text-green";
          this.dificultad.palabra = "Fácil";

          break;
      }
    },
  },
  data() {
    this.tema = this.$q.dark.isActive ? "yonce" : "ttcn";
    this.$store.commit("setMenuStatus", "retos");

    console.log("tema" + this.tema);
    var dificultad = {
      valor: Number,
      palabra: String,
      color: String,
    };
    var reto = {
      id: String,
      nombre: String,
      descripcion: String,
      dificultad: Number,
      etiquetas: [String],
      recompensa: Number,
      conquistador: String,
      pruebas: [{ entrada: String, id: String, salida: String }],
    };
    var pruebas = [
      {
        entrada: String,
        id: String,
        salida: String,
        tipo: [String],
        superada: Boolean,
      },
    ];
    this.obtenerReto();

    return {
      reto,
      dificultad,
      pruebas,
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
      pruebaSeleccionada: 0,
      splitterModel: 5,
      tab: "info",
      ventanaInfoOpen1: true,
      ventanaInfoExpanded1: true,
      ventanaInfoOpen2: true,
      ventanaInfoExpanded2: true,
      outputConsola: "",

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
      code:
        "/** Bienvenido al editor de ECodium. \n Por seguridad, estás en un entorno de sandbox, por lo que olvídate de intentar liarla. \n Para que se te contabilice la prueba como válida, tu programa deberá imprimir por pantalla la salida que consideres correcta. \n ¡Gracias y suerte con el reto!**/",
      cmOptions: {
        tabSize: 4,
        mode: "javascript",
        theme: this.tema,
        lineNumbers: true,
        lineWrapping: true,
        styleActiveLine: true,
        styleActiveSelected: true,
      },
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
