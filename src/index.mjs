import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "guri" },
  { id: 2, username: "noveli" },
  { id: 3, username: "joaozinho" },
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
    return response.status(400).send({ msg: "Bad Request. Invalida ID" });
  }

  const findUser = mockUsers.find((user) => user.id === parseId);

  if (!findUser) return response.sendStatus(404);

  return response.status(200).send(findUser);
});
