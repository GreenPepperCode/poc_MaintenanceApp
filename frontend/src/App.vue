<template>
  <div id="app">
    <NavigationBar />
    <router-view/>
  </div>
</template>

<script>
import NavigationBar from './components/NavigationBar.vue';

export default {
  components: {
    NavigationBar
  }
};
</script>

<style scoped>
/* Ajoutez les styles spécifiques au composant ici si nécessaire */
</style>
