import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000", // Sakın sonuna /profiles veya / ekleme
  headers: {
    "Content-Type": "application/json",
  },
});