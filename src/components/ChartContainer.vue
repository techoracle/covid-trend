<template>
  <div class="container">

    <select class="custom-select d-block w-100" v-model="selectedCountry" @change="requestData">
      <option v-for="country in countries" v-bind:value="country.Slug"
              :selected="country.Country == 'Germany'" >{{ country.Country }}</option>
    </select>

    <div v-if="showEndDate" class="table-responsive withOffsetTop">
      <table class="table table-striped table-sm">
        <tr>
          <td class="leftAlign goodNewsBg">{{ $t('forecastEndDay') }}</td>
          <td class="rightAlign goodNewsBg"><b>{{ endDate }}</b><b v-if="isEndDateInPast">{{ $t('alreadyReached') }} </b></td>
        </tr>
      </table>
    </div>

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

    <!--
      <div class="Chart">
        <h2>{{ $t('forecastDailyInfected') }}</h2>
        <line-chart
          v-if="loaded"
          :chart-data="forecastNewConfirmed"
          :chart-labels="forecastLabels"
          :data-label="labelForecast"
        />
      </div>
      -->

    <br>
    <h2>{{ $t('forecast') }}</h2>
    <p>
      {{ $t('forecastDescription1') }}
      {{ $t('forecastDescription2') }}
      {{ $t('forecastDescription3') }}
      {{ $t('forecastDescription4') }}
    </p>

    <div class="Chart">
      <h2>{{ $t('forecastTotalInfected') }}</h2>
      <two-lines-chart
        v-if="loadedForecastConfirmed"
        :chart-labels="labelsVerhulst"
        :chart-data-first="confirmed"
        :data-label-first="labelConfirmed"
        :chart-data-second="forecastVerhulstConfirmed"
        :data-label-second="labelForecast"
      />
    </div>

    <div class="Chart">
      <h2>{{ $t('forecastDailyInfected') }}</h2>
      <two-lines-chart
        v-if="loadedForecastConfirmed"
        :chart-labels="labelsVerhulst"
        :chart-data-first="newConfirmed"
        :data-label-first="labelNewConfirmed"
        :chart-data-second="forecastVerhulstNewConfirmed"
        :data-label-second="labelForecast"
      />
    </div>

    <div class="Chart">
      <h2>{{ $t('forecastTotalDeaths') }}</h2>
      <two-lines-chart
        v-if="loadedForecastDeaths"
        :chart-labels="labelsVerhulst"
        :chart-data-first="deaths"
        :data-label-first="labelDeaths"
        :chart-data-second="forecastVerhulstDeaths"
        :data-label-second="labelForecast"
      />
    </div>

    <div class="Chart">
      <h2>{{ $t('forecastDailyDeaths') }}</h2>
      <two-lines-chart
        v-if="loadedForecastDeaths"
        :chart-labels="labelsVerhulst"
        :chart-data-first="newDeaths"
        :data-label-first="labelNewDeaths"
        :chart-data-second="forecastVerhulstNewDeaths"
        :data-label-second="labelForecast"
      />
    </div>

    <br>
    <div class="leftAlign">
      <h4>{{ $t('links') }}</h4>
      <ul>
        <li><small><a href="https://github.com/CSSEGISandData/COVID-19">{{ $t('linkJohnsHopkinsUniversity') }}</a></small></li>
        <li><small><a href="https://en.wikipedia.org/wiki/Logistic_function">{{ $t('linkVerhulst') }}</a></small></li>
      </ul>
    </div>


  </div>
</template>

<script>
  import LineChart from './LineChart.vue';
  import TwoLinesChart from './TwoLinesChart.vue';
  import axios from 'axios';
  import moment from 'moment';
  import {createForecastData, createForecastDataVerhulst} from './forecastdata';
  import getCountries, { preselectedCountry } from '@/assets/countries';
  import doubleSmoothing from '@/math/smoothing';


  export default {
    name: 'ChartContainer',
    components: {LineChart, TwoLinesChart},
    data: () => ({
      loaded: false,
      loadedForecastConfirmed: false,
      loadedForecastDeaths: false,
      loading: false,
      showError: false,
      showEndDate: false,
      isEndDateInPast: false,
      endDate: '',
      errorMessage: '',
      labels: [],
      forecastLabels: [],
      confirmed: [],
      deaths: [],
      newConfirmed: [],
      newDeaths: [],
      confirmedSmoothing: [],
      newConfirmedSmoothing: [],
      deathsSmoothing: [],
      newDeathsSmoothing: [],
      forecastData: null,
      forecastNewConfirmed: [],
      forecastChartData: null,
      forecastDataVerhulstConfirmed: null,
      forecastDataVerhulstDeaths: null,
      forecastVerhulstConfirmed: [],
      forecastVerhulstNewConfirmed: [],
      forecastVerhulstDeaths: [],
      forecastVerhulstNewDeaths: [],
      labelsVerhulst: [],
      labelConfirmed: 'Infected (total)',
      labelDeaths: 'Deaths (total)',
      labelNewConfirmed: 'Infected (daily)',
      labelNewDeaths: 'Deaths (daily)',
      labelForecast: 'Forecast',
      countries: getCountries
    }),
    mounted () {
      this.loaded = false;
      this.loadedForecastConfirmed = false;
      this.loadedForecastDeaths = false;
      this.requestData();
    },
    methods: {
      resetState () {
        this.loaded = false;
        this.loadedForecastConfirmed = false;
        this.loadedForecastDeaths = false;
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
            this.loaded = true;
/*
            this.forecastData = createForecastData(this.newConfirmed, 30, 'linear');
            this.forecastNewConfirmed = this.forecastData.arrayForecastCalculated;
            this.forecastLabels = this.forecastData.labels;
            this.showEndDate = this.forecastData.showEndDate;
            this.isEndDateInPast = this.forecastData.isEndDateInPast;
            this.endDate = this.forecastData.endDate;
*/
            this.newConfirmedSmoothing = doubleSmoothing(this.newConfirmed);
            this.confirmedSmoothing = doubleSmoothing(this.confirmed);
            this.deathsSmoothing = doubleSmoothing(this.deaths);
            this.newDeathsSmoothing = doubleSmoothing(this.newDeaths);

            this.forecastDataVerhulstConfirmed = createForecastDataVerhulst(this.confirmedSmoothing, this.newConfirmedSmoothing, this.newConfirmed, null);
            this.forecastVerhulstConfirmed = this.forecastDataVerhulstConfirmed.arrayN;
            this.forecastVerhulstNewConfirmed = this.forecastDataVerhulstConfirmed.arrayDN;
            this.labelsVerhulst = this.labels.slice().concat(this.forecastDataVerhulstConfirmed.labels);
            this.showEndDate = this.forecastDataVerhulstConfirmed.showEndDate;
            this.isEndDateInPast = this.forecastDataVerhulstConfirmed.isEndDateInPast;
            this.endDate = this.forecastDataVerhulstConfirmed.endDate;
            this.loadedForecastConfirmed = true;

            this.forecastDataVerhulstDeaths = createForecastDataVerhulst(this.deathsSmoothing, this.newDeathsSmoothing, this.newDeaths, null);
            this.forecastVerhulstDeaths = this.forecastDataVerhulstDeaths.arrayN;
            this.forecastVerhulstNewDeaths = this.forecastDataVerhulstDeaths.arrayDN;
            this.loadedForecastDeaths = true;

            this.loading = false;
          })
          .catch(err => {
            console.log('error: ' + err.message);
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
