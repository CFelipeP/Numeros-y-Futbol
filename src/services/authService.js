import api from "../api";

export const loginUser = (email, password) => {
  return api.post("login.php", { email, password });
};

export const registerUser = (nombre, email, password) => {
  return api.post("register.php", { nombre, email, password });
};