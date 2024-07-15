export const appConfig = {
  port: process.env.PORT ?? 3000,
};

export const kaaConfig = {
  baseURL: process.env.KAA_BASEURL || "https://cloud.kaaiot.com/epr/api/",
  host: process.env.KAA_HOST || "mqtt.cloud.kaaiot.com",
  port: parseInt(process.env.KAA_PORT || "1883", 10),
  appVersion: process.env.APPLICATION_VERSION || "your-app-version",
  token: process.env.ENDPOINT_TOKEN || "your-endpoint-token",
};

export const kaaKeycloak = {
  baseURL: process.env.KAA_KEYCLOAK || "https://authh.cloud.kaaiot.com",
  beClientId: process.env.KAA_BACKEND_CLIENT_ID || "kaa-rest-api",
  beClientSecret: process.env.KAA_BACKEND_CLIENT_SECRET || "",
  realmName: process.env.KAA_REALM_NAME || "",
};
