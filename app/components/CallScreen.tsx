import React from "react";
import { View, Button, Linking, Alert } from "react-native";

const CallScreen = () => {
  const makeCall = () => {
    const phoneNumber = "tel:+919876543210"; // Add country code

    Linking.openURL(phoneNumber).catch(() =>
      Alert.alert("Error", "Unable to make a call")
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Call Now" onPress={makeCall} />
    </View>
  );
};

export default CallScreen;
