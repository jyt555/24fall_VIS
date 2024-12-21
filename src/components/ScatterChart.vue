<template>
  <div>
    <h2 @mousedown ="ChooseChart(yLabel)">IMDB Rating vs {{ yLabel }}</h2>
    <!-- 使用 scatterChartData -->
    <Scatter :data="scatterChartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Scatter } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ScatterController, LinearScale, PointElement} from 'chart.js';
import EventBus from '../EventBus.js';

ChartJS.register(Title, Tooltip, Legend, ScatterController, LinearScale, PointElement);

export default {
  components: {
    Scatter
  },
  props: {
    movies: Array,
    yLabel: String
  },
  data() {
    return {
      highlightMovie: '',
      chooseMovie: '',
      chooseChart: -1,
    };
  },
  computed: {
    scatterChartData() {
      // 如果 movies 为空或未加载，返回一个空的对象
      if (!this.movies || this.movies.length === 0) {
        return { datasets: [] };
      }

      // 根据电影名称设置颜色
      const backgroundColors = this.movies.map(movie => {
        const color = this.getColorByMovieName(movie.Series_Title);
        // console.log(`Color for ${movie.Series_Title}: ${color}`); // 调试输出
        if (this.chooseMovie !== '') {
          if (this.chooseMovie !== movie.Series_Title) {
            return 'rgba(255,255,255,0.5)'; //未选中时半透明白色
          } 
        }
        return color;
      });
      // const backgroundColors = "#66ccff";
      const PointRadius = this.movies.map(movie => {
        if (this.chooseMovie !== '') {
          if (this.chooseMovie !== movie.Series_Title)
            return 4;
          return 7;
        }
        // if (this.highlightMovie !== '') {
        //   if (this.highlightMovie !== movie.Series_Title)
        //     return 4;
        //   return 7;
        // }
        return 4;
      });

      const data = {
        datasets: [
        {
          label: 'Movies',
          backgroundColor: backgroundColors,
          data: this.movies.map((movie) => {
            const imdbRating = parseFloat(movie.IMDB_Rating);
            const yValue = this.getYValue(movie);
            // 过滤掉非法数据
            if (isNaN(imdbRating) || isNaN(yValue)) {
              return null; // 返回 null 以排除掉无效数据
            }
            return {
              x: imdbRating,  // 使用 IMDB_Rating 作为 X 轴数据
              y: yValue,      // 根据 yLabel 来获取 Y 轴数据
              movie: movie // tag:movie
            };
          }).filter(item => item !== null), // 过滤掉 null 值
          pointRadius: PointRadius,
          hoverRadius: 7,
        }]
      };
      return data;
    },
    chartOptions() {
      const options = {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            // enabled: false, // test1:failed
            mode: 'index',
            intersect: true, // 仅在鼠标位置与元素相交时应用
            backgroundColor:'rgba(100,0,100,0.8)',
            // external: (tooltipModel, tooltipItem) => { // test1:failed
            //   if (tooltipModel.opacity === 0) {
            //     this.highlightMovie = '';
            //     this.emitHighlightMovie('');
            //   } else if (tooltipModel.body) {
            //     const title = tooltipItem.raw.movie.Series_Title;
            //     this.highlightMovie = title;
            //     this.emitHighlightMovie(title);
            //     console.log('ScatterChart:' + this.highlightMovie); // 调试输出
            //   }
            // },
            callbacks: {
              title:(tooltipItems) => {
                let title = '';
                tooltipItems.forEach(function(tooltipItem) {
                  title += tooltipItem.raw.movie.Series_Title;
                });
                this.highlightMovie = title;
                this.emitHighlightMovie(title);
                // // 根据yLabel设置chooseChart为0-3
                // switch (this.yLabel) {
                //   case 'Gross Earning':
                //     this.chooseChart = 0;
                //     break;
                //   case 'Released Year':
                //     this.chooseChart = 1;
                //     break;
                //   case 'Runtime':
                //     this.chooseChart = 2;
                //     break;
                //   case 'No of Votes':
                //     this.chooseChart = 3;
                //     break;
                //   default:
                //     this.chooseChart = -1;
                //     break;
                // }
                // this.emitChooseChart(this.chooseChart);
                // console.log('ScatterChart:' + this.highlightMovie); // 调试输出
                return "《" + title + "》";
              },
              afterTitle: (tooltipItems) => {
                let director = '';
                tooltipItems.forEach(function(tooltipItem) {
                  director += tooltipItem.raw.movie.Director;
                });
                return '  ' + director;
              },
              // beforeLabel: () => {
              //   return `label1`;
              // },
              label: (tooltipItem) => {
                // let label = tooltipItem.parsed.y;
                // console.log('label: ', this.yLabel, label); // 调试输出
                return `${this.yLabel}: ${tooltipItem.parsed.y}`;
              },
              afterLabel: (tooltipItem) => {
                let Gross_Earning = tooltipItem.raw.movie.Gross;
                let Released_Year = tooltipItem.raw.movie.Released_Year;
                let Runtime = tooltipItem.raw.movie.Runtime;
                switch (this.yLabel) {
                  case 'Gross Earning':
                    return `Released Year: ${Released_Year}\nRuntime: ${Runtime}`;
                  case 'Released Year':
                    return `Gross: ${Gross_Earning}\nRuntime: ${Runtime}`;
                  case 'Runtime':
                    return `Gross: ${Gross_Earning}\nReleased Year: ${Released_Year}`;
                  case 'No of Votes':
                    return `Gross: ${Gross_Earning}\nReleased Year: ${Released_Year}\nRuntime: ${Runtime}`;
                  default:
                    return '';
                }
                // return `jyt & wrr`;
              },
              footer: (tooltipItems) => {
                let star1 = '';
                let star2 = '';
                let star3 = '';
                let star4 = '';
                tooltipItems.forEach(function(tooltipItem) {
                  star1 = tooltipItem.raw.movie.Star1;
                  star2 = tooltipItem.raw.movie.Star2;
                  star3 = tooltipItem.raw.movie.Star3;
                  star4 = tooltipItem.raw.movie.Star4;
                });
                return `Stars: ${star1}\n           ${star2}\n           ${star3}\n           ${star4}`;
                // return `Stars1: ${star1}\nStars2: ${star2}\nStars3: ${star3}\nStars4: ${star4}`;
              },
            },
            // onLeave: () => {
            //   console.log('onLeave'); // 调试输出onLeave，失败
            //   this.highlightMovie = '';
            //   this.emitHighlightMovie('');
            // }
          },
          
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'IMDB Rating'
            }
          },
          y: {
            title: {
              display: true,
              text: this.yLabel
            }
          }
        }
      };
      // console.log(options); // 调试输出
      return options;
    },
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
    getColorByMovieName(title) {
      // 根据电影名称在this.movies中找到对应的颜色
      const movie = this.movies.find(item => item.Series_Title === title);
      if (!movie) {
        return '#66ccff';
      }
      const color = movie.color;
      // console.log('Find:', movie, color); // 调试输出
      return color;
    },
    emitHighlightMovie(movieTitle) { // 触发 highlightMovie 事件
      EventBus.emit('highlightMovie', movieTitle);
    },
    // emitChooseChart(chooseChart) { // 触发 chooseChart 事件
    //   EventBus.emit('chooseChart', chooseChart);
    // },
    ChooseChart(yLabel) {
      // 根据yLabel设置chooseChart为0-3
      switch (yLabel) {
        case 'Gross Earning':
          this.chooseChart = 0;
          break;
        case 'Released Year':
          this.chooseChart = 1;
          break;
        case 'Runtime':
          this.chooseChart = 2;
          break;
        case 'No of Votes':
          this.chooseChart = 3;
          break;
        default:
          this.chooseChart = -1;
          break;
      }
      // console.log('chooseChart: ', this.chooseChart); // 调试输出
      EventBus.emit('ChooseChart', this.chooseChart);
    },
  },
  created() {
    EventBus.on('chooseMovie', (movieTitle) => {
      this.chooseMovie = movieTitle;
      // console.log('ScatterChart:choose ', movieTitle); // 调试输出
    });
  },
};
</script>


<style scoped>
.scatter-chart {
  width: 100%;
  height: 400px;
}
</style>
