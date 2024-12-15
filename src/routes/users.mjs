import { Router } from "express";
import { query } from "express-validator";
import { mockUsers } from "../mock/users.mjs";
import { validationResult, matchedData, checkSchema } from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByUser } from "../middleware/resolveIndexByUser.mjs";

const router = Router();

router.get(
  "/api/users",
  query("filter")
    .optional()
    .isString()
    .withMessage("Must be string")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
  query("value").optional().isString().withMessage("Value must be string"),
  (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty())
      return response.status(400).send({ errors: errors.errors });

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

router.post(
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

router.get("/api/users/:id", resolveIndexByUser, (request, response) => {
  const { findUserIndex } = request;

  const findUser = mockUsers[findUserIndex];

  if (!findUser) return response.sendStatus(404);

  return response.status(200).send(findUser);
});

router.put("/api/users/:id", resolveIndexByUser, (request, response) => {
  const { body, findUserIndex } = request;

  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };

  return response.sendStatus(200);
});

router.patch("/api/users/:id", resolveIndexByUser, (request, response) => {
  const { body, findUserIndex } = request;

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };

  return response.sendStatus(200);
});

router.delete("/api/users/:id", resolveIndexByUser, (request, response) => {
  const { findUserIndex } = request;

  mockUsers.splice(findUserIndex, 1);

  return response.sendStatus(204);
});

export default router;
