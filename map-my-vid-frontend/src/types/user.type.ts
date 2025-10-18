export interface User {
  _id: string
  roles: Role[]
  email: string
  name: string
}

type Role = 'User' | 'Admin'
