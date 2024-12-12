src/components/ScatterChart.vue  
<template>  
    <div>  
      <h2>IMDB Rating vs {{ yLabel }}</h2>  
      <Scatter :chart-data="scatterChartData" />  
    </div>  
  </template>  
  
  <script>  
  import { Scatter } from 'vue-chartjs';  
  import {  
    Chart as ChartJS,  
    Title,  
    Tooltip,  
    Legend,  
    ScatterController,  
    LinearScale,  
    PointElement  
  } from 'chart.js';  
  
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
        const data = {  
          datasets: []  
        };  
  
        const dataset = {  
          label: 'Movies',  
          data: this.movies.map(movie => ({  
            x: parseFloat(movie.IMDBRating),  
            y: this.getYValue(movie),  
            backgroundColor: movie.color || this.getRandomColor()  
          })),  
          pointRadius: 5  
        };  
  
        data.datasets.push(dataset);  
        return data;  
      }  
    },  
    methods: {  
      getYValue(movie) {  
        switch (this.yLabel) {  
          case 'Gross Earnings':  
            return parseFloat(movie.Gross.replace(/[^0-9.-]+/g, ""));  
          case 'Released Year':  
            return parseInt(movie['Released Year']);  
          case 'Runtime':  
            return parseInt(movie.Runtime);  
          case 'No of Votes':  
            return parseInt(movie['No of Votes']);  
          default:  
            return 0;  
        }  
      },  
      getRandomColor() {  
        const letters = '0123456789ABCDEF';  
        let color = '#';  
        for (let i = 0; i < 6; i++) {  
          color += letters[Math.floor(Math.random() * 16)];  
        }  
        return color;  
      }  
    }  
  };  
  </script>  
  
  <style scoped>  
  .scatter-chart {  
    width: 100%;  
    height: 400px;  
  }  
  </style>