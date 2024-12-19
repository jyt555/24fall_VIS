<template>
  <div id="app">
    <Header />
    <div class="layout">
      <div class="filters">
        <!-- 过滤器部分 -->
        <Filters 
          :movies="movies" 
          @filter="applyFilters" 
          :certificate="filters.certificate"
          :director="filters.director"
          :genre="filters.genre"
        />
        
        <!-- 搜索框：将其放置到最右边 -->
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search Movies" 
          class="search-box" 
        />
        
        <!-- 重置按钮 -->
        <button @click="resetFilters">Reset Filters</button>
      </div>
      <div class="main-content">
        <div class="charts">
          <!-- 渲染 ScatterChart 组件 -->
          <ScatterChart
            v-for="(label, index) in yLabels"
            :key="index"
            :movies="filteredMovies"
            :yLabel="label"
          />
        </div>
        <div class="moviesList">
          <!-- 渲染 MovieList 组件 -->
          <MovieList :movies="filteredMovies" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import ScatterChart from './components/ScatterChart.vue';
import Filters from './components/Filters.vue';
import MovieList from './components/MovieList.vue';
import Papa from 'papaparse';
import csvFile from '/public/assets/movies_data.csv';  // 导入 CSV 文件

export default {
  components: {
    Header,
    ScatterChart,
    Filters,
    MovieList
  },
  data() {
    return {
      movies: [],              // 存储所有电影数据
      yLabels: ['Gross Earning', 'Released Year', 'Runtime', 'No of Votes'],  // Y 轴标签
      searchQuery: '',          // 搜索框内容
      filters: {
        certificate: '',
        director: '',
        genre: ''
      }
    };
  },
  computed: {
    // 根据 searchQuery 和 filters 过滤电影
    filteredMovies() {
      return this.movies
        .filter(movie => {
          const title = typeof movie.Series_Title === 'string' ? movie.Series_Title : '';  // 确保是字符串
          return title.toLowerCase().includes(this.searchQuery.toLowerCase());
        })
        .filter(movie => {
          // 根据选择的过滤器筛选电影
          return (
            (this.filters.certificate ? movie.Certificate === this.filters.certificate : true) &&
            (this.filters.director ? movie.Director === this.filters.director : true) &&
            (this.filters.genre ? movie.Genre.includes(this.filters.genre) : true)
          );
        });
    }
  },
  methods: {
    // 加载并解析 CSV 数据
    loadMovies() {
      console.log('Loading CSV data from URL:', csvFile);

      fetch('/assets/movies_data.csv')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then(csvData => {
          Papa.parse(csvData, {
            header: true,
            dynamicTyping: true,
            delimiter: ",",
            quoteChar: '"',
            skipEmptyLines: 'greedy',
            complete: (results) => {
              console.log('Parsed results:', results);
              if (results.errors && results.errors.length > 0) {
                console.error('Parsing errors:', results.errors);
              } else {
                if (results.data.length === 0) {
                  console.error("No data found in CSV file.");
                } else {
                  this.movies = results.data;
                  console.log('Movies data loaded:', this.movies);
                }
              }
            },
            error: (error) => {
              console.error("Error parsing CSV:", error);
            }
          });
        })
        .catch(error => {
          console.error('Error fetching CSV file:', error);
        });
    },

    // 应用过滤器
    applyFilters(filters) {
      this.filters = filters; // 更新过滤器状态
      console.log('Applied filters:', this.filters);  // 打印当前过滤器状态
    },

    // 重置过滤器
    resetFilters() {
      this.filters = {
        certificate: '',
        director: '',
        genre: ''
      };
      this.searchQuery = ''; // 重置搜索框
      console.log('Filters reset');  // 打印重置状态
    }
  },
  mounted() {
    this.loadMovies();  // 在组件挂载时加载电影数据
  }
};
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  background-color: rgba(247, 202, 247, 0.3);
}

.filters {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-height: 50px;
  background-color: rgba(235, 181, 235, 0.3);
  min-height: 50px;
}

.search-box {
  margin-left: auto;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
}

.main-content {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 20px;  /* 给左右间距 */
  align-items: flex-start;  /* 保证左边和右边对齐 */
}

.charts {
  display: grid;
  grid-template-columns: repeat(2, 45%); /* 两列布局，每列占 45% */
  grid-template-rows: repeat(2, auto); /* 每行自适应高度 */
  gap: 20px;
  width: 70%;  /* 增大图表区域宽度，确保图表能填满更多空间 */
}

.moviesList {
  width: 300px;
  background-color: rgba(235, 181, 235, 0.3);
  flex-shrink: 0; /* 防止它被压缩 */
  align-self: flex-start; /* 确保它在顶部显示 */
  margin-left: auto; /* 将电影列表推到最右边 */
}

button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #f4a261;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #e76f51;
}
</style>
