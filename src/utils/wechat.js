

const protocol = 'http:';
const host = process.env.SERVER_ENV === 'test' ? 'test-jstlq.yunkai.com' : 'jstlq.yunkai.com';
const virtualPath = process.env.SERVER_ENV === 'test' ? '/basic-wechat-test' : '/basic-wechat';

const wxAuthUrl = '/basic-api/wechat/mp/authorize/userinfo';
const wxSilentAuthUrl = '/basic-api/wechat/mp/authorize';
const wxAuthUrl3rd = '/basic-api/wechat/thirdparty/oauth2/authorize/userinfo';
const wxSilentAuthUrl3rd = '/basic-api/wechat/thirdparty/oauth2/authorize';

function fullpath(url) {
  return `${protocol}//${host}${virtualPath}${url}`;
}

function silentAuthPath(appid) {
  if (appid) return wxSilentAuthUrl3rd;
  return wxSilentAuthUrl;
}
function authPath(appid) {
  if (appid) return wxAuthUrl3rd;
  return wxAuthUrl;
}

function pathWithAuth(path, options) {
  const opt = options || {};
  const { appid } = opt;
  const wxPath = opt.type === 'silent' ? silentAuthPath(appid) : authPath(appid);
  let url = `${protocol}//${host}${wxPath}?state=${encodeURIComponent(path)}`;
  if (appid) url += `&appid=${appid}`;
  return url;
}

function getPath(url, options) {
  const path = /^(http)/i.test(url) ? url : fullpath(url);
  return pathWithAuth(path, options);
}

function setSize(url, size) {
  // http://wx.qlogo.cn/
  // 用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像）
  if (/^https?:\/\/wx\.qlogo\.cn/i.test(url)) {
    return url.replace(/\d+$/i, size);
  }
  return url;
}

export {
  getPath,
  setSize,
};
