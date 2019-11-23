<template>
  <div>
    <!-- 이름으로 설문자 참여 가능여부 확인  -->
    <div v-if="surveyAccess === false" class="viewBackground">
      <div class="inner">
        <h1>DevJH 설문에 오신 걸 환영합니다😍</h1>

        <label for="submitUserName">이름</label>
        <b-form-input
          v-model="sendData.submitUserName"
          v-on:keyup.enter="handleSurveyAccess"
          class="mb-15"
          placeholder="이름을 입력하세요"
          id="submitUserName"
        ></b-form-input>

        <b-button @click="handleSurveyAccess" class="btnStyle" block variant="primary">확인</b-button>
      </div>
    </div>
    <!-- 설문지 -->
    <template v-if="surveyAccess === true">
      <div class="surveyBackground">
        <div class="questionHead">
          <h1>{{ sendData.surveyTitle }}</h1>
        </div>

        <div v-for="( item, itemIdx ) in sendData.itemArr" :key="itemIdx" class="item">
          <div class="questionArea">
            <div>{{ item.questionContent }}</div>
          </div>

          <div class="selectedArea">
            <!-- yes / no -->
            <template v-if="item.answerType === '1'">
              <b-form-group>
                <b-form-radio v-model="item.answer" :value="'1'">Yes</b-form-radio>
                <b-form-radio v-model="item.answer" :value="'0'">No</b-form-radio>
              </b-form-group>
            </template>

            <!-- 한 개 선택 -->
            <template v-else-if="item.answerType === '2'">
              <div v-for="( obj ) in item.selectedOneArr" :key="obj.questionIdx" class="pa-10">
                <b-form-radio v-model="item.answer" class="in-bl" :value="obj.value">{{ obj.value }}</b-form-radio>
              </div>
            </template>

            <!-- 여러 개 선택 -->
            <template v-else>
              <div v-for="( obj ) in item.selectedMultiArr" :key="obj.questionIdx" class="pa-10">
                <b-form-checkbox
                  class="in-bl"
                  v-model="item.answers"
                  :value="obj.value"
                >{{ obj.value }}</b-form-checkbox>
              </div>
            </template>
          </div>
        </div>
        <b-button @click="handleSubmit" class="btnStyle" variant="outline-primary">제출</b-button>
      </div>
    </template>
  </div>
</template>

<script>
// firebase
import * as firebase from "firebase";
// common
import alertMsg from "../components/common/data/alertMsg";
import alert from "../components/common/func/alert";
import validation from "../components/common/func/validation";
import firestoreCtrl from "../components/common/func/firestoreCtrl";

let questionIdx = 1;

export default {
  data() {
    return {
      surveyAccess: false,
      surveyIdxForAccess: 0,
      docId: "",
      sendData: {
        submitUserName: "",
        submitAt: "",
        surveyIdx: 1,
        itemArr: [
          // itemArr sample
          // {
          //   draggableIdx: 1,
          //   questionContent: "",
          //   answerType: "1",
          //   answerType: "1 or 2"인 경우 answer: String으로 저장
          //   answer: "",
          //   answerType: "3" > 답변을 여러 개 선택하는 경우만 answer: [] 추가
          //   answers: [],
          //   options: [
          //     { value: null, text: "Please select an option" },
          //     { value: "1", text: "Yes / No" },
          //     { value: "2", text: "한 개 선택" },
          //     { value: "3", text: "여러 개 선택" }
          //   ],
          //   questionIdx,
          //   selectedRadioVal: "1",
          //   selectedOneArrIndex: 1,
          //   selectedMultiArrIndex: 1,
          //   selectedOneArr: [{ answerIdx: 1, value: "" }],
          //   selectedMultiArr: [{ answerIdx: 1, value: "" }]
          // }
        ]
      }
    };
  },
  mixins: [alertMsg, alert, validation, firestoreCtrl],
  methods: {
    handleSurveyAccess() {
      const { msgType, surveyAccess } = this.alertMsg;
      const firestore = firebase.firestore();
      const _this = this;

      if (this.validKorean(this.sendData.submitUserName)) {
        firestore
          .collection("submitSurvey")
          .where("surveyIdx", "==", this.surveyIdxForAccess)
          .where("submitUserName", "==", this.sendData.submitUserName)
          .get()
          .then(docs => {
            if (docs.empty === false) {
              this.basicAlert(msgType.fail, surveyAccess.fail);
            } else {
              this.basicAlert(msgType.success, surveyAccess.success).then(
                res => {
                  if (res) {
                    // msg 출력 후 딜레이를 두고 설문여부 전환
                    setTimeout(function() {
                      _this.surveyAccess = true;
                    }, 1000);
                  }
                }
              );
            }
          });
      } else {
        // 참여자명 미입력
        this.basicAlert(msgType.fail, surveyAccess.guide);
      }
    },
    // 불러온 설문지 세팅
    setSurvey(doc) {
      // 설문지 고유번호 세팅
      this.sendData.surveyIdx = doc.surveyIdx;
      // 설문제목 세팅
      this.sendData.surveyTitle = doc.surveyTitle;

      doc.itemArr.map(item => {
        if (item.answerType === "3") {
          // 여러 개 답변 질문문항 세팅
          this.sendData.itemArr.push({ answers: [], ...item });
        } else {
          // Yes or No, 한 개 답변 질문문항 세팅
          this.sendData.itemArr.push({ answer: "", ...item });
        }
      });
    },
    // 설문지 불러오기
    handleFetchSurvey() {
      this.selectOneDocIdCtrl("adminSurvey", this.docId).then(res => {
        this.setSurvey(res.data());
      });
    },
    // 설문지 제출
    handleSubmit() {
      const { msgType, submit } = this.alertMsg;
      const _this = this;

      if (this.validSurveyView(this.sendData.itemArr)) {
        // 제출 시간 세팅
        this.sendData.submitAt = this.$moment().format("YYYY-MM-DD HH:mm");

        this.addCtrl("submitSurvey", this.sendData).then(() => {
          // 제출 후 성공 메세지 출력
          this.basicAlert(msgType.success, submit.success).then(res => {
            // 같은 컴퓨터에서 연속 참여 시 이전 참여자의 선택사항 초기화를 위함
            // 매 번 참여 여부 확인 후 같은 내용의 설문지를 불러오는 것보다
            // 초기화가 더 효율적이라 판단
            this.sendData.itemArr.map(item => {
              if (item.answers) {
                item.answers = [];
              } else {
                item.answer = "";
              }
            });

            // 설문지 참여자 이름 확인 컴포넌트 활성화
            if (res) {
              setTimeout(function() {
                _this.surveyAccess = false;
                _this.sendData.submitUserName = "";
              }, 1000);
            }
          });
        });
        // this.submitSurvey();
      } else {
        this.basicAlert(msgType.fail, submit.fail);
      }
    }
  },
  // lifeCycle
  created() {
    // this.$route...은 props와 달리 바로 data에 주입이 어려워보여 아래와 같이 처리
    const route = this.$route.query;
    // docId 세팅
    this.docId = route.addr.substr(0, route.addr.lastIndexOf("z"));
    // 참여 여부 확인용 surveyIdx
    this.surveyIdxForAccess = Number(
      route.addr.substr(route.addr.lastIndexOf("z") + 1)
    );

    this.handleFetchSurvey();
  }
};
</script>

<style lang="scss" scoped>
.viewBackground {
  padding: 30%;

  .inner {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25);
    box-sizing: border-box;
    overflow: hidden;
    width: 500px;
    height: 400px;
    text-align: center;
    margin: 0 auto;
    padding: 10%;

    #submitUserName {
      display: inline-block;
      width: 60%;
    }

    .btnStyle {
      width: 70%;
      margin: 0 auto;
    }
  }

  h1 {
    font-size: 20px;
    margin: 30px 0;
    padding: 0 5%;
  }
}

.surveyBackground {
  padding: 10%;

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

  h1 {
    margin: 30px 0;
    padding: 0 5%;
  }

  .btnStyle {
    float: right;
    margin-right: 5%;
  }
}
</style>
