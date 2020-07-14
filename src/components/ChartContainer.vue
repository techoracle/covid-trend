<template>
  <div class="container">

    <select class="custom-select d-block w-100" v-model="selectedCountry" @change="requestData">
      <option v-for="country in countries" v-bind:value="country.Slug"
              :selected="country.Country == 'Germany'">{{ country.Country }}
      </option>
    </select>

    <div v-if="showEndDate" class="table-responsive withOffsetTop">
      <table class="table table-striped table-sm">
        <tr>
          <td class="leftAlign goodNewsBg">{{ $t('forecastApproxEndDay') }}</td>
          <td class="rightAlign goodNewsBg"><b>{{ endDate }}</b><b v-if="isEndDateInPast">{{ $t('alreadyReached')
            }} </b></td>
        </tr>
      </table>
    </div>

    <div class="Chart">
      <h2>{{ $t('infectedTotal') }}</h2>
      <line-chart
        v-if="loaded"
        :chart-data="confirmed"
        :chart-labels="labelsTotal"
        :data-label="$t('infectedTotal')"
      />
    </div>

    <div class="Chart">
      <h2>{{ $t('infectedDaily') }}</h2>
      <two-lines-chart
        v-if="loaded"
        :chart-labels="labelsDaily"
        :chart-data-first="newConfirmed"
        :data-label-first="$t('infectedDaily')"
        :chart-data-second="newConfirmedSmoothing"
        :data-label-second="$t('averageValue')"
      />
    </div>

    <div class="Chart">
      <h2>{{ $t('infectedAccelerator') }}</h2>

        {{ $t('explainAccelaration') }}


      <two-lines-chart
        v-if="loaded"
        :chart-labels="labelsAccelerator"
        :chart-data-first="acceleratorConfirmed"
        :data-label-first="$t('infectedAccelerator')"
        :chart-data-second="acceleratorConfirmedSmoothing"
        :data-label-second="$t('averageValue')"
      />
    </div>


    <div class="Chart">
      <h2>{{ $t('deathsTotal') }}</h2>
      <two-lines-chart
        v-if="loaded"
        :chart-labels="labelsTotal"
        :chart-data-first="deaths"
        :data-label-first="$t('deathsTotal')"
        :chart-data-second="deathsSmoothing"
        :data-label-second="$t('averageValue')"
      />
    </div>


    <div class="Chart">
      <h2>{{ $t('deathsDaily') }}</h2>
      <two-lines-chart
        v-if="loaded"
        :chart-labels="labelsDaily"
        :chart-data-first="newDeaths"
        :data-label-first="$t('deathsDaily')"
        :chart-data-second="newDeathsSmoothing"
        :data-label-second="$t('averageValue')"
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
        :chart-labels="labelsVerhulstTotal"
        :chart-data-first="confirmed"
        :data-label-first="$t('infectedTotal')"
        :chart-data-second="forecastVerhulstConfirmed"
        :data-label-second="$t('forecastTotalInfected')"
      />
    </div>

    <!--
    <div class="Chart">
      <h2>{{ $t('forecastDailyInfected') }}</h2>
      <two-lines-chart
        v-if="loadedForecastConfirmed"
        :chart-labels="labelsVerhulstDaily"
        :chart-data-first="newConfirmed"
        :data-label-first="$t('infectedDaily')"
        :chart-data-second="forecastVerhulstNewConfirmed"
        :data-label-second="$t('forecastDailyInfected')"
      />
    </div>
    -->

    <div class="Chart">
      <h2>{{ $t('forecastTotalDeaths') }}</h2>
      <two-lines-chart
        v-if="loadedForecastDeaths"
        :chart-labels="labelsVerhulstTotal"
        :chart-data-first="deaths"
        :data-label-first="$t('deathsTotal')"
        :chart-data-second="forecastVerhulstDeaths"
        :data-label-second="$t('forecastTotalDeaths')"
      />
    </div>

    <!--
    <div class="Chart">
      <h2>{{ $t('forecastDailyDeaths') }}</h2>
      <two-lines-chart
        v-if="loadedForecastDeaths"
        :chart-labels="labelsVerhulstDaily"
        :chart-data-first="newDeaths"
        :data-label-first="labelNewDeaths"
        :chart-data-second="forecastVerhulstNewDeaths"
        :data-label-second="labelForecast"
      />
    </div>
    -->

  </div>
</template>

<script>
  import LineChart from './LineChart.vue';
  import TwoLinesChart from './TwoLinesChart.vue';
  import axios from 'axios';
  import moment from 'moment';
  import {createForecastData, createForecastDataVerhulst} from './forecastdata';
  import getCountries, {preselectedCountry} from '@/assets/countries';
  import {doubleSmoothing, smoothing} from '@/math/smoothing';


  export default {
    name: 'ChartContainer',
    components: {LineChart, TwoLinesChart},
    props: {
      componentType: {
        type: String,
        required: true
      },
      countriesList: {
        type: Array,
        required: true
      },
      preselectedItem: {
        type: String,
        required: true
      },
      storeChange: {
        type: String,
        required: true
      }
    },
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
      labelsTotal: [],
      labelsDaily: [],
      labelsAccelerator: [],
      forecastLabels: [],
      confirmed: [],
      deaths: [],
      newConfirmed: [],
      acceleratorConfirmed: [],
      newDeaths: [],
      confirmedSmoothing: [],
      newConfirmedSmoothing: [],
      acceleratorConfirmedSmoothing: [],
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
      labelsVerhulstTotal: [],
      labelsVerhulstDaily: [],
      labelConfirmed: 'Infected (total)',
      labelDeaths: 'Deaths (total)',
      labelNewConfirmed: 'Infected (daily)',
      labelAcceleratorConfirmed: 'Infected (accelerator)',
      labelNewDeaths: 'Deaths (daily)',
      labelForecast: 'Forecast',
      countries: null,
      currentJsonFile: null
    }),
    mounted () {
      this.loaded = false;
      this.loadedForecastConfirmed = false;
      this.loadedForecastDeaths = false;
      this.countries = this.countriesList;
      this.selectedCountry = this.preselectedItem;
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
        const host = window.location.host;
        const protocol = window.location.href.toString().split(window.location.host)[0];
        const url = protocol + host;

//        axios.get(`https://covid-trend.info/static/datasource/global/${this.selectedCountry}.json`)
//        axios.get(`https://api.covid19api.com/total/dayone/country/${this.selectedCountry}`)
        axios.get(`${url}/static/datasource/${this.componentType}/${this.selectedCountry}.json`)
          .then(response => {
            this.confirmed = response.data.map(entry => entry.Confirmed);
            this.deaths = response.data.map(entry => entry.Deaths);
            this.labelsTotal = response.data.map(entry => this.dateToDay(entry.Date));
            this.labelsDaily = this.labelsTotal.slice(-1 * (this.labelsTotal.length - 1));
            this.labelsAccelerator = this.labelsDaily.slice(-1 * (this.labelsDaily.length - 1));
            this.newConfirmed = this.calculateDayDelta(this.confirmed, false);
            this.newDeaths = this.calculateDayDelta(this.deaths, false);


            /*
             this.forecastData = createForecastData(this.newConfirmed, 30, 'linear');
             this.forecastNewConfirmed = this.forecastData.arrayForecastCalculated;
             this.forecastLabels = this.forecastData.labels;
             this.showEndDate = this.forecastData.showEndDate;
             this.isEndDateInPast = this.forecastData.isEndDateInPast;
             this.endDate = this.forecastData.endDate;
             */

            this.confirmedSmoothing = doubleSmoothing(this.confirmed, false);
            this.newConfirmedSmoothing = doubleSmoothing(this.newConfirmed, false);
            this.deathsSmoothing = doubleSmoothing(this.deaths, false);
            this.newDeathsSmoothing = doubleSmoothing(this.newDeaths, false);
            this.acceleratorConfirmed = this.calculateDayDelta(this.newConfirmedSmoothing, true);
            this.acceleratorConfirmedSmoothing = doubleSmoothing(this.acceleratorConfirmed, true);
            this.loaded = true;

            this.forecastDataVerhulstConfirmed = createForecastDataVerhulst(this.confirmedSmoothing, this.newConfirmedSmoothing, this.newConfirmed, null);
            this.forecastVerhulstConfirmed = this.forecastDataVerhulstConfirmed.arrayN;
            this.forecastVerhulstNewConfirmed = this.forecastDataVerhulstConfirmed.arrayDN;
            this.labelsVerhulstTotal = this.labelsTotal.slice().concat(this.forecastDataVerhulstConfirmed.labels);
            this.labelsVerhulstDaily = this.labelsVerhulstTotal.slice(-1 * (this.labelsVerhulstTotal.length - 1));
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
      requestCountries() {
        let result = [];
        console.log('loading countries');
        axios.get(`https://covid-trend.info/static/datasource/global/countries.json`)
          .then(response => {
            result = response.data;
          })
          .catch(err => {
            console.log('error: ' + err.message);
            this.errorMessage = err.response.data.error;
            this.showError = true;
          });
        return result;
      },
      dateToDay(date) {
        return moment(date).format('YYYY-MM-DD');
      },
      calculateDayDelta(arraySource, withNegative) {
        const result = [];
        for (let i = 1; i <= arraySource.length - 1; i++) {
          let delta = arraySource[i] - arraySource[i - 1];
          result.push(withNegative ? delta : Math.abs(delta));
        }
        return result;
      },
      generateDateLabels(amount) {
        const result = [];
        for (let i = 1; i <= amount; i++) {
          result.push(moment().add(i, 'days').format('YYYY-MM-DD'));
        }
        return result;
      },
      getJsonFile (index) {

        this.currentJsonFile = async () => {
          const runtimeConfig = await fetch('/' + index);
          console.log('runtimeConfig: ' + runtimeConfig);
          return await runtimeConfig.json();
        };

        console.log('currentJsonFile: ' + this.currentJsonFile);
      }
    },
    computed: {
      selectedCountry: {
        get: function () {
          return this.preselectedItem;
        },
        set: function (newVal) {
          this.$store.dispatch(this.storeChange, newVal);
          this.preselectedItem = newVal;
        }
      }
    }
  }
</script>
