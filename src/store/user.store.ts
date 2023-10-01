import { User } from "types";
import { create } from "zustand";

interface UserState {
  users: User[];
  add: (value: User) => void;
  remove: (id: string) => void;
  setUsers: (values: User[]) => void;
}

const useUserStore = create<UserState>()((set) => ({
  users: [],
  add: (value: User) => set((state) => ({ users: [value, ...state.users] })),
  remove: (id: string) =>
    set((state) => ({ users: state.users.filter((user) => user.id !== id) })),
  setUsers: (values: User[]) => set(() => ({ users: values })),
}));

export default useUserStore;
