import queryString from "query-string";

import { IOwnApiOptions } from "@modules/common/types";
import { ownApi } from "@utils/axios";
import { getAxiosCacheOptions } from "@utils/axios/getAxiosCacheOptions";

class CommonService {
  public getTestData = async (
    params: any,
    ownApiOptions?: IOwnApiOptions
  ): Promise<any> => {
    try {
      const requestUrl = queryString.stringifyUrl({
        url: "test",
        query: {
          endCustomerType: params?.endCustomerType,
          searchText: params?.searchText,
          pageSize: params?.pagination?.pageSize,
          current: params?.pagination?.current,
        },
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

export default new CommonService();
