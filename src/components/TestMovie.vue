<template>  
  <div>  
    <h1>IMDB Movies</h1>  
    <div v-if="movies.length">  
      <ul>  
        <li v-for="movie in movies" :key="movie.Series_Title">  
          <strong>{{ movie.Series_Title }}</strong> - IMDB Rating: {{ movie.IMDB_Rating }}  
          <p>Released Year: {{ movie.Released_Year }}</p>  
          <p>Overview: {{ movie.Overview }}</p>  
        </li>  
      </ul>  
    </div>  
    <div v-else>  
      <p>Loading movies...</p>  
    </div>  
  </div>  
</template>  

<script>  
import Papa from 'papaparse';  
// import csvFile from '@/assets/imdb_top_1000.csv'; // 使用 import 语句导入 CSV 文件
// import axios from 'axios';

export default {  
  data() {  
    return {  
      movies: [] // 用于存储解析后的电影数据  
    };  
  },  
  mounted() {  
    console.log("Component mounted"); // 这里是测试代码  
    this.loadCSV(); // 组件挂载后加载 CSV  
  },  
  methods: {  
    loadCSV() {
        console.log("Loading CSV..."); // 这里是测试代码  
        const csvFile = new URL('../assets/imdb_top_1000.csv', import.meta.url);
        console.log("csvFile:" + csvFile); // 调试信息
        fetch(csvFile)
            // .then(response => response.text())
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();
            })
            .then(text => {
            Papa.parse(text, {
                download: false,
                header: true,
                complete: (results) => {
                console.log("Parsed Data:", results.data); // 调试信息
                this.movies = results.data.map(movie => ({
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
                    Gross: movie.Gross
                }));
                // this.uploadCSVData(results.data); // 上传 CSV 到服务器
                },
                error: (error) => {
                console.error("Error parsing CSV:", error);
                }
            });
        })
        .catch(error => {
        console.error("Error fetching CSV:", error);
        });
    // },
    // uploadCSVData(data) {
    //     console.log("Uploading CSV data to server..."); // 这里是测试代码
    //     axios.post('http://localhost:8080/api/upload', csvData)
    //        .then(response => {
    //         console.log("CSV data uploaded successfully:", response.data);
    //         })
    //        .catch(error => {
    //         console.error("Error uploading CSV data:", error);
    //         });
        console.log("data:" + this.movies); // 调试信息
    }
  }  
};  
</script>  

<style scoped>  
h1 {  
  text-align: center;  
}  
ul {  
  list-style-type: none;  
  padding: 0;  
}  
li {  
  margin: 10px 0;  
  padding: 10px;  
  border: 1px solid #ccc;  
  border-radius: 5px;  
}  
</style>
