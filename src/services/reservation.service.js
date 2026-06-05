import { http } from "@/api/http";

export const getReservation = () =>
  http.get("/reservations");

export const createReservation = (data) =>
  http.post("/reservations", data);