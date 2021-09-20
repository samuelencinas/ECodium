<!-- ECODIUM - TFG Samuel Encinas -->
<!-- WEB COMPONENT: Modal para Presentar Candidatura (para usuarios Jugadores) -->
<template>
  <q-card style="width: 1000px">
    <q-toolbar class="bg-primary justify-center text-h5">
      <span class="text-weight-bold">Añadir nueva candidatura</span>
    </q-toolbar>
    <q-card-section class="">
      <q-form class="q-pa-md" @submit="nuevaCandidatura">
        <q-input
          v-model="candidatura.titulo"
          filled
          class="q-mb-md"
          label="Nombre de usuario"
          lazy-rules
          :rules="[(val) => !!val || 'Campo obligatorio']"
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" @click.stop />
          </template>
          <template v-slot:hint> Escribe el título de la candidatura </template>
        </q-input>
        <q-input
          v-model="candidatura.descripcion"
          filled
          class="q-mb-md"
          label="Descripción"
          lazy-rules
          :rules="[(val) => !!val || 'Campo obligatorio']"
        >
          <template v-slot:prepend>
            <q-icon name="article" @click.stop />
          </template>
          <template v-slot:hint> Pon una descripción a la candidatura </template>
        </q-input>
        <q-select
          filled
          v-model="repositorio"
          use-input
          class="q-mb-md"
          fill-input
          hide-selected
          input-debounce="0"
          :options="listadoRepositorios"
          hint="Selecciona el repositorio de GitHub para enlazar con la candidatura. ¡Asegúrate de tener tu cuenta de GitHub enlazada y que el repo es público!"
        >
          <template v-slot:prepend>
            <q-icon name="article" @click.stop />
          </template>
        </q-select>
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
            Sube un archivo válido (se permiten documentos de ofimática e imágenes en
            múltiples formatos)
          </template>
        </q-file>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn type="submit" label="Subir" color="primary" />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import axios from "axios";
export default {
  // name: 'ComponentName',
  props: {
    datos: {},
  },
  mounted: function () {
    this.evento = this.datos;
  },
  data() {
    this.obtenerListadoRepositorios();
    return {
      candidatura: {
        titulo: "",
        descripcion: "",
        repositorio: "",
        autor: this.$store.state.auth.user.nombreUsuario,
        archivo: null,
      },
      listadoRepositorios: [],
      archivoSubiendo: null,
      repositorio: null,
      evento: this.datos,
    };
  },
  methods: {
    // Obtener el listado de repositorios
    obtenerListadoRepositorios() {
      const token =
        !!this.$store.state.auth.user.third_party_link &&
        !!this.$store.state.auth.user.third_party_link.github
          ? this.$store.state.auth.user.third_party_link.github.token || ""
          : "";
      if (!!token && token !== "") {
        const axiosConfig = {
          headers: { Authorization: `Bearer ${token}` },
        };
        axios
          .get("https://api.github.com/user/repos", axiosConfig)
          .then((res) => {
            res.data.forEach((repo) => {
              if (
                !!this.$store.state.auth.user.third_party_link.github &&
                !!this.$store.state.auth.user.third_party_link.github.id &&
                this.$store.state.auth.user.third_party_link.github.id == repo.owner.id
              ) {
                this.listadoRepositorios.push({
                  value: repo.html_url,
                  label: repo.name,
                });
              }
            });
          })
          .catch((err) => {
            
          });
      }
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
      fd.append("tipo", "candidatura");
      fd.append("file", archivo);
      
      axios
        .post(apiCall, fd, headers)
        .then((res) => {
          this.candidatura.archivo = "https://api.ecodium.dev/subidas/" + res.data;
        })
        .catch((err) => {
          this.candidatura.archivo = null;
        });
    },
    // Insertar contenido
    nuevaCandidatura() {
      this.candidatura.repositorio = !!this.repositorio ? this.repositorio.value : "";
      const flag =
        !!this.candidatura &&
        this.candidatura.titulo !== "" &&
        this.candidatura.descripcion !== "" &&
        this.candidatura.repositorio !== "" &&
        this.candidatura.autor !== "";
      if (flag) {
        const apiCallActualizarUsuario =
          "https://api.ecodium.dev/api/auth/actualizar/" + id;
        const apiCall =
          "https://api.ecodium.dev/api/eventos/nueva-candidatura/" +
          this.$route.params.id;
        axios
          .put(apiCall, { candidatura: this.candidatura })
          .then((res) => {
            axios
              .put(apiCallActualizarUsuario, {
                pases: Number(pases - this.evento.precio),
              })
              .then((res2) => {
                this.$store.commit("addNotification", {
                  notification: "Candidatura presentada con éxito",
                  time: Date.now(),
                });
                window.location.reload();
              })
              .catch((err2) => {
                console.warn(err2);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // Descargar material adjunto
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
};
</script>
