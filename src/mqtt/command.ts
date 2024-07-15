import mqtt, { MqttClient, IClientOptions, Packet } from "mqtt";
import * as crypto from "crypto";
import { kaaConfig } from "../utils/constants";

const kaaHost = kaaConfig.host;
const kaaPort = kaaConfig.port;
const applicationVersion = kaaConfig.appVersion;
const endpointToken = kaaConfig.token;

const dataCollectionTopic = `kp1/${applicationVersion}/dcx/${endpointToken}/json/32`;
const commandRebootTopic = `kp1/${applicationVersion}/cex/${endpointToken}/command/reboot/status`;
const commandRebootResultTopic = `kp1/${applicationVersion}/cex/${endpointToken}/result/reboot`;
const commandZeroTopic = `kp1/${applicationVersion}/cex/${endpointToken}/command/zero/status`;
const commandZeroResultTopic = `kp1/${applicationVersion}/cex/${endpointToken}/result/zero`;
const updateTopic = `kp1/${applicationVersion}/cex/${endpointToken}/command/hubUpdate/status`;

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

function disconnectFromServer(client: MqttClient) {
  console.log(`Disconnecting from Kaa server at ${kaaHost}:${kaaPort}...`);
  client.end();
  console.log("Successfully disconnected");
}

function handleRebootCommand(client: MqttClient, message: Buffer) {
  console.log(`<--- Received "reboot" command. Rebooting...`);
  const commandResult = composeCommandResultPayload(message);
  console.log(`command result ${commandResult}`);
  client.publish(commandRebootResultTopic, commandResult);
}

function handleZeroCommand(client: MqttClient, message: Buffer) {
  console.log(`<--- Received "zero" command. Sending zero values...`);
  const commandResult = composeCommandResultPayload(message);
  // client.publish(dataCollectionTopic, composeDataSample(0, 0, 0));
  client.publish(commandZeroResultTopic, commandResult);
}

function composeCommandResultPayload(message: Buffer): string {
  const commandPayload = JSON.parse(message.toString());
  console.log(`command payload: ${JSON.stringify(commandPayload)}`);
  const commandResultList = commandPayload.map((command: any) => ({
    id: command.id,
    statusCode: 200,
    reasonPhrase: "OK",
    payload: "Success",
  }));
  return JSON.stringify(commandResultList);
}

function composeDataSample(
  fuelLevel: number,
  minTemp: number,
  maxTemp: number
): string {
  return JSON.stringify({
    timestamp: Date.now(),
    fuelLevel,
    temperature: Math.floor(Math.random() * (maxTemp - minTemp + 1)) + minTemp,
  });
}

function main() {
  const clientId = crypto.randomBytes(3).toString("hex").toUpperCase();
  const clientOptions: IClientOptions = { clientId };
  const client = mqtt.connect(`mqtt://${kaaHost}:${kaaPort}`, clientOptions);

  connectToServer(client);

  client.on("message", (topic, message) => {
    if (topic === commandRebootTopic) {
      console.log("gets inside reboot??");
      handleRebootCommand(client, message);
    } else if (topic === commandZeroTopic) {
      handleZeroCommand(client, message);
    } else if (topic === updateTopic) {
      console.log({ topic, message: message.toString() });
    } else {
      if (topic.endsWith("/status")) return;
      console.log(
        `Message received: topic ${topic}\nbody ${message.toString()}`
      );
    }
  });
  // client.on("message", (topic, message) => {
  //   if (topic === updateTopic) {
  //     console.log({ topic, message: message.toString() });
  //   } else {
  //     if (topic.endsWith("/status")) return;
  //     console.log(
  //       `Message received: topic ${topic}/nbody ${message.toString()}`
  //     );
  //   }
  // });

  client.subscribe(commandRebootTopic);
  client.subscribe(commandZeroTopic);
  client.subscribe(updateTopic);

  let fuelLevel = 100;
  const minTemp = 95;
  const maxTemp = 100;

  const intervalId = setInterval(() => {
    const payload = composeDataSample(fuelLevel, minTemp, maxTemp);
    client.publish(
      dataCollectionTopic,
      payload,
      {},
      (error?: Error, packet?: Packet) => {
        if (error) {
          console.error(
            "Server connection lost, attempting to reconnect",
            error
          );
          connectToServer(client);
        } else {
          // console.log(
          //   `--> Sent message on topic "${dataCollectionTopic}":\n${payload}`
          // );
        }
      }
    );
    fuelLevel -= 0.3;
    if (fuelLevel < 1) {
      fuelLevel = 100;
    }
  }, 3000);

  process.on("SIGINT", () => {
    clearInterval(intervalId);
    disconnectFromServer(client);
    process.exit();
  });

  process.on("SIGTERM", () => {
    clearInterval(intervalId);
    disconnectFromServer(client);
    process.exit();
  });
}

main();
