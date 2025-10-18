const path = {
  home: '/',
  login: '/auth/login',
  logout: '/auth/logout',
  register: '/auth/register',
  admin: '/admin',
  myProfile: '/profile',
  analyze: '/video-analyzer/analyze',
  videos: '/video-analyzer/videos',
  locations: '/locations'
} as const

export default path
