import express from "express";
import { resolveIndexByUser } from "./middleware/resolveIndexByUser.mjs";
import { mockUsers } from "./mock/users.mjs";
import { loggingMiddleware } from "./middleware/logging.mjs";

const app = express();
app.use(express.json());
app.use(loggingMiddleware);

app.listen(3000, () => {
  console.log(`Running on ${3000}`);
});

app.get("/api/users/:id", resolveIndexByUser, (request, response) => {
  const { findUserIndex } = request;

  const findUser = mockUsers[findUserIndex];

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

app.put("/api/users/:id", resolveIndexByUser, (request, response) => {
  const { body, findUserIndex } = request;

  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };

  return response.sendStatus(200);
});

app.patch("/api/users/:id", resolveIndexByUser, (request, response) => {
  const { body, findUserIndex } = request;

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };

  return response.sendStatus(200);
});

app.delete("/api/users/:id", resolveIndexByUser, (request, response) => {
  const { findUserIndex } = request;

  mockUsers.splice(findUserIndex, 1);

  return response.sendStatus(204);
});
