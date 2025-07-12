import queryString from "query-string";

import { IOwnApiOptions } from "@modules/common/types";
import { ownApi } from "@utils/axios";
import { getAxiosCacheOptions } from "@utils/axios/getAxiosCacheOptions";
import { IUser } from "../types";

class UserService {
  public getUsers = async (
    ownApiOptions?: IOwnApiOptions
  ): Promise<IUser[]> => {
    try {
      const requestUrl = queryString.stringifyUrl({
        url: "users",
      });

      const { data } = await ownApi.get(requestUrl, {
        ...getAxiosCacheOptions(ownApiOptions),
        id: requestUrl,
      });

      return data;
    } catch (error: any) {
      throw new Error(error.message);

      //   if (!axios.isCancel(error)) {
      //     notification.error({
      //       message: error.message,
      //       duration: 5,
      //     });
      //     throw new Error(error.message);
      //   }
    }
  };
}

export default new UserService();
