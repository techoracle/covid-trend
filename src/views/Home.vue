<template>
  <div id="app">

    <div class="container">
      <lang-dropdown class="rightAlign"></lang-dropdown>
      <h1>{{ $t('title') }} </h1>
      <small>{{ $t('titleDescription') }}</small>
      <p></p>
      <chart-container
        :component-type="compType"
        :countries-list="countries"
        :preselected-item="preselected"
        :store-change="storeChangeAction">

      </chart-container>

      <br>
      <div class="leftAlign">
        <h4>{{ $t('links') }}</h4>
        <ul>
          <li>
            <small><a href="https://github.com/CSSEGISandData/COVID-19">{{ $t('linkJohnsHopkinsUniversity') }}</a>
            </small>
          </li>
          <li>
            <small><a href="https://en.wikipedia.org/wiki/Logistic_function">{{ $t('linkVerhulst') }}</a></small>
          </li>
          <li>
            <small><a href="/#/en/us">{{ $t('usTitle') }}</a></small>
          </li>
          <li>
            <small><a href="/#/ru/russia">{{ $t('ruTitle') }}</a></small>
          </li>
        </ul>
      </div>

    </div>

    <footer class="footer mt-auto py-3">
      <div class="container">

        <div class="table-responsive">
          <table cellspacing="0" cellpadding="0" class="table table-sm">
            <tr>
              <td class="leftAlign">© 2020 <a href="https://covid-trend.info">covid-trend.info</a>
                ({{ $t('licensedUnder') }}
                <a href="https://github.com/techoracle/covid-trend/blob/master/LICENSE">MIT</a>)
              </td>
              <td align="right">
                <router-link :to="{ name: 'about' }"> {{ $t('about') }} </router-link>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </footer>

  </div>
</template>

<script>
  import ChartContainer from '../components/ChartContainer.vue';
  import LangDropdown from '../components/LangDropdown.vue';
  import getCountries, {preselectedCountry} from '../assets/countries';


  export default {
    name: 'app',
    components: {
      ChartContainer,
      LangDropdown
    },
    data: () => ({
      compType: 'global',
      countries: getCountries,
      storeChangeAction: 'changeCountry'
    }),
    computed: {
      preselected: {
        get: function () {
          return this.$store.state.country || preselectedCountry;
        },
        set: function (newVal) {
          this.$store.dispatch('changeCountry', newVal)
        }
      }
    }
  }
</script>

<style>
  body {
    background: white;
  }

  @keyframes colorchange {
    0% {
      background: #9b59b6;
    }
    25% {
      background: #f1c40f;
    }
    50% {
      background: #3498db;
    }
    75% {
      background: #1abc9c;
    }
    100% {
      background: #9b59b6;
    }
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;

    color: rgba(155, 89, 182, 1);
  }

  .Chart {
    background: #eff;
    border-radius: 15px;
    box-shadow: 0px 2px 15px rgba(25, 25, 25, 0.27);
    margin: 25px 0;
  }

  .Chart h2 {
    margin-top: 0;
    padding: 15px 0;
    color: rgba(255, 0, 0, 0.5);
    border-bottom: 1px solid #323d54;
  }

  .rightAlign {
    text-align: right;
    margin-top: 0px;
  }

  .leftAlign {
    text-align: left;
    margin-top: 0px;
  }

  .goodNewsBg {
    background: #aff;
  }

  .withOffsetTop {
    margin-top: 4px;
  }

  a {
    text-decoration: underline;
  }

</style>
