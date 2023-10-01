import { VoterPage, LoginPage } from "@pages/index";
import { FileStack } from "tabler-icons-react";
import { Route } from "types";

const routes: Omit<Route, "leftSection" | "rightSection">[] = [
  { label: "Voters", path: "/voters", component: <VoterPage /> },
  { label: "Login", path: "/login", component: <LoginPage /> },
];

export const navLinks: Omit<Route, "component" | "rightSection">[] = [
  {
    label: "Voters",
    path: "/voters",
    leftSection: <FileStack size="1rem" strokeWidth={1.5} />,
  },
];

export default routes;
