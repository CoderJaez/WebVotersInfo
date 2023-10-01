import useAxiosPrivate from "../hooks/useAxiosPrivate";
import React, { useState } from "react";
import { VoterInfo, Response } from "../types";

interface VoterResponse extends Response {
  data: VoterInfo[] | VoterInfo | null;
}
const useVoter = () => {
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const getVoter = async (search: string) => {
    return await new Promise<VoterInfo[]>((resolve, reject) => {
      setLoading(true);
      axiosPrivate
        .get(`Voters?search=${search}`)
        .then((res) => {
          const result: VoterInfo[] = res.data;
          resolve(result);
        })
        .catch((err) => {
          console.log("Error:", err);
          reject([]);
        })
        .finally(() => setLoading(false));
    });
  };

  const addVoter = async (values: Omit<VoterInfo, "_id">) => {
    setLoading(true);
    return await new Promise<VoterResponse>((resolve, reject) => {
      axiosPrivate
        .post("voters", values)
        .then((res) => {
          const result = {
            status: res.status,
            data: res.data.voter as VoterInfo,
            message: res.data.message,
          };
          resolve(result);
        })
        .catch((err) => {
          const result = {
            status: err.response.status,
            data: null,
            message: err.response.data.message,
          };
          reject(result);
        })
        .finally(() => setLoading(false));
    });
  };

  const updateVoter = async (values: Omit<VoterInfo, "_id">, id: string) => {
    setLoading(true);
    return await new Promise<Response>((resolve, reject) => {
      axiosPrivate
        .put(`voters/${id}`, values)
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

  const removeVoter = async (id: string) => {
    setLoading(true);
    return await new Promise<Response>((resolve, reject) => {
      axiosPrivate
        .delete(`Voters/${id}`)
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
    getVoter,
    loading,
    updateVoter,
    addVoter,
    removeVoter,
  };
};

export default useVoter;
