import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UserState {
  user: {
    token: string
  } | null
  loggedInUser: (token: string) => void
  logoutUser: () => void
}

const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      user: null,
      loggedInUser: (token: string) => set(() => ({ user: { token } })),
      logoutUser: () => set(() => ({ user: null })),
    })
  ),
)

export default useUserStore