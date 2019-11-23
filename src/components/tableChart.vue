<template>
  <div>
    <b-table :items="items" class="mt-3" outlined>
      <template v-slot:table-busy>
        <div class="text-center text-danger my-2"></div>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        // sample
        // { 항목명: "Dickerson", 응답자수: "MacDonald", 응답비율: 40 }
      ]
    };
  },
  methods: {
    async setChartItems() {
      const { chartItem, chartCount } = this;
      const totalCount = await (function() {
        let result = 0;
        chartCount.map(count => {
          result += count;
        });
        return result;
      })();

      if (chartItem.length === chartCount.length) {
        chartItem.map((item, idx) => {
          this.items.push({
            항목명: item,
            응답자수: chartCount[idx] + "명",
            응답비율: ((chartCount[idx] / totalCount) * 100).toFixed(1) + " %"
          });
        });
      } else {
        // item과 count 수가 다르면 data 비정상
      }
    }
  },
  created() {
    this.setChartItems();
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
