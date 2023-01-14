import TicketSelect from "@/components/TicketStatus";
import { Container, MultiSelect, Table, Title } from "@mantine/core";
import React from "react";

const index = () => {
  const mokdata = [
    {
      id: 1,
      name: "Todo",
      done: false,
      created: "2021-08-01",
      status: "open",
    },
    {
      id: 2,
      name: "Todo",
      done: false,
      created: "2021-08-01",
      status: "open",
    },
    {
      id: 3,
      name: "Todo",
      done: false,
      created: "2021-08-01",
      status: "open",
    },
    {
      id: 4,
      name: "Todo",
      done: false,
      created: "2021-08-01",
      status: "open",
    },
  ];

  const MultiSelectData = [
    {
      label: "Open",
      value: "open",
    },
    {
      label: "Closed",
      value: "closed",
    },
    {
      label: "In Progress",
      value: "in progress",
    },
    {
      label: "On Hold",
      value: "on hold",
    },
  ];
  return (
    <>
      <Container w={"100%"} p={"md"}>
        <Title size={30} fw={500}>
          Tickets
        </Title>
        <Table mt={"5vh"}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Todo</th>
              <th>Done</th>
              <th>Created</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mokdata.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.done ? "Yes" : "No"}</td>
                <td>{item.created}</td>
                <td>
                  <TicketSelect />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default index;
