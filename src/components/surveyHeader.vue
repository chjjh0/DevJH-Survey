<template>
  <header class="header clearfix">
    <div class="left-nav">
      <img src="../../static/devjh_logo.jpg" alt="logo" />
    </div>
    <div v-if="mode === 'admin'" class="right-nav">
      <b-dropdown size="lg" right variant="dark" toggle-class="text-decoration-none" no-caret>
        <template v-slot:button-content>
          <font-awesome-icon icon="user" />
        </template>
        <b-dropdown-item variant="dark" @click="logout">logout</b-dropdown-item>
      </b-dropdown>
    </div>
  </header>
</template>

<script>
export default {
  name: "surveyHeader",
  props: {
    logout: {
      type: Function
    },
    mode: {
      type: String
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 5vh;
  padding: 15px;
  color: white;
  background: black;
  display: table;

  .left-nav,
  .right-nav {
    display: table-cell;
    vertical-align: middle;
  }

  .left-nav {
    width: 100px;
    float: left;
  }

  .right-nav {
    float: right;
    font-size: 20px;
  }
}
</style>
