<template>
  <div>
    <h2>IMDB Rating vs {{ yLabel }}</h2>
    <!-- 使用 scatterChartData -->
    <Scatter :data="scatterChartData" />
  </div>
</template>

<script>
import { Scatter } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ScatterController, LinearScale, PointElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ScatterController, LinearScale, PointElement);

export default {
  components: {
    Scatter
  },
  props: {
    movies: Array,
    yLabel: String
  },
  computed: {
    scatterChartData() {
      // 如果 movies 为空或未加载，返回一个空的对象
      if (!this.movies || this.movies.length === 0) {
        return { datasets: [] };
      }

      const data = {
        datasets: []
      };

      const dataset = {
        label: 'Movies',
        data: this.movies.map(movie => {
          const imdbRating = parseFloat(movie.IMDB_Rating);
          const yValue = this.getYValue(movie);
          const color = "#66ccff"
          // 过滤掉非法数据
          if (isNaN(imdbRating) || isNaN(yValue)) {
            return null; // 返回 null 以排除掉无效数据
          }
          return {
            x: imdbRating,  // 使用 IMDB_Rating 作为 X 轴数据
            y: yValue,      // 根据 yLabel 来获取 Y 轴数据
            pointBackgroundColor: color
          };
        }).filter(item => item !== null), // 过滤掉 null 值
        pointRadius: 5
      };

      data.datasets.push(dataset);
      return data;
    }
  },
  methods: {
    getYValue(movie) {
      switch (this.yLabel) {
        case 'Gross Earning':
          return parseFloat(movie.Gross); // 去掉非数字字符
        case 'Released Year':
          return parseInt(movie.Released_Year);
        case 'Runtime':
          return parseInt(movie.Runtime);
        case 'No of Votes':
          return parseInt(movie.No_of_Votes);
        default:
          return 0;
      }
    },
  }
};
</script>

<style scoped>
.scatter-chart {
  width: 100%;
  height: 400px;
}
</style>
