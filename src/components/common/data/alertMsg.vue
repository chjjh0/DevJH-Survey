<script>
export default {
  data() {
    return {
      alertMsg: {
        msgType: {
          success: "success",
          warning: "warning",
          fail: "error"
        },
        // msgContent
        // 관리자용
        confirm: {
          delete: "삭제하시겠습니까?"
        },
        login: {
          fail: "관리자용 이메일과 비번을 확인해주세요.",
          empty: "빈칸을 확인해주세요."
        },
        surveyQuestion: {
          fail: "삭제 할 수 없습니다. 최소 1개의 질문이 있어야 합니다."
        },
        surveyAnswer: {
          fail: "삭제 할 수 없습니다. 최소 1개의 답변란이 있어야 합니다."
        },
        surveySave: {
          success: "설문지를 저장하였습니다.",
          fail: "설문지를 저장할 수 없습니다, 빈칸이 없는지 확인해주세요."
        },
        // 설문참여용
        surveyAccess: {
          success: "설문을 시작합니다.",
          fail: "이미 설문에 참여한 이름입니다.",
          guide: "빈칸이 있으면 안되며 한글만 사용 가능합니다."
        },
        submit: {
          success: "설문에 참여해주셔서 감사합니다.",
          fail:
            "설문지를 제출할 수 없습니다, 답변하지 않은 지문이 없는지 확인해주세요."
        },
        permission: {
          fail: "관리자 권한이 필요합니다."
        }
      }
    };
  }
};
</script>
