<!-- ECODIUM - TFG Samuel Encinas -->
<!-- PÁGINA: Evento -->
<template>
  <q-page>
    <q-item class="col">
      <q-item-section avatar>
        <q-icon
          v-if="$q.dark.isActive"
          size="500%"
          name="img:icons/iconos/lightmode/eventos.svg"
        />
        <q-icon v-else size="500%" name="img:icons/iconos/darkmode/eventos.svg" />
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-h3 text-primary text-weight-bolder"
          >Eventos</q-item-label
        >
      </q-item-section>

      <q-item-section side>
        <q-btn
          class="q-ma-lg"
          color="primary"
          style="margin-right: 50px"
          v-if="!showSpecialButton"
          label="Añadir nuevo evento"
          @click="card = true"
        />
      </q-item-section>
    </q-item>

    <daykeep-calendar
      class="q-ma-md"
      event-ref="calendario"
      :prevent-event-detail="true"
      :tab-labels="this.literalesBotones"
      :event-array="eventos"
    />

    <q-dialog v-model="card" @hide="obtenerEventos">
      <modal-eventos />
    </q-dialog>
  </q-page>
</template>

<script>
import axios from "axios";
import ModalEventos from "../components/ModalEventos.vue";
import { copyToClipboard } from "quasar";
import { DaykeepCalendar } from "@daykeep/calendar-quasar";

export default {
  components: { ModalEventos, DaykeepCalendar },
  methods: {
    // Carga los eventos en memoria del cliente
    obtenerEventos() {
      const apiCall = "https://api.ecodium.dev/api/eventos/eventos/";
      axios
        .get(apiCall)
        .then((res) => {
          this.mapearEventos(res.data, "concursos");
        })
        .catch((err) => {
          console.warn(err);
          this.eventos = {};
        });
    },
    // Compartir un evento
    compartir(id) {
      const mensaje =
        "He encontrado este evento en ECodium | https://www.ecodium.dev/evento/" + id;
      copyToClipboard(mensaje)
        .then(() => {})
        .catch(() => {});
    },
    // Elimina el evento seleccionado
    eliminar() {
      const apiCall =
        "https://api.ecodium.dev/api/eventos/eliminar/" + this.retoEditar.id;
      axios
        .delete(apiCall)
        .then((res) => {
          this.obtenerEventos();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // Mapea la visualización y el color del evento
    mapearVisualizacion(evento) {
      const esPropio = this.$store.state.auth.user.nombreUsuario === evento.organizador;
      if (evento.estado === "Publicado") {
        return esPropio ? "rgba(16, 255, 0, 0.5)" : "rgb(16, 255, 0)";
      } else if (evento.estado === "Borrador") {
        return esPropio ? "rgba(244, 255, 0, 0.5)" : null;
      } else {
        return "rgba(148, 18, 18, 1)";
      }
    },
    // Mapea los eventos al formato del calendario basado en Google Calendar
    mapearEventos(eventosApi) {
      var eventos = [];
      eventosApi.forEach((ev) => {
        const evento = ev._doc;

        const e = {
          id: evento.id,
          summary: evento.nombre,
          description: evento.descripcion,
          start: {
            date: !!evento.fechaInicio ? evento.fechaInicio.substring(0, 10) : "",
          },
          end: {
            date: !!evento.fechaFin ? evento.fechaFin.substring(0, 10) : "",
          },
          limite: evento.limite,
          precio: evento.precio,
          premios: evento.premios,
          color: "green",
          organizador: evento.organizador,
        };
        if (e.color !== null) eventos.push(e);
      });
      console.log(eventos);

      this.eventos = eventos;
    },
  },
  meta() {
    return {
      title: "ECodium | Eventos",
    };
  },
  data() {
    // Listener que escucha el clic de un evento del calendario
    this.$root.$on("click-event-calendario", function (eventDetailObject) {
      const url = "/evento/" + eventDetailObject.id;
      this.$router.push(url);
    });
    var logros = [
      {
        id: Number,
        nombre: String,
        descripcion: String,
        categoria: String,
        recompensa: Number,
      },
    ];
    this.obtenerEventos();
    console.log(this.eventos);
    this.$store.commit("setMenuStatus", "eventos");

    return {
      literalesBotones: {
        month: "Mes",
        week: "Semana",
        threeDay: "Tres días",
        day: "Día",
        agenda: "Agenda",
      },
      hayEventoSeleccionado: true,
      eventoSeleccionado: null,
      eventos: [],
      card: false,
      ventanaInfoOpen: true,
      ventanaInfoExpanded: false,

      logrosUsuario: this.$store.state.auth.user.logros,
      retoEditar: {},
      search: "",
      filterToggles: {
        onlyUnlocked: true,
        onlyLocked: true,
        categoria: {
          comun: true,
          infrecuente: true,
          raro: true,
          mitico: true,
        },
        tags: [],
      },
      showSpecialButton: this.$store.state.auth.user.rol[0] !== "player",
      columns: [
        {
          name: "nombre",
          required: true,
          label: "Logro",
          align: "left",
          field: "nombre",
          sortable: true,
        },
        {
          name: "categoria",
          align: "center",
          label: "Categoría",
          field: "categoria",
          sortable: true,
        },
        {
          name: "recompensa",
          label: "Recompensa (XP)",
          field: "recompensa",
          sortable: true,
        },
        {
          name: "descripcion",
          label: "Descripción",
          field: "descripcion",
          sortable: true,
        },
      ],
    };
  },
  computed: {
    filter() {
      return {
        search: this.search,
        unlocked: this.filterToggles.onlyUnlocked,
        locked: this.filterToggles.onlyLocked,
        categoria: this.filterToggles.categoria,
      };
    },
  },
};
</script>

<style lang="scss">
.calendar-month .calendar-content .calendar-day-current {
  background-color: rgba(252, 119, 69, 0.4) !important;
}
.calendar-month .calendar-content .calendar-day-weekend {
  background-color: rgba(0, 0, 0, 0.2);
}
.calendar-agenda-event:hover {
  background-color: $primary;
}
.calendar-agenda-event-allday .calendar-agenda-event-time:before {
  content: "Todo el día";
  visibility: visible;
}
.calendar-agenda-event-allday .calendar-agenda-event-time {
  visibility: hidden;
}
.item-box {
  border-top-left-radius: 17px;
  border-top-right-radius: 17px;
}

.q-separator {
  background-color: #1d09256b;
}

.q-separator--dark {
  background-color: #ec774582;
}

.logro {
  max-width: 300px;
}

.filter-box {
  border-top: 0.1rem solid $primary;
  border-bottom: 0.1rem solid $primary;
  border-left: 0.1rem solid $primary;
  border-right: 0.1rem solid $primary;
  border-radius: 1rem;
}

.filter-select {
  text-transform: inherit;
}

.bloqueado > .q-img__image {
  -webkit-filter: contrast(1.9) grayscale(1);
  filter: contrast(1.9) grayscale(1) invert(0.4);
}

.card-box {
  border-top: 0.1rem solid $primary;
  border-bottom: 0.1rem solid $primary;
  border-left: 0.1rem solid $primary;
  border-right: 0.1rem solid $primary;
}

.editor {
  box-shadow: rgba(236, 119, 69, 0.2) 5px 5px, rgba(236, 119, 69, 0.15) 10px 10px,
    rgba(236, 119, 69, 0.1) 15px 15px, rgba(236, 119, 69, 0.05) 20px 20px,
    rgba(236, 119, 69, 0.025) 25px 25px !important;
}
</style>
