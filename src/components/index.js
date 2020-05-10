
import Http from './http';
import Toast from './toast';

function install(Vue) {
  if (install.installed) return;

  // prototype
  Vue.prototype.$http = Http;
  Vue.prototype.$toast = Toast;
}

export default install;
