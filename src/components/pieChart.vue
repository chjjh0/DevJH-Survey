<template>
  <Apexchart width="500" type="pie" :options="chartOptions" :series="series"></Apexchart>
</template>

<script>
import Apexchart from "vue-apexcharts";

export default {
  components: {
    Apexchart
  },
  data() {
    return {
      // pie Chart
      series: this.chartCount,
      chartOptions: {
        labels: this.chartItem,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      }
    };
  },
  props: {
    chartItem: {
      type: Array
    },
    chartCount: {
      type: Array
    }
  }
};
</script>

<style>
</style>
