import { useState } from "react";
import useAxiosPrivate from "@hooks/useAxiosPrivate";
import { Response, User } from "types";

interface UserResponse extends Response {
  user: User | null;
}

const useUser = () => {
  const [loading, setLoading] = useState(false);
  const axios = useAxiosPrivate();

  const getUsers = async (search: string) => {
    return await new Promise<User[]>((resolve, reject) => {
      axios
        .get(`users?search=${search}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          console.log("Error:", err);
          reject([]);
        });
    });
  };

  const updateUser = async (
    id: string,
    values: Omit<User, "_id" | "image_path" | "password">,
  ) => {
    setLoading(true);
    return await new Promise<Response>((resolve, reject) => {
      axios
        .put(`users/${id}`, values)
        .then((res) => {
          const result = {
            status: res.status,
            message: res.data.message,
          };
          resolve(result);
        })
        .catch((err) => {
          const result = {
            status: err.response.status,
            message: err.response.data.message,
          };
          reject(result);
        })
        .finally(() => setLoading(false));
    });
  };

  const addUser = async (
    values: Omit<User, "_id" | "image_path" | "password">,
  ) => {
    setLoading(true);
    const value = { ...values, ...{ role: values.role.toLowerCase() } };
    return await new Promise<UserResponse>((resolve, reject) => {
      axios
        .post("users", value)
        .then((res) => {
          const result: UserResponse = {
            status: res.status,
            user: res.data.data,
            message: res.data.message,
          };
          resolve(result);
        })
        .catch((err) => {
          const result: UserResponse = {
            status: err.response.status,
            user: null,
            message: err.response.data.message,
          };
          reject(result);
        })
        .finally(() => setLoading(false));
    });
  };

  const removeUser = async (id: string) => {
    setLoading(true);
    return await new Promise<Response>((resolve, reject) => {
      axios
        .delete(`users/${id}`)
        .then((res) => {
          const result = {
            status: res.status,
            message: res.data.message,
          };
          resolve(result);
        })
        .catch((err) => {
          const result = {
            status: err.response.status,
            message: err.response.data.message,
          };
          reject(result);
        })
        .finally(() => setLoading(false));
    });
  };

  return {
    loading,
    addUser,
    getUsers,
    updateUser,
    removeUser,
  };
};

export default useUser;
