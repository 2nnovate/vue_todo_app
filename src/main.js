// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import router from './router';
import store from './store';

Vue.use(ElementUI);
Vue.config.productionTip = false;

// 사용자 정의 디렉티브 (v-focus 어트리뷰트로 사용가능)
// FIXME: element ui 는 하위에 실제 인풋박스를 만들기 때문에 워킹하지 않는다.
Vue.directive('focus', {
  inserted(el) {
    el.focus();
  },
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
});
