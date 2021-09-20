<!-- ECODIUM - TFG Samuel Encinas -->
<!-- WEB COMPONENT: Modal de Retos -->
<template>
  <q-card style="width: 700px; max-width: 80vw">
    <q-form @submit="mainModalAction" @reset="resetModalAction" class="login-form">
      <q-toolbar class="q-pa-md bg-primary">
        <q-icon name="work" size="md" class="text-white" />
        <q-toolbar-title v-if="!this.datos">Añadir nuevo reto</q-toolbar-title>
        <q-toolbar-title v-if="this.datos">Editar reto</q-toolbar-title>

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
          <q-tab name="info" label="Datos" />
          <q-tab name="pruebas" label="Pruebas" />
        </q-tabs>
        <q-tab-panels v-model="tab" animated keep-alive>
          <q-tab-panel name="info">
            <div class="input-group q-ma-md">
              <q-input
                v-model="info.nombre"
                class="q-mb-md"
                type="string"
                label="Nombre"
                lazy-rules
                :rules="[(val) => !!val || 'Campo obligatorio']"
                hint="Pon un nombre llamativo"
              />
            </div>
            <div class="input-group row q-ma-md">
              <q-input
                v-model="info.recompensa"
                type="string"
                style="min-width: 180px"
                label="Recompensa"
                suffix="XP"
                lazy-rules
                hint="Establece la recompensa para tu reto"
                :rules="[
                  (val) => !!val || 'Campo obligatorio',
                  (val) => !isNaN(val) || 'Solo se permiten números',
                  (val) => val < 3000 || 'No se permiten retos de más de 3000 XP',
                ]"
              />
              <q-space />
              <q-select
                v-model="info.dificultad"
                style="min-width: 200px"
                :options="[
                  { label: 'Muy fácil', value: 0 },
                  { label: 'Fácil', value: 1 },
                  { label: 'Moderado', value: 2 },
                  { label: 'Difícil', value: 3 },
                  { label: 'Extremo', value: 4 },
                ]"
                label="Dificultad"
                hint="Establece la dificultad de tu reto"
                :rules="[(val) => !!val || 'Campo obligatorio']"
              ></q-select>
              <q-space />
            </div>
            <q-space />
            <div class="input-group q-ma-md">
              <q-select
                v-model="info.etiquetas"
                :display-value="`${info.etiquetas.length} etiquetas seleccionadas`"
                filled
                borderless
                multiple
                label="Etiquetas"
                :options="posiblesEtiquetas"
              />
            </div>
            <q-space />
            <div class="input-group q-ma-md">
              <q-field borderless label="Descripción">
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
            <div class="input-group">
              <q-field
                class="pruebasDinamicas"
                borderless
                label="Pruebas que debe pasar el usuario"
                stack-label
              >
                <div v-for="(prueba, counter) in pruebas" v-bind:key="counter">
                  <div class="row">
                    <div class="col-md-2 q-pl-lg">
                      <div class="text-weight-bolder text-h6 q-pa-sm">
                        {{ (prueba.id = counter + 1) }}
                      </div>
                    </div>
                    <div class="col-md-2 q-pl-lg">
                      <q-input
                        type="text"
                        label="Entrada"
                        v-model="prueba.entrada"
                        required
                      />
                    </div>
                    <div class="col-md-2 q-pl-lg" style="padding-top: 0px !important">
                      <q-select
                        v-model="prueba.tipo"
                        :options="[
                          { label: 'Pública', value: 'publica' },
                          { label: 'Oculta', value: 'oculta' },
                          { label: 'Privada', value: 'privada' },
                        ]"
                        label="Tipo"
                        :rules="[(val) => !!val || 'Campo obligatorio']"
                      ></q-select>
                    </div>
                    <div class="col-md-2 q-pl-lg">
                      <q-input
                        type="text"
                        label="Salida esperada"
                        v-model="prueba.salida"
                        required
                      />
                    </div>
                    <div class="col-md-3 q-ma-md">
                      <q-btn
                        flat
                        color="primary"
                        v-if="pruebas.length > 1"
                        @click="deletePrueba(counter)"
                        icon="delete"
                      ></q-btn>
                      <q-btn
                        flat
                        color="primary"
                        @click="addPrueba(counter)"
                        icon="add"
                      ></q-btn>
                    </div>
                  </div>
                </div>
              </q-field>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
      <q-card-actions align="center">
        <div>
          <q-btn label="Añadir" type="submit" color="primary" v-close-popup></q-btn>
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
    let posiblesEtiquetas = [];
    this.obtenerEtiquetas();
    return {
      tab: "info",
      info: {
        nombre: this.datos ? this.datos.nombre : "",
        descripcion: this.datos ? this.datos.descripcion : "",
        dificultad: this.datos ? this.datos.dificultad : "",
        recompensa: this.datos ? this.datos.recompensa : "",
        etiquetas: this.datos ? this.datos.etiquetas : [],
      },
      pruebas:
        this.datos && this.datos.pruebas.length > 0
          ? this.datos.pruebas
          : [{ entrada: "", salida: "", tipo: "" }],
      posiblesEtiquetas: this.posiblesEtiquetas,
    };
  },

  // name: 'ComponentName',
  props: {
    datos: {
      nombre: String,
    },
  },
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
    mainModalAction() {
      if (this.datos && this.datos !== undefined) {
        this.editarReto();
      } else {
        this.altaReto();
      }
    },
    resetModalAction() {
      this.info = {
        nombre: this.datos ? this.datos.nombre : "",
        descripcion: this.datos ? this.datos.descripcion : "",
        dificultad: this.datos ? this.datos.dificultad : "",
        recompensa: this.datos ? this.datos.recompensa : "",
        etiquetas: this.datos ? this.datos.etiquetas : [],
      };
    },
    altaReto() {
      const axiosConfig = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://www.ecodium.dev/",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
        },
      };
      const apiCall = "https://api.ecodium.dev/api/retos/nuevo-reto";
      axios
        .post(
          apiCall,
          {
            ...this.info,
            dificultad: this.info.dificultad.value,
            organizador: this.$store.state.auth.user.nombreUsuario,
            pruebas: this.pruebas
              ? this.pruebas.map((prueba) =>
                  prueba.tipo && prueba.tipo.value
                    ? { ...prueba, tipo: prueba.tipo.value }
                    : prueba
                )
              : [],
            conquistador: this.info.conquistador ? this.info.conquistador : "",
          },
          axiosConfig
        )
        .then((res) => {
          console.log("Reto guardado");
        })
        .catch((err) => {
          console.log("Error");
        });
    },
    editarReto() {
      const axiosConfig = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://www.ecodium.dev/",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
        },
      };
      const apiCall = "https://api.ecodium.dev/api/retos/actualizar/" + this.datos.id;
      axios
        .put(
          apiCall,
          {
            ...this.info,
            dificultad: this.info.dificultad.value,
            pruebas: this.pruebas
              ? this.pruebas.map((prueba) =>
                  prueba.tipo && prueba.tipo.value
                    ? { ...prueba, tipo: prueba.tipo.value }
                    : prueba
                )
              : [],
            conquistador: this.info.conquistador ? this.info.conquistador : "",
          },
          axiosConfig
        )
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
    addPrueba(counter) {
      this.pruebas.push({
        entrada: "",
        salida: "",
        tipo: "",
      });
    },
    deletePrueba(counter) {
      this.pruebas.splice(counter, 1);
    },
  },
};
</script>
<style lang="scss">
.q-panel > div {
  height: 70vh !important;
  width: 100%;
}
.editorTexto {
  width: 100% !important;
}
.q-field--auto-height.q-field--labeled .q-field__control-container {
  padding-top: 24px;
  flex-direction: column;
}
</style>
