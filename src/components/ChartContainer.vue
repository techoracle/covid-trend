<template>
  <div class="container">

    <select class="custom-select d-block w-100" v-model="selectedCountry" @change="requestData">
      <option v-for="country in countries" v-bind:value="country.Slug"
              :selected="country.Country == 'Germany'" >{{ country.Country }}</option>
    </select>


    <div class="Chart">
        <h2>{{ $t('infectedTotal') }}</h2>
        <line-chart
          v-if="loaded"
          :chart-data="confirmed"
          :chart-labels="labels"
          :data-label="labelConfirmed"
        />
      </div>

      <div class="Chart">
        <h2>{{ $t('infectedDaily') }}</h2>
        <line-chart
          v-if="loaded"
          :chart-data="newConfirmed"
          :chart-labels="labels"
          :data-label="labelNewConfirmed"
        />
      </div>
      <div class="Chart">
        <h2>{{ $t('deathsTotal') }}</h2>
        <line-chart
          v-if="loaded"
          :chart-data="deaths"
          :chart-labels="labels"
          :data-label="labelDeaths"
        />
      </div>
      <div class="Chart">
        <h2>{{ $t('deathsDaily') }}</h2>
        <line-chart
          v-if="loaded"
          :chart-data="newDeaths"
          :chart-labels="labels"
          :data-label="labelNewDeaths"
        />
      </div>
      <div class="Chart">
        <h2>{{ $t('forecastDailyInfected') }}</h2>
        <line-chart
          v-if="loaded"
          :chart-data="forecastNewConfirmed"
          :chart-labels="forecastLabels"
          :data-label="labelForecast"
        />
      </div>
    <p>
      {{ $t('forecastDescription1') }}
      {{ $t('forecastDescription2') }}
      {{ $t('forecastDescription3') }}
      {{ $t('forecastDescription4') }}
    </p>


  </div>
</template>

<script>
  import LineChart from './LineChart.vue';
  import axios from 'axios';
  import moment from 'moment';
  import createForecastData from './forecastdata';
  import getCountries, { preselectedCountry } from '../assets/countries';


  export default {
    name: 'ChartContainer',
    components: {LineChart},
    data: () => ({
      loaded: false,
      loading: false,
      showError: false,
      errorMessage: '',
      labels: [],
      forecastLabels: [],
      confirmed: [],
      deaths: [],
      newConfirmed: [],
      newDeaths: [],
      forecastNewConfirmed: [],
      forecastChartData: null,
      labelConfirmed: 'Infected (total)',
      labelDeaths: 'Deaths (total)',
      labelNewConfirmed: 'Infected (daily)',
      labelNewDeaths: 'Deaths (daily)',
      labelForecast: 'Forecast',
      countries: getCountries
    }),
    mounted () {
      this.loaded = false;
      this.requestData();
    },
    methods: {
      resetState () {
        this.loaded = false;
        this.showError = false;
      },
      requestData () {
        console.log('selectedCountry=' + this.selectedCountry);
        if (this.selectedCountry === null || this.selectedCountry === '' || this.selectedCountry === 'undefined') {
          console.log('ERROR: selectedCountry=' + this.selectedCountry);
          return;
        }
        this.resetState();
        this.loading = true;
        console.log('loading');
        axios.get(`https://api.covid19api.com/total/dayone/country/${this.selectedCountry}`)
          .then(response => {
            this.confirmed = response.data.map(entry => entry.Confirmed);
            this.deaths = response.data.map(entry => entry.Deaths);
            this.labels = response.data.map(entry => this.dateToDay(entry.Date));
            this.newConfirmed = this.calculateDayDelta(this.confirmed);
            this.newDeaths = this.calculateDayDelta(this.deaths);
            this.forecastNewConfirmed = createForecastData(this.newConfirmed, 60).datasets[0].data;
            this.forecastLabels = this.generateDateLabels(this.forecastNewConfirmed.length);
            this.loaded = true;
            this.loading = false;
          })
          .catch(err => {
            this.errorMessage = err.response.data.error;
            this.showError = true;
          });

      },
      dateToDay(date) {
        return moment(date).format('YYYY-MM-DD');
      },
      calculateDayDelta(arraySource) {
        const result = [0];
        for (let i = 0; i < arraySource.length - 1; i++) {
          result.push(Math.abs(arraySource[i - 1] - arraySource[i]));
        }
        return result;
      },
      generateDateLabels(amount) {
        const result = [];
        for (let i = 1; i <= amount; i++) {
          result.push(moment().add(i, 'days').format('YYYY-MM-DD'));
        }
        return result;
      }
    },
    computed: {
      selectedCountry: {
        get: function() {
          return this.$store.state.country || preselectedCountry;
          //return getCountries.find(x => x.Country === countryName).Slug;
        },
        set: function(newVal) {
          this.$store.dispatch('changeCountry', newVal)
        }
      }
    }
  }
</script>
