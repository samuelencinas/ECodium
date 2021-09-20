<!-- ECODIUM - TFG Samuel Encinas -->
<!-- WEB COMPONENT: Cajón de Notificaciones-->
<template>
  <div class="notificaciones">
    <q-card class="bg-primary text-white notifHead">
      <q-card-section>
        <div class="notifIndic text-h6" style="float: left">
          {{ notificationsArray.length }} por leer
        </div>
        <q-btn
          flat
          round
          color="secondary"
          icon="grading"
          class="notifIcon"
          style="float: right"
          @click="limpiarNotificaciones"
        />
      </q-card-section>
    </q-card>
    <q-scroll-area :thumb-style="thumbStyle" :bar-style="barStyle" class="notif">
      <q-activity dense bar-width="0px">
        <q-activity-item
          v-for="item in notificationsArray"
          v-bind:key="item.title"
          icon="list"
          icon-color="orange-8"
          icon-text-color="white"
          icon-size="2rem"
          icon-font-size="1rem"
          :icon-square="true"
          class="notificacion"
          style="padding-bottom: 5px; padding-top: 5px"
        >
          <q-item>
            <q-item-section>
              <q-item-label class="text-h6">{{ item.notification }}</q-item-label>
              <q-item-label caption lines="2">{{ item.time }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-btn
            flat
            round
            color="white"
            icon="delete"
            size="0.7rem"
            class="notifIcon"
            style="float: right"
            @click="eliminarNotificacion(item.notification, item.time)"
          />
        </q-activity-item>
      </q-activity>
    </q-scroll-area>
  </div>
</template>

<script>
export default {
  name: "NotificationsBox",

  data() {
    return {
      notificationsArray: this.$store.state.data.notifications,
      thumbStyle: {
        right: "4px",
        borderRadius: "5px",
        backgroundColor: "#ec7745",
        width: "5px",
        opacity: 0.75,
      },
      barStyle: {
        right: "2px",
        borderRadius: "9px",
        backgroundColor: "#ec7745",
        width: "0px",
        opacity: 0.2,
      },
    };
  },
  methods: {
    testNotif() {
      this.$store.commit("addNotification", {
        notification: "Hola",
        time: "Mundo",
      });
    },
    limpiarNotificaciones() {
      this.$store.commit("removeAllNotifications");
    },
    eliminarNotificacion(titulo, time) {
      const notif = { notification: titulo, time };
      this.$store.commit("removeNotification", notif);
    },
  },
};
</script>

<style lang="scss">
.notifHead {
  display: inline-block;
  width: 100%;
  bottom: 2px;
}
.notifIndic {
  float: left;
  padding-left: 2%;
}
.notifIcon {
  float: right;
  bottom: 5px;
  padding-left: 0px;
}
.notif {
  width: 480px;
  height: 500px;
  overflow-y: hidden;
}
@media (max-width: 768px) {
  .notif {
    width: 100%;
  }
}
</style>
