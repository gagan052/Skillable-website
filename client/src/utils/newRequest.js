import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://skillable-freelance-back.onrender.com/api/",
  withCredentials: true,
});

export default newRequest;
