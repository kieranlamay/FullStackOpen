import { z } from "zod";
import { Gender, Entry } from "./types";


export const NewPatientSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  dateOfBirth: z
    .string()
    .refine((d) => Boolean(Date.parse(d)), {
      message: "Invalid or missing dateOfBirth",
    }),
  ssn: z.string().min(1, { message: "ssn is required" }),
  gender: z.nativeEnum(Gender),
  occupation: z.string().min(1, { message: "occupation is required" }),
  entries: z.array(z.any()).optional().default([]),
});

export type NewPatientInput = z.infer<typeof NewPatientSchema>;

export const parsePatient = (obj: unknown) => {
  return NewPatientSchema.parse(obj);
};

export default { NewPatientSchema, parsePatient };
