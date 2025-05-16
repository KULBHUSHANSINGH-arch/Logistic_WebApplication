import axios from 'axios';
import { dev } from './ApiUrl';

const performStatusCheck = async (handleLogout, versionNo, user) => {
  const url = localStorage.getItem('url');
  const personId = localStorage.getItem('CurrentUser');

  // console.log('Checking status with:', {
  //   user,
  //   dev,
  //   versionNo,
  // });

  try {
    const response = await axios.post(`${dev}/user/CheckActive`, {
        personId: user.user.personId,  // Use the personId from the user object
    });
    // console.log('Status Response:', response.data);

    if (response.data.status === 'Inactive' || response.data.versionName !== versionNo) {
      console.log('Status check failed: Logging out user.');
      handleLogout();
    } else {
      // console.log('Status check passed.');
    }
  } catch (err) {
    console.error('Error checking status:', err);
  }
};

export default performStatusCheck;
