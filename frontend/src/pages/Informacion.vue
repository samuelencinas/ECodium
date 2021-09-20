<!-- ECODIUM - TFG Samuel Encinas -->
<!-- PÁGINA: Informativa -->
<template>
  <q-page padding>
    <div class="column items-center">
      <div class="col" style="width: 100%">
        <q-card class="editor q-ma-xl q-pa-l" v-show="ventanaInfoOpen" flat bordered>
          <q-bar class="bg-primary">
            <q-icon name="img:icons/iconos/lightmode/talento.svg" />
            <div class="text-bold">Info del taller - a</div>

            <q-space />

            <q-btn dense flat icon="minimize" @click="ventanaInfoExpanded = false" />
            <q-btn dense flat icon="crop_square" @click="ventanaInfoExpanded = true" />
            <q-btn
              dense
              flat
              icon="close"
              @click="
                $q.dialog({
                  title: 'Alerta!',
                  class: 'bg-secondary text-white',
                  message:
                    '¿Por qué intentas destruir un componente web de la aplicación?',
                  ok: {
                    label: 'a',
                    color: 'black',
                  },
                })
              "
            />
          </q-bar>
          <q-slide-transition>
            <div v-show="ventanaInfoExpanded">
              <q-splitter v-model="splitterModel" style="height: 250px">
                <template v-slot:before>
                  <q-tabs v-model="tab" vertical class="text-primary">
                    <q-tab name="info" icon="lightbulb" label="Info" />
                                        <q-tab name="cookies" icon="lightbulb" label="Política GPRD" />
                    <q-tab name="contacto" icon="email" label="Contacto" />
                  </q-tabs>
                </template>

                <template v-slot:after>
                  <q-tab-panels
                    v-model="tab"
                    animated
                    swipeable
                    vertical
                    transition-prev="jump-up"
                    transition-next="jump-up"
                  >
                    <q-tab-panel name="info">
                      <div class="text-h4 q-mb-md text-weight-bold text-center">
                        Info - a
                      </div>
                      <span class="text-bold">ECodium</span> es el proyecto realizado como Trabajo Fin de Grado por Samuel Encinas Plaza, que tiene como objetivo principal desarrollar y documentar el proceso de desarrollo completo de una aplicación de carácter full stack, que utilice tecnologías punteras y que sea lo más atractiva posible.
                      <br/>
                      <span class="text-bold">No es, por tanto, una web real.</span> Podemos considerarlo un prototipo muy avanzado dado que está en la Nube, pero por ahora es eso, un mero prototipo.
                      <br/>
                      <span class="text-bold">Enjoy coding!</span>
                    </q-tab-panel>
                    <q-tab-panel name="cookies">
                                    <q-scroll-area style="width: 100%; height: 350px" class="q-px-lg q-pb-md">

                      POLÍTICA DE COOKIES
https://www.ecodium.dev
El acceso a este Sitio Web puede implicar la utilización de cookies. Las cookies son pequeñas cantidades de información que se almacenan en el navegador utilizado por cada Usuario —en los distintos dispositivos que pueda utilizar para navegar— para que el servidor recuerde cierta información que posteriormente y únicamente el servidor que la implementó leerá. Las cookies facilitan la navegación, la hacen más amigable, y no dañan el dispositivo de navegación.

Las cookies son procedimientos automáticos de recogida de información relativa a las preferencias determinadas por el Usuario durante su visita al Sitio Web con el fin de reconocerlo como Usuario, y personalizar su experiencia y el uso del Sitio Web, y pueden también, por ejemplo, ayudar a identificar y resolver errores.

La información recabada a través de las cookies puede incluir la fecha y hora de visitas al Sitio Web, las páginas visionadas, el tiempo que ha estado en el Sitio Web y los sitios visitados justo antes y después del mismo. Sin embargo, ninguna cookie permite que esta misma pueda contactarse con el número de teléfono del Usuario o con cualquier otro medio de contacto personal. Ninguna cookie puede extraer información del disco duro del Usuario o robar información personal. La única manera de que la información privada del Usuario forme parte del archivo Cookie es que el usuario dé personalmente esa información al servidor.

Las cookies que permiten identificar a una persona se consideran datos personales. Por tanto, a las mismas les será de aplicación la Política de Privacidad anteriormente descrita. En este sentido, para la utilización de las mismas será necesario el consentimiento del Usuario. Este consentimiento será comunicado, en base a una elección auténtica, ofrecido mediante una decisión afirmativa y positiva, antes del tratamiento inicial, removible y documentado.

Cookies propias
Son aquellas cookies que son enviadas al ordenador o dispositivo del Usuario y gestionadas exclusivamente por ECodium para el mejor funcionamiento del Sitio Web. La información que se recaba se emplea para mejorar la calidad del Sitio Web y su Contenido y su experiencia como Usuario. Estas cookies permiten reconocer al Usuario como visitante recurrente del Sitio Web y adaptar el contenido para ofrecerle contenidos que se ajusten a sus preferencias.

Cookies de terceros
Son cookies utilizadas y gestionadas por entidades externas que proporcionan a ECodium servicios solicitados por este mismo para mejorar el Sitio Web y la experiencia del usuario al navegar en el Sitio Web. Los principales objetivos para los que se utilizan cookies de terceros son la obtención de estadísticas de accesos y analizar la información de la navegación, es decir, cómo interactúa el Usuario con el Sitio Web.

La información que se obtiene se refiere, por ejemplo, al número de páginas visitadas, el idioma, el lugar a la que la dirección IP desde el que accede el Usuario, el número de Usuarios que acceden, la frecuencia y reincidencia de las visitas, el tiempo de visita, el navegador que usan, el operador o tipo de dipositivo desde el que se realiza la visita. Esta información se utiliza para mejorar el Sitio Web, y detectar nuevas necesidades para ofrecer a los Usuarios un Contenido y/o servicio de óptima calidad. En todo caso, la información se recopila de forma anónima y se elaboran informes de tendencias del Sitio Web sin identificar a usuarios individuales.

Puede obtener más información sobre las cookies, la información sobre la privacidad, o consultar la descripción del tipo de cookies que se utiliza, sus principales características, periodo de expiración, etc. en el siguiente(s) enlace(s):

Google: https://developers.google.com GitHub: https://github.com

La(s) entidad(es) encargada(s) del suministro de cookies podrá(n) ceder esta información a terceros, siempre y cuando lo exija la ley o sea un tercero el que procese esta información para dichas entidades.

Deshabilitar, rechazar y eliminar cookies
El Usuario puede deshabilitar, rechazar y eliminar las cookies —total o parcialmente— instaladas en su dispositivo mediante la configuración de su navegador (entre los que se encuentran, por ejemplo, Chrome, Firefox, Safari, Explorer). En este sentido, los procedimientos para rechazar y eliminar las cookies pueden diferir de un navegador de Internet a otro. En consecuencia, el Usuario debe acudir a las instrucciones facilitadas por el propio navegador de Internet que esté utilizando. En el supuesto de que rechace el uso de cookies —total o parcialmente— podrá seguir usando el Sitio Web, si bien podrá tener limitada la utilización de algunas de las prestaciones del mismo.

                                    </q-scroll-area>
                    </q-tab-panel>
                    <q-tab-panel name="contacto"> bb </q-tab-panel>
                  </q-tab-panels>
                </template>
              </q-splitter>
            </div>
          </q-slide-transition>

          <q-separator />
        </q-card>
      </div>
      <div class="col" style="width: 100%">
        <q-card class="editor" flat>
          <q-bar class="bg-primary barraMenu">
            <q-space />

            <q-space />

            <q-btn dense flat icon="minimize" @click="ventanaInfoExpanded = false" />
            <q-btn dense flat icon="crop_square" @click="ventanaInfoExpanded = true" />
            <q-btn dense flat icon="close" />
          </q-bar>
          <q-separator />

          <q-card-section horizontal>
            <q-card-section class="falsoIDE col-12">
              <q-scroll-area style="width: 100%; height: 350px" class="q-px-lg q-pb-md">
                <div class="q-px-lg q-pb-md">
                  <q-timeline color="secondary">
                    <q-timeline-entry heading>
                      Los rangos de ECodium
                    </q-timeline-entry>

                    <q-timeline-entry
                      title="Sin Rango"
                      color="black"
                      icon="img:icons/iconos/lightmode/talento.svg"
                      subtitle="Niveles 1-10 (0 - 107 Puntos de Experiencia)"
                      side="left"
                    >
                      <div>
                        Todos los comienzos son duros. Bienvenido a ECodium. Sin rangos.
                        Sin presiones.
                      </div>
                    </q-timeline-entry>
                    <q-timeline-entry
                      title="Aluminio"
                      color="grey"
                      icon="img:icons/iconos/lightmode/talento.svg"
                      subtitle="Niveles 11-14 (118 - 157 Puntos de Experiencia)"
                      side="left"
                    >
                      <div>
                        ALUMINIO es el primer rango al que te enfrentarás. Sube cuatro
                        niveles, llega a ALUMINIO I y vive tu primera fase de ascenso.
                      </div>
                    </q-timeline-entry>
                                        <q-timeline-entry
                      title="Cobre"
                      color="brown"
                      icon="img:icons/iconos/lightmode/talento.svg"
                      subtitle="Niveles 15-18 (108 - 230 Puntos de Experiencia)"
                      side="left"
                    >
                      <div>
                        COBRE es el siguiente paso. También tiene cuatro divisiones (COBRE IV...COBRE I) y no supondrá demasiado esfuerzo.
                      </div>
                    </q-timeline-entry>
                                        </q-timeline-entry>
                                        <q-timeline-entry
                      title="Plata"
                      color="teal"
                      icon="img:icons/iconos/lightmode/talento.svg"
                      subtitle="Niveles 19-22 (253 - 336 Puntos de Experiencia)"
                      side="left"
                    >
                      <div>
                        La cosa empieza a cambiar, estás acercándote peligrosamente al oro... Cuatro divisiones más y lo tienes
                      </div>
                    </q-timeline-entry>
                                                            <q-timeline-entry
                      title="Oro"
                      color="amber"
                      icon="img:icons/iconos/lightmode/talento.svg"
                      subtitle="Niveles 23-26 (370 - 492 Puntos de Experiencia)"
                      side="left"
                    >
                      <div>
                        ¿Quién no sueña con el ORO?
                      </div>
                    </q-timeline-entry>
                                                                                <q-timeline-entry
                      title="Platino"
                      color="cyan"
                      icon="img:icons/iconos/lightmode/talento.svg"
                      subtitle="Niveles 27-30 (542 - 721 Puntos de Experiencia)"
                      side="left"
                    >
                      <div>
                        ¿Pensabas que en el oro se quedaba todo?
                      </div>
                    </q-timeline-entry>

                                                                                                  <q-timeline-entry
                      title="Silicio"
                      color="red"
                      icon="img:icons/iconos/lightmode/talento.svg"
                      subtitle="Niveles 31-34 (793 - 1.056k Puntos de Experiencia)"
                      side="left"
                    >
                      <div>
                        Uno de los metales más codiciados por los aficionados a la tecnología.
                      </div>
                    </q-timeline-entry>
                                                                                                                      <q-timeline-entry
                      title="Neodimio"
                      color="green"
                      icon="img:icons/iconos/lightmode/talento.svg"
                      subtitle="Niveles 35-44 (1.161k - 2.738k Puntos de Experiencia)"
                      side="left"
                    >
                      <div>
                        Bienvenido a tu primer rango con 10 divisiones. Sube de NEODIMIO X a NEODIMIO I y conquista el imán más potente del mundo. 
                      </div>
                    </q-timeline-entry>
                                                                                                                                          <q-timeline-entry
                      title="Leyenda"
                      color="purple"
                      icon="img:icons/iconos/lightmode/talento.svg"
                      subtitle="Niveles 45-54 (3.012k - 7.102k Puntos de Experiencia)"
                      side="left"
                    >
                      <div>
                        Ya has conquistado todos los materiales habidos y por haber. Eres una auténtica leyenda... si consigues completar otras diez divisiones más.
                      </div>
                    </q-timeline-entry>
                                                                                                                                                              <q-timeline-entry
                      title="Maestro"
                      color="orange"
                      icon="img:icons/iconos/lightmode/talento.svg"
                      subtitle="Niveles 55-59 (7.812k - 11.438k Puntos de Experiencia)"
                      side="left"
                    >
                      <div>
                        ¿Qué digo leyenda? ¡Tú eres un maestro! ¡5 divisiones más y lo tienes!
                      </div>
                    </q-timeline-entry>
                                                                                                                                                                                  <q-timeline-entry
                      title="GRAN MAESTRO."
                      color="primary"
                      icon="img:icons/iconos/lightmode/talento.svg"
                      subtitle="Nivel 60 en adelante (mínimo 12.582k Puntos de Experiencia)"
                      side="left"
                    >
                      <div>
                        Enhorabuena. Has llegado. El último peldaño para la gloria.
                      </div>
                    </q-timeline-entry>
                  </q-timeline>
                </div>
              </q-scroll-area>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
    meta() {
    return {
      title: "ECodium | Información",
    };
  },
  data() {
        this.$store.commit("setMenuStatus", "info");

    return {
      tab: "info",
      ventanaInfoExpanded: true,
      ventanaInfoOpen: true,
      splitterModel: 5,
    };
  },
};
</script>
