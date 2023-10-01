import React from "react";
import {
  Button,
  Container,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { ToastContainer, toast } from "react-toastify";
import useAuthStore from "store/auth";
import { Response, User } from "types";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const form = useForm<Omit<User, "id" | "role">>({
    validateInputOnChange: true,
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) => (value === "" ? "Username is required" : null),
      password: (value) => (value === "" ? "Password is required" : null),
    },
  });

  const onSubmitHandler = async (user: Omit<User, "_id" | "role">) => {
    await login(user.username, user.password)
      .then((res) => {
        toast.success(res.message as string);
        navigate("/voters");
      })
      .catch((err: Response) => {
        toast.warn(err.message as string);
      });
  };
  return (
    <Container size={420} my={40}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
      />
      <Title style={{ textAlign: "center" }}>Voters Information System!</Title>

      <form onSubmit={form.onSubmit(onSubmitHandler as any)}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="username"
            placeholder="you@mantine.dev"
            required
            {...form.getInputProps("username")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />

          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </Paper>
      </form>
    </Container>
  );
};

export default LoginPage;
