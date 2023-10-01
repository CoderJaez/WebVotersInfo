import { VoterPage, LoginPage } from "@pages/index";
import {
  Gauge,
  Chalkboard,
  Dashboard,
  FileStack,
  User,
} from "tabler-icons-react";
import { Route } from "types";

const routes: Omit<Route, "leftSection" | "rightSection">[] = [
  { label: "Voters", path: "/voters", component: <VoterPage /> },
];

export const navLinks: Omit<Route, "component" | "rightSection">[] = [
  {
    label: "Voters",
    path: "/voters",
    leftSection: <FileStack size="1rem" strokeWidth={1.5} />,
  },
];

export default routes;
