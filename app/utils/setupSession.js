import Globals from './globals';
import { $Cookies } from './cookies';
import { JWT_TOKEN, CURRENT_USER } from './constants';
const setupSession = () => {
  Globals.reset();
  const token = $Cookies.get(JWT_TOKEN);
  const currentUser = $Cookies.get(CURRENT_USER);
  Globals.init({
    public: {
      currentUser,
    },
    private: {
      token,
    },
  });
};
export default setupSession;
