<script>
export default {
  methods: {
    // 질문 추가
    addQuestion(draggableIdx, questionIdx) {
      return {
        draggableIdx,
        questionContent: "",
        answerType: "1",
        options: [
          { value: null, text: "Please select an option" },
          { value: "1", text: "Yes / No" },
          { value: "2", text: "한 개 선택" },
          { value: "3", text: "여러 개 선택" }
        ],
        surveyIdx: this.sendData.surveyIdx,
        questionIdx,
        selectedRadioVal: "",
        selectedOneArrIndex: 1,
        selectedMultiArrIndex: 1,
        selectedOneArr: [{ answerIdx: 1, value: "" }],
        selectedMultiArr: [{ answerIdx: 1, value: "" }]
      };
    },
    // 질문 삭제
    removeQuestion(itemArr, questionIdx) {
      let result = 0;

      itemArr.forEach((item, idx) => {
        if (item.questionIdx === questionIdx) {
          result = idx;
        }
      });

      return result;
    },
    // 한 개만 선택, 여러 개 선택 질문에 대한 답변란 추가
    addAnswer(arrType, currentItemArr) {
      let answerIdx = 0;
      // const currentItemArr = this.sendData.itemArr[itemIdx];

      switch (arrType) {
        case "selectedOneArr":
          answerIdx = ++currentItemArr.selectedOneArrIndex;
          break;
        case "selectedMultiArr":
          answerIdx = ++currentItemArr.selectedMultiArrIndex;
          break;
        default:
          break;
      }

      currentItemArr[arrType].push({
        answerIdx,
        value: ""
      });
    },
    // 답변란 삭제
    removeAnswer(itemArr, answerIdx) {
      return itemArr.filter(answer => answer.answerIdx !== answerIdx);
    }
  }
};
</script>
