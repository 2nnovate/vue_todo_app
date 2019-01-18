<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  .col100 {
    width: 100%;
  }
  section {
    text-align: left;
    padding: 1rem;
    width: 60%;
    margin: auto;
  }
  header {
    font-size: 3rem;
  }
  .margin-bottom {
    margin-bottom: .5rem;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .float-right {
    float: right;
  }
</style>
