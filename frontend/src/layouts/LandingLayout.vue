<!-- ECODIUM - TFG Samuel Encinas -->
<!-- LAYOUT para la Landing Page -->
<template>
  <q-layout view="hhh LpR fFf">
    <!-- Cabecera -->
    <q-header
     class="header">
        <img class="ml-2 logo" src="../assets/img/logo.png">
    </q-header>
    <q-page-container class="row"> 
      <!-- Decorador de la izquierda -->
      <q-page class="col-12 col-md-8 test">
          <div class="q-pa-md row items-start q-gutter-md">
            <div class="landing">
              <span id="typed" class="text-h3 text-weight-bolder text-center"><!-- content will be typed here --></span>
              <p class="text-h5 text-center">Si eres capaz de demostrarlo, recibe <span class="text-h5 texto-destacado text-bold"> talentos </span> en forma de tokens ERC20 como recompensa </span></p>
            </div>
            <q-img src="~/assets/svg/landing.svg"></q-img>
      <!-- Fin decorador izquierda -->
          </div>
      </q-page>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Particles from 'particles.vue';
import Typed from 'typed.js';
export default {
  // name: 'LayoutName',
  name: 'LandingLayout',
  components: { Particles },
  data() {
  },
  mounted(){
    const plugin = document.createElement("script");
    plugin.setAttribute(
      "src",
      "https://cdn.jsdelivr.net/npm/typed.js@2.0.11"
    );
    plugin.async = true;
    document.head.appendChild(plugin);
var typed = new Typed('#typed', {
  strings: ['¿Tienes <span class="texto-destacado">talento digital?</span>', '¿Eres <span class="texto-destacado">creativo?</span>', '¿Te ves capaz de <span class="texto-destacado">resolver problemas?</span>'],
            typeSpeed: 50,
            backDelay: 500,
            loop: true
});
  }
}
</script>

<style>

p.detail { color:#4C4C4C;font-weight:bold;font-family:Calibri;font-size:20 }
span.texto-destacado { color:#ec7745;}

.typed-cursor{
    font-size: 40px;
}

.titulo{
  display: inline-block;
}
.landing{
    width: 50%;
  margin: 0 auto;
}
.my-card{
  color: black;
}
.center {
  margin: auto;
  width: 50%;
  border: 3px solid green;
  padding-top: 50%;
  background-color: white;
}
.header{
background: transparent;
filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#020024",endColorstr="#1d0925",GradientType=1);
}
img.logo {
  padding-left: 2%;
  width: 80%;
  height: auto;
  /* Recommended - Limit maximum width */
  max-width: 400px;
}
.test {
  color: white;
}
@media only screen and (min-width: 769px) {
html, body {
  margin: 0; height: 100%; overflow: hidden;
}
}
@media only screen and (max-width: 768px) {
  html, body {
    overflow-x: hidden;
  }
  .header {
  text-align: center;
}
img.logo {
  width: 70%;
}
}
  
</style>
