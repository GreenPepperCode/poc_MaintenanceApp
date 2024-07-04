<template>
    <div>
      <button @click="showAddProviderModal">Ajouter un Prestataire</button>
      <ul>
        <li v-for="provider in providers" :key="provider.id">
          {{ provider.name }} - {{ provider.phone }} - {{ provider.email }}
          <button @click="editProvider(provider)">Modifier</button>
        </li>
      </ul>
      <AddProviderModal v-if="isAddProviderModalVisible" @close="hideAddProviderModal" />
    </div>
  </template>
  
  <script>
  import AddProviderModal from './AddProviderModal.vue';
  
  export default {
    components: { AddProviderModal },
    data() {
      return {
        providers: [],
        isAddProviderModalVisible: false
      };
    },
    created() {
      this.fetchProviders();
    },
    methods: {
      fetchProviders() {
        // Logique pour récupérer les prestataires
      },
      showAddProviderModal() {
        this.isAddProviderModalVisible = true;
      },
      hideAddProviderModal() {
        this.isAddProviderModalVisible = false;
      },
      editProvider(provider) {
        // Logique pour éditer le prestataire
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
    margin: 0.5rem 0;
  }
  
  button:hover {
    background-color: var(--dhl-red);
    color: var(--dhl-white);
  }
  </style>
  