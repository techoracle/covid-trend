<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'app',
    computed: mapState(['locale']),
    watch: {
      locale() {
        this.$router.replace({ params: { lang: this.locale } }).catch(() => {})
      }
    },
    created() {
      this.$store.dispatch('changeLocale', this.$store.state.locale)
    }
  }
</script>

<style>
  body {
    background: white;
  }

  @keyframes colorchange
  {
    0%   {background: #9b59b6;}
    25%  {background: #f1c40f;}
    50%  {background: #3498db;}
    75%  {background: #1abc9c;}
    100% {background: #9b59b6;}
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .Chart h2 {
    margin-top: 0;
    padding: 15px 0;
    color:  rgba(255, 0,0, 0.5);
    border-bottom: 1px solid #323d54;
  }

</style>
