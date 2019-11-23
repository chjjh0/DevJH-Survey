<template>
  <router-view />
</template>

<script>
export default {};
</script>

<style>
/* alias */
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}

.mb-15 {
  margin-bottom: 15px;
}

.pa-10 {
  padding: 10px;
}

.in-bl {
  display: inline-block;
}

.fr {
  float: right;
}

.cs {
  cursor: pointer;
}
</style>
