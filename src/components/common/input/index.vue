<template>
  <b-form-input
    @keyup.enter="(func !== undefined) ? func() : null"
    v-model="localVal"
    :type="inputType"
    :class="clsName"
    :placeholder="plsholder"
  ></b-form-input>
</template>

<script>
export default {
  data() {
    return {
      currentType: this.inputType,
      localVal: ""
    };
  },
  watch: {
    localVal(newVal) {
      this.$emit("changeVal", [this.currentType, this.localVal]);
    }
  },
  props: {
    inputType: {
      type: String
    },
    clsName: {
      type: String
    },
    plsholder: {
      type: String
    },
    bindVal: {
      type: [Number, String, Boolean, Array, Object, Function]
    },
    func: {
      type: Function
    }
  }
};
</script>

<style>
</style>
