import axios from "axios";

import { EnvironmentVars } from "@/utils/envUtils";

const logError = (error: unknown) => {
  if (EnvironmentVars.isDevelopmentEnvironment) {
    if (error instanceof Error) {
      console.log("Error message: ", error.message);
    }
    if (axios.isAxiosError(error)) {
      console.log("Axios Error request: ", error.request);
      console.log("Axios Error response: ", error.response);
    }
    console.log("Error object: ", error);
  }
  // TODO Log error in cloud
};

export default logError;
