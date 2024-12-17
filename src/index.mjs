import express, { request, response } from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./mock/users.mjs";
import passport from "passport";
import "./strategies/local-strategy.mjs";

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

app.use(passport.initialize());
app.use(passport.session());

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

app.post("/api/auth", passport.authenticate("local"), (request, response) => {
  return response.sendStatus(200);
});

app.get("/api/auth/status", (request, response) => {
  console.log(request.user);
  console.log(request.session);
  return request.user
    ? response.send(request.user)
    : response.status(401).send({
        msg: "Not Authenticated",
      });
});

app.post("/api/auth/logout", (request, response) => {
  if (!request.user) return response.sendStatus(401);

  request.logout((err) => {
    if (err) return response.sendStatus(400);

    response.sendStatus(200);
  });
});
