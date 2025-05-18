import { action, observable, runInAction, makeObservable } from "mobx";

import { IExecuteStore, IPagination } from "@modules/common/types";
import BaseStore from "@utils/BaseStore";
import { commonService } from "../services";
import config from "@config";

type CommonStoreData = { searchText?: string; pagination?: IPagination };

const {
  DEFAULT_PAGINATION: { PAGE_SIZE, CURRENT },
} = config;

class CommonStore extends BaseStore<CommonStoreData> {
  public totalAmount: number = 0;

  public totalPages: number = 0;

  public contacts: any[] | [] = [];

  public currentPage: number = CURRENT;

  public pageSize: number = PAGE_SIZE;

  public onExecute = async ({
    data,
    ownApiOptions,
  }: IExecuteStore<CommonStoreData>) => {
    const response = await commonService.getTestData(data, ownApiOptions);

    runInAction(() => {
      this.totalAmount = response?.totalAmount ?? 0;
      this.totalPages = response?.totalPages ?? 0;
      this.contacts = response?.contacts ?? [];
      this.currentPage = response?.currentPage ?? CURRENT;
      this.pageSize = data.pagination?.pageSize ?? PAGE_SIZE;
    });
  };

  constructor() {
    super();

    makeObservable(this, {
      contacts: observable,
      totalAmount: observable,
      onExecute: action,
    });
  }
}

export default new CommonStore();
