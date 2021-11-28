export interface UserServiceInfo {
  id: string
  name: string
  image: string
  token: string
}

export interface User extends UserServiceInfo {
  githubInfo?: UserServiceInfo
}
