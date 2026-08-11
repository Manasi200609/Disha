import { apiPost } from "./api";

export function getRoutes(data) {
  return apiPost("/routes", data);
}

export function getSaferRoutes(data) {
  return apiPost("/routes", data);
}