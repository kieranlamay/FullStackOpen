import express from "express";
const app = express();
import { calculateBmi } from "./bmiCalculator";

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  try {
    const height = Number(req.query.height);
    const weight = Number(req.query.weight);
    if (isNaN(height) || isNaN(weight)) {
      throw new Error("malformatted parameters");
    }
    const bmi = calculateBmi(height, weight);
    res.json({
      weight: weight,
      height: height,
      bmi: bmi,
    });
  } catch {
    res.json({ error: "malformatted parameters" });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
