import { action, observable, makeObservable } from "mobx";

import { IUser } from "../types";

class CurrentUserStore {
  public currentUser: IUser | null = null;

  setCurrentUser = (user: IUser) => {
    this.currentUser = user;
  };

  clearCurrentUser = () => {
    this.currentUser = null;
  };

  constructor() {
    makeObservable(this, {
      currentUser: observable,
      setCurrentUser: action,
      clearCurrentUser: action,
    });
  }
}

export default new CurrentUserStore();
