import React from "react";

export interface Route {
  label: string;
  path: string;
  component: React.ReactElement | null;
  leftSection: React.ReactElement;
  rightSection: React.ReactElement;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: string;
}

export interface Response {
  status: number;
  message: string | Object;
}

export interface VoterInfo {
  _id: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  gender: string;
  address: string;
  image_path: string;
}
