<template>
  <nav>
    <ul>
      <li><router-link to="/">Accueil</router-link></li>
      <li><router-link to="/directory">Annuaire</router-link></li>
      <li><router-link to="/ai">IA</router-link></li>
      <li><router-link to="/statistics">Statistiques</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'NavigationBar'
};
</script>

<style scoped>
nav {
  background-color: var(--dhl-red);
  color: var(--dhl-white);
  padding: 1rem;
}
ul {
  list-style: none;
  display: flex;
  justify-content: space-around;
  padding: 0;
}
li {
  margin: 0 1rem;
}
a {
  color: var(--dhl-white);
  text-decoration: none;
}
</style>
