import { AxiosInstance } from "axios";
import axiosInstance from "../../utils/axios";
import { kaaConfig, kaaKeycloak } from "../../utils/constants";

export interface IDeviceService {
  addNewDevice(): Promise<any>;
}

class DeviceService {
  #axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.#axiosInstance = axiosInstance;
  }

  // Get admin token
  async getAdminToken() {
    const response = await this.#axiosInstance.post(
      `${kaaKeycloak.baseURL}/auth/realms/${kaaKeycloak.realmName}/protocol/openid-connect/token`,
      {
        grant_type: "client_credentials",
        client_id: `${kaaKeycloak.beClientId}`,
        client_secret: `${kaaKeycloak.beClientSecret}`,
      }
    );
    return response.data.access_token;
  }

  //
  //   async addDevice() {
  //     const response = await this.#axiosInstance.post(
  //       `https://cloud.kaaiot.com/epr/api/v1/endpoints`,
  //       {
  //         appVersion: {
  //           name: `${kaaConfig.appVersion}`,
  //         },
  //         metadata: {
  //           name: "new-device",
  //         },
  //       },
  //       { headers: { Authorization: "Bearer ${this.adminToken()}" } }
  //     );
  //   }

  //
  addNewDevice = async () => {
    const clientToken = await this.getAdminToken();
    console.log(clientToken);
    //
    const response = await this.#axiosInstance.post(
      `https://cloud.kaaiot.com/epr/api/v1/endpoints`,
      {
        appVersion: {
          name: `${kaaConfig.appVersion}`,
        },
        metadata: {
          name: "new-device",
          mac: "23-DA-234-FR-930-KGJ",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${clientToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const deviceToken = response.data.token;

    //
    const endpointList = await this.#axiosInstance.get(
      `https://cloud.kaaiot.com/epr/api/v1/endpoints`,
      {
        params: { include: "metadata" },
        headers: {
          //
          Authorization: `Bearer ${clientToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(endpointList.data.content);
  };
}

//
export default DeviceService;
