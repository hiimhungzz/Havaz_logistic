const _Cookies = window.Cookies;

const get = key => {
  try {
    const jwtToken = _Cookies.get(key);
    return jwtToken;
  } catch (err) {
    remove();
    return null;
  }
};
const remove = key => {
  _Cookies.remove(key);
};
const set = (
  key,
  value,
  options = {
    expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
  },
) => {
  _Cookies.set(key, value);
};
export const $Cookies = {
  get,
  remove,
  set,
};
