import { useRouteStatusChecker } from '../hooks/useRouteStatusChecker';

export const RouteGuard = ({ children, handleLogout, versionNo }) => {
  useRouteStatusChecker(handleLogout, versionNo);

  return children;
};
