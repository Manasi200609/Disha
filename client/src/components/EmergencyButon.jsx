import { useState } from "react";

import EmergencyAlert
  from "./EmergencyAlert.jsx";


export default function EmergencyButton() {

  const [showAlert, setShowAlert] =
    useState(false);


  const handleEmergency = () => {

    // For now this is the actual
    // emergency action entry point.
    // We'll connect notification/location
    // sharing after the popup works.

    console.log(
      "🚨 EMERGENCY ALERT TRIGGERED"
    );

    setShowAlert(false);

  };


  return (

    <>

      <button
        className="emergency-button"
        onClick={() =>
          setShowAlert(true)
        }
      >
        Emergency
      </button>


      <EmergencyAlert
        open={showAlert}

        onCancel={() =>
          setShowAlert(false)
        }

        onConfirm={
          handleEmergency
        }
      />

    </>

  );
}