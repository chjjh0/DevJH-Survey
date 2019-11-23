<template>
  <md-table>
    <md-table-row>
      <md-table-head md-numeric>ID</md-table-head>
      <md-table-head>설문지 제목</md-table-head>
      <md-table-head>질문지 갯수</md-table-head>
      <md-table-head>설문지 수정</md-table-head>
      <md-table-head>리포트</md-table-head>
      <md-table-head>참여자 현황</md-table-head>
      <md-table-head>설문지 배포주소</md-table-head>
    </md-table-row>

    <md-table-row v-for="( obj, index ) in this.surveyListData" :key="index">
      <md-table-cell md-numeric>{{obj[0].surveyIdx}}</md-table-cell>

      <md-table-cell>
        <router-link
          :to="{ path: '/submitlist', query: { surveyIdx: obj[0].surveyIdx }}"
        >{{obj[0].title}}</router-link>
      </md-table-cell>

      <md-table-cell>{{obj[0].questionCount}}</md-table-cell>

      <md-table-cell>
        <!-- 레포트 오염 방지를 위해 참여자가 있으면 수정 불가 -->
        <template v-if="obj[0].submitCount > 0">
          <b-button v-b-tooltip.hover disabled title="참여자가 있어 수정이 불가합니다.">수정</b-button>
        </template>

        <template v-else>
          <b-button @click="$emit('updateSurvey', obj[0].webAddr)">수정</b-button>
        </template>

        <b-button @click="$emit('deleteSurvey', obj[0].webAddr)">삭제</b-button>
      </md-table-cell>

      <md-table-cell>
        <a :href="`/surveyReport?surveyIdx=${obj[0].surveyIdx}`">레포트</a>
      </md-table-cell>

      <md-table-cell>{{ obj[0].submitCount }}</md-table-cell>

      <md-table-cell>
        <a :href="`/surveyView?addr=${obj[0].webAddr}z${obj[0].surveyIdx} `">설문지 배포</a>
      </md-table-cell>
    </md-table-row>
  </md-table>
</template>

<script>
export default {
  props: {
    surveyListData: {
      type: Array
    }
  }
};
</script>

<style>
</style>
