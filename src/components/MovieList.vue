<!-- src/components/MovieList.vue -->  
<template>  
  <div class="movie-list">  
    <h2>Movie List</h2>  
    <div v-for="movie in movies" :key="movie.Series_Title" class="movie-item">
      <div class="movie-content">
        <span :style="{ backgroundColor: movie.color }" class="color-indicator"></span>
        <span>{{ movie.Series_Title }}</span>
      </div>
    </div>
  </div>  
</template>  

<script>  
export default {  
  props: ['movies']  
};  
</script>  

<style scoped>  
.movie-list {  
  max-width: 300px;  
  margin-left: 20px;  
}  
.movie-item {  
  display: flex;  
  align-items: center;  
}  
.movie-content {  
  display: flex;  
  align-items: center;
  flex-grow: 1;
}  
.color-indicator {  
  width: 10px;  
  height: 10px;  
  border-radius: 50%;  
  margin-right: 8px;  
  flex-shrink: 0; /* 防止元素被压缩 */  
}  
</style>