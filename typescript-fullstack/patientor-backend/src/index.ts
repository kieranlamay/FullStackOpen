import express from "express";
const app = express();
import cors from "cors";
import { Response } from "express";

import { Diagnosis, NonSensitivePatient, Gender } from "./types";
import diagnosesData from "../data/diagnoses";
import patientService from "./services/patientService";
import { parsePatient } from "./utils";
import { ZodError } from "zod";

app.use(cors()); // allow all origins (dev only)

app.use(express.json());

const PORT = 3001;

app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.get("/api/diagnoses", (_req, res: Response<Diagnosis[]>) => {
  res.send(diagnosesData);
});

app.get("/api/patients", (_req, res: Response<NonSensitivePatient[]>) => {
  const patients = patientService
    .getPatients()
    .map(({ id, name, dateOfBirth, gender, occupation }) => ({
      id,
      name,
      dateOfBirth,
      gender: gender as Gender,
      occupation,
    }));
  res.send(patients);
});

app.post("/api/patients", (req, res) => {
  try {
    const newPatient = parsePatient(req.body);
    const added = patientService.addPatient(newPatient);
    res.json(added);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const messages = error.issues.map((i) => i.message).join("; ");
      res.status(400).send({ error: messages });
    } else if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "Unknown error" });
    }
  }
});

app.get("/api/patients/:id", (req, res: Response<NonSensitivePatient | { error: string }>) => {
  try {
    const patient = patientService
      .getPatients()
      .find((p) => p.id === req.params.id);
    if (!patient) {
      res.status(404).send({ error: "Patient not found" });
      return;
    }
    res.json(patient);
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
