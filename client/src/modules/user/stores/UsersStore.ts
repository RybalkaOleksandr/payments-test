import { action, observable, runInAction, makeObservable } from "mobx";

import { IExecuteStore } from "@modules/common/types";
import BaseStore from "@utils/BaseStore";
import { userService } from "../services";
import { IUser } from "../types";

type UsersStoreData = {};

class UsersStore extends BaseStore<UsersStoreData> {
  public users: IUser[] = [];

  public onExecute = async ({
    ownApiOptions,
  }: IExecuteStore<UsersStoreData>) => {
    const response = await userService.getUsers(ownApiOptions);

    runInAction(() => {
      this.users = response;
    });
  };

  constructor() {
    super();

    makeObservable(this, {
      users: observable,
      onExecute: action,
    });
  }
}

export default new UsersStore();
