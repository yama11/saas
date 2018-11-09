import Http from 'enslaver-http';
import token from './token';

const apiMap = {
  localhost:
    'https://final-admin-api.caihonggou.com',
  'final-admin-vue.caihonggou.com':
    'https://final-admin-api.caihonggou.com',
  'final-admin.imkid.com.cn':
    'https://final-admin-api.aikaola.com',
};

const errorAOP = (res) => {
  if (res.status === 401) window.location.href = '/login';

  throw res;
};

export const baseURI = apiMap[window.location.hostname];

export default new Http({
  baseURI,
  baseHeaders: {
    Authorization: `Bearer ${token.get()}`,
  },
  baseInit: {
    mode: 'cors',
  },
  errorAOP,
});
