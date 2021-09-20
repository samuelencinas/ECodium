<!-- ECODIUM - TFG Samuel Encinas -->
<!-- PÁGINA: Inicio -->
<template>
  <q-page class="q-pa-sm">
    <!-- 1. SLIDER DE BIENVENIDA (Todos los roles) -->
    <diapositivas class="carousel" />

    <!-- 2. PANELES INFORMATIVOS (Solo JUG) -->
    <paneles-jugador
      icon_position="right"
      v-if="
        this.$store.state.auth.user.rol[0] === 'player' &&
        this.$store.state.auth.user.rol.length < 2
      "
    />

    <!-- 3. ESTADÍSTICAS (Sólo JUG) -->
    <q-card
      class="q-mt-sm q-ma-lg"
      v-if="
        this.$store.state.auth.user.rol[0] === 'player' &&
        this.$store.state.auth.user.rol.length < 2
      "
    >
      <q-card-section class="row">
        <div class="col-lg-3 col-sm-12 col-xs-12 col-md-3 q-mr-xl">
          <q-item class="text-h6 q-pb-none">
            <q-item-section avatar class="">
              <q-icon color="blue" name="fas fa-chart-line" size="44px" />
            </q-item-section>

            <q-item-section>
              <div class="text-h4 text-weight-bolder text-primary">
                Estadísticas de actividad
              </div>
              <div class="text-overline text-weight-bolder">
                {{ this.mesActual }}
              </div>
            </q-item-section>
          </q-item>
          <grafico-mes
            style="
              max-width: 225px;
              display: block;
              margin-left: auto;
              margin-right: auto;
            "
            :data="test2"
          ></grafico-mes>
        </div>

        <grafico-historico
          class="col-lg-7 col-sm-12 col-xs-12 col-md-7"
          :data="test"
        ></grafico-historico>
      </q-card-section>
    </q-card>

    <!-- 4. ÚLTIMOS MOVIMIENTOS (Sólo JUG) -->
    <div
      class="row q-col-gutter-sm q-pa-lg"
      v-if="
        this.$store.state.auth.user.rol[0] === 'player' &&
        this.$store.state.auth.user.rol.length < 2
      "
    >
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card>
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
          >
            <q-tab
              name="experiencia"
              :class="tab == 'experiencia' ? 'text-primary' : ''"
              icon="img:icons/iconos/lightmode/talento.svg"
              label="Experiencia"
            />
            <q-tab
              name="talentos"
              :class="tab == 'talentos' ? 'text-primary' : ''"
              icon="img:icons/iconos/lightmode/banco.svg"
              label="Talentos (TAL)"
            >
            </q-tab>
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="experiencia" class="q-pa-sm">
              <q-list class="rounded-borders" separator>
                <q-item v-for="(experiencia, index) in movimientos" :key="index">
                  <q-item-section avatar class="col-4">
                    <div
                      v-if="experiencia.cantidad > 0"
                      class="text-h6 text-weight-bolder text-green"
                    >
                      + {{ experiencia.cantidad }} XP
                    </div>
                    <div v-else class="text-h6 text-red text-weight-bolder">
                      - {{ experiencia.cantidad }} XP
                    </div>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-weight-bold text-subtitle1" lines="1"
                      >{{ experiencia.concepto }}
                    </q-item-label>
                    <q-item-label caption class="text-overline" lines="2">
                      <span>{{ experiencia.fecha }}</span>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>
            <q-tab-panel name="talentos" class="q-pa-sm">
              <q-list class="rounded-borders" separator>
                <q-item v-for="(transaccion, index) in datosTransacciones" :key="index">
                  <q-item-section avatar class="col-4">
                    <div class="text-h6 text-red text-weight-bolder">
                      - {{ transaccion.exp }} XP
                    </div>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-weight-bold text-subtitle1" lines="1"
                      >Obtención de {{ transaccion.tal }} talentos (TAL)
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>

    <!-- 5. MIS EVENTOS Y TALLERES (Organizadores) -->
    <q-card
      class="q-mt-sm q-ma-lg"
      v-if="this.$store.state.auth.user.rol[0] === 'organizador'"
    >
      <eventos-talleres-propios />
    </q-card>

    <!-- 6. MIS JUGADORES FAVORITOS (Ojeadores) -->
    <q-card
      class="q-mt-sm q-ma-lg"
      v-if="this.$store.state.auth.user.rol[0] === 'ojeador'"
    >
      <favoritos />
    </q-card>

    <!-- 7. EVENTOS ACTIVOS (Todos salvo organizador)" -->
    <q-card
      class="q-mt-sm q-ma-lg"
      v-if="this.$store.state.auth.user.rol[0] !== 'organizador'"
    >
      <eventos-talleres-activos />
    </q-card>
  </q-page>
</template>

<script>
import GraficoHistorico from "../components/GraficoHistorico";
import GraficoMes from "../components/GraficoMes";
import PanelesJugador from "../components/PanelesJugador";
import Diapositivas from "../components/Diapositivas";
import { date } from "quasar";
import EventosTalleresActivos from "../components/EventosTalleresActivos.vue";
import EventosTalleresPropios from "../components/EventosTalleresPropios.vue";
import Favoritos from "../components/Favoritos.vue";

export default {
  name: "Dashboard2",
  components: {
    GraficoHistorico,
    GraficoMes,
    PanelesJugador,
    Diapositivas,
    EventosTalleresActivos,
    EventosTalleresPropios,
    Favoritos,
  },
  data() {
    this.$store.commit("setMenuStatus", "inicio");

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
    const pases = this.$store.state.auth.user.pases
      ? this.$store.state.auth.user.pases
      : 0;
    const retosActuales = this.$store.state.auth.user.retos.length;
    const retosTotales = 125;
    const logrosActuales = this.$store.state.auth.user.logros.length;
    const logrosTotales = 17;
    const movimientos = this.$store.state.auth.user.movimientosExp;
    const transacciones = this.$store.state.auth.user.transaccionesTal;
    const xpActual = sumarDeArray(movimientos, "cantidad");
    const xpSiguiente = this.$store.state.auth.objetivo.XP;
    const rango = this.$store.state.auth.user.rank;
    const nivelSiguiente = this.$store.state.auth.objetivo.nivel;
    const datosGrafica = this.obtenerDatosGrafica();
    const datosGraficaMensual = this.obtenerDatosGraficaMensual();
    console.log(
      "mes " +
        datosGraficaMensual.experiencia +
        datosGraficaMensual.retos +
        datosGraficaMensual.logros
    );
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    const mesActual = meses[new Date().getMonth()] + " " + new Date().getFullYear();
    return {
      mesActual,
      movimientos,
      tab: "experiencia",
      talentoss: [
        {
          id: 5,
          name: "Pratik Patel",
          msg:
            " -- I'll be in your neighborhood doing errands this\n" +
            "            weekend. Do you want to grab brunch?",
          avatar: "https://avatars2.githubusercontent.com/u/34883558?s=400&v=4",
          time: "10:42 PM",
        },
        {
          id: 6,
          name: "Winfield Stapforth",
          msg:
            " -- I'll be in your neighborhood doing errands this\n" +
            "            weekend. Do you want to grab brunch?",
          avatar: "https://cdn.quasar.dev/img/avatar6.jpg",
          time: "11:17 AM",
        },
        {
          id: 1,
          name: "Boy",
          msg:
            " -- I'll be in your neighborhood doing errands this\n" +
            "            weekend. Do you want to grab brunch?",
          avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
          time: "5:17 AM",
        },
        {
          id: 2,
          name: "Jeff Galbraith",
          msg:
            " -- I'll be in your neighborhood doing errands this\n" +
            "            weekend. Do you want to grab brunch?",
          avatar: "https://cdn.quasar.dev/team/jeff_galbraith.jpg",
          time: "5:17 AM",
        },
        {
          id: 3,
          name: "Razvan Stoenescu",
          msg:
            " -- I'll be in your neighborhood doing errands this\n" +
            "            weekend. Do you want to grab brunch?",
          avatar: "https://cdn.quasar.dev/team/razvan_stoenescu.jpeg",
          time: "5:17 AM",
        },
      ],
      experiencias: [
        {
          name: "Pratik Patel",
          position: "Developer",
          avatar: "https://avatars2.githubusercontent.com/u/34883558?s=400&v=4",
        },
        {
          name: "Razvan Stoenescu",
          position: "Developer",
          avatar: "https://cdn.quasar.dev/team/razvan_stoenescu.jpeg",
        },
        {
          name: "Jeff Galbraith",
          position: "Developer",
          avatar: "https://cdn.quasar.dev/team/jeff_galbraith.jpg",
        },
        {
          name: "Brunhilde Panswick",
          position: "Administrator",
          avatar: "https://cdn.quasar.dev/img/avatar2.jpg",
        },
        {
          name: "Winfield Stapforth",
          position: "Administrator",
          avatar: "https://cdn.quasar.dev/img/avatar6.jpg",
        },
      ],
      sales_data: [
        {
          name: "Pratik Patel",
          Progress: 70,
          status: "Canceled",
          stock: "14 / 30",
          date: "23 Oct 2018",
          avatar:
            "https://avatars3.githubusercontent.com/u/34883558?s=400&u=09455019882ac53dc69b23df570629fd84d37dd1&v=4",
          product_name: "Woman Bag",
          total: "$300,00",
          code: "QWE123",
        },
        {
          name: "Mayank Patel",
          Progress: 60,
          status: "Sent",
          date: "11 Nov 2018",
          stock: "25 / 70",
          avatar:
            "https://avatars2.githubusercontent.com/u/27857088?s=400&u=a898efbc753d93cf4c2070a7cf3b05544b50deea&v=4",
          product_name: "Laptop",
          total: "$230,00",
          code: "ABC890",
        },
        {
          name: "Mayur Patel",
          Progress: 30,
          status: "Pending",
          stock: "35 / 50",
          avatar:
            "https://avatars0.githubusercontent.com/u/55240045?s=400&u=cf9bffc2bd2d8e42ca6e5abf40ddd6c1a03ce2860&v=4",
          product_name: "Pinapple Jam",
          total: "$34,00",
          date: "19 Sept 2020",
          code: "GHI556",
        },
        {
          name: "Jeff Galbraith",
          Progress: 100,
          status: "Paid",
          stock: "18 / 33",
          avatar:
            "https://avatars1.githubusercontent.com/u/10262924?s=400&u=9f601b344d597ed76581e3a6a10f3c149cb5f6dc&v=4",
          product_name: "Action Figure",
          total: "$208,00",
          date: "19 Sept 2020",
          code: "JKL345",
        },
      ],
      sales_column: [
        {
          name: "Products",
          label: "Products",
          field: "Products",
          sortable: true,
          align: "left",
        },
        { name: "Name", label: "Buyer", field: "name", sortable: true, align: "left" },
        {
          name: "Total",
          label: "Total",
          field: "total",
          sortable: true,
          align: "right",
          classes: "text-bold",
        },
        {
          name: "Status",
          label: "Status",
          field: "status",
          sortable: true,
          align: "left",
          classes: "text-bold",
        },
        { name: "Stock", label: "Stock", field: "task", sortable: true, align: "left" },
      ],
      test2: {
        labels: ["Progreso (mensual)"],
        datasets: [
          {
            label: "Experiencia",
            data: [datosGraficaMensual.experiencia || 0.005],
            hoverBackgroundColor: "rgba(171, 111, 0, 0.7)",
            borderColor: "orange",
            borderWidth: 1.5,
          },
          {
            label: "Retos",
            data: [datosGraficaMensual.retos || 0.005],
            borderWidth: 1.5,
            borderColor: "cyan",
            hoverBackgroundColor: "rgba(66, 241, 252, 0.7)",
          },
          {
            label: "Logros",
            data: [datosGraficaMensual.logros || 0.005],
            borderWidth: 1.5,
            borderColor: "#fc6579",
            hoverBackgroundColor: "rgba(138, 55, 66, 0.7)",
          },
        ],
      },
      test: {
        labels: [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic",
        ],
        datasets: [
          {
            label: ["Experiencia"],
            pointBackgroundColor: "transparent",
            borderWidth: 1.5,
            borderColor: "orange",

            data: [50, 40, 11, 9, 8, 4, 3, 4, 11, 9, 8, 4, 3],
            yAxisID: "y",
            type: "line",
            order: 0,
            //data: datosGrafica.experiencia,
          },
          {
            label: ["Retos"],
            borderWidth: 1.5,
            borderColor: "cyan",
            hoverBackgroundColor: "rgba(66, 241, 252, 0.7)",
            data: [1, 2, 5, 9, 1, 5, 3, 2, 5, 0, 1, 2, 5],
            yAxisID: "y1",
            order: 1,
            //data: datosGrafica.retos,
          },
          {
            label: ["Logros"],
            borderWidth: 1.5,
            borderColor: "#fc6579",
            hoverBackgroundColor: "rgba(138, 55, 66, 0.7)",
            data: [11, 8, 3, 2, 1, 9, 8, 3, 2, 1, 9, 3],
            yAxisID: "y1",
            order: 1,
            //data: datosGrafica.logros,
          },
        ],
      },
      datosTransacciones: this.$store.state.auth.user.transaccionesTal
        ? this.$store.state.auth.user.transaccionesTal
        : [],
    };
  },
  computed: {
    getSalesOptions() {
      return {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // Coordinate axis indicator, coordinate axis trigger is valid
            type: "shadow", // The default is a straight line, optional:'line' |'shadow'
          },
        },
        grid: {
          left: "2%",
          right: "2%",
          top: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
          },
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "Fashions",
            type: "bar",
            data: [40, 45, 27, 50, 32, 50, 70, 30, 30, 40, 67, 29],
            color: "#546bfa",
          },
          {
            name: "Electronics",
            type: "bar",
            data: [124, 100, 20, 120, 117, 70, 110, 90, 50, 90, 20, 50],
            color: "#3a9688",
          },
          {
            name: "Toys",
            type: "bar",
            data: [17, 2, 0, 29, 20, 10, 23, 0, 8, 20, 11, 30],
            color: "#02a9f4",
          },
          {
            name: "Vouchers",
            type: "bar",
            data: [20, 100, 80, 14, 90, 86, 100, 70, 120, 50, 30, 60],
            color: "#f88c2b",
          },
        ],
      };
    },
  },
  meta() {
    return {
      title: "ECodium | Inicio",
    };
  },
  methods: {
    sumarDeArray(array, propiedad) {
      return array.reduce(function (r, a) {
        return r + a[propiedad];
      }, 0);
    },
    skipped(ctx, value) {
      return ctx.p0.skip || ctx.p1.skip ? value : undefined;
    },
    down(ctx, value) {
      return ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;
    },
    getGradient(ctx, chartArea) {
      const chartWidth = chartArea.right - chartArea.left;
      const chartHeight = chartArea.bottom - chartArea.top;
      if (gradient === null || width !== chartWidth || height !== chartHeight) {
        // Create the gradient because this is either the first render
        // or the size of the chart has changed
        width = chartWidth;
        height = chartHeight;
        gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, Utils.CHART_COLORS.blue);
        gradient.addColorStop(0.5, Utils.CHART_COLORS.yellow);
        gradient.addColorStop(1, Utils.CHART_COLORS.red);
      }

      return gradient;
    },
    formatearFecha(fecha) {
      return date.formatDate(fecha, "DD/MM/YYYY HH:mm");
    },
    obtenerDatosGraficaMensual() {
      var datosActuales = {
        experiencia: 0,
        retos: 0,
        logros: 0,
      };
      var datosPasados = {
        experiencia: 0,
        retos: 0,
        logros: 0,
      };
      const mesAnt = Number(new Date().getMonth());
      const mes = mesAnt + 1;
      if (
        !!this.$store.state.auth.user.movimientosExp &&
        this.$store.state.auth.user.movimientosExp.length > 0
      ) {
        const arrayActual = this.$store.state.auth.user.movimientosExp.filter((item) => {
          let itemMes = new Date(item.fecha).getMonth();
          return itemMes === mes - 1;
        });
        const arrayPasado = this.$store.state.auth.user.movimientosExp.filter((item) => {
          let itemMes = new Date(item.fecha).getMonth();
          return itemMes === mesAnt - 1;
        });
        datosActuales.experiencia = this.sumarDeArray(arrayActual, "cantidad");
        datosPasados.experiencia = this.sumarDeArray(arrayPasado, "cantidad");
      }
      if (
        !!this.$store.state.auth.user.retos &&
        this.$store.state.auth.user.retos.length > 0
      ) {
        this.$store.state.auth.user.retos.forEach((reto) => {
          if (new Date(reto.fecha).getMonth() === mes - 1) {
            datosActuales.retos += 1;
          } else if (new Date(reto.fecha).getMonth() === mesAnt - 1) {
            datosPasados.retos += 1;
          }
        });
      }
      if (
        !!this.$store.state.auth.user.logros &&
        this.$store.state.auth.user.logros.length > 0
      ) {
        this.$store.state.auth.user.logros.forEach((logro) => {
          if (new Date(logro.fecha).getMonth() === mes - 1) {
            datosActuales.logros += 1;
          } else if (new Date(logro.fecha).getMonth() === mesAnt - 1) {
            datosPasados.logros += 1;
          }
        });
      }
      return {
        experiencia: Number(
          (datosActuales.experiencia - datosPasados.experiencia) /
            datosPasados.experiencia
        ),
        retos:
          datosPasados.retos === 0
            ? Number(datosActuales.retos)
            : Number((datosActuales.retos - datosPasados.retos) / datosPasados.retos),
        logros:
          datosPasados.logros === 0
            ? Number(datosActuales.logros)
            : Number((datosActuales.logros - datosPasados.logros) / datosPasados.logros),
      };
    },
    obtenerDatosGrafica() {
      var experiencia = new Array(12).fill(0);
      var logros = new Array(12).fill(0);
      var retos = new Array(12).fill(0);
      if (
        !!this.$store.state.auth.user.movimientosExp &&
        this.$store.state.auth.user.movimientosExp.length > 0
      ) {
        this.$store.state.auth.user.movimientosExp.forEach(
          (movimiento) => (experiencia[new Date(movimiento.fecha).getMonth()] += 1)
        );
      }
      if (
        !!this.$store.state.auth.user.retos &&
        this.$store.state.auth.user.retos.length > 0
      ) {
        this.$store.state.auth.user.retos.forEach(
          (reto) => (retos[new Date(reto.fecha).getMonth()] += 1)
        );
      }
      if (
        !!this.$store.state.auth.user.logros &&
        this.$store.state.auth.user.logros.length > 0
      ) {
        this.$store.state.auth.user.logros.forEach(
          (logro) => (logros[new Date(logro.fecha).getMonth()] += 1)
        );
      }
      return {
        experiencia,
        logros,
        retos,
      };
    },
    getColor(val) {
      if (val > 70 && val <= 100) {
        return "green";
      } else if (val > 50 && val <= 70) {
        return "blue";
      }
      return "red";
    },
    getChipColor(status) {
      if (status == "Canceled") {
        return "negative";
      } else if (status == "Sent") {
        return "positive";
      } else if (status == "Pending") {
        return "warning";
      } else if (status == "Paid") {
        return "info";
      } else {
        return "dark";
      }
    },
  },
};
</script>
<style lang="scss">
.carousel .scroll {
  overflow-y: hidden !important;
}
</style>
