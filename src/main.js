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
Vue.directive('focus', {
  inserted(el) {
    // childNodes: DOM 애서 자식 노드를 선택할 수 있다.
    el.childNodes[1].focus();
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
