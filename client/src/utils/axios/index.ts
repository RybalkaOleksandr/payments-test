import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.put["Content-Type"] = "application/json";
axios.defaults.headers.patch["Content-Type"] = "application/json";

export {
  axiosInstance as ownApi,
  forageStore as requestsCacheStore,
  removeRelatedCache,
} from "./ownApi";
