import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://skillable-saini.onrender.com/api/",
  withCredentials: true,
});

export default newRequest;
