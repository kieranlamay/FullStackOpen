import patientData from "../../data/patients";
import { Patient, NewPatient } from "../types";

const addPatient = (patient: NewPatient): Patient => {
  const id = (Math.random() * 100000).toFixed(0);
  const newPatient: Patient = {
    id,
    ...patient,
  };
  patientData.push(newPatient);
  return newPatient;
};

const getPatients = () => {
  return patientData;
};

export default {
  addPatient,
  getPatients,
};
