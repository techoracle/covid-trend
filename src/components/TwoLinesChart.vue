<script>
  import { Line } from 'vue-chartjs'
  export default Line.extend({
    props: {
      chartDataFirst: {
        type: Array | Object,
        required: false
      },
      chartDataSecond: {
        type: Array | Object,
        required: false
      },
      chartLabels: {
        type: Array,
        required: true
      },
      dataLabelFirst: {
        type: String,
        required: true
      },
      dataLabelSecond: {
        type: String,
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
            label: this.dataLabelFirst,
            borderColor: '#249EBF',
            pointBackgroundColor: 'red',
            borderWidth: 1,
            pointBorderColor: '#249EBF',
            backgroundColor: '#dfffff',
            data: this.chartDataFirst
          },
          {
            label: this.dataLabelSecond,
            borderColor: '#249EBF',
            pointBackgroundColor: 'black',
            borderWidth: 1,
            pointBorderColor: '#249EBF',
            backgroundColor: '#afffff',
            data: this.chartDataSecond
          }
        ]
      }, this.options)
    }
  })
</script>
