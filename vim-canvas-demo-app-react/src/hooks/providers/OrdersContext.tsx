import { createContext, useEffect, useState, useRef } from "react";
import { EHR } from "vim-os-js-browser/types";
import { useVimOsContext } from "../useVimOsContext";
import { useVimOSPatient } from "../usePatient";
import { isEqual, differenceWith } from 'lodash';

interface OrderContext {
  orders: EHR.Order[] | undefined;
}

export const VimOSOrdersContext = createContext<OrderContext>({
  orders: undefined,
});

export const VimOSOrdersProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const vimOS = useVimOsContext();
  const { patient } = useVimOSPatient();
  const [orders, setOrders] = useState<EHR.Order[] | undefined>(undefined);
  const prevOrdersRef = useRef<EHR.Order[] | undefined>(undefined);
  useEffect(() => {
    vimOS.ehr.subscribe("orders", (data) => {
      const prevOrders = prevOrdersRef.current;
      if (data && prevOrders && !isEqual(data, prevOrders)) {
        const newOrder = differenceWith(data, prevOrders)[0];
        if (newOrder.basicInformation?.type == "LAB"){
          console.log('patient:', patient);
          console.log('patient.insurance:', patient?.insurance);
          console.log('patient.insurance.ehrInsurance:', patient?.insurance?.ehrInsurance);
          console.log('newOrder', newOrder);
          const payerName = patient?.insurance?.ehrInsurance;
          const procCode = newOrder.procedureCodes?.procedureCodes?.[0]?.code;
          const icd10Codes = newOrder.assessments?.assessments?.map(ass => ass.code).join(",")
          vimOS.hub.pushNotification.show({
            text: `Test ${procCode} will not be paid by ${payerName} with diagnosis ${icd10Codes}`,
            notificationId: crypto.randomUUID(),
            actionButtons: {
              leftButton: {
                text: "Details",
                buttonStyle: "PRIMARY",
                openAppButton: true,
                callback: () => {},
              },
            },
          });
        }

      }
      prevOrdersRef.current = data;
    });
  }, [vimOS, prevOrdersRef]);
  useEffect(() => {
    vimOS.ehr.subscribe("orders", (data) => {
      setOrders(data);
    });
    return () => {
      vimOS.ehr.unsubscribe("orders", setOrders);
    };
  }, [vimOS]);

  return (
    <VimOSOrdersContext.Provider
      value={{
        orders,
      }}
    >
      {children}
    </VimOSOrdersContext.Provider>
  );
};
