<template>  
  <div class="charts">  
    <BarChart :data="barChartData" />  
    <LineChart :data="lineChartData" />  
  </div>  
</template>  

<script>  
import { Bar, Line } from 'vue-chartjs';  
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, LineElement, CategoryScale, LinearScale } from 'chart.js';  

ChartJS.register(Title, Tooltip, Legend, BarElement, LineElement, CategoryScale, LinearScale);  

export default {  
  name: 'ChartsComponent',
  components: {  
    BarChart: Bar,  
    LineChart: Line  
  },  
  props: ['movies'],  
  computed: {  
    barChartData() {  
      // 计算评分分布数据  
      const labels = ['0-2', '2-4', '4-6', '6-8', '8-10'];  
      const data = Array(5).fill(0);  
      this.movies.forEach(movie => {  
        const rating = parseFloat(movie.IMDBRating);  
        if (rating < 2) data[0]++;  
        else if (rating < 4) data[1]++;  
        else if (rating < 6) data[2]++;  
        else if (rating < 8) data[3]++;  
        else data[4]++;  
      });  
      return {  
        labels,  
        datasets: [{  
          label: 'Number of Movies',  
          data,  
          backgroundColor: 'rgba(75, 192, 192, 0.6)'  
        }]  
      };  
    },  
    lineChartData() {  
      // 计算发行年份趋势数据  
      const years = [...new Set(this.movies.map(movie => movie.ReleasedYear))].sort();  
      const data = years.map(year => this.movies.filter(movie => movie.ReleasedYear === year).length);  
      return {  
        labels: years,  
        datasets: [{  
          label: 'Movies Released',  
          data,  
          fill: false,  
          borderColor: 'rgba(153, 102, 255, 1)',  
          tension: 0.1  
        }]  
      };  
    }  
  }  
};  
</script>  

<style>  
.charts {  
  width: 100%;  
}  
</style>