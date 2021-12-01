import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'
import { User } from '../models/user'

const { persistAtom } = recoilPersist()

export const userState = atom<User | null>({
  key: 'userState',
  default: null,
  effects_UNSTABLE: [persistAtom],
})
