export const paths = {
  home: '/',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  page: {
    overview: '/home',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
