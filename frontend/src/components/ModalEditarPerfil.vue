<!-- ECODIUM - TFG Samuel Encinas -->
<!-- WEB COMPONENT: Modal para Editar tu Perfil -->
<template>
  <q-card style="width: 700px; max-width: 80vw">
    <q-toolbar class="q-pa-md">
      <q-icon name="person" size="md" class="text-primary" />
      <q-toolbar-title>Editar perfil</q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup />
    </q-toolbar>
    <q-separator />
    <q-card-section>
      <q-form @submit="actualizarUsuario" class="login-form" style="overflow-x: hidden">
        <q-btn round push>
          <q-file
            round
            borderless
            class="justify-center"
            accept=".jpg, image/*"
            model="nuevaFoto"
            @input="subirFotoPerfil"
          >
            <q-avatar size="100px">
              <img :src="this.urlFoto" class="fotoPerfil" />
            </q-avatar>
          </q-file>
          <q-tooltip> Cambiar foto de perfil</q-tooltip>
        </q-btn>

        <div class="input-group">
          <q-input
            v-model="info.nombreUsuario"
            class="q-mb-md"
            type="string"
            label="Nombre de usuario"
            :rules="[esUsuarioValido]"
            lazy-rules
          />
        </div>
        <div class="input-group">
          <q-input
            v-model="info.email"
            class="q-mb-md"
            type="email"
            label="E-mail"
            lazy-rules
            :rules="[esEmailValido]"
          />
        </div>
        <div class="input-group">
          <q-input
            v-model="info.password"
            class="q-mb-md"
            type="password"
            placeholder="(No modificar)"
            label="Cambia tu contraseña (opcional)"
            lazy-rules
            :rules="[esPassValida]"
          />
        </div>
        <div class="input-group">
          <q-input
            v-model="repass"
            class="q-mb-md"
            placeholder="(No modificar)"
            type="password"
            label="Confirma tu nueva contraseña"
            lazy-rules
            :rules="[esRepassValida]"
          />
        </div>
        <q-btn push class="botonPrincipal" type="submit" label="Añadir" color="primary">
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import axios from "axios";
export default {
  name: "ModalEditarPerfil",
  data() {    
    return {
      info: {
        email: this.datos && this.datos.email ? this.datos.email : "",
        password: this.datos && this.datos.password ? this.datos.password : "",
        nombreUsuario:
          this.datos && this.datos.nombreUsuario ? this.datos.nombreUsuario : "",
        fotoPerfil: this.datos && this.datos.fotoPerfil ? this.datos.fotoPerfil : "",
      },
      repass: "",
      urlFoto:
        this.info && this.info.fotoPerfil ? this.info.fotoPerfil : "fotoperfil.png",
    };
  },
  methods: {
    // Seleccionar fichero
    file_selected(file) {
      
      this.nuevaFoto = file[0];
      this.subirFotoPerfil(file);
    },
    // Subir foto de perfil
    subirFotoPerfil(foto) {
      const apiCall = "https://api.ecodium.dev/api/herramientas/subirArchivo";
      const headers = {
        "Content-Type": undefined,
        "Access-Control-Allow-Origin": "https://www.ecodium.dev",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
      };
      let fd = new FormData();
      fd.append("tipo", "avatar");
      fd.append("file", foto);
      axios
        .post(apiCall, fd, headers)
        .then((res) => {
          this.info.fotoPerfil = res.data;
          this.urlFoto = "https://api.ecodium.dev/subidas/" + this.info.fotoPerfil;
          return res.data._id;
        })
        .catch((err) => {
          return "";
        });
    },

    // Actualizar usuario
    actualizarUsuario() {
      const id = this.$store.state.auth.user._id;
      const apiCall = "https://api.ecodium.dev/api/auth/actualizar/" + id;
      const request = {
        email:
          this.info.email && this.info.email != this.datos.email
            ? this.info.email
            : undefined,
        nombreUsuario:
          this.info.nombreUsuario && this.info.nombreUsuario != this.datos.nombreUsuario
            ? this.info.nombreUsuario
            : undefined,
        fotoPerfil:
          this.info.fotoPerfil && this.info.fotoPerfil != this.datos.fotoPerfil
            ? this.info.fotoPerfil
            : undefined,
        password: this.info.password ? this.info.password : undefined,
      };
      
      axios
        .put(apiCall, request)
        .then((res) => {
          console.log(res);
          
        })
        .catch((err) => {
          console.log(err);
          
        });
    },
    // Comprobar si existe un usuario
    existe(val) {
      const apiCall = "https://api.ecodium.dev/api/auth/existe" + val;
      axios
        .get(apiCall)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.warn(err);
        });
    },
    // Validación lado cliente de usuario
    esUsuarioValido(val) {
      return val && val.length > 0 ? !existe(val) : "Campo obligatorio";
    },
    // Validación lado cliente de email
    esEmailValido(val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "No es un email válido";
    },
    // Validación lado cliente de contraseña
    esPassValida(val) {
      return this.info.password
        ? this.info.password.length > 7 || "La nueva contraseña debe tener 8 caracteres"
        : this.info.password === ""
        ? true
        : "La nueva contraseña debe tener 8 caracteres";
    },
    esRepassValida(val) {
      return this.repass
        ? this.repass.length > 7
          ? this.repass === this.info.password
            ? true
            : "Las contraseñas deben coincidir"
          : "La contraseña debe tener 8 caracteres"
        : this.repass === ""
        ? this.info.password === ""
          ? true
          : "Por favor, confirma tu contraseña"
        : "La contraseña debe tener 8 caracteres";
    },
  },
  // name: 'ComponentName',
  props: {
    datos: {
      email: String,
      password: String,
      nombreUsuario: String,
      fotoPerfil: String,
    },
  },
};
</script>
<style lang="scss">
.fotoPerfil:hover {
  visibility: visible;
  opacity: 0.5;
  transition: 0.3s;
}
</style>
