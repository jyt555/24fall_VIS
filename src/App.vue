<!-- src/App.vue -->  
<template>  
  <div id="app">  
    <Header />  
    <div class="layout">  
      <!-- <div class="filters">  
        <Filters :movies="movies" @filter="applyFilters" />  
      </div>  
      <div class="main-content">
        <div class="charts">  
          <ScatterChart v-for="(label, index) in yLabels" :key="index" :movies="filteredMovies" :yLabel="label" />  
        </div>  
        <div class="moviesList">  
          <MovieList :movies="filteredMovies" />  
        </div>
      </div> -->
      <!-- <TestMovie />   -->
    </div>  
  </div>  
</template>  

<script>  
import Header from './components/Header.vue';  
// import ScatterChart from './components/ScatterChart.vue';  
// import Filters from './components/Filters.vue';  
// import MovieList from './components/MovieList.vue';  
// import TestMovie from './components/TestMovie.vue';
// import Papa from 'papaparse';  
import csvFile from '@/assets/imdb_top_1000.csv';

export default {  
  components: {  
    Header
    // ScatterChart,  
    // Filters,  
    // MovieList
    // TestMovie
  },  
  data() {  
    return {  
      movies: [],  
      filteredMovies: [],  
      yLabels: ['Gross Earnings', 'Released Year', 'Runtime', 'No of Votes']  
    };  
  },  
  methods: {  
    loadMovies() {  
      console.log('Loading movies');  // test  
      console.log('csvFile: ',csvFile);  // test1  
      // // 使用 PapaParse 解析 CSV 数据
      // const file = new File([csvFile], 'imdb_top_1000.csv', {type: 'text/csv'});
      // Papa.parse(file, {  
      //   header: true,  
      //   dynamicTyping: true,  
      //   delimiter: ",",  
      //   complete: (results) => {  
      //     console.log('results: ',results);  // test3
      //     // 解析后的数据  
      //     this.movies = results.data.map(movie => ({  
      //       Poster_Link: movie.Poster_Link,  
      //       Series_Title: movie.Series_Title,  
      //       Released_Year: movie.Released_Year,  
      //       Certificate: movie.Certificate,  
      //       Runtime: movie.Runtime,  
      //       Genre: movie.Genre,  
      //       IMDB_Rating: movie.IMDB_Rating,  
      //       Overview: movie.Overview,  
      //       Meta_score: movie.Meta_score,  
      //       Director: movie.Director,  
      //       Star1: movie.Star1,  
      //       Star2: movie.Star2,  
      //       Star3: movie.Star3,  
      //       Star4: movie.Star4,  
      //       No_of_Votes: movie.No_of_Votes,  
      //       Gross: movie.Gross  
      //     }));  
      //     console.log('movies: ',this.movies);  // test2
      //   },  
      //   error: (error) => {  
      //     console.error("Error parsing CSV:", error);  
      //   }  
      // });  
      // if (!(csvFile instanceof String)) {
      //   console.error('csvFile is not a String');
      //   return;
      // }
      fetch(csvFile)
       .then(response => response.text())
       .then(csvData => {
        const results = this.parseCSV(csvData);

        console.log('results: ', results); // test5

        this.movies = results.map((movie) => ({
          Poster_Link: movie.Poster_Link,
          Series_Title: movie.Series_Title,
          Released_Year: movie.Released_Year,
          Certificate: movie.Certificate,
          Runtime: movie.Runtime,
          Genre: movie.Genre,
          IMDB_Rating: movie.IMDB_Rating,
          Overview: movie.Overview,
          Meta_score: movie.Meta_score,
          Director: movie.Director,
          Star1: movie.Star1,
          Star2: movie.Star2,
          Star3: movie.Star3,
          Star4: movie.Star4,
          No_of_Votes: movie.No_of_Votes,
          Gross: movie.Gross,
        }));
        console.log('movies: ', this.movies); // test4
      })
      .catch(error => {
        console.error("Error fetching CSV:", error);
      });
    },  
    parseCSV(csvData) {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',');
      const data = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length === headers.length) {
          const obj = {};
          for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = values[j];
          }
          data.push(obj);
        }
      }
      return data;
    },  
    applyFilters(filters) {  
      this.filteredMovies = this.movies.filter(movie => {  
        return (  
          (filters.certificate ? movie.Certificate === filters.certificate : true) &&  
          (filters.director ? movie.Director === filters.director : true) &&  
          (filters.genre ? movie.Genre.includes(filters.genre) : true)  
        );  
      });  
    },  
    getRandomColor() {  
      const letters = '0123456789ABCDEF';  
      let color = '#';  
      for (let i = 0; i < 6; i++) {  
        color += letters[Math.floor(Math.random() * 16)];  
      }  
      return color;  
    }  
  },  
  mounted() {  
    console.log('App mounted');  // test  
    this.loadMovies(); // 组件挂载后加载数据 
  }  
};  
</script>  

<style>  
.layout {  
  display: flex;  
  flex-direction: column;  
  background-color: rgba(247, 202, 247, 0.3);
}  
  
.filters {  
  display: flex;  
  flex-direction: row;  
  align-items: center;  
  max-height: 50px;  
  background-color: rgba(235, 181, 235, 0.3);
}  

.main-content {  
  display: flex;  
  flex-direction: row;  
  align-items: stretch;  
  justify-content: space-between;  
}  
.charts {  
  display: flex;  
  flex-direction: column;  
  align-items: center;  
  margin-top: 20px;   
  flex: 1;
  margin-right: 20px;
}  
.moviesList {  
  width: 300px;
  background-color: rgba(235, 181, 235, 0.3);
}
</style>