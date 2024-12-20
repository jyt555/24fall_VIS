<!-- src/components/MovieList.vue -->  
<template>  
  <div class="movie-list">  
    <h2>Movie List</h2>  
    <div v-for="movie in movies" :key="movie.Series_Title" class="movie-item">
      <div class="movie-content" :class="{ highlighted: movie.Series_Title === highlightMovie }">
        <span :style="{ backgroundColor: movie.color }" class="color-indicator"></span>
        <span>{{ movie.Series_Title }}</span>
      </div>
    </div>
  </div>  
</template>  

<script>  
import EventBus from '../EventBus.js';

export default {  
  props: ['movies'],
  created() {
    EventBus.on('highlightMovie',(movieTitle) => {
      this.highlightMovie = movieTitle;
      // console.log('MovieList:' + this.highlightMovie); // 调试输出
    });
  },
  beforeUnmount() {
    EventBus.off('highlightMovie');
  },
  data() {
    return {
      highlightMovie: ''
    };
  },
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
.highlighted {
  background-color: rgba(235, 181, 235, 0.4); /* 高亮效果 */
}

</style>