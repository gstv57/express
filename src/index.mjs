import express, { request, response } from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./mock/users.mjs";

const app = express();

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(
  session({
    secret: "gstv57",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);
app.use(routes);

app.listen(3000, () => {
  console.log(`Running on ${3000}`);
});

app.get("/", (request, response) => {
  console.log(request.session);
  console.log(request.session.id);
  request.session.visited = true;
  response.cookie("hello", "world", {
    maxAge: 10000,
    signed: true,
  });

  response.status(201).send({ msg: "hello" });
});

app.post("/api/auth", (request, response) => {
  const {
    body: { username, password },
  } = request;

  const findUser = mockUsers.find((user) => user.username === username);

  if (!findUser || findUser.password !== password)
    return response.status(401).send({ msg: "BAD CREDENTIALS" });

  request.session.user = findUser;

  return response.status(200).send(findUser);
});

app.get("/api/auth/status", (request, response) => {
  request.sessionStore.get(request.sessionID, (err, session) => {
    console.log(session);
  });

  return request.session.user
    ? response.status(200).send(request.session.user)
    : response.status(401).send({
        msg: "Not Authenticated",
      });
});

app.post("/api/cart", (request, response) => {
  if (!request.session.user) return response.sendStatus(401);

  const { body: item } = request;

  const { cart } = request.session;

  if (cart) {
    cart.push(item);
  } else {
    request.session.cart = [item];
  }

  return response.status(201).send(item);
});

app.get("/api/cart", (request, response) => {
  if (!request.session.user) return response.sendStatus(401);

  return response.send(request.session.cart ?? []);
});
