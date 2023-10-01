import { create } from "zustand";
import { User, Response } from "types";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "api/axios";

interface UserState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<Response>;
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

const useAuthStore = create<UserState>()(
  persist(
    (set) => ({
      user: {
        id: "",
        username:"",
        password: "",
        role: "",
      },
      accessToken: "",
      refreshToken: "",
      login: async (email: string, password: string) => {
        return await new Promise<Response>((resolve, reject) => {
          axios
            .post("auth/login", {
              email: email,
              password: password,
            })
            .then((res) => {
              if (res.data.user.role == "admin") {
                const response: Response = {
                  status: res.status,
                  message: res.data.message,
                };
                // const user = { ...res.data.user, password: password };
                const user = res.data.user;
                set((state) => ({ ...state.user, user }));
                set(() => ({ accessToken: res.data.access_token }));
                set(() => ({ refreshToken: res.data.refresh_token }));
                resolve(response);
              } else {
                reject({
                  status: 200,
                  message: "Only staff or admin can access the admin site. ",
                });
              }
            })
            .catch((err) => {
              console.log("Error:", err);
              const response: Response = {
                status: err.response.status,
                message: err.response.data.message,
              };
              reject(response);
            });
        });
      },
      setUser: (user: User) => set((state) => ({ ...state.user, user })),
      setAccessToken: (token: string) => set(() => ({ accessToken: token })),
      setTokens: (accessToken: string, refreshToken: string) =>
        set(() => ({ accessToken: accessToken, refreshToken: refreshToken })),
    }),
    {
      name: "user-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);

export default useAuthStore;
