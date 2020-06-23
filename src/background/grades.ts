import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://api.canvascbl.com/api/v1/",
  withCredentials: false,
});

// async function getUserProfile(accessToken: string)
