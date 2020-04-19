<template>
  <div id="app">

    <div class="container">
      <lang-dropdown class="rightAlign"></lang-dropdown>
      <h1>{{ $t('title') }} </h1>
      <small>{{ $t('titleDescription') }}</small>
      <p></p>
      <chart-container></chart-container>
    </div>


    <footer class="footer mt-auto py-3">
      <div class="container">
        <!--
        <div class="leftAlign">
          <span class="text-muted ">Questions? Mail to <a href="mailto:bewsof@yahoo.de">admin</a>.</span>
        </div>
        -->
        <div class="rightAlign">
          <router-link :to="{ name: 'about' }"> {{ $t('about') }} </router-link>
        </div>
      </div>
    </footer>


  </div>
</template>

<script>
  import ChartContainer from '../components/ChartContainer.vue';
  import LangDropdown from '../components/LangDropdown.vue'

  export default {
    name: 'app',
    components: {
      ChartContainer,
      LangDropdown
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
