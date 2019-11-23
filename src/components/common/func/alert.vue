<script>
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

// swal
const Toast = Swal.mixin({
  toast: true,
  position: "center",
  showConfirmButton: false,
  timer: 1000
});

export default {
  methods: {
    basicAlert(msgType, content) {
      return new Promise((resolve, reject) => {
        Toast.fire({
          type: msgType,
          title: content
        });
        resolve(true);
      });
    },
    confirmAlert(msgType, content) {
      return new Promise((resolve, reject) => {
        Swal.fire({
          title: content,
          type: msgType,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "확인",
          cancelButtonText: "취소"
        }).then(res => {
          // 확인: res.value, 취소: res.dismiss 반환
          resolve(res.value ? true : false);
        });
      });
    }
  }
};
</script>
