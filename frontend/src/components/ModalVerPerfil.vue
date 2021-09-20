<!-- ECODIUM - TFG Samuel Encinas -->
<!-- WEB COMPONENT: Modal para Ver un Perfil Público -->
<template>
  <q-card style="width: 1000px">
    <q-toolbar class="bg-primary justify-center text-h6">
      <span class="text-weight-bold">Perfil público de {{ perfil.nombreUsuario }}</span>
    </q-toolbar>
    <q-card-section class="">
      <div class="float-right col">
        <q-avatar class="row" size="100px">
          <img
            :src="
              'https://api.ecodium.dev/subidas/' + perfil.fotoPerfil || 'fotoperfil.png'
            "
            class="fotoPerfil"
          />
        </q-avatar>
        <div class="row q-pt-md q-pb-md justify-center">
          <q-btn
            round
            color="primary"
            glossy
            size="20px"
            v-if="showSpecialButton"
            icon="favorite"
            @click="this.nuevoFavorito"
          />
        </div>
      </div>
      <div class="text-h6 row">
        <q-icon name="shopping_cart" style="font-size: 1.5rem" class="text-primary" />
        <div class="col-auto q-pl-lg text-weight-light">Usuario de</div>

        <div class="col-auto q-pl-sm q-pr-sm text-weight-bold">
          Nivel {{ perfil.nivel || 0 }}
        </div>
      </div>
      <div class="text-h6 row">
        <q-icon name="military_tech" style="font-size: 1.5rem" class="text-primary" />

        <span
          class="q-ml-lg text-weight-bold text-primary q-pt-none q-pb-none q-pl-md q-pr-md"
          style="border: 1px groove orange"
        >
          {{ perfil.rango }}
        </span>
      </div>
      <div class="text-h6 row">
        <q-icon name="shopping_cart" style="font-size: 1.5rem" class="text-primary" />

        <div class="col-auto q-ml-md q-pl-sm q-pr-sm text-weight-bold">
          {{ perfil.xp }}
        </div>
        <div class="col-auto text-weight-light">Puntos de XP</div>
      </div>
      <div class="text-h6 row">
        <q-icon name="shopping_cart" style="font-size: 1.5rem" class="text-primary" />

        <div class="col-auto q-ml-md q-pl-sm q-pr-sm text-weight-bold">
          {{ perfil.retos }}
        </div>
        <div class="col-auto text-weight-light">Retos resueltos</div>
      </div>
      <div class="text-h6 row">
        <q-icon name="shopping_cart" style="font-size: 1.5rem" class="text-primary" />

        <div class="col-auto q-ml-md q-pl-sm q-pr-sm text-weight-bold">
          {{ perfil.logros }}
        </div>
        <div class="col-auto text-weight-light">Logros obtenidos</div>
      </div>
      <div class="text-h6 row">
        <q-icon name="shopping_cart" style="font-size: 1.5rem" class="text-primary" />

        <div class="col-auto q-ml-md q-pl-sm q-pr-sm text-weight-bold">
          {{ perfil.talleres }}
        </div>
        <div class="col-auto text-weight-light">Talleres cursados</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import axios from "axios";
export default {
  // name: 'ComponentName',
  data() {
    this.obtenerPerfil();
    return {
      usuario: "",
      showSpecialButton: !!this.$store.state.auth.user.rol.includes("ojeador"),
      perfil: {},
    };
  },
  methods: {
    obtenerPerfil() {
      const apiCall = "https://api.ecodium.dev/api/auth/perfil/" + this.datos;
      axios
        .get(apiCall)
        .then((res) => {
          this.perfil = res.data;
          
        })
        .catch((err) => {
          console.log(err);
          
        });
    },
    nuevoFavorito() {
      const favorito = !this.showSpecialButton ? this.usuario : "";
      if (favorito !== "") {
        const id = this.$store.state.auth.user._id;
        const apiCall = "https://api.ecodium.dev/api/auth/nuevoFavorito/" + id;
        axios
          .put(apiCall, { favorito: favorito })
          .then((res) => {
            console.log(res);
            
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  props: {
    datos: "",
  },
  mounted: function () {
    this.usuario = this.datos;
    
  },
};
</script>
<style lang="scss"></style>
