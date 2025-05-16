import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import performStatusCheck from '../utils/checkStatus';

export const useRouteStatusChecker = (handleLogout, versionNo) => {
  const location = useLocation();
  const user = useSelector((state) => state.user);  // Access user from Redux

  const debouncedCheckStatus = debounce(() => {
    // console.log('Route changed, triggering status check');
    performStatusCheck(handleLogout, versionNo, user);  
  }, 1000);

  useEffect(() => {
    // console.log('useRouteStatusChecker mounted or route changed:', location.pathname);
    debouncedCheckStatus();

    return () => {
      debouncedCheckStatus.cancel();
    };
  }, [location.pathname, handleLogout, versionNo, user, debouncedCheckStatus]);
};
