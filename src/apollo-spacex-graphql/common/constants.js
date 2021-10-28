export const routes = {
  DASHBOARD: '/',
  USERS: '/users',
  LAUNCHES: '/launches',
  ROCKETS: '/rockets',
  EDIT_USER: '/users/:userId/edit',
  CREATE_USER: '/users/create',
  ROCKET_BY_ID: '/rockets/:rocketId',
  LAUNCH_BY_ID: '/launches/:launchId' ,
  UPCOMING_LAUNCH_BY_ID: 'upcoming-launch/:launchId',
  ERROR_404: "*"
}
export const defaultDateFormat = 'MM/DD/YYYY';
