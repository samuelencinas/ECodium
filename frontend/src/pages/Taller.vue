<!-- ECODIUM - TFG Samuel Encinas -->
<!-- PÁGINA: Taller -->
<template>
  <q-page padding>
    <div class="column items-center" v-if="!error">
      <div class="col">
        <q-card class="editor q-ma-xl q-pa-l" v-show="ventanaInfoOpen" flat bordered>
          <q-bar class="bg-primary">
            <q-icon name="img:icons/iconos/lightmode/talento.svg" />
            <div class="text-bold">Info del taller - {{ taller.nombre }}</div>

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
                    <q-tab name="contacto" icon="email" label="Contacto" />
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
                        Info - {{ taller.nombre }}
                      </div>
                      <span v-html="taller.descripcion"></span
                    ></q-tab-panel>
                    <q-tab-panel name="contacto">
                      <formulario-contacto :dest="taller.organizador" />
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
            <q-dialog v-model="modalNuevoContenido">
              <q-card style="width: 1000px">
                <q-toolbar class="bg-primary justify-center text-h5">
                  <span class="text-weight-bold">Añadir nuevo contenido</span>
                </q-toolbar>
                <q-card-section class="">
                  <q-form class="q-pa-md" @submit="nuevoContenido">
                    <q-input
                      v-model="contenido.titulo"
                      filled
                      class="q-mb-md"
                      label="Nombre de usuario"
                      lazy-rules
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="cloud_upload" @click.stop />
                      </template>
                      <template v-slot:hint> Escribe el título del contenido </template>
                    </q-input>
                    <q-input
                      v-model="contenido.descripcion"
                      filled
                      class="q-mb-md"
                      label="Descripción"
                      lazy-rules
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="article" @click.stop />
                      </template>
                      <template v-slot:hint> Pon una descripción al contenido </template>
                    </q-input>
                    <q-file
                      filled
                      bottom-slots
                      v-model="archivoSubiendo"
                      label="Archivo"
                      counter
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      accept=".jpg, .png, .pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .psd, .eps, .otf, image/*"
                      @input="subirArchivo"
                    >
                      <template v-slot:prepend>
                        <q-icon name="cloud_upload" @click.stop />
                      </template>
                      <template v-slot:append>
                        <q-icon
                          name="close"
                          @click.stop="archivoSubiendo = null"
                          class="cursor-pointer"
                        />
                      </template>

                      <template v-slot:hint>
                        Sube un archivo válido (se permiten documentos de ofimática e
                        imágenes en múltiples formatos)
                      </template>
                    </q-file>
                    <q-card-actions align="right">
                      <q-btn flat label="Cancelar" color="primary" v-close-popup />
                      <q-btn type="submit" label="Subir" color="primary" />
                    </q-card-actions>
                  </q-form>
                </q-card-section>
              </q-card>
            </q-dialog>
            <q-card-section class="falsoIDE col-12">
              <div class="text-h5 q-pa-sm text-center row justify-center">
                <div class="col-4">Contenidos del taller</div>
                <q-btn
                  push
                  icon="add"
                  class="botonPrincipal"
                  label="Añadir contenido"
                  color="primary"
                  v-if="showSpecialButton"
                  @click="modalNuevoContenido = true"
                >
                  <template v-slot:loading>
                    <q-spinner-facebook />
                  </template>
                </q-btn>
              </div>

              <q-scroll-area
                :thumb-style="thumbStyle"
                :bar-style="barStyle"
                style="width: 100%; height: 350px"
              >
                <q-list>
                  <q-item
                    v-for="contenido in taller.contenidos"
                    v-bind:key="contenido"
                    clickable
                    ripple
                  >
                    <q-item-section avatar top>
                      <q-avatar icon="description" color="primary" text-color="white" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label lines="1">{{
                        contenido.titulo || "Sin nombre"
                      }}</q-item-label>
                      <q-item-label caption>{{
                        contenido.descripcion || "Sin descripción"
                      }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        round
                        color="primary"
                        icon="download"
                        @click="descargarMaterial(contenido)"
                      />
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="delete" color="primary" v-if="!showSpecialButton" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-scroll-area>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-if="error">
      Error: No se ha podido obtener el taller solicitado. Es posible que no dispongas de
      permisos.
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
import FormularioContacto from "../components/FormularioContacto.vue";
import download from "downloadjs";

export default {
  components: { FormularioContacto },
  methods: {
    forceRerender() {
      // Remove my-component from the DOM
      this.render = false;

      this.$nextTick(() => {
        // Add the component back in
        this.render = true;
      });
    },

    obtenertaller() {
      const axiosConfig = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://www.ecodium.dev/",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
        },
      };
      const apiCall =
        "https://api.ecodium.dev/api/talleres/taller/" + this.$route.params.id;
      axios
        .get(apiCall, axiosConfig)
        .then((res) => {
          this.error = false;
          this.taller = res.data;
          const apiCall2 =
            "https://api.ecodium.dev/api/talleres/tienePermisos/" + this.$route.params.id;
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
          this.taller = {};
        });
    },
    // Subir contenido
    subirArchivo(archivo) {
      const apiCall = "https://api.ecodium.dev/api/herramientas/subirArchivo";
      const headers = {
        "Content-Type": undefined,
        "Access-Control-Allow-Origin": "https://www.ecodium.dev",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
      };
      let fd = new FormData();
      fd.append("tipo", "contenido");
      fd.append("file", archivo);
      
      axios
        .post(apiCall, fd, headers)
        .then((res) => {
          this.contenido.archivo = "https://api.ecodium.dev/subidas/" + res.data;
        })
        .catch((err) => {
          this.contenido.archivo = null;
        });
    },
    // Insertar contenido
    nuevoContenido() {
      const flag =
        !!this.contenido &&
        this.contenido.titulo !== "" &&
        this.contenido.descripcion !== "" &&
        this.contenido.archivo !== null;
      if (flag) {
        const apiCall =
          "https://api.ecodium.dev/api/talleres/nuevoContenido/" + this.taller.id;
        axios
          .put(apiCall, { contenido: this.contenido })
          .then((res) => {
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // Descargar material
    descargarMaterial(contenido) {
      axios
        .get(contenido.archivo, {
          responseType: "blob",
        })
        .then((res) => {
          download(res.data, contenido.titulo, res.headers["content-type"]);
        });
    },
  },
  data() {
    this.tema = this.$q.dark.isActive ? "yonce" : "ttcn";
    var taller = {
      id: Number,
      estado: String,
      nombre: String,
      descripcion: String,
      limite: Number,
      precio: Number,
      contacto: [
        {
          puesto: Number,
          recompensa: Number,
        },
      ],
      visible: Boolean,
      fecha: Date,
      contenidos: [
        {
          titulo: String,
          descripcion: String,
          archivo: String,
        },
      ],
      etiquetas: [String],
    };
    this.obtenertaller();
    
    return {
      taller,
      modalNuevoContenido: false,
      error: false,
      archivoSubiendo: null,
      contenido: {
        titulo: "",
        descripcion: "",
        archivo: null,
      },
      showSpecialButton: false,
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
