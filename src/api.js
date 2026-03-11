import axios from "axios";

export default axios.create({
  baseURL: "http://localhost/numeros-y-futbol/api/"
});