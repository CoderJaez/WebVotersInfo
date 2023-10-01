import React, { SyntheticEvent, useState } from "react";
import {
  Container,
  Button,
  Card,
  Image,
  Text,
  Group,
  Table,
  Title,
  Modal,
  TextInput,
  ActionIcon,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import moment from "moment";
import useVoter from "@services/VoterService";
import useVoterStore from "@store/voter.store";
import { useDisclosure } from "@mantine/hooks";
import { Edit, Trash } from "tabler-icons-react";
import { VoterInfo } from "types";
import { ToastContainer, toast } from "react-toastify";
import { ConfirmationDialog } from "@components/utils";

const VoterPage: React.FC = () => {
  const { loading, getVoter, addVoter, updateVoter, removeVoter } = useVoter();
  const { voters, setVoters, addOneVoter, removeOneVoter } = useVoterStore();
  const [opened, { open, close }] = useDisclosure(false);
  const [voter, setVoter] = useState<VoterInfo | null>(null);
  const [search, setSearch] = useState("");
  const [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  const handleCloseConfirmationDialog = () => {
    setConfirmationDialogOpen(false);
  };

  const fetchData = async (search: string) => {
    await getVoter(search)
      .then((res) => {
        setVoters(res);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      firstname: "",
      lastname: "",
      middlename: "",
      votersId: "",
      precinctNo: "",
      gender: "",
      address: "",
      city: "",
      province: "",
      image_path: "",
    },
    validate: {
      firstname: (value) =>
        value.trim().length !== 0 ? null : "firstname is required",
    },
  });

  const onSubmitHandler = async (values: typeof form.values) => {
    try {
      if (voter == null) {
        await addVoter(values as Omit<VoterInfo, "_id">)
          .then((res) => {
            addOneVoter(res.data as VoterInfo);
            toast.success(res.message as string);
          })
          .catch((err: any) => {
            if (err.status === 400) {
              err.message.forEach((msg: any) => {
                form.setFieldError("roomNo", msg.message);
              });
            }
          });
      } else {
        await updateVoter(values as Omit<VoterInfo, "_id">, voter._id)
          .then((res) => {
            const updatedVoter = {
              ...voter,
              ...values,
            };
            const newItems = voters.map((room) =>
              room._id === updatedVoter._id ? updatedVoter : room,
            );
            setVoters(newItems);
            toast.success(res.message as string);
            setVoter(null);
            form.reset();
          })
          .catch((err: any) => {
            if (err.status === 400) {
              err.message.forEach((msg: any) => {
                form.setFieldError("roomNo", msg.message);
              });
            } else {
              toast.error(err.message);
            }
          });
      }
    } catch (error) {
      console.log(error);
    } finally {
      form.reset();
    }
  };

  const handleConfirmAction = async () => {
    // Add your logic for the confirmation action here
    // For example, delete an item or perform a critical action
    await removeVoter(voter?._id as string)
      .then((res) => {
        toast.success(res.message as string);
        removeOneVoter(voter?._id as string);
        setVoter(null);
      })
      .catch((err: any) => {
        if (err.status === 400) {
          err.message.forEach((msg: any) => {
            form.setFieldError("roomNo", msg.message);
          });
        } else {
          toast.error(err.message);
        }
      });
    handleCloseConfirmationDialog();
  };
  const editRoom = (id: string) => {
    const _voter = voters.find((room) => room._id === id);
    setVoter(_voter as VoterInfo);
    form.setFieldValue("firstname", _voter?.firstname as string);
    form.setFieldValue("middlename", _voter?.middlename as string);
    form.setFieldValue("lastname", _voter?.lastname as string);
    form.setFieldValue("gender", _voter?.gender as string);
    form.setFieldValue("address", _voter?.address as string);
    open();
  };

  const action = (id: string) => {
    return (
      <Group justify="row">
        <ActionIcon
          variant="filled"
          color="yellow"
          aria-label="edit"
          onClick={() => editRoom(id)}
        >
          <Edit style={{ width: "70%", height: "70%" }} strokeWidth={1.5} />
        </ActionIcon>
        <ActionIcon
          variant="filled"
          color="red"
          aria-label="delete"
          onClick={() => {
            setVoter(voters.find((room) => room._id === id) as VoterInfo);
            setConfirmationDialogOpen(true);
          }}
        >
          <Trash style={{ width: "70%", height: "70%" }} strokeWidth={1.5} />
        </ActionIcon>
      </Group>
    );
  };

  const onSearchHandler = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchData(search);
    }
  };

  React.useEffect(() => {
    fetchData("");
  }, []);
  return (
    <Container fluid p="lg">
      <ToastContainer />
      <ConfirmationDialog
        open={isConfirmationDialogOpen}
        onClose={handleCloseConfirmationDialog}
        onConfirm={handleConfirmAction}
        title="Delete Confirmation"
        message="Are you sure you want to proceed?"
      />
      <Card shadow="sm" p="md" radius="sm" withBorder>
        <Card.Section>
          <Title order={2} p="sm">
            Voters
          </Title>
          <Group justify="space-between" m="md">
            <Button
              onClick={() => {
                form.reset();
                setVoter(null);
                open();
              }}
            >
              New Voter
            </Button>
            <TextInput
              placeholder="Search"
              onKeyDown={onSearchHandler}
              onChange={(e: any) => setSearch(e.target.value)}
            />
          </Group>
        </Card.Section>
        <Table.ScrollContainer minWidth={600}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Id</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Gender</Table.Th>
                <Table.Th>Address</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {voters.map((element) => (
                <Table.Tr key={element._id}>
                  <Table.Td>{element._id}</Table.Td>
                  <Table.Td>
                    {`${element.firstname} ${element.middlename} ${element.lastname}`}
                  </Table.Td>
                  <Table.Td>{action(element.gender)}</Table.Td>
                  <Table.Td>{action(element.address)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        <Modal
          opened={opened}
          onClose={close}
          title="Voter"
          closeOnClickOutside={false}
          closeOnEscape
        >
          <form onSubmit={form.onSubmit(onSubmitHandler)}>
            <Stack>
              <TextInput
                data-autofocus
                label="Room No"
                placeholder="Eg. IT102"
                {...form.getInputProps("roomNo")}
              />
              <Button type="submit" loading={loading}>
                Save
              </Button>
            </Stack>
          </form>
        </Modal>
      </Card>
    </Container>
  );
};

export default VoterPage;
