import { kaaConfig } from "../utils/constants";
import * as mqtt from "mqtt";
import * as crypto from "crypto";

const kaaHost = kaaConfig.host;
const kaaPort = kaaConfig.port;
const applicationVersion = kaaConfig.appVersion;
const endpointToken = kaaConfig.token;

const connectToServer = (client: mqtt.MqttClient): void => {
  console.log(
    `Connecting to Kaa server at ${kaaHost}:${kaaPort} using application version ${applicationVersion} and endpoint token ${endpointToken}`
  );
  client.on("connect", () => {
    console.log("Successfully connected");
  });
  client.on("error", (error) => {
    console.error("Connection failed", error);
  });
  client.reconnect();
};

const disconnectFromServer = (client: mqtt.MqttClient): void => {
  console.log(`Disconnecting from Kaa server at ${kaaHost}:${kaaPort}...`);
  client.end(false, {}, () => {
    console.log("Successfully disconnected");
  });
};

const main = (): void => {
  const client = mqtt.connect(`mqtt://${kaaHost}:${kaaPort}`, {
    clientId: crypto.randomBytes(3).toString("hex"),
  });

  connectToServer(client);

  const listener = new SignalListener(() => {
    disconnectFromServer(client);
  });

  // Commenting out the sendDataSamples call
  // sendDataSamples();
};

class SignalListener {
  keepRunning = true;

  constructor(callback: () => void) {
    // signalExit((code: any, signal: any) => {
    //   console.log("Shutting down...");
    //   this.keepRunning = false;
    //   callback();
    // });
    callback();
  }
}

main();
