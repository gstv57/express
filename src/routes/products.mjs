import { response, Router } from "express";

const router = Router();

router.get("/api/products", (request, response) => {
  if (request.signedCookies.hello && request.signedCookies.hello === "world")
    return response.send([{ id: 1, name: "Apple", price: 12.99 }]);

  return response
    .status(403)
    .send({ msg: "Sorry. You need the correct cookie to access" });
});

export default router;
