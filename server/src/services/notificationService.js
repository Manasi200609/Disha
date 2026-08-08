const sendSafetyAlert = async ({
  contact,
  userName,
  alertType,
  message
}) => {
  try {
    console.log("\n🚨 DISHA SAFETY ALERT");
    console.log("--------------------------------");
    console.log(`User: ${userName}`);
    console.log(`Contact: ${contact.name}`);
    console.log(`Phone: ${contact.phone}`);
    console.log(`Alert: ${alertType}`);
    console.log(`Message: ${message}`);
    console.log("--------------------------------\n");

    // Hackathon MVP:
    // Notification is simulated through the server console.
    //
    // A real SMS provider can be connected here later.

    return {
      success: true,
      message: "Safety alert prepared successfully"
    };

  } catch (error) {
    console.error(
      "Notification error:",
      error.message
    );

    return {
      success: false,
      message: "Failed to send safety alert"
    };
  }
};

export {
  sendSafetyAlert
};