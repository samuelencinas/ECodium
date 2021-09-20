<!-- ECODIUM - TFG Samuel Encinas -->
<!-- WEB COMPONENT: Paneles Informativos del Index para jugadores -->

<template>
  <q-card class="bg-transparent no-shadow no-border q-pa-lg">
    <q-card-section class="q-pa-none">
      <div class="row q-col-gutter-sm">
        <!-- Generación dinámica de los 3 primeros paneles -->
        <div
          v-for="(item, index) in paneles"
          :key="index"
          class="col-md-3 col-sm-12 col-xs-12"
        >
          <q-item class="q-pa-none index-box widget-med">
            <q-item-section class="q-pa-md q-ml-none text-white">
              <q-item-label class="text-white text-h4 text-weight-bolder">{{
                item.value
              }}</q-item-label>
              <q-item-label class="text-h6">{{ item.title }}</q-item-label>
              <q-item-label caption class="text-overline text-primary">
                {{ item.subtitle }}
              </q-item-label>
              <q-item-label caption />
              <q-linear-progress track-color="grey" v-model="item.progress" />
            </q-item-section>
            <q-item-section side class="q-mr-md text-white">
              <q-icon :name="item.icon" color="primary" size="44px"></q-icon>
            </q-item-section>
          </q-item>
        </div>

        <!-- Anuncio estático como cuarto panel -->

        <div
          class="col-md-3 col-sm-12 col-xs-12"
          :class="!this.$q.screen.md ? 'q-pt-lg' : 'q-pt-none'"
        >
          <q-item
            class="borde q-ma-sm"
            :style="this.$q.screen.md ? 'flex-direction: column' : ''"
          >
            <q-item-section avatar>
              <q-avatar color="white">
                <q-icon size="200%" name="img:icons/iconos/darkmode/pase.svg" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-h5 text-weight-bolder"
                >{{ pases }} Pases</q-item-label
              >
              <div class="text-overline" style="line-height: 1rem">
                Sirven para acceder a Eventos y Talleres.
              </div>
            </q-item-section>
            <q-item-section>
              <q-btn
                label="Canjear XP"
                type="submit"
                color="primary"
                to="/banco"
                v-close-popup
              ></q-btn>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import axios from "axios";

export default {
  name: "PanelesJugador",
  props: {
    icon_position: {
      required: false,
      default: "left",
    },
  },
  data() {
    function sumarDeArray(array, propiedad) {
      return array.reduce(function (r, a) {
        return r + a[propiedad];
      }, 0);
    }

    function formatearNumero(num) {
      return Math.abs(num) > 999
        ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
        : Math.sign(num) * Math.abs(num);
    }
    // Info retos
    const retosActuales = this.$store.state.auth.user.retos.length;
    let retosTotales = 125;
    // Info logros
    const logrosActuales = this.$store.state.auth.user.logros.length;
    const logrosTotales = 17;
    // Info XP y rango
    const movimientos = this.$store.state.auth.user.movimientosExp;
    const xpActual = sumarDeArray(movimientos, "cantidad");
    const xpSiguiente = this.$store.state.auth.objetivo.XP;
    const rango = this.$store.state.auth.user.rank;
    const nivelSiguiente = this.$store.state.auth.objetivo.nivel;
    // Info pases
    const pases = this.$store.state.auth.user.pases
      ? this.$store.state.auth.user.pases
      : 0;
    obtenerNumRetos();
    return {
      retosActuales,
      retosTotales,
      progresoRetos: retosActuales / retosTotales,
      logrosActuales,
      logrosTotales,
      progresoLogros: logrosActuales / logrosTotales,
      xpActual: formatearNumero(xpActual),
      xpSiguiente: formatearNumero(xpSiguiente),
      progresoXp: xpActual / xpSiguiente,
      rango,
      nivelSiguiente,
      pases,
      paneles: [
        {
          title: "Nivel " + Number(nivelSiguiente - 1) + " - " + rango,
          icon: "img:icons/iconos/lightmode/talento.svg",
          value: formatearNumero(xpActual) + " XP",
          subtitle: "Quedan " + Number(xpSiguiente - xpActual) + " XP",
          progress: Number(xpActual / xpSiguiente),
        },
        {
          title: "Retos completados",
          icon: "img:icons/iconos/lightmode/retos.svg",
          value: Number((retosActuales / retosTotales) * 100) + "%",
          subtitle: retosActuales + " / " + retosTotales + " retos",
          progress: Number(retosActuales / retosTotales),
        },
        {
          title: "Logros obtenidos",
          icon: "img:icons/iconos/lightmode/logros.svg",
          value: Number((logrosActuales / logrosTotales) * 100) + "%",
          subtitle: logrosActuales + " / " + logrosTotales + " logros",
          progress: Number(logrosActuales / logrosTotales),
        },
      ],
    };
  },
  methods: {
    obtenerNumRetos() {
      const apiCall = "https://api.ecodium.dev/api/retos/retos/";
      axios
        .get(apiCall)
        .then((res) => {
          this.retosTotales = res.data.length;
        })
        .catch((err) => {
          console.warn(err);
        });
    },
  },
};
</script>
<style lang="scss">
.borde {
  border: solid #ec7745 3px;
}
</style>
