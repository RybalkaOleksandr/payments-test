import { IUserData } from "@modules/payment/types";
import { Button, Form, Input } from "antd";
import { observer } from "mobx-react";
import { Controller, useForm } from "react-hook-form";

import styles from "./styles.module.scss";
import { currentUserStore } from "@modules/user/stores";

interface IProps {
  onSubmit: (userData: IUserData) => void;
}

interface IUserDataForm {
  name: string;
  email: string;
  country: string;
  postalCode: string;
}

const UserDataForm = ({ onSubmit }: IProps) => {
  const { getValues, control } = useForm<IUserDataForm>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name:
        currentUserStore.currentUser?.firstName +
          " " +
          currentUserStore.currentUser?.lastName || "",
      email: currentUserStore.currentUser?.email || "",
      country: "Ukraine",
      postalCode: "61000",
    },
  });

  return (
    <Form>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Form.Item label="Name">
            <Input {...field} />
          </Form.Item>
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <Form.Item label="Email">
            <Input {...field} />
          </Form.Item>
        )}
      />

      <Controller
        control={control}
        name="country"
        render={({ field }) => (
          <Form.Item label="Country">
            <Input {...field} />
          </Form.Item>
        )}
      />

      <Controller
        control={control}
        name="postalCode"
        render={({ field }) => (
          <Form.Item label="Postal Code">
            <Input {...field} />
          </Form.Item>
        )}
      />

      <div className={styles.btnWrapper}>
        <Button onClick={() => onSubmit(getValues())}>Next</Button>
      </div>
    </Form>
  );
};

export default observer(UserDataForm);
