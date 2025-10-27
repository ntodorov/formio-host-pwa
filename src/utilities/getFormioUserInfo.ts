interface FormioUser {
  _id?: string;
  id?: string;
  name?: string;
  data?: {
    name?: string;
    username?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface UserInfo {
  userId: string | null;
  userName: string | null;
}

/**
 * Fetch and extract user info from localStorage FormioUser object
 */

function getFormioUserInfo(): UserInfo | null {
  try {
    const userString = localStorage.getItem('formioUser');

    if (!userString) {
      console.warn('No FormioUser found in localStorage.');
      return null;
    }

    const formioUser: FormioUser = JSON.parse(userString);

    const userId = formioUser._id || formioUser.id || null;
    const userName =
      formioUser.data?.name ||
      formioUser.data?.username ||
      formioUser.name ||
      null;

    return { userId, userName };
  } catch (err) {
    console.error('Error parsing mioUser from localStorage:', err);
    return null;
  }
}

export default getFormioUserInfo;
