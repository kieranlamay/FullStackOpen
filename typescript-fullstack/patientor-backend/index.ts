import express from "express";
const app = express();
import cors from "cors";

app.use(cors()); // allow all origins (dev only)

app.use(express.json());

const PORT = 3001;

app.get("/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
