import { CheckoutSession, PaymentMethods } from "@modules/payment/components";
import styles from "./page.module.scss";
import { ProductList } from "@modules/product/components";
import TotalAmount from "@modules/product/components/TotalAmount";
import CustomCheckoutBtn from "@modules/payment/components/CustomCheckoutBtn";
import SelectUser from "@modules/user/components/SelectUser";
import PurchaseSubscriptionBtn from "@modules/payment/components/PurchaseSubscriptionBtn";
import AddPaymentDetailsBtn from "@modules/payment/components/AddPaymentDetailsBtn";
import GooglePayBtn from "@modules/payment/components/GooglePayBtn";
import { Button, Card, Col, Steps } from "antd";
import { useState } from "react";
import { newOrderStore } from "@modules/product/stores";
import { observer } from "mobx-react";
import SelectProductType from "@modules/product/components/SelectProductType";

const MainSteps = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const stepsItems = [
    { title: "User Data (optional)" },
    { title: "Product Type" },
    { title: "Products" },
    { title: "Payment" },
  ];

  const stepsNode = <Steps current={currentStep} items={stepsItems} />;

  return (
    <div className={styles.wrapper}>
      <Card title={stepsNode} headStyle={{ background: "#fafafa" }}>
        <Col>
          <div>
            {currentStep === 0 && (
              <>
                <SelectUser />
                <PaymentMethods />
                <AddPaymentDetailsBtn />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row-reverse",
                    gap: "10px",
                  }}
                >
                  <Button
                    className={styles.nextBtn}
                    onClick={() => setCurrentStep(1)}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}

            {currentStep === 1 && (
              <>
                <SelectProductType />

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    className={styles.backBtn}
                    onClick={() => {
                      setCurrentStep(0);
                      newOrderStore.setProductType(null);
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    className={styles.nextBtn}
                    onClick={() => setCurrentStep(2)}
                    disabled={!newOrderStore.productType}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <ProductList />
                <TotalAmount />

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    className={styles.backBtn}
                    onClick={() => {
                      setCurrentStep(1);
                      newOrderStore.clearOrder();
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    className={styles.nextBtn}
                    onClick={() => setCurrentStep(3)}
                    disabled={!newOrderStore.total}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <CheckoutSession />
                <CustomCheckoutBtn />
                <PurchaseSubscriptionBtn />
                <GooglePayBtn />

                <div style={{ display: "flex", marginTop: "20px" }}>
                  <Button
                    className={styles.backBtn}
                    onClick={() => setCurrentStep(2)}
                  >
                    Back
                  </Button>
                </div>
              </>
            )}
          </div>
        </Col>
      </Card>
    </div>
  );
};

export default observer(MainSteps);
