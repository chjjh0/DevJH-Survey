<template>
  <div class="loginBackground">
    <div class="loginContainer">
      <h1>SIGN IN</h1>

      <cInput
        :inputType="'email'"
        :clsName="'inputStyle'"
        :plsholder="'이메일을 입력하세요'"
        @changeVal="changeVal"
        :func="handleLogin"
      />

      <cInput
        :inputType="'password'"
        :clsName="'inputStyle'"
        :plsholder="'비밀번호를 입력하세요'"
        @changeVal="changeVal"
        :func="handleLogin"
      />

      <b-button @click="handleLogin" class="btnStyle" block variant="primary">Login</b-button>
    </div>
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import fbConfig from "../../fbConfing";
// common
import alertMsg from "../../components/common/data/alertMsg";
import alert from "../../components/common/func/alert";
import validation from "../../components/common/func/validation";
// components
import cInput from "../../components/common/input";

// firebase init
firebase.initializeApp(fbConfig);

export default {
  data() {
    return {
      userMail: "",
      userPW: "",
      isLogin: false
    };
  },
  components: {
    cInput
  },
  mixins: [alertMsg, alert, validation],
  methods: {
    changeVal(e) {
      // e[0]: inputtype, e[1]: inputVal
      switch (e[0]) {
        case "email":
          this.userMail = e[1];
          break;
        case "password":
          this.userPW = e[1];
          break;
        default:
          break;
      }
    },
    movePage(dest) {
      window.location = dest;
    },
    handleLogin() {
      const { msgType, login } = this.alertMsg;

      if (this.validEmptyVal([this.userMail, this.userPW])) {
        firebase
          .auth()
          .signInWithEmailAndPassword(this.userMail, this.userPW)
          .then(res => {
            if (res === undefined) {
              // login failed
              this.basicAlert(msgType.fail, login.fail);
            } else {
              // 로그인 여부 확인 및 페이지 이동은 firebase의 onAuthStateChanged에서 전담
              // 로그인 성공 시 페이지 이동 로직이 있을경우 onAuth...과 충돌하여
              // 페이지 이동 후 basicAlert 호출 됨
              // 때문에 isLogin flag를 두어 created()에 있는 onAuth.. 와 충돌 방지
              this.isLogin = true;
              this.movePage("/surveylist");
            }
          })
          .catch(res => {
            this.basicAlert(msgType.fail, login.fail);
          });
      } else {
        this.basicAlert(msgType.fail, login.empty);
      }
    }
  },
  // lifeCycle
  created() {
    // onAuth..는 현 페이지에서 로그인 여부에 따라 watch 와 유사한 방식으로 트리거
    // lifeCycle을 무시하고 로그인 여부에 따라 트리거 되기때문에
    // created '시' 에만 로그인 여부 확인 및 콜백처리가 불가
    // isLogin falg를 두어 오작동 ( 페이지 이동 후 basicAlert 출력 ) 방지
    // 정상 작동 ( basicAlert 출력 후 페이지 이동 )
    firebase.auth().onAuthStateChanged(user => {
      if (user && this.isLogin === false) {
        this.basicAlert("error", "이미 로그인 중입니다.").then(res => {
          this.movePage("/surveylist");
        });
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.loginBackground {
  padding: 100px;
}

.loginContainer {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  overflow: hidden;
  width: 500px;
  height: 400px;
  text-align: center;
  margin: 0 auto;

  h1 {
    margin: 30px 0;
  }
}

.inputStyle,
.btnStyle {
  width: 70%;
  margin: 15px auto;
}
</style>
