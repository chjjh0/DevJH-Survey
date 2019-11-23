<template>
  <div>
    <div v-for="( item, itemIdx ) in surveyData[0].itemArr" :key="itemIdx" class="item">
      <div class="questionArea mb-15">
        <h2>{{ item.questionContent }}</h2>
      </div>

      <div class="selectedArea mb-15">
        <!-- yes / no -->
        <template v-if="item.answerType === '1'">
          <b-form-group>
            <template v-if="item.answer === '1'">
              <font-awesome-icon icon="check-circle" />
              <span>Yes</span>
              <div>&nbsp; &nbsp; &nbsp;No</div>
            </template>

            <template v-else>
              <div>&nbsp; &nbsp; &nbsp;Yes</div>
              <font-awesome-icon icon="check-circle" />
              <span>No</span>
            </template>
          </b-form-group>
        </template>

        <!-- 한 개 선택 -->
        <template v-else-if="item.answerType === '2'">
          <div v-for="( obj, index ) in item.selectedOneArr" :key="index" class="pa-10">
            <template v-if="item.answer === obj.value">
              <font-awesome-icon icon="check-circle" />
              {{ obj.value }}
            </template>
            <template v-else>&nbsp; &nbsp; &nbsp;{{ obj.value }}</template>
          </div>
        </template>

        <!-- 여러 개 선택 -->
        <template v-else>
          <div v-for="( obj, index ) in item.selectedMultiArr" :key="index" class="pa-10">
            <template v-if="item.answers[0] === obj.value">
              <font-awesome-icon icon="check-circle" />
              {{ obj.value }}
            </template>
            <template v-else>&nbsp; &nbsp; &nbsp;{{ obj.value }}</template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    surveyData: {
      type: Array
    }
  }
};
</script>

<style lang="scss" scoped>
.questionArea {
  h2 {
    font-size: 20px;
  }
}

.item {
  width: 90%;
  margin: 15px auto;
  text-align: center;
  padding: 10px;
  font-size: 16px;
  line-height: 1.6;
  border: 1px solid black;
  border-radius: 4px;
}
</style>
