<!-- ECODIUM - TFG Samuel Encinas -->
<!-- WEB COMPONENT: Carrusel de diapositivas -->

<template>
  <div class="row q-col-gutter-sm q-py-sm q-ma-sm">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-carousel
        animated
        v-model="diapositiva"
        infinite
        autoplay
        height="360px"
        arrows
        transition-prev="slide-right"
        transition-next="slide-left"
        :control-type="$q.screen.gt.md ? 'outline' : 'unelevated'"
        :control-text-color="$q.screen.gt.md ? 'primary' : 'white'"
      >
        <!-- Plantilla de la Diapositiva (se genera dinámicamente para cada diapositiva dada de alta) -->
        <q-carousel-slide
          v-for="item in diapositivas"
          :key="item.titulo"
          :name="item.id"
          class="q-pa-none"
          :img-src="item.imagen"
          style="overflow-y: hidden"
        >
          <q-card class="absolute-bottom titulo-diapositiva">
            <q-card-section v-if="item.id === 1">
              <div v-if="$q.screen.gt.md" class="text-h2 text-weight-bolder">
                {{ item.titulo + ", " + $store.state.auth.user.nombreUsuario }}
              </div>
              <div
                v-if="$q.screen.gt.sm && !$q.screen.gt.md"
                class="text-h3 text-weight-bolder"
              >
                {{ item.titulo + ", " + $store.state.auth.user.nombreUsuario }}
              </div>
              <div v-if="$q.screen.lt.sm" class="text-h5 text-weight-bolder">
                {{ item.titulo + ", " + $store.state.auth.user.nombreUsuario }}
              </div>
              <div class="text-subtitle1 text-weight-regular">
                {{ item.subtitulo }}
              </div>
            </q-card-section>
            <q-card-section v-else>
              <div v-if="$q.screen.gt.md" class="text-h2 text-weight-bolder">
                {{ item.titulo }}
              </div>
              <div
                v-if="$q.screen.gt.sm && !$q.screen.gt.md"
                class="text-h3 text-weight-bolder"
              >
                {{ item.titulo }}
              </div>
              <div v-if="$q.screen.lt.sm" class="text-h5 text-weight-bolder">
                {{ item.titulo }}
              </div>
              <div class="text-subtitle1 text-weight-regular">
                {{ item.subtitulo }}
              </div>
            </q-card-section>
          </q-card>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </div>
</template>

<script>
import axios from "axios";
let diapositivas = [];

export default {
  name: "Diapositivas",
  data() {
    this.obtenerDiapositivas();
    return {
      diapositivas,
      diapositiva: 1,
    };
  },
  methods: {
    obtenerDiapositivas() {
      const apiCall = "https://api.ecodium.dev/api/herramientas/diapositivas";
      axios
        .get(apiCall)
        .then((res) => {
          res.data.forEach((slide, index) => {
            const id = index + 1;
            const titulo = slide.titulo;
            const subtitulo = slide.subtitulo;
            const imagen = slide.imagen;
            const diapositiva = { id, titulo, subtitulo, imagen };
            this.diapositivas.push(diapositiva);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.titulo-diapositiva {
  text-align: center;
  padding: 12px;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
