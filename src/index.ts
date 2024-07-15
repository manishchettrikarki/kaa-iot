import dotenv from "dotenv";
dotenv.config();

//
import express from "express";
import { appConfig, kaaConfig } from "./utils/constants";
// import { createKaaMqttClient } from "@kaaiot/mqtt-client";
import deviceRouter from "./modules/device/device.router";

const app = express();
const port = appConfig.port;

//
app.use("/api", deviceRouter);
//
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

// import "./mqtt/connection";
// import "./mqtt/deviceConnection";

// const client = createKaaMqttClient({
//   appVersionName: `${kaaConfig.appVersion}`,
//   token: `${kaaConfig.token}`,
// });

// client.publishMetadata({ deviceModel: "RapberryPi" });

// client.publishDataCollection([{ temperature: 22.5 }], (status) => {
//   console.log("Data published with status:", status);
// });

// import "./mqtt/command";
