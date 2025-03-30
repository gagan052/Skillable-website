import axios from "axios";
// import * as axios from "axios";


const newRequest = axios.create({
  baseURL: "http://localhost:8800/api/",
  withCredentials: true,
  
});

export default newRequest;
