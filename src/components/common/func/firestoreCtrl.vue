<script>
// firebase
import * as firebase from "firebase";

const firestore = firebase.firestore();

export default {
  methods: {
    // surveyWrite
    addCtrl(collectionName, sendData) {
      return new Promise((resolve, reject) => {
        firestore
          .collection(collectionName)
          .add(sendData)
          .then(() => {
            resolve(true);
          });
      });
    },
    selectAllOrderByCtrl(collectionName, orderByOpt) {
      const [target, orderBy] = orderByOpt;

      return new Promise((resolve, reject) => {
        firestore
          .collection(collectionName)
          .orderBy(target, orderBy)
          .get()
          .then(docs => {
            if (docs.docs.length > 0) {
              resolve(docs);
            }
          });
      });
    },
    // submitUpdate, submitList
    selectWhereCtrl(collectionName, condition) {
      const [target, sign, val] = condition;
      // target: 비교 대상 ( 문서명 or 필드명 )
      // sign: <, <=, ==, >, >=
      // val: 비교 할 값
      return new Promise((resolve, reject) => {
        firestore
          .collection(collectionName)
          .where(target, sign, val)
          .get()
          .then(docs => {
            if (docs.empty === false) {
              resolve(docs);
            }
          });
      });
    },
    // surveyView
    selectOneDocIdCtrl(collectionName, docId) {
      return new Promise((resolve, reject) => {
        firestore
          .collection(collectionName)
          .doc(docId)
          .get()
          .then(docs => {
            if (docs.exists === true) {
              resolve(docs);
            }
          });
      });
    },
    // surveyUpdate
    updateCtrl(collectionName, docId, sendData) {
      return new Promise((resolve, reject) => {
        firestore
          .collection(collectionName)
          .doc(docId)
          .update(sendData)
          .then(res => {
            resolve(true);
          });
      });
    }
  }
};
</script>
