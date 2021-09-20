/**
 * ECodium - TFG Samuel Encinas
 * Fichero de configuración de la propiedad "auth" del store de Vuex
 * (Manejo de estados)
 */
import * as types from './mutations'
import axios from "axios";
import store from '..';
import { date } from "quasar";

const axiosConfig = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "https://www.ecodium.dev",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE"
  }
};
const apiCall = "https://api.ecodium.dev/api/auth/user"

export default {
  state: {
    user: null,
    objetivo: null,
  },
  mutations: {
    SET_USER(state, user) {
      user.movimientosExp.map((elem) => {
          elem.fecha = date.formatDate(elem.fecha, "DD/MM/YYYY HH:mm");
      })
      state.user = user;
    },
    SET_OBJETIVO(state, objetivo) {
      state.objetivo = objetivo;
    },
    setAuthStatus(state, authStatus) {
      state.userAuth = authStatus;
    }
  },
  getters: {
    sesionIniciada(state) {
      if (state.user !== null) {
        return !!state.user.usuario;
      } else {
        return false;
      }
    }
  },
  actions: {
    //Registro
    async REGISTER({
      commit
    }, userData) {
      let provisionalUserData = {};
      const apiCall = "https://api.ecodium.dev/api/auth/register";
      await axios
        .post(apiCall, userData)
        .then(res => {
          provisionalUserData = (res.data.estado === "error") ? null : res.data;
        })
        .catch(err => {
          provisionalUserData = null;
          console.log(err);
        });
      commit('SET_USER', provisionalUserData);
    },
    //Login
    async LOGIN({
      commit,
      dispatch
    }, userData) {
      let provisionalUserData = {};
      const apiCall = "https://api.ecodium.dev/api/auth/login";
      await axios
        .post(apiCall, userData, axiosConfig)
        .then(res => {
          if (res.data.estado === "ok") {
            commit('SET_USER', res.data)
            dispatch('CHECK');
          }
        })
        .catch(err => {});
    },
    //Cerrar sesión
    async LOGOUT({
      commit
    }) {
      const apiCall = "https://api.ecodium.dev/api/auth/cerrarsesion"
      await axios
        .get(apiCall, axiosConfig)
        .then(res => {
          commit('SET_USER', null);
          location.reload();
        })
    },
    //CheckUser
    async CHECK({
      commit
    }) {
      const apiCall1 = "https://api.ecodium.dev/api/auth/user"
      await axios.get(apiCall1, axiosConfig).then(res => {
        commit('SET_USER', res.data.usuario);
      }).catch(err => {
        return err.data
      })
    },
    //CheckObjetivo
    async OBJETIVO({
      commit
    }) {
      const apiCall2 = "https://api.ecodium.dev/api/herramientas/siguienteNivel";
      await axios.get(apiCall2, axiosConfig).then(res2 => {
        commit('SET_OBJETIVO', res2.data);
      }).catch(err => {
        return err.data
      })
    }

}
}