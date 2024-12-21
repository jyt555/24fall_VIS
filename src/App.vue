<template>
  <div id="app">
    <Header />
    <div class="layout">
      <div class="filters">
        <!-- 过滤器部分 -->
        <Filters 
          :movies="movies" 
          v-model="filters" 
          @filter="applyFilters" 
        />
        
        <!-- 搜索框：将其放置到最右边 -->
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search Movies" 
          class="search-box" 
        />
        
        <!-- 重置按钮 -->
        <button @click="resetFilters" class="resetBtn">Reset</button>
      </div>
      <div class="main-content">
        <div class="charts">
          <!-- 渲染 ScatterChart 组件 -->
          <ScatterChart
            v-for="(label, index) in yLabels"
            :key="index"
            :movies="filteredMovies"
            :yLabel="label"
            :class="getChartClass(index)"
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
import EventBus from './EventBus.js';

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
      },
      chooseChart: -1, // 选择的散点图 -1: 平均视图，0-3: 各个散点图
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
    // 生成随机颜色:粉紫色系
    // getRandomColor() {
    //   const r = Math.floor(Math.random() * 100) + 155;
    //   const g = Math.floor(Math.random() * 100);
    //   const b = Math.floor(Math.random() * 100) + 100;
    //   return `rgb(${r},${g},${b})`;
    // },

    // 根据电影名称的hash值生成随机颜色，使每部电影的颜色固定
    getRandomColor(movieName) {
      const hash = this.hashCode(movieName);
      // console.log('Movie name:', movieName, 'Hash:', hash); // 测试
      const r = parseInt(hash.slice(2, 4), 16);
      const g = parseInt(hash.slice(3, 5), 16);
      const b = parseInt(hash.slice(4, 6), 16);
      // 返回透明度alpha=0.5的颜色
      return `rgba(${r},${g},${b},0.5)`;
    },
    hashCode(str) {
      let hash = 0;
      if (str.length === 0) return hash;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return hash.toString(16).padStart(6, '3');  // 转为6位十六进制数，不足6位前面补
    },

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
                  // 为每部电影分配随机颜色
                  this.movies = results.data.map(movie => {
                    return {
                      ...movie,
                      color: this.getRandomColor(movie.Series_Title) // color tag
                    };
                  });
                  console.log('Movies data loaded with colors:', this.movies);
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
    },

    // 根据散点图的索引获取类名
    getChartClass(index) {
      if (this.chooseChart === -1) {
        return 'chart-avg';
      } else {
        switch (this.chooseChart) {
          case 0:
              if (index === 0) return 'chart-large-0';
              if (index === 1) return 'chart-small-12';
              if (index === 2) return 'chart-small-15';
              if (index === 3) return 'chart-small-16';
              break;
          case 1:
              if (index === 0) return 'chart-small-9';
              if (index === 1) return 'chart-large-1';
              if (index === 2) return 'chart-small-13';
              if (index === 3) return 'chart-small-14';
              break;
          case 2:
              if (index === 0) return 'chart-small-3';
              if (index === 1) return 'chart-small-4';
              if (index === 2) return 'chart-large-2';
              if (index === 3) return 'chart-small-8';
              break;
          case 3:
              if (index === 0) return 'chart-small-1';
              if (index === 1) return 'chart-small-2';
              if (index === 2) return 'chart-small-5';
              if (index === 3) return 'chart-large-3';
              break;
          default: return 'chart-small';
        }
      }
    },
  },
  created() {
    EventBus.on('ChooseChart', (chooseChart) => {
      this.chooseChart = chooseChart;
    });
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

.resetBtn {
  background-color: #b87bc4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.resetBtn:hover {
  background-color: #9a4ea8;
}
.resetBtn:active {
  background-color: #7c278d;
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
  grid-template-columns: repeat(4, 25%); /* 四列布局，每列占 25% */
  grid-template-rows: repeat(4, auto); /* 每行自适应高度 */
  gap: 20px;
  width: 70%;
}
.chart-avg {
  grid-column: span 2;
  grid-row: span 2;
}
.chart-large-0 {
  grid-column: 1 / 4;
  grid-row: 1 / 4;
}
.chart-large-1 {
  grid-column: 2 / 5;
  grid-row: 1 / 4;
}
.chart-large-2 {
  grid-column: 1 / 4;
  grid-row: 2 / 5;
}
.chart-large-3 {
  grid-column: 2 / 5;
  grid-row: 2 / 5;
}
.chart-small-12 {
  grid-column: 4 / 5;
  grid-row: 3 / 4;
}
.chart-small-15 {
  grid-column: 3 / 4;
  grid-row: 4 / 5;
}
.chart-small-16 {
  grid-column: 4 / 5;
  grid-row: 4 / 5;
}
.chart-small-9 {
  grid-column: 1 / 2;
  grid-row: 3 / 4;
}
.chart-small-13 {
  grid-column: 1 / 2;
  grid-row: 4 / 5;
}
.chart-small-14 {
  grid-column: 2 / 3;
  grid-row: 4 / 5;
}
.chart-small-3 {
  grid-column: 3 / 4;
  grid-row: 1 / 2;
}
.chart-small-4 {
  grid-column: 4 / 4;
  grid-row: 1 / 2;
}
.chart-small-8 {
  grid-column: 4 / 5;
  grid-row: 2 / 3;
}
.chart-small-1 {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}
.chart-small-2 {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
}
.chart-small-5 {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}
/* .chart-small {
  grid-column: span 1;
  grid-row: span 1;
} */


.moviesList {
  width: 300px;
  background-color: rgba(235, 181, 235, 0.2);
  /* border: 2px solid rgba(235, 181, 235, 0.3); */
  flex-shrink: 0; /* 防止它被压缩 */
  align-self: flex-start; /* 确保它在顶部显示 */
  margin-left: auto; /* 将电影列表推到最右边 */
  height: 80vh;
  overflow-y: auto;  /* 滚动条 */
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
