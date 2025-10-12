import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { usersStore } from "../../stores";
import { currentUserStore } from "../../stores";
import { IUser } from "../../types";
import styles from "./styles.module.scss";
import { paymentMethodsStore } from "@modules/payment/stores";

const SelectUser: React.FC = () => {
  useEffect(() => {
    usersStore.reload();
  }, []);

  const handleUserSelect = (user: IUser) => {
    currentUserStore.setCurrentUser(user);

    paymentMethodsStore.reload({
      data: { customerId: user.id },
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={styles.selectUserContainer}>
      <h2 className={styles.title}>Select user</h2>

      {usersStore.isLoading && (
        <div className={styles.loading}>Loading users...</div>
      )}

      {usersStore.error && (
        <div className={styles.error}>
          Ошибка загрузки: {usersStore.error.message}
        </div>
      )}

      <div className={styles.usersGrid}>
        {usersStore.users.map((user) => (
          <div
            key={user.id}
            className={`${styles.userCard} ${
              currentUserStore.currentUser?.id === user.id
                ? styles.selected
                : ""
            }`}
            onClick={() => handleUserSelect(user)}
          >
            <div className={styles.userAvatar}>
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </div>
            <div className={styles.userInfo}>
              <h3 className={styles.userName}>
                {user.firstName} {user.lastName}
              </h3>
              <p className={styles.userEmail}>{user.email}</p>
              {user.phone && <p className={styles.userPhone}>{user.phone}</p>}
              <p className={styles.userDate}>
                Created: {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {currentUserStore.currentUser && (
        <div className={styles.currentUserSection}>
          <h3 className={styles.currentUserTitle}>Current user:</h3>
          <div className={styles.currentUserCard}>
            <div className={styles.currentUserAvatar}>
              {currentUserStore.currentUser.firstName.charAt(0)}
              {currentUserStore.currentUser.lastName.charAt(0)}
            </div>
            <div className={styles.currentUserInfo}>
              <h4 className={styles.currentUserName}>
                {currentUserStore.currentUser.firstName}{" "}
                {currentUserStore.currentUser.lastName}
              </h4>
              <p className={styles.currentUserEmail}>
                {currentUserStore.currentUser.email}
              </p>
              {currentUserStore.currentUser.phone && (
                <p className={styles.currentUserPhone}>
                  {currentUserStore.currentUser.phone}
                </p>
              )}
            </div>
            <button
              className={styles.clearButton}
              onClick={() => {
                currentUserStore.clearCurrentUser();
                paymentMethodsStore.clear();
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default observer(SelectUser);
