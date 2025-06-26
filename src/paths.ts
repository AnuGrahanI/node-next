export const paths = {
  home: '/',
  auth: {
    login: '/login',
    register: '/register',
  },
  page: {
    overview: '/dashboard',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
