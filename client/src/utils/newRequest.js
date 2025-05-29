import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://skillable-website-1.onrender.com/api",
  withCredentials: true,
});

export default newRequest;
