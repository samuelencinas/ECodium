/**
 * ECodium - TFG Samuel Encinas
 * Fichero de configuración de la propiedad "auth" del store de Vuex
 * (Manejo de estados)
 */
import axios from "axios";
import store from "..";

const axiosConfig = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
  },
};
const apiCall = "https://api.ecodium.dev/api/auth/notificaciones";

export default {
  state: {
    menu: null,
    theme: null,
    isDarkTheme: null,
    notifications: [],
  },
  actions: {
    // Acción que inicializa las notificaciones - comprobando si hay nuevas y cargándolas desde el almacenamiento local
    initNotifications(context) {
      // Comprobamos si hay nuevas notificacioens y las descargamos
      axios.get(apiCall, axiosConfig).then((res) => {
        const newNotifications = res.data.notificaciones;
        // Obtenemos las notificaciones acumuladas de otras sesiones en local
        const localNotifications = JSON.parse(localStorage.getItem("notifications"));
        // Generamos el array de notificaciones final (concatenación de anteriores array ordenado por fecha y hora de manera decreciente)
        const finalNotifications = newNotifications
          .concat(localNotifications)
          .sort((a, b) => {
            return new Date(b.time) - new Date(a.time);
          });
        
        localStorage.getItem("notifications", finalNotifications);
        context.commit("setNotifications", finalNotifications);
      });
    },
  },
  mutations: {
    // Mutación que establece la posición actual del menú
    setMenuStatus(state, menu) {
      state.menu = menu;
    },

    // Mutación que establece el tema del usuario
    setDarkTheme(state, darkTheme) {
      localStorage.setItem("isDarkTheme", darkTheme);
    },

    // Mutación que establece el tema del simulador de IDE para Retos
    setIDETheme(state, theme) {
      localStorage.setItem("theme", theme);
      state.theme = theme;
    },

    // Mutación que establece el listado de notificaciones actual
    setNotifications(state, notifications) {
      
      localStorage.setItem("notifications", JSON.stringify(notifications));
      state.notifications = notifications;
    },

    // Mutación que añade una nueva notificación
    addNotification(state, notification) {
      var notifications = state.notifications;
      notifications.push(notification);
      state.notifications = notifications;
      localStorage.setItem("notifications", JSON.stringify(notifications));
    },

    // Mutación que elimina una notificación
    removeNotification(state, notification) {
      const index = state.notifications.findIndex(
        (x) =>
          x.notification === notification.notification && x.time === notification.time
      );
      state.notifications.splice(index, 1);
      localStorage.setItem("notifications", JSON.stringify(state.notifications));
    },

    // Mutación que elimina todas las notificaciones
    removeAllNotifications(state) {
      while (state.notifications.length > 0) {
        state.notifications.pop();
      }
    },
  },
};
