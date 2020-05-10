import axios from 'axios';
import toast from '../components/toast';

const instance = axios.create({});

instance.interceptors.request.use(
  (config) => {
    // prefix
    // config.url = `/mgmt/${config.url.replace(/^\/?/, '')}`;
    config.url = `${window.BASE_URL}${config.url.replace(/^\/?/, '')}`;

    const token = localStorage.getItem('access_token');

    config.headers.Authorization = `Bearer ${token}`;

    if (!config.params) config.params = {};
    Object.assign(config.params, { _r: Math.random() });

    return config;
  },
  error => Promise.reject(error),
);

instance.interceptors.response.use(
  response => response,
  (error) => {
    // error handler
    const { config, response } = error;
    const { status } = response;
    // status code
    if (status === 401 || status === 403) {
      // TODO 授权跳页
      // router.push('/login');
      // const path = encodeURIComponent(window.location.href);
      window.location = '/login';
    } else if (status >= 400 && status < 600 && response && response.data) {
      if (!Object.hasOwnProperty.call(config, 'errorHandler')) {
        const errMsg = response.data.err_msg;
        if (errMsg && typeof errMsg === 'string') {
          toast(errMsg);
        } else if (errMsg && Array.isArray(errMsg)) {
          toast(errMsg[0]);
        }
      }
    } else if (status >= 500) {
      window.location = '/login';
    }
    // else if (status >= 400 && status < 500) {}
    return Promise.reject(error);
  },
);

export default instance;
