<template>
  <div>
    <template v-if="loading === true">
      <b-spinner class="loading" label="Spinning"></b-spinner>
    </template>

    <template v-else>
      <div class="questionHead">
        <div class="clearfix">
          <div class="fr">
            <b-button variant="success" @click="handleSubmit">저장</b-button>
            <b-button variant="danger" @click="onCancel">취소</b-button>
          </div>
        </div>

        <label for="surveyTitle">제목</label>
        <b-form-input
          v-model="sendData.surveyTitle"
          placeholder="제목을 입력하세요"
          id="surveyTitle"
          class="surveyTitleInput"
        ></b-form-input>
      </div>

      <draggable
        v-model="sendData.itemArr"
        v-bind="dragOptions"
        @start="isDragging = true"
        @end="isDragging = false"
      >
        <transition-group type="transition" name="flip-list">
          <div v-for="( item, itemIdx ) in sendData.itemArr" :key="item.draggableIdx" class="item">
            <div class="itemControl clearfix">
              <font-awesome-icon icon="times" @click="handleRemoveQuestion(item.questionIdx)" />
            </div>

            <div class="questionArea mb-15">
              <label for="questionContent">질문 내용:</label>
              <input type="text" v-model="item.questionContent" id="questionContent" />
            </div>

            <div class="answerArea mb-15">
              <span>답변 형태:</span>
              <b-form-select v-model="item.answerType" :options="item.options"></b-form-select>
            </div>

            <div class="selectedArea mb-15">
              <!-- yes / no -->
              <template v-if="item.answerType === '1'">
                <b-form-group>
                  <b-form-radio name="some-radios" value="1" disabled>Yes</b-form-radio>
                  <b-form-radio name="some-radios" value="0" disabled>No</b-form-radio>
                </b-form-group>
              </template>

              <!-- 한 개 선택 -->
              <template v-else-if="item.answerType === '2'">
                <div v-for="( obj, index ) in item.selectedOneArr" :key="index" class="pa-10">
                  <b-form-radio name="some-radios" class="in-bl" :value="obj.id" disabled />

                  <input type="text" v-model="obj.value" name="selectedOne" />

                  <b-button
                    @click="handleRemoveAnswer(
                    itemIdx,
                    'selectedOneArr',
                    sendData.itemArr[itemIdx].selectedOneArr,
                    obj.answerIdx)"
                    variant="danger"
                  >삭제</b-button>
                </div>

                <b-button
                  @click="addAnswer('selectedOneArr', sendData.itemArr[itemIdx])"
                  variant="outline-primary"
                >선택 항목 추가</b-button>
              </template>

              <!-- 여러 개 선택 -->
              <template v-else>
                <div v-for="( obj, index ) in item.selectedMultiArr" :key="index" class="pa-10">
                  <b-form-checkbox
                    class="in-bl"
                    name="checkbox-1"
                    value="accepted"
                    unchecked-value="not_accepted"
                    disabled
                  />

                  <input type="text" v-model="obj.value" name="selectedMulti" />

                  <b-button
                    @click="handleRemoveAnswer(
                    itemIdx,
                    'selectedMultiArr',
                    sendData.itemArr[itemIdx].selectedMultiArr,
                    obj.answerIdx)"
                    variant="danger"
                  >삭제</b-button>
                </div>

                <b-button
                  @click="addAnswer('selectedMultiArr', sendData.itemArr[itemIdx])"
                  variant="outline-primary"
                >선택 항목 추가</b-button>
              </template>
            </div>
          </div>
        </transition-group>
      </draggable>

      <b-button @click="handleAddQuestion" class="btnStyle" variant="outline-primary">질문 추가</b-button>
    </template>
  </div>
</template>

<script>
// firebase
import * as firebase from "firebase";
// lib
import draggable from "vuedraggable";
// common
import alertMsg from "./common/data/alertMsg";
import alert from "./common/func/alert";
import surveyCTrl from "./common/func/surveyCTrl";
import validation from "./common/func/validation";
import firestoreCtrl from "./common/func/firestoreCtrl";

let questionIdx = 1;
let draggableIdx = 1;

export default {
  data() {
    return {
      loading: true,
      userInfo: "",
      adminUid: "",
      selectedOneIndex: 1,
      originItemArr: [],
      sendData: {
        surveyTitle: "",
        surveyIdx: 1,
        itemArr: [
          {
            draggableIdx: 1,
            questionContent: "",
            answerType: "1",
            options: [
              { value: null, text: "답변 형태를 선택하세요." },
              { value: "1", text: "Yes / No" },
              { value: "2", text: "한 개 선택" },
              { value: "3", text: "여러 개 선택" }
            ],
            questionIdx,
            selectedRadioVal: "1",
            selectedOneArrIndex: 1,
            selectedMultiArrIndex: 1,
            selectedOneArr: [{ id: 1, value: "" }],
            selectedMultiArr: [{ id: 1, value: "" }]
          }
        ]
      },

      // questionContent
      questionContent: [{ id: 1, name: "" }],

      // radio options
      values: [{ label: "Yes", value: "1" }, { label: "No", value: "2" }],
      suveyData: []
    };
  },
  components: {
    draggable
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  mixins: [alert, alertMsg, surveyCTrl, validation, firestoreCtrl],
  methods: {
    onCancel() {
      this.sendData.itemArr = this.originItemArr.slice();
      this.$emit("hideModal", "modalSurveyUpdate");
    },
    // 설문지 세팅
    setSurvey(docs) {
      const { surveyTitle, surveyIdx, itemArr } = docs.docs[0].data();

      this.sendData.surveyTitle = surveyTitle;
      this.sendData.surveyIdx = surveyIdx;
      this.sendData.itemArr = itemArr.slice();
      this.sendData.itemArr.map(item => {
        draggableIdx = item.draggableIdx;
        questionIdx = item.questionIdx;
      });

      // loding 종료
      this.loading = false;
    },
    handleAddQuestion() {
      this.sendData.itemArr.push(
        this.addQuestion(++draggableIdx, ++questionIdx)
      );
    },
    handleRemoveQuestion(questionIdx) {
      const { msgType, surveyQuestion } = this.alertMsg;

      if (this.validLeng(this.sendData.itemArr.length, 1)) {
        this.basicAlert(msgType.fail, surveyQuestion.fail);
      } else {
        this.sendData.itemArr.splice(
          this.removeQuestion(this.sendData.itemArr, questionIdx),
          1
        );
      }
    },
    handleRemoveAnswer(itemIdx, arrType, itemArr, answerIdx) {
      const currentItemArr = this.sendData.itemArr[itemIdx];
      const { msgType, surveyAnswer } = this.alertMsg;

      if (
        currentItemArr.answerType === "2" &&
        this.validLeng(currentItemArr.selectedOneArr.length, 1)
      ) {
        // 한 개 답변란 1개 이상 체크
        this.basicAlert(msgType.fail, surveyAnswer.fail);
        return false;
      } else if (
        currentItemArr.answerType === "3" &&
        this.validLeng(currentItemArr.selectedOneArr.length, 1)
      ) {
        // 여러 개 답변란 1개 이상 체크
        this.basicAlert(msgType.fail, surveyAnswer.fail);
        return false;
      } else {
        // 답변 삭제
        this.sendData.itemArr[itemIdx][arrType] = this.removeAnswer(
          itemArr,
          answerIdx
        );
      }
    },
    handleSubmit() {
      const { msgType, surveySave } = this.alertMsg;

      if (this.validSurvey(this.sendData)) {
        this.updateCtrl("adminSurvey", this.surveyDocId, this.sendData)
          .then(res => {
            if (res) {
              this.basicAlert(msgType.success, surveySave.success);
            }
          })
          .then(() => {
            this.$emit("hideModal", "modalSurveyUpdate");
          });
      } else {
        this.basicAlert(msgType.fail, surveySave.fail);
      }
    }
  },
  // lifeCycle
  created() {
    const _this = this;

    setTimeout(function() {
      // 설문지 불러오기
      _this
        .selectWhereCtrl("adminSurvey", [
          firebase.firestore.FieldPath.documentId(),
          "==",
          _this.surveyDocId
        ])
        .then(res => {
          _this.setSurvey(res);
        });
    }, 1000);
  },
  props: {
    surveyDocId: {
      type: String
    }
  }
};
</script>


<style lang="scss" scoped>
/* questionHead */
.questionHead {
  padding: 0 5%;
}

input[name="selectedOne"] {
  vertical-align: middle;
}

#questionContent {
  width: 80%;
}

.custom-select {
  width: 40%;
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
  cursor: move;
}

.itemControl {
  margin-bottom: 10px;
}

.btnStyle {
  float: right;
  margin-right: 5%;
}

// draggable
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

// fade
.flip-list-enter-active,
.flip-list-leave-active {
  transition: opacity 0.5s;
}

.flip-list-enter,
.flip-list-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

