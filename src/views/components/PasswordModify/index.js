import Vue from 'vue';
import store from '@/store';
import options from './Main';

class PasswordModify {
  vm = null

  init = () => {
    const Component = Vue.extend(options);

    this.vm = new Component({ store }).$mount();

    document.body.appendChild(this.vm.$el);
  }

  open = () => {
    this.init();
  }
}

export default new PasswordModify();
