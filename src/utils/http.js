import Http from 'enslaver-http';

const apiMap = {
  localhost: 'https://oa-v2-admin-api.caihonggou.com',
  'oa-v2-admin-api.caihonggou': 'https://oa-v2-admin-api.caihonggou.com',
  'oa-v2-admin.aikaola.com': 'https://oa-v2-admin-api.aikaola.com',
};

export const baseURI = apiMap[window.location.hostname];

export default new Http({
  baseURI,
});
