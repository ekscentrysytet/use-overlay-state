const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface User {
  id: number
  firstName: string
  lastName: string
  gender: string
  updatedAt?: number
}

export default {
  update: async (userId: number, payload: Omit<User, 'id'>): Promise<User> => {
    await sleep(2000)

    return {
      id: userId,
      ...payload,
      updatedAt: Date.now(),
    }
  },
}
