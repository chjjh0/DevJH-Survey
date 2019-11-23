<template>
  <div>
    <surveyHeader></surveyHeader>

    <template v-if="surveyListData.length === 0">
      <noData></noData>
    </template>

    <template v-else>
      <div class="listBackground">
        <div class="tableArea">
          <b-table
            id="submitListTable"
            :per-page="perPage"
            :current-page="currentPage"
            :fields="fields"
            :items="items"
          >
            <!-- table custom -->
            <template v-slot:cell(submitUser)="data">
              <span @click="handleSubmitDetail(data.value)" class="cs">{{ data.value }}</span>
            </template>
          </b-table>
        </div>

        <div class="paginationArea">
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            align="center"
            aria-controls="submitListTable"
          ></b-pagination>
        </div>

        <div class="countArea fr">
          <font-awesome-icon icon="user-circle" class="faCustom" />
          <span>총 참여자: {{ surveyTotalCount }} 명</span>
        </div>

        <b-modal id="modalSurveyDetail" size="lg" hide-footer>
          <template v-slot:modal-header>
            <h5>{{ currentSurvey[0].submitUserName }}님의 설문참여내역</h5>
          </template>

          <SubmitDetail :surveyData="currentSurvey"></SubmitDetail>
        </b-modal>
      </div>
    </template>
  </div>
</template>

<script>
// common
import firestoreCtrl from "../components/common/func/firestoreCtrl";
import modalCtrl from "../components/common/func/modalCtrl";
// components
import surveyHeader from "./surveyHeader";
import SubmitDetail from "./submitDetail";
import noData from "./noData";

export default {
  data() {
    return {
      // 설문 Data
      surveyListData: [],
      // pagination table용
      items: [],
      // pagination 현재 페이지
      currentPage: 1,
      // pagination 페이지별 노출 갯수
      perPage: 5,
      // table custom용
      fields: [
        { key: "id", label: "ID" },
        { key: "submitUser", label: "참여자" },
        { key: "submitAt", label: "설문 제출시각" }
      ],
      // submitDetail용 현재 선택한 참여자
      currentSurvey: [],
      // 설문 총 참여자 수
      surveyTotalCount: 0
    };
  },
  components: {
    surveyHeader,
    SubmitDetail,
    noData
  },
  computed: {
    // pagination용
    rows() {
      return this.items.length;
    }
  },
  mixins: [firestoreCtrl, modalCtrl],
  methods: {
    setCurrentSurvey(submitUserName) {
      return new Promise((resolve, reject) => {
        if (submitUserName) {
          // 현재 선택한 설문지를 위한 init
          this.currentSurvey = [];

          this.surveyListData.some(survey => {
            if (survey.submitUserName === submitUserName) {
              this.currentSurvey.push(survey);
              // 같은 이름이 있을 경우 surveyListData.some 반복문 종료
              // some에서 종료 방법: return true;
              // 하단의 resolve(true) 와 다른 역할
              return true;
            }
          });

          resolve(true);
        }
      });
    },
    // 페이지네이션 및 테이블 세팅
    setTable() {
      this.surveyListData.map((item, idx) => {
        this.items.push({
          id: ++idx,
          submitUser: item.submitUserName,
          submitAt: item.submitAt
        });
      });
    },
    // 설문지 리스트 세팅
    setSurveyList(docs) {
      if (docs.docs.length > 0) {
        const surveys = docs.docs;
        // 총 설문 참여자수 count
        this.surveyTotalCount = surveys.length;
        // 리스트 세팅
        surveys.map(survey => {
          this.surveyListData.push(survey.data());
        });
        // 내림차순 정렬
        this.surveyListData.sort(function(a, b) {
          if (a.submitAt > b.submitAt) return -1;
          else if (b.submitAt > a.submitAt) return 1;
          else return 0;
        });
      }
    },
    handleSubmitDetail(submitUserName) {
      this.setCurrentSurvey(submitUserName).then(res => {
        if (res) {
          this.showModal(this, "modalSurveyDetail");
        }
      });
    }
  },
  created() {
    this.selectWhereCtrl("submitSurvey", [
      "surveyIdx",
      "==",
      Number(this.$route.query.surveyIdx)
    ])
      .then(docs => {
        this.setSurveyList(docs);
      })
      .then(() => {
        this.setTable();
      });
  }
};
</script>

<style lang="scss" scoped>
.tableArea {
  /* 테이블에 노출되는 행이 5개일 때 최적화 된 height */
  height: 265px;
}

.cs:hover {
  color: skyblue;
  font-weight: bold;
}

.listBackground {
  padding: 5%;

  .countArea {
    font-size: 18px;
  }
}
</style>
