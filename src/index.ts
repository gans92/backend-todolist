import express from "express";
import cors from "cors";
import { routes } from "./routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

// function teste(request, response) {
//   return response.json("fasfasfas");
// // }
// app.get("/fffff", teste);

app.get("/health", (req, res) => {
  return res.json("up");
});

app.listen(3003, () => console.log("server is running on 🚀 http://localhost:3003"));
