<!-- 
ECODIUM - TFG Samuel Encinas
WEB-COMPONENT: FormularioContacto - Un simple formulario de contacto reutilizable
que envía el mensaje de correo al destinatario pasado por props mediante el
'Cartero de ECodium', un no-reply configurado por los middlewares del correo
-->
<template>
  <q-form @submit="recaptcha" class="login-form">
    <div class="input-group">
      <q-input
        v-model="asunto"
        label="Asunto"
        lazy-rules
        :rules="[(val) => !!val || 'Campo obligatorio']"
      />
    </div>
    <div class="input-group">
      <q-input
        v-model="mensaje"
        class="q-mb-md"
        autogrow
        label="Cuerpo del mensaje"
        lazy-rules
        :rules="[(val) => !!val || 'Campo obligatorio']"
      />
    </div>
    <div class="input-group">
      <q-btn
        push
        icon="send"
        class="botonPrincipal"
        type="submit"
        label="Enviar"
        color="primary"
      >
        <template v-slot:loading>
          <q-spinner-facebook />
        </template>
      </q-btn>
      <div class="text-caption">
        Este formulario está protegido por reCAPTCHA v3. Se aplican la
        <a class="text-primary" href="https://policies.google.com/privacy"
          >Protección de Privacidad</a
        >
        y los
        <a href="https://policies.google.com/terms">Términos del Servicio</a> pertinentes.
      </div>
    </div>
  </q-form>
</template>

<script>
import { VueReCaptcha } from "vue-recaptcha-v3";
import Vue from "vue";
import axios from "axios";
import emailjs from "emailjs-com";

// Integración de reCAPTCHA v3 como protección antispam
Vue.use(VueReCaptcha, { siteKey: "6LfUJUwcAAAAAC3nhhP8lB79XfD6xED0YfeIz9VM" });
export default {
  name: "FormularioContacto",
  props: {
    dest: "",
  },
  data() {
    return {
      asunto: "",
      mensaje: "",
      remitente_nombre: this.$store.state.auth.user.nombre,
      remitente_email: this.$store.state.auth.user.email,
      destinatario: this.dest,
    };
  },
  methods: {
    // Método asíncrono que comprueba si el usuario ha pasado el captcha
    async recaptcha() {
      await this.$recaptchaLoaded();
      const token = await this.$recaptcha("login");
      // En caso de que el usuario pase el captcha...
      if (!!token) {
        // Se obtiene el mail del destinatario mediante la API
        const apiCall = "https://api.ecodium.dev/api/auth/email/" + this.destinatario;
        axios.get(apiCall).then((res) => {
          const destinatario_email = res.data;
          const destinatario_nombre = this.destinatario;
          
          // Y posteriormente se envía el correo mediante el middleware
          try {
            emailjs.send(
              "service_2uikhkp",
              "template_kloxe7x",
              {
                destinatario_nombre: destinatario_nombre,
                remitente_nombre: this.remitente_nombre,
                remitente_email: this.remitente_email,
                destinatario_email: destinatario_email,
                mensaje: this.mensaje,
                asunto: this.asunto,
              },
              "user_nohQcjXp0NTlnn99uLM2h"
            );
          } catch (error) {
            console.log(error);
          }
        });
      }
    },
  },
};
</script>
<style lang="scss">
.grecaptcha-badge {
  visibility: hidden;
}
a {
  color: $primary;
}
</style>
