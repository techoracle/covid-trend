<script>
  import { Line } from 'vue-chartjs'
  export default Line.extend({
    props: {
      chartData: {
        type: Array | Object,
        required: false
      },
      chartLabels: {
        type: Array,
        required: true
      },
      dataLabel: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: true
              }
            }],
            xAxes: [ {
              gridLines: {
                display: false
              }
            }]
          },
          legend: {
            display: false
          },
          responsive: true,
          maintainAspectRatio: false
        }
      }
    },
    mounted () {
      this.renderChart({
        labels: this.chartLabels,
        datasets: [
          {
            label: this.dataLabel,
            borderColor: '#249EBF',
            pointBackgroundColor: 'red',
            borderWidth: 1,
            pointBorderColor: '#249EBF',
            backgroundColor: '#dfffff',
            data: this.chartData
          }
        ]
      }, this.options)
    }
  })
</script>
