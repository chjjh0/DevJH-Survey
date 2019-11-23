<script>
export default {
  methods: {
    // surveyWrite, surveyUpdate
    validSurvey(sendData) {
      let validQuestionContent = [];
      let selectedOne = [];
      let selectedMulti = [];

      // 설문 제목
      const validSurveyTitle = sendData.surveyTitle.trim() !== "";

      sendData.itemArr.map(item => {
        validQuestionContent.push(
          // 질문 내용
          item.questionContent.trim() !== "" ? true : false
        );

        if (item.answerType === "2" || item.answerType === "3") {
          switch (item.answerType) {
            case "2":
              // 한 개 질문 내용
              item.selectedOneArr.map(answer => {
                selectedOne.push(answer.value !== "" ? true : false);
              });
              break;
            case "3":
              // 여러 개 질문 내용
              item.selectedMultiArr.map(answer => {
                selectedMulti.push(answer.value !== "" ? true : false);
              });
              break;
            default:
              break;
          }
        }
      });

      return (
        validSurveyTitle &&
        validQuestionContent.every(val => val === true) &&
        selectedOne.every(val => val === true) &&
        selectedMulti.every(val => val === true)
      );
    },
    // surveyWrite, surveyUpdate
    validLeng(itemLeng, numCondition) {
      // 부호에 유연성을 부여하려면 부호에 맞는 switch 필요
      // 예) equal 이란 인자를 받은 경우 == 로 비교 하는 case 작성
      // 추후 필요하면 유연성 부여
      return itemLeng <= numCondition ? true : false;
    },
    // surveyView
    validSurveyView(itemArr) {
      let result = [];

      itemArr.map(item => {
        if (item.answers) {
          // 여러 개 답변
          result.push(item.answers.length > 0 ? true : false);
        } else {
          // Yes or No, 한 개 답변
          result.push(item.answer.length > 0 ? true : false);
        }
      });

      return result.every(val => val === true);
    },
    // 한글만 입력 가능
    validKorean(val) {
      if (val !== "") {
        const condition = /^[가-힣]+$/;
        return condition.test(val);
      }
    },
    // 빈 칸 체크
    validEmptyVal(valArr) {
      return valArr.every(val => val !== "");
    }
  }
};
</script>
