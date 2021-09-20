/**
 * ECodium - TFG Samuel Encinas
 * WEB COMPONENT - Gráfico Mes (para usuarios de tipo Jugador) - Muestra un gráfico del progreso del mes actual
 */
import {
  PolarArea,
  Bar,
  Line
}
from 'vue-chartjs'
import {
  Chart
} from 'chart.js'

let draw = Chart.controllers.line.prototype.draw;
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
        fill: false,
        scales: {
          xAxes: [{
                        categoryPercentage: 1,
            barPercentage: 1
          }],
          yAxes: [{
                     gridLines: {
                  display: true,
                  zeroLineColor:'white',
                  color:'transparent'
                },
          }]
        },
        plugins: {
          layout: {
            padding: 18
          },
          filler: {
            propagate: false,
          },
        },
        legend: {
          display: false
        },
        elements: {
          line: {
            tension: 0.4
          }
        },
                tooltips: {
callbacks: {
        title: function(tooltipItem, data) {
          return data['labels'][tooltipItem[0]['index']];
        },
        label: function(tooltipItem, data) {
          const tipo = tooltipItem.datasetIndex === 0
            ? 'Experiencia'
            : tooltipItem.datasetIndex === 1
              ? 'Retos'
              : 'Logros';
          return data['datasets'][tooltipItem.datasetIndex]['data'][tooltipItem['index']] === 0.005
              ? "0%"
              : data['datasets'][tooltipItem.datasetIndex]['data'][tooltipItem['index']] > 0.005
            ? "+" + Number(data['datasets'][tooltipItem.datasetIndex]['data'][tooltipItem['index']]*100) + "% " + tipo
            : "-" + Number(data['datasets'][tooltipItem.datasetIndex]['data'][tooltipItem['index']]*-100) + "% " + tipo;
        },
      },
      titleFontSize: 16,
      titleFontColor: 'orange',
      bodyFontColor: 'white',
      bodyFontSize: 14,
      displayColors: false
        }
      }
    }
  }
}
