import express from "express";
import { resolveIndexByUser } from "./middleware/resolveIndexByUser.mjs";
import { mockUsers } from "./mock/users.mjs";
import { loggingMiddleware } from "./middleware/logging.mjs";
import {
  query,
  validationResult,
  matchedData,
  checkSchema,
} from "express-validator";
import { createUserValidationSchema } from "./utils/validationSchemas.mjs";

const app = express();

app.use(express.json(), loggingMiddleware);

app.listen(3000, () => {
  console.log(`Running on ${3000}`);
});

app.get(
  "/api/users",
  [
    query("filter")
      .isString()
      .withMessage("Must be string")
      .notEmpty()
      .withMessage("Must not be empty")
      .isLength({ min: 3, max: 10 })
      .withMessage("Must be at least 3-10 characters"),
  ],
  (request, response) => {
    const result = validationResult(request);

    // console.log(result["errors"]);
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
  }
);

app.get("/api/users/:id", resolveIndexByUser, (request, response) => {
  const { findUserIndex } = request;

  const findUser = mockUsers[findUserIndex];

  if (!findUser) return response.sendStatus(404);

  return response.status(200).send(findUser);
});

app.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (request, response) => {
    const result = validationResult(request);

    if (!result.isEmpty())
      return response.status(400).send({ errors: result.errors });

    const data = matchedData(request);

    const newUserId = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newUserId);

    response.status(201).send(newUserId);
  }
);

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
