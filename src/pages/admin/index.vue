<template>
  <div>
    <surveyHeader :mode="'admin'" :logout="logout"></surveyHeader>

    <div class="clearfix">
      <div class="btnArea fr">
        <b-button
          variant="outline-primary"
          class="md-primary"
          @click="showModal('modalSurveyWrite')"
        >설문지 추가</b-button>
      </div>
    </div>

    <b-modal id="modalSurveyWrite" size="lg" no-close-on-backdrop hide-footer>
      <template v-slot:modal-header>
        <h5>설문지 추가</h5>
      </template>

      <surveyWrite :userInfo="userInfo" @hideModal="hideModal"></surveyWrite>
    </b-modal>

    <b-modal id="modalSurveyUpdate" size="lg" no-close-on-backdrop hide-footer>
      <template v-slot:modal-header>
        <h5>설문지 수정</h5>
      </template>

      <surveyUpdate :surveyDocId="surveyDocId" @hideModal="hideModal"></surveyUpdate>
    </b-modal>

    <template v-if="surveyListData.length > 0">
      <surveyList
        @updateSurvey="updateSurvey"
        @deleteSurvey="handleDeleteSurvey"
        :surveyListData="surveyListData"
        :userInfo="userInfo"
      ></surveyList>
    </template>
  </div>
</template>

<script>
// firebase
import * as firebase from "firebase";
// common
import alertMsg from "../../components/common/data/alertMsg";
import alert from "../../components/common/func/alert";
import firestoreCtrl from "../../components/common/func/firestoreCtrl";
// components
import surveyHeader from "../../components/surveyHeader";
import surveyWrite from "../../components/surveyWrite";
import surveyUpdate from "../../components/surveyUpdate";
import surveyList from "../../components/surveyList";

const auth = firebase.auth();
const firestore = firebase.firestore();

export default {
  data() {
    return {
      userInfo: "",
      surveyListData: [],
      surveyDocId: ""
    };
  },
  components: {
    surveyHeader,
    surveyWrite,
    surveyUpdate,
    surveyList
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
  mixins: [alertMsg, alert, firestoreCtrl],
  methods: {
    checkLogin() {
      let result = false;
      auth.onAuthStateChanged(user => {
        if (!user) {
          this.$router.push({
            name: "root"
          });
        } else {
          this.userInfo = user.uid;
          result = true;
        }
        return result;
      });
    },
    // 설문 참여자 count
    fetchSubmitCount(surveyIdx) {
      this.selectWhereCtrl("submitSurvey", ["surveyIdx", "==", surveyIdx]).then(
        docs => {
          this.surveyListData.map(survey => {
            if (survey[0].surveyIdx === surveyIdx) {
              survey[0].submitCount = docs.docs.length;
            }
          });
        }
      );
    },
    // 설문지 불러오기
    fetchData() {
      firestore
        .collection("adminSurvey")
        .orderBy("surveyIdx", "desc")
        .get()
        .then(docs => {
          if (docs.docs.length > 0) {
            let result = false;
            // init
            this.surveyListData = [];

            docs.forEach(doc => {
              const res = doc.data();
              // surveyList에 전달 할 surveyListData 세팅
              this.surveyListData.push([
                {
                  surveyIdx: res.surveyIdx,
                  questionCount: res.itemArr.length,
                  submitCount: 0,
                  title: res.surveyTitle,
                  webAddr: doc.id
                }
              ]);
              this.fetchSubmitCount(res.surveyIdx);

              result = true;
            });

            return result;
          }
        });
    },
    // 로그아웃
    logout() {
      auth.signOut().then(() => {
        window.location.href = "/";
      });
    },
    // modal
    showModal(modalName) {
      this.$bvModal.show(modalName);
    },
    hideModal(modalName) {
      this.$bvModal.hide(modalName);
      this.fetchData();
    },
    // 설문지 수정/삭제
    updateSurvey(docId) {
      this.surveyDocId = docId;
      this.$bvModal.show("modalSurveyUpdate");
    },
    deleteSurvey(docId) {
      const firestore = firebase.firestore();

      firestore
        .collection("adminSurvey")
        .doc(docId)
        .delete()
        .then(() => {
          this.fetchData();
        });
    },
    handleDeleteSurvey(docId) {
      const { msgType, confirm } = this.alertMsg;

      this.confirmAlert(msgType.warning, confirm.delete).then(result => {
        if (result) {
          this.deleteSurvey(docId);
        }
      });
    }
  },
  watch: {
    userInfo(newVal) {
      this.fetchData();
    }
  },
  // lifeCycle
  mounted() {
    this.checkLogin();
  }
};
</script>

<style lang="scss" scoped>
.btnArea {
  margin: 15px;
}

.item {
  width: 50%;
  margin: 10px auto;
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

.questionArea input {
  /* width: 80%; */
}

// fade
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

