<template>
  <div class="container">
    <h1>{{ $t('about') }} </h1>

    <p>{{ $t('aboutTargetPart1') }}</p>
    <p>{{ $t('aboutTargetPart2') }}</p>
    <p>{{ $t('aboutTargetPart3') }} <a href="https://github.com/techoracle/covid-trend">{{ $t('github') }}</a> </p>

    <p>{{ $t('feedback') }}
      <a href="mailto:info@covid-trend.info">{{ $t('here') }}</a>.
    </p>
  </div>


</template>
<script>

  export default {
    name: 'About',
    components: {

    }
  }
</script>
