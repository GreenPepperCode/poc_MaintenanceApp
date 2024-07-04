<template>
    <div>
      <div>
        <button @click="toggleView">{{ viewType === 'week' ? 'Vue Mensuelle' : 'Vue Hebdomadaire' }}</button>
        <button @click="prev">Précédent</button>
        <button @click="next">Suivant</button>
      </div>
      <div v-if="viewType === 'week'">
        <!-- Afficher le calendrier hebdomadaire -->
      </div>
      <div v-else>
        <!-- Afficher le calendrier mensuel -->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        viewType: 'week'
      };
    },
    methods: {
      toggleView() {
        this.viewType = this.viewType === 'week' ? 'month' : 'week';
      },
      prev() {
        // Logique pour naviguer vers la semaine ou le mois précédent
      },
      next() {
        // Logique pour naviguer vers la semaine ou le mois suivant
      }
    }
  };
  </script>
  
  <style scoped>
  button {
    background-color: var(--dhl-yellow);
    border: none;
    color: var(--dhl-black);
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 1rem;
  }
  
  button:hover {
    background-color: var(--dhl-red);
    color: var(--dhl-white);
  }
  </style>
  