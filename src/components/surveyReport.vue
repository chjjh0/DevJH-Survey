<template>
  <div>
    <surveyHeader></surveyHeader>

    <template v-if="surveyDataEmpty === true">
      <noData></noData>
    </template>

    <template v-else>
      <div class="reportBackground">
        <div class="reportHead">
          <div class="countArea">
            <div class="countView">
              총 참여자
              <span>{{ surveyTotalCount }}명</span>
            </div>
            <div class="countView">
              금일 참여자
              <span>{{ todaySubmitCount }}명</span>
            </div>
          </div>

          <div class="questionArea">
            <h1>{{ surveyDataForPT.surveyTitle }}</h1>
          </div>
        </div>

        <div class="chartArea">
          <div v-for="( item, itemIdx ) in surveyDataForPT.itemArr" :key="itemIdx" class="item">
            <h2>질문{{ itemIdx+1 }}: {{ item.questionContent }}</h2>

            <div class="selectedChartArea">
              <b-form-select v-model="item.chartMode" :options="chartModeOptions"></b-form-select>
            </div>

            <div>
              <template v-if="item.chartMode === 'pie'">
                <pieChart
                  :chartItem="item.answerType === '1' ? yesOrNoOptions : item.answerType === '2' ? selectedOneOptions : selectedMultiOptions"
                  :chartCount="item.answerType === '1' ? yesOrNoCount : item.answerType === '2' ? selectedOneCount : selectedMultiCount"
                ></pieChart>
              </template>

              <template v-else-if="item.chartMode === 'bar'">
                <barChart
                  :chartItem="item.answerType === '1' ? yesOrNoOptions : item.answerType === '2' ? selectedOneOptions : selectedMultiOptions"
                  :chartCount="item.answerType === '1' ? yesOrNoCount : item.answerType === '2' ? selectedOneCount : selectedMultiCount"
                ></barChart>
              </template>

              <template v-else>
                <tableChart
                  :chartItem="item.answerType === '1' ? yesOrNoOptions : item.answerType === '2' ? selectedOneOptions : selectedMultiOptions"
                  :chartCount="item.answerType === '1' ? yesOrNoCount : item.answerType === '2' ? selectedOneCount : selectedMultiCount"
                ></tableChart>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
// firebase
import * as firebase from "firebase";
// common
import alertMsg from "./common/data/alertMsg";
import alert from "./common/func/alert";
// components
import pieChart from "./pieChart";
import barChart from "./barChart";
import tableChart from "./tableChart";
import surveyHeader from "./surveyHeader";
import noData from "./noData";

const auth = firebase.auth();
const firestore = firebase.firestore();

let questionIdx = 1;

export default {
  data() {
    return {
      userInfo: "",
      surveyDataEmpty: false,
      // chartMode 기본값: chartModeOptions의 원하는 값 value와 같은 값으로 설정
      chartModeOptions: [
        { value: null, text: "차트형식을 선택하세요." },
        { value: "pie", text: "파이차트" },
        { value: "bar", text: "컬럼차트" },
        { value: "table", text: "테이블" }
      ],
      // 현재 선택한 설문지 surveyIdx 필드 번호
      currentSurveyIdx: Number(this.$route.query.surveyIdx),
      surveyTotalCount: 0,
      todaySubmitCount: 0,
      // 답변 Yes or No
      yesOrNoOptions: ["Yes", "No"],
      yesOrNoCount: [0, 0],
      // 답변 한 개 선택
      selectedOneOptions: [],
      selectedOneCount: [],
      selectedOneOptionsSettingDone: false,
      // 답변 여러 개 선택
      selectedMultiOptions: [],
      selectedMultiCount: [],
      selectedMultiOptionsSettingDone: false,
      // chart용 설문
      totalSurveys: [],
      // 표시용 설문
      surveyDataForPT: []
    };
  },
  components: {
    pieChart,
    barChart,
    tableChart,
    surveyHeader,
    noData
  },
  mixins: [alertMsg, alert],
  methods: {
    async checkLogin() {
      const { msgType, permission } = this.alertMsg;

      auth.onAuthStateChanged(user => {
        if (user && user.uid === "fvqgUCKmjJhYH1Ir5Klq1zc1Fg93") {
          return true;
        } else {
          this.basicAlert(msgType.fail, permission.fail).then(res => {
            // msg 출력 후 페이지 이동
            // $router.push 이용시 이동 후 msg 출력 되어 비정상 작동
            window.location.href = "/";
          });
        }
      });
    },
    setYesOrNoCount(answer) {
      if (answer === "1") {
        // yes count
        this.yesOrNoCount[0] = this.yesOrNoCount[0] + 1;
      } else {
        // no count
        this.yesOrNoCount[1] = this.yesOrNoCount[1] + 1;
      }
    },
    computedChartData() {
      this.totalSurveys.map(survey => {
        const itemArr = survey.itemArr;

        itemArr.map((item, idx) => {
          if (item.answerType === "1") {
            // Yes or No 답변
            this.setYesOrNoCount(item.answer);
          } else if (item.answerType === "2") {
            // 한 개 선택 답변
            // totalsurveys.map 처음 한번만 chart 항목 세팅
            if (this.selectedOneOptionsSettingDone === false) {
              // 한 번만 항목 세팅을 위한 flag
              this.selectedOneOptionsSettingDone = true;

              item.selectedOneArr.map(answerOption => {
                // 항목명 세팅
                this.selectedOneOptions.push(answerOption.value);
                // 항목 개수에 맞게 count값 init
                this.selectedOneCount.push(0);
              });
            }
            // 참여자 수 count
            item.selectedOneArr.map((answerOption, idx) => {
              if (answerOption.value === item.answer) {
                this.selectedOneCount[idx] = this.selectedOneCount[idx] + 1;
              }
            });
          } else {
            // 여러 개 선택 답변
            const answers = item.answers;
            // totalsurveys.map 처음 한번만 chart 항목 세팅
            if (this.selectedMultiOptionsSettingDone === false) {
              // 한 번만 항목 세팅을 위한 flag
              this.selectedMultiOptionsSettingDone = true;

              item.selectedMultiArr.map(answerOption => {
                // 항목명 세팅
                this.selectedMultiOptions.push(answerOption.value);
                // 항목 개수에 맞게 count값 init
                this.selectedMultiCount.push(0);
              });
            }
            // count setting
            item.selectedMultiArr.map((answerOption, idx) => {
              answers.map(answer => {
                if (answerOption.value === answer) {
                  this.selectedMultiCount[idx] =
                    this.selectedMultiCount[idx] + 1;
                }
              });
            });
          }
        });
      });
      this.$forceUpdate();
    },
    // 설문지 세팅
    fetchSurvey() {
      return new Promise((resolve, reject) => {
        if (this.$route.query.surveyIdx) {
          firestore
            .collection("submitSurvey")
            .where("surveyIdx", "==", this.currentSurveyIdx)
            .get()
            .then(docs => {
              if (docs.docs.length > 0) {
                // 오늘날짜
                const today = this.$moment().format("YYYY-MM-DD");
                const surveys = docs.docs;
                let countForPT = 0;

                // 전체 설문 참여자 count
                this.surveyTotalCount = docs.docs.length;

                // 설문지 복사
                surveys.some(survey => {
                  const item = survey.data();
                  const { surveyTitle, submitAt } = item;

                  // 금일 설문 참여자 count
                  if (submitAt === today) {
                    ++this.todaySubmitCount;
                  }

                  // 차트 계산용
                  surveys.map(survey => {
                    this.totalSurveys.push(survey.data());
                  });

                  // 설문 표시용
                  this.surveyDataForPT = {
                    surveyTitle: item.surveyTitle,
                    itemArr: []
                  };

                  if (countForPT < item.itemArr.length) {
                    for (; countForPT < item.itemArr.length; countForPT++) {
                      // 질문지 표시용
                      this.surveyDataForPT.itemArr.push({
                        questionContent:
                          item.itemArr[countForPT].questionContent,
                        questionIdx: item.itemArr[countForPT].questionIdx,
                        answerType: item.itemArr[countForPT].answerType,
                        chartMode: "pie"
                      });
                    }
                    resolve(true);
                    // surveys.some 반복문 탈출
                    return true;
                  }
                });
              } else {
                this.surveyDataEmpty = true;
              }
            });
        }
      });
    }
  },
  // lifeCycle
  created() {
    if (this.checkLogin()) {
      this.fetchSurvey().then(res => {
        if (res) {
          this.computedChartData();
        }
      });
    }
  },
  props: {
    surveyIdx: {
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
$in-bl: inline-block;

.reportBackground {
  padding: 10%;

  .countArea {
    display: $in-bl;
    margin-right: 20px;
  }

  .countView {
    display: $in-bl;
    border: 1px solid black;
    border-radius: 5px;
    padding: 20px;
    background: black;
    color: white;
    font-size: 20px;
    font-weight: bold;

    span {
      display: block;
      text-align: center;
      font-weight: 400;
    }
  }

  .reportHead {
    padding: 0 10%;
  }

  .questionArea {
    display: $in-bl;
    vertical-align: top;

    h1 {
      font-size: 30px;
    }

    h2 {
      font-size: 20px;
    }
  }

  .chartArea {
    padding: 10%;
  }
}
</style>
