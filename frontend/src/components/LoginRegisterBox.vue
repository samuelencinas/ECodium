<!-- ECODIUM - TFG Samuel Encinas -->
<!-- WEB COMPONENT: Widget de Inicio de sesión y Registro-->

<template>
  <div class="q-gutter-y-md panelPrincipal" style="max-width: 600px">
    <q-card class="card">
      <q-tab-panels v-model="tab" animated class="text-center">
        <q-tab-panel name="login">
          <q-tabs
            v-model="tab"
            class="accent text-white"
            align="justify"
            narrow-indicator
          >
            <q-tab name="login" label="Iniciar sesión" />
            <q-tab name="register" label="Registrarse" />
          </q-tabs>
          <section class="wrapper">
            <div class="content">
              <header>
                <div class="text-h4 text-weight-bolder">
                  Hola <span class="texto-destacado">(de nuevo)</span>
                </div>
                <div class="text-weight-bold"><br />Accede con...</div>
              </header>
              <section>
                <div class="social-login">
                  <q-btn
                    round
                    glossy
                    push
                    color=""
                    icon="img:icons/iconos/social/google.svg"
                    @click="entrarGoogle"
                  >
                    <q-tooltip content-class="bg-primary"
                      >Inicia sesión con Google</q-tooltip
                    >
                  </q-btn>
                  <q-btn
                    round
                    glossy
                    push
                    color=""
                    icon="img:icons/iconos/social/github.svg"
                    @click="entrarGitHub"
                  >
                    <q-tooltip content-class="bg-primary"
                      >Inicia sesión con GitHub</q-tooltip
                    >
                  </q-btn>
                </div>
                <div class="text-weight-bold"><br />...o bien con tu email:</div>
                <q-form @submit="iniciarSesion" class="login-form">
                  <div class="input-group">
                    <q-input
                      v-model="lemail"
                      class="q-mb-md"
                      type="email"
                      label="E-mail"
                      lazy-rules
                      :rules="[(val) => !!val || 'Campo obligatorio', esEmailValido]"
                    />
                  </div>
                  <div class="input-group">
                    <q-input
                      v-model="lpass"
                      class="q-mb-md"
                      color="blue-grey-10"
                      type="password"
                      label="Contraseña"
                      lazy-rules
                      :rules="[(val) => !!val || 'Campo obligatorio', esLPassValida]"
                    />
                  </div>
                  <div class="input-group">
                    <q-btn
                      push
                      class="botonPrincipal"
                      type="submit"
                      label="Iniciar sesión"
                      color="primary"
                    >
                      <template v-slot:loading>
                        <q-spinner-facebook />
                      </template>
                    </q-btn>
                  </div>
                </q-form>
              </section>
              <footer>
                <q-btn
                  size="12px"
                  outline
                  color="primary"
                  label="He olvidado mi contraseña"
                />
              </footer>
            </div>
          </section>
        </q-tab-panel>
        <q-tab-panel name="register">
          <q-tabs
            v-model="tab"
            class="accent text-white"
            align="justify"
            narrow-indicator
          >
            <q-tab name="login" label="Iniciar sesión" />
            <q-tab name="register" label="Registrarse" />
          </q-tabs>
          <section class="wrapper">
            <div class="content">
              <header>
                <div class="text-h4 text-weight-bolder">
                  Únete <span class="texto-destacado">a ECodium</span>
                </div>
                <div class="text-weight-bold"><br />Regístrate con...</div>
              </header>
              <section>
                <div class="social-login">
                  <q-btn
                    round
                    glossy
                    push
                    color=""
                    icon="img:icons/iconos/social/google.svg"
                    @click="entrarGoogle"
                  >
                    <q-tooltip content-class="bg-primary"
                      >Inicia sesión con Google</q-tooltip
                    >
                  </q-btn>
                  <q-btn
                    round
                    glossy
                    push
                    color=""
                    icon="img:icons/iconos/social/github.svg"
                    @click="entrarGoogle"
                  >
                    <q-tooltip content-class="bg-primary"
                      >Inicia sesión con GitHub</q-tooltip
                    >
                  </q-btn>
                </div>
                <div class="text-weight-bold"><br />...o bien con tu email:</div>
                <q-form @submit="registrarse" class="login-form">
                  <div class="input-group">
                    <q-input
                      v-model="email"
                      class="q-mb-md"
                      type="email"
                      label="E-mail"
                      lazy-rules
                      :rules="[(val) => !!val || 'Campo obligatorio', esEmailValido]"
                    />
                  </div>
                  <div class="input-group">
                    <q-input
                      v-model="pass"
                      class="q-mb-md"
                      color="blue-grey-10"
                      type="password"
                      label="Contraseña"
                      lazy-rules
                      :rules="[(val) => !!val || 'Campo obligatorio', esPassValida]"
                    />
                  </div>
                  <div class="input-group">
                    <q-input
                      v-model="repass"
                      class="q-mb-md"
                      color="blue-grey-10"
                      type="password"
                      label="Confirma tu contraseña"
                      lazy-rules
                      :rules="[(val) => !!val || 'Campo obligatorio', esRepassValida]"
                    />
                  </div>
                  <div class="input-group">
                    <q-btn
                      push
                      class="botonPrincipal"
                      type="submit"
                      label="Registrarse"
                      color="primary"
                    >
                      <template v-slot:loading>
                        <q-spinner-facebook />
                      </template>
                    </q-btn>
                  </div>
                </q-form>
              </section>
              <footer>
                <q-btn
                  size="12px"
                  outline
                  color="primary"
                  label="He olvidado mi contraseña"
                />
              </footer>
            </div>
          </section>
        </q-tab-panel>
        <q-tab-panel name="movies">
          <div class="text-h6">Movies</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script>
import { required, email, minLength, sameAs } from "vuelidate/lib/validators";
import axios from "axios";
import Vue from "vue";

export default {
  name: "LoginRegisterBox",
  methods: {
    entrarGoogle() {
      var popup = window.open(
        "https://api.ecodium.dev/api/auth/google",
        "_blank",
        "location=1,status=1,scrollbars=1, width=800,height=800"
      );
    },
    entrarGitHub() {
      var popup = window.open(
        "https://api.ecodium.dev/api/auth/github",
        "_blank",
        "location=1,status=1,scrollbars=1, width=800,height=800"
      );
    },
    iniciarSesion() {
      const userData = {
        email: this.lemail,
        password: this.lpass,
      };
      this.$store.dispatch("LOGIN", userData).then(() => {
        if (!!this.$store.state.auth.user) {
          location.reload();
        }
      });
    },

    registrarse() {
      const userData = {
        email: this.email,
        password: this.pass,
      };
      this.$store.dispatch("REGISTER", userData);
    },
    // Validación lado cliente de email
    esEmailValido(val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "No es un email válido";
    },
    // Validación lado servidor de contraseña
    esPassValida(val) {
      return this.pass.length > 7 || "La contraseña debe tener 8 caracteres";
    },
    esLPassValida(val) {
      return this.lpass.length > 7 || "La contraseña debe tener 8 caracteres";
    },
    esRepassValida(val) {
      return this.repass.length > 7
        ? this.repass === this.pass
          ? true
          : "Las contraseñas deben coincidir"
        : "La contraseña debe tener 8 caracteres";
    },
  },
  data() {
    let axiosConfig = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://www.ecodium.dev/",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
      },
    };
    return {
      primary: "#ec7745",
      lemail: "",
      lpass: "",
      email: "",
      pass: "",
      repass: "",
      tab: "login",
      leftDrawer: true,
    };
  },
};
</script>

<style lang="scss">
$primary: #ec7745;

.accent {
  background-color: $primary;
  flex-direction: row !important;
}

$background-start: $primary;
$background-end: #20bdff;

$gray-color: $primary;
$input-color: #e4eff8;
$label-color: #999;
$login-button: $primary;

.q-tab-panel {
  background-color: $primary;
  padding: 1px !important;
}

.panelPrincipal {
  box-shadow: rgba(236, 119, 69, 0.4) 5px 5px, rgba(236, 119, 69, 0.3) 10px 10px,
    rgba(236, 119, 69, 0.2) 15px 15px, rgba(236, 119, 69, 0.1) 20px 20px,
    rgba(236, 119, 69, 0.05) 25px 25px;
  max-width: 450px !important;
}

.wrapper {
  height: 100%;
  width: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    padding: 10px 15px;
    width: 100%;
    max-width: 450px;
    min-width: 200px;

    header {
      text-align: center;

      h1 {
        margin: 0;
        font-size: 230%;
      }
    }

    .social-login {
      padding: 10px;
      text-align: center;
      display: flex;
      justify-content: center;

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.5s;
        -webkit-transition: background 0.5s;
        margin-right: 10px;

        &:hover {
          background-color: $gray-color;
        }

        span {
          font-size: 17px;
          color: #777;
        }
      }
    }

    .login-form {
      padding: 0 20px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .input-group {
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        width: 100%;
        max-width: 310px;

        q-input {
          padding: 15px;
          font-size: 13px;
          border: 1px solid $input-color;
          background-color: $input-color;
          border-radius: 50px;
          transition: border 0.5s;
          -webkit-tranistion: border 0.5s;

          &:focus {
            outline: 0;
            border-color: $background-end;
          }
        }

        label {
          color: $label-color;
          font-size: 12px;
          margin-bottom: 3px;
          margin-left: 16px;
        }

        .botonPrincipal {
          align-self: center;
        }
      }
    }

    footer {
      padding-top: 15px;
      text-align: center;

      a {
        color: #999;
        text-decoration: none;
        font-size: 11px;
      }
    }
  }
}

@media screen and (max-width: 720px) {
  .wrapper {
    .content {
      padding-right: 0;
      padding-left: 0;
      margin: 0 10px;
    }
  }
}

#tsparticles {
  height: 100%;
  width: 100%;
}
</style>
