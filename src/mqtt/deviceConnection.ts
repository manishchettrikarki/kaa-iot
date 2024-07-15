import * as mqtt from "mqtt";
import * as crypto from "crypto";
//
import { kaaConfig } from "../utils/constants";
import { timeStamp } from "console";

//
const kaaHost = kaaConfig.host;
const kaaPort = kaaConfig.port;
const applicationVersion = kaaConfig.appVersion;
const endpointToken = kaaConfig.token;

//
const metadataUpdateTopic = `kp1/${applicationVersion}/epmx/${endpointToken}/update/keys`;
const dataCollectionTopic = `kp1/${applicationVersion}/dcx/${endpointToken}/json`;

//
const connectToServer = (client: mqtt.MqttClient): void => {
  console.log("connecting to kaa server");
  client.on("connect", () => {
    console.log("Successfully connected");
  });
  client.on("error", (error) => {
    console.error("Connection failed", error);
  });
  client.reconnect();
};

//
const disconnectFromServer = (client: mqtt.MqttClient): void => {
  console.log(`Disconnecting from Kaa server at ${kaaHost}:${kaaPort}...`);
  client.end(false, {}, () => {
    console.log("Successfully disconnected");
  });
};

//
const composeMetadata = (): string => {
  return JSON.stringify([
    {
      deviceName: "Raspberry pi",
      fwVersion: "v0.0.1",
    },
  ]);
};

//
// const composeDataSample = (): string => {
//   return JSON.stringify({
//     timeStamp: Date.now(),
//   });
// };

//
const onMessage = (topic: string, message: Buffer): void => {
  console.log(`Received message on ${topic}: ${message}`);
};

//
const main = () => {
  const client = mqtt.connect(`mqtt://${kaaHost}:${kaaPort}`, {
    clientId: crypto.randomBytes(3).toString("hex"),
  });

  connectToServer(client);
  client.on("message", onMessage);

  client.subscribe("#", (err) => {
    if (err) {
      console.log("Failed to subscribe to topics");
    }
  });

  //   const listener = new SignalListener(() => {
  //     disconnectFromServer(client);
  //   });
};

class SignalListener {
  keepRunning = true;
  constructor(callback: () => void) {
    callback();
  }
}

main();
