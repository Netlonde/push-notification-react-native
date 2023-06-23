import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, Button } from "react-native";
import notifee, {
  AndroidImportance,
  EventType,
  TimestampTrigger,
  TriggerType,
} from "@notifee/react-native";
import { useEffect } from "react";

export default function App() {
  async function createChannelId() {
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
      vibration: true,
      importance: AndroidImportance.HIGH,
    });

    return channelId;
  }

  async function displayNotification() {
    await notifee.requestPermission();

    const channelId = await createChannelId();

    await notifee.displayNotification({
      id: "default",
      title: "Notification <strong>Title</strong>",
      body: "Main body content of the <span style='color:red'>notification</span>",
      android: { channelId },
      ios: {
        sound: "default",
      },
    });
  }

  async function updateNotification() {
    await notifee.requestPermission();
    const channelId = await createChannelId();

    await notifee.displayNotification({
      id: "default",
      title: "Notification Title <strong>Updated</strong>",
      body: "<span color='blue'>Main</span> body content of the notification",
      android: { channelId },
      ios: {
        sound: "default",
      },
    });
  }

  async function cancelNotification() {
    await notifee.cancelNotification("default");
  }

  async function triggerNotification() {
    const date = new Date(Date.now() + 10000);
    const channelId = await createChannelId();

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
    };

    await notifee.createTriggerNotification(
      {
        id: "default",
        title: "Notification Title  <span>Triggered</span>",
        body: "Main body content of the notification",
        android: { channelId },
        ios: {
          sound: "default",
        },
      },
      trigger
    );
  }

  async function showScheduledNotifications() {
    const notifications = await notifee.getTriggerNotificationIds();
    console.log(notifications);
  }

  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log("User dismissed notification");
          break;
        case EventType.PRESS:
          console.log("User pressed notification");
          break;
        case EventType.ACTION_PRESS:
          console.log("User pressed an action");
          break;
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Send Notification" onPress={displayNotification} />
      <Button title="Update Notification" onPress={updateNotification} />
      <Button title="Cancel Notification" onPress={cancelNotification} />
      <Button title="Trigger Notification" onPress={triggerNotification} />
      <Button
        title="Show Scheduled Notifications"
        onPress={showScheduledNotifications}
      />
      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
