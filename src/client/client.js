import axios from "axios";

export const client = axios.create({
  baseURL: "https://api.miporra.es/v1.0",
});
