<!-- ECODIUM - TFG Samuel Encinas -->
<!-- WEB COMPONENT: Modal para Añadir un Evento -->
<template>
  <q-card style="width: 700px; max-width: 80vw">
    <q-form @submit="altaEvento" class="login-form">
      <q-toolbar class="q-pa-md bg-primary">
        <<q-icon name="img:icons/iconos/lightmode/talento.svg" />
        size="md" class="text-white" />
        <q-toolbar-title>Añadir nuevo evento</q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-separator />
      <q-card-section>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="info" label="Datos generales" />
          <q-tab name="pruebas" label="Datos de Evento" />
        </q-tabs>
        <q-tab-panels v-model="tab" animated keep-alive>
          <q-tab-panel name="info">
            <!-- Info general EVENTOS -->
            <div class="input-group row q-ma-md justify-between">
              <q-input
                v-model="info.nombre"
                class="col-6"
                filled
                type="string"
                label="Nombre"
                lazy-rules
                :rules="[(val) => !!val || 'Campo obligatorio']"
                hint="Pon un nombre llamativo"
              />
              <q-space />
              <q-input
                v-model="info.organizador"
                type="string"
                filled
                disable
                class="col-2"
                readonly
                lazy-rules
                hint="Organizador del evento"
                :rules="[(val) => !!val || 'Campo obligatorio']"
              />
            </div>

            <div class="input-group row justify-between q-pa-md">
              <q-input
                v-model="info.precio"
                type="string"
                label="Pases"
                class="col-3"
                filled
                suffix="Pases"
                lazy-rules
                hint="Establece cuántos pases cuesta tu evento"
                :rules="[
                  (val) => !!val || 'Campo obligatorio',
                  (val) => !isNaN(val) || 'Solo se permiten números',
                  (val) => val < 3000 || 'No se permiten retos de más de 3000 XP',
                ]"
              />
              <q-space />
              <q-select
                v-model="info.estado"
                class="col-3"
                filled
                :options="[
                  { label: 'Borrador', value: 0 },
                  { label: 'Publicado', value: 1 },
                  { label: 'Cerrado', value: 2 },
                ]"
                label="Estado del evento"
                hint="Determina el estado del evento."
                :rules="[(val) => !!val || 'Campo obligatorio']"
              ></q-select>
              <q-space />
              <q-select
                v-model="info.etiquetas"
                :display-value="`${info.etiquetas.length} etiquetas seleccionadas`"
                filled
                class="col-4"
                borderless
                style="padding-bottom: 3%"
                multiple
                label="Etiquetas"
                :options="posiblesEtiquetas"
              />
            </div>
            <div class="input-group q-ma-md">
              <q-field borderless label="Descripción del evento">
                <div class="q-pa-sm q-gutter-sm editorTexto">
                  <q-editor
                    v-model="info.descripcion"
                    ref="editorRef"
                    class="q-ma-md"
                    toolbar-text-color="white"
                    toolbar-toggle-color="primary"
                    toolbar-bg="secondary"
                  >
                  </q-editor>
                </div>
              </q-field>
            </div>
          </q-tab-panel>

          <q-tab-panel name="pruebas">
            <!-- Info CONCURSOS -->
            <div>
              <div class="text-h4 row">Info de concurso</div>
              <div class="input-group row q-ma-md justify-even q-pa-lg">
                <q-input
                  v-model="info.limite"
                  type="string"
                  label="Nivel"
                  class="col-2"
                  filled
                  prefix="Nivel"
                  lazy-rules
                  hint="Establece nivel mínimo de acceso al evento"
                  :rules="[
                    (val) => !!val || 'Campo obligatorio',
                    (val) => !isNaN(val) || 'Solo se permiten números',
                    (val) => val > 0 || 'No se permiten niveles negativos',
                    (val) =>
                      val < 49 || 'No se permiten niveles mínimos superiores al Nivel 49',
                  ]"
                />
                <q-space />
                <q-input
                  filled
                  v-model="info.fecha.from"
                  class="col-4"
                  label="Fecha de inicio"
                  hint="Establece la fecha de inicio del evento"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-date v-model="info.fecha" mask="YYYY-MM-DD HH:mm" range>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-space />
                <q-input
                  label="Fecha de fin"
                  hint="Establece la fecha de fin del evento"
                  filled
                  v-model="info.fecha.to"
                  class="col-4"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-date v-model="info.fecha" mask="YYYY-MM-DD HH:mm" range>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-space />
              </div>
              <div class="input-group q-pa-lg">
                <q-field
                  class="pruebasDinamicas"
                  borderless
                  label="Premios para los ganadores"
                  stack-label
                >
                  <div v-for="(premio, counter) in premios" v-bind:key="counter">
                    <div class="row">
                      <div class="q-pl-lg">
                        <div class="q-pl-lg">
                          <div class="text-weight-bolder text-h6 q-pa-sm">
                            {{ (premio.puesto = counter + 1) }}
                          </div>
                        </div>
                      </div>
                      <div class="q-pl-lg">
                        <q-input
                          type="text"
                          label="Puntos de Experiencia"
                          v-model="premio.recompensa"
                          required
                        />
                      </div>
                      <div class="q-ma-md">
                        <q-btn
                          flat
                          color="primary"
                          v-if="premios.length > 1"
                          @click="deletePrueba(counter)"
                          icon="delete"
                        ></q-btn>
                        <q-btn flat color="primary" @click="addPrueba" icon="add"></q-btn>
                      </div>
                    </div>
                  </div>
                </q-field>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
      <q-card-actions align="center">
        <div>
          <q-btn label="Añadir" type="submit" color="primary"></q-btn>
          <q-btn
            label="Reiniciar"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          ></q-btn>
        </div>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import axios from "axios";
export default {
  name: "ModalRetos",
  data() {
    return {
      tab: "info",
      info: {
        // Variables generales
        nombre: this.datos ? this.datos.nombre : "",
        estado: this.datos ? this.datos.estado : "",
        descripcion: this.datos ? this.datos.descripcion : "",
        precio: this.datos ? this.datos.precio : "",
        etiquetas: this.datos ? this.datos.etiquetas : [],
        organizador: this.datos
          ? this.datos.organizador
          : this.$store.state.auth.user.nombreUsuario,

        // Variables de eventos de tipo CONCURSO
        limite: this.datos ? this.datos.limite : "",
        premios: this.datos ? this.datos.premios : [],
        visible: this.datos ? this.datos.visible : true,
        fechaInicio: this.datos ? this.datos.fechaInicio : "",
        fechaFin: this.datos ? this.datos.fechaFin : "",
        candidaturas: this.datos ? this.datos.candidaturas : [],

        // Variables de eventos de tipo TALLER
        contenidos: this.datos ? this.datos.contenidos : [],
        certificable: this.datos ? this.datos.certificable : false,
        plazas: this.datos ? this.datos.plazas : 0,
        alumnos: this.datos ? this.datos.alumnos : [],
        fecha: this.datos ? this.datos.fecha : "",
      },
      premios:
        this.datos && this.datos.premios.length > 0
          ? this.datos.premios
          : [{ puesto: "1", recompensa: "2" }],
      contador: "",
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

  // name: 'ComponentName',
  props: {
    datos: {
      nombre: String,
    },
  },
  methods: {
    altaEvento() {
      const apiCall = "https://api.ecodium.dev/api/eventos/nuevo-evento";
      axios
        .post(apiCall, {
          ...this.info,
          estado: this.info.estado.label,
          fechaInicio: this.info.fecha.from,
          fechaFin: this.info.fecha.to,
          premios: this.premios ? this.premios : [],
        })
        .then((res) => {
          console.log("Reto guardado");
        })
        .catch((err) => {
          console.log("Error");
        });
    },
    obtenerDificultad(value) {
      switch (value) {
        case 0:
          return "Muy fácil";
        case 1:
          return "Fácil";
        case 2:
          return "Moderado";
        case 3:
          return "Difícil";
        case 4:
          return "Extremo";
        default:
          return "Fácil";
      }
    },
    addPrueba() {
      this.premios.push({
        puesto: "",
        recompensa: "",
      });
    },
    deletePrueba(counter) {
      this.premios.splice(counter, 1);
    },
  },
};
</script>
<style lang="scss">
.delete-button {
  height: 20px;
  width: 20px;
  color: white;
  background: crimson;
  border: none;
  font-weight: 900;
  border-radius: 100%;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
}
.editorTexto {
  width: 100% !important;
}
.q-field--auto-height.q-field--labeled .q-field__control-container {
  padding-top: 24px;
  flex-direction: column;
}
</style>
