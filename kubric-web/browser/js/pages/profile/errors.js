export default {
  ACCESS_DENIED: {
    type: 'error',
    heading: 'Facebook Linking failed',
    desc: 'We were unable to link with your facebook account as access was denied during the login process.',
    timeout: 10000,
  },
  PERMISSIONS_DENIED: {
    type: 'error',
    heading: 'Facebook Linking failed',
    desc: 'We were unable to link with your facebook account. This was caused as either or both of the permissions required by Kubric - read pages and/or manage ads - were not provided duriing Facebook login process.',
    timeout: 15000,
  },
  DRIVE_CALLBACK_FAILED: {
    type: 'error',
    heading: 'Drive Linking failed',
    desc: 'We were unable to link with your drive account. Please try again after some time.',
    timeout: 3000,
  }
};