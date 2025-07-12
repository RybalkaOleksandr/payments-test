import { Card, Col, Steps } from "antd";
import { observer } from "mobx-react";

import { useState } from "react";
import CustomCheckout from "../CustomCheckout";
import UserDataForm from "../UserDataForm";
import { IUserData } from "@modules/payment/types";

const CustomCheckoutSteps = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<IUserData | null>(null);

  const stepsItems = [{ title: "User Data" }, { title: "Payment Details" }];
  const stepsNode = <Steps current={currentStep} items={stepsItems} />;

  return (
    <Card title={stepsNode} headStyle={{ background: "#fafafa" }}>
      <Col>
        <div>
          {currentStep === 0 && (
            <UserDataForm
              onSubmit={(userDataFromForm: IUserData) => {
                setUserData(userDataFromForm);
                setCurrentStep(1);
              }}
            />
          )}
          {currentStep === 1 && <CustomCheckout userData={userData!} />}
        </div>
      </Col>
    </Card>
  );
};

export default observer(CustomCheckoutSteps);
