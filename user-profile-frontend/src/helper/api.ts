import axios from "axios";

export const api = axios.create({
  baseURL: "https://webprojesi.onrender.com", // Sakın sonuna /profiles veya / ekleme
  headers: {
    "Content-Type": "application/json",
  },
});
