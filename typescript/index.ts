import express from "express";
const app = express();
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

app.use(express.json());

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

app.post("/exercises", (req, res) => {
  try {
    const daily_exercises = req.body.daily_exercises;
    const target = req.body.target;

    if (!daily_exercises || !target) {
      throw new Error("parameters missing");
    }

    if (!Array.isArray(daily_exercises) || isNaN(Number(target))) {
      throw new Error("malformatted parameters");
    }

    const dailyExerciseHours: number[] = daily_exercises.map((hour: any) => {
      const numHour = Number(hour);
      if (isNaN(numHour)) {
        throw new Error("malformatted parameters");
      }
      return numHour;
    });

    const result = calculateExercises(dailyExerciseHours, Number(target));
    res.json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.json({ error: error.message });
    } else {
      res.json({ error: "unknown error" });
    }
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
