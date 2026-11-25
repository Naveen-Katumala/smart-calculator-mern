import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getCalculations = () =>
  API.get("/calculations");

export const saveCalculation = (data) =>
  API.post("/calculations", data);

export const deleteCalculation = (id) =>
  API.delete(`/calculations/${id}`);

export const clearHistory = () =>
  API.delete("/calculations");