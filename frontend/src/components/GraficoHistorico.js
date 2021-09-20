/**
 * ECodium - TFG Samuel Encinas
 * WEB COMPONENT: Gráfico Histórico Anual (para usuarios de tipo Jugador) - Muestra un gráfico de barras con el progreso anual del usuario
 */
import {
  Line,
  Bar
}
from 'vue-chartjs'
import {
  Chart
} from 'chart.js'

let draw = Chart.controllers.line.prototype.draw;
Chart.Legend.prototype.afterFit = function() {
    this.height = this.height + 20;
};

Chart.controllers.line.prototype.draw = function () {
  let chart = this.chart;
  let ctx = chart.ctx;
  let _stroke = ctx.stroke;
  ctx.stroke = function () {
    ctx.save();
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    _stroke.apply(this, arguments);
    ctx.restore();
  };
  draw.apply(this, arguments);
  ctx.stroke = _stroke;
};

export default {
  extends: Bar,
  props: ['data'],
  mounted: function () {
    this.renderChart(this.data, this.options)
  },
  data() {
    function handleHover(evt, item, legend) {
      legend.chart.data.datasets[0].backgroundColor.forEach((color, index, colors) => {
        colors[index] = index === item.index || color.length === 9 ? color : color + '4D';
      });
      legend.chart.update();
    }

    function handleLeave(evt, item, legend) {
      legend.chart.data.datasets[0].backgroundColor.forEach((color, index, colors) => {
        colors[index] = color.length === 9 ? color.slice(0, -2) : color;
      });
      legend.chart.update();
    }
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
          plugins: {
            legend: {
              position: 'left'
            }
          }
        },

        animation: {
          easing: 'easeInOutQuad',
          duration: 520
        },
        scales: {
          xAxes: {
            gridLines: {
              color: 'rgba(200, 200, 200, 0.05)',
              lineWidth: 1
            },
          },
          yAxes: [{
            id: 'y',
            type: 'linear',
            display: true,
            text: 'Value',
            position: 'right',
            ticks: {
              callback: function (value, index, values) {
                return value + " XP";
              },
              fontColor: "orange",
            }

          }, {
            id: 'y1',
            type: 'linear',
            display: true,
            text: 'Value',
            position: 'left',


          }, ],
        },
        elements: {
          line: {
            tension: 0.4
          }
        },
        legend: {
          display: true,
          labels: {
            usePointStyle: true,
            fontSize: 16
          },


        },
        point: {
          backgroundColor: 'white'
        },
        tooltips: {
          mode: 'index',
          titleFontFamily: 'Fira Sans',
          backgroundColor: 'rgba(0,0,0,0.7)',
          titleFontColor: '#ec7745',
          caretSize: 5,
          cornerRadius: 2,
          xPadding: 10,
          yPadding: 10
        }
      }
    }
  }
}
