import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const mockUsers = [
  {
    id: 1,
    username: "guri",
    email: "guri@email.com",
    role: "developer",
  },
  {
    id: 2,
    username: "noveli",
    email: "noveli@email.com",
    role: "designer",
  },
  {
    id: 3,
    username: "joaozinho",
    email: "joaozinho@email.com",
    role: "manager",
  },
  {
    id: 4,
    username: "ana_silva",
    email: "ana.silva@email.com",
    role: "analyst",
  },
  {
    id: 5,
    username: "pedro_dev",
    email: "pedro.dev@email.com",
    role: "developer",
  },
  {
    id: 6,
    username: "mari_costa",
    email: "mari.costa@email.com",
    role: "product_owner",
  },
  {
    id: 7,
    username: "lucas_santos",
    email: "lucas.santos@email.com",
    role: "developer",
  },
  {
    id: 8,
    username: "carol_lima",
    email: "carol.lima@email.com",
    role: "designer",
  },
  {
    id: 9,
    username: "rafael_alves",
    email: "rafael.alves@email.com",
    role: "analyst",
  },
  {
    id: 10,
    username: "julia_teix",
    email: "julia.teix@email.com",
    role: "manager",
  },
];

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});

app.get("/", (request, response) => {
  response.status(201).send({ msg: "Hello" });
});

app.get("/api/users/:id", (request, response) => {
  const parseId = parseInt(request.params.id);

  if (isNaN(parseId)) {
    return response.status(400).send({ msg: "Bad Request. Invalid ID" });
  }

  const findUser = mockUsers.find((user) => user.id === parseId);

  if (!findUser) return response.sendStatus(404);

  return response.status(200).send(findUser);
});

app.get("/api/users", (request, response) => {
  const {
    query: { filter, value },
  } = request;

  if (!filter && !value) {
    return response.send(mockUsers);
  }

  if (filter && value) {
    return response.send(
      mockUsers.filter(
        (user) => user[filter].includes(value) || user[filter] === value
      )
    );
  }

  return response.send(mockUsers);
});

app.post("/api/users", (request, response) => {
  const { body } = request;
  const newUserId = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
  mockUsers.push(newUserId);
  response.status(201).send(newUserId);
});
