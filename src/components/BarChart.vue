<template>  
    <div ref="barChart" style="width: 100%; height: 400px;"></div>  
  </template>  
  
  <script>  
  import * as echarts from 'echarts';  
  
  export default {  
    props: {  
      data: Array,  
    },  
    mounted() {  
      this.initChart();  
    },  
    watch: {  
      data: 'initChart',  
    },  
    methods: {  
      initChart() {  
        const chart = echarts.init(this.$refs.barChart);  
        const genreCounts = this.getGenreCounts(this.data);  
        const option = {  
          tooltip: {  
            trigger: 'item',  
            formatter: params => {  
              return `Genre: ${params.name}<br>Count: ${params.value}`;  
            },  
          },  
          xAxis: {  
            type: 'category',  
            data: Object.keys(genreCounts),  
            name: 'Genre',  
          },  
          yAxis: {  
            type: 'value',  
            name: 'Count',  
          },  
          series: [{  
            data: Object.values(genreCounts),  
            type: 'bar',  
          }],  
        };  
        chart.setOption(option);  
      },  
      getGenreCounts(data) {  
        const counts = {};  
        data.forEach(item => {  
          item.genre.split(', ').forEach(genre => {  
            counts[genre] = (counts[genre] || 0) + 1;  
          });  
        });  
        return counts;  
      },  
    },  
  };  
  </script>  
  
  <style scoped>  
  </style>