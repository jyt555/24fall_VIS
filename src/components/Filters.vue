<!-- src/components/Filters.vue -->  
<template>  
  <div class="filters">  
    <select v-model="selectedCertificate" @change="applyFilters">  
      <option value="">Select Certificate</option>  
      <option v-for="cert in uniqueCertificates" :key="cert" :value="cert">{{ cert }}</option>  
    </select>  
    <select v-model="selectedDirector" @change="applyFilters">  
      <option value="">Select Director</option>  
      <option v-for="dir in uniqueDirectors" :key="dir" :value="dir">{{ dir }}</option>  
    </select>  
    <select v-model="selectedGenre" @change="applyFilters">  
      <option value="">Select Genre</option>  
      <option v-for="gen in uniqueGenres" :key="gen" :value="gen">{{ gen }}</option>  
    </select>  
  </div>  
</template>  

<script>  
import EventBus from '../EventBus.js';

export default {  
  name: 'FiltersComponent',
  props: {  
    movies: Array  
  },  
  data() {  
    return {  
      selectedCertificate: '',  
      selectedDirector: '',  
      selectedGenre: '' ,
    };  
  },  
  computed: {  
    uniqueCertificates() {  
      return [...new Set(this.movies.map(movie => movie.Certificate))];  
    },  
    uniqueDirectors() {  
      return [...new Set(this.movies.map(movie => movie.Director))];  
    },  
    uniqueGenres() {  
      return [...new Set(this.movies.map(movie => movie.Genre))];  
    }  
  },  
  methods: {  
    applyFilters() {  
      this.$emit('filter', {  
        certificate: this.selectedCertificate,  
        director: this.selectedDirector,  
        genre: this.selectedGenre  
      });  
    }  
  },
  created() {
    EventBus.on('ResetFilters', () => {
      this.selectedCertificate = '';
      this.selectedDirector = '';
      this.selectedGenre = '';
    })
  },
};  
</script>  

<style scoped>  
.filters {  
  display: flex;  
  justify-content: center;  
  margin: 30px;  
}  
select {  
  margin: 0 10px; 
  border-radius: 4px;
  /* padding: 5px;   */
}  
.search-title {
  /* 位置固定，与最右侧间隔100px */
  position: absolute;
  right: 50px;
  width: 200px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  padding: 5px;
  text-align: center;
}

.search-title:focus {
  border: 2px solid #e9abeb;
  outline: none;
}  
</style>