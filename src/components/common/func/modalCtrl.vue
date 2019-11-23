<script>
export default {
  methods: {
    showModal(_this, modalName) {
      _this.$bvModal.show(modalName);
    },
    hideModal(_this, modalName) {
      _this.$bvModal.hide(modalName);
    }
  }
};
</script>
