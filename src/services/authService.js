import axios from "axios";

const API = "http://localhost/backend";

export const loginUser = (email, password) => {
  return axios.post(`${API}/login.php`, { email, password });
};

export const registerUser = (nombre, email, password) => {
  return axios.post(`${API}/register.php`, { nombre, email, password });
};