import { NextFunction, Request, Response } from "express";
import { IDeviceService } from "./device.service";

//
class DeviceController {
  #service: IDeviceService;
  constructor(service: IDeviceService) {
    this.#service = service;
  }

  createNewDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.#service.addNewDevice();
      //   console.log(response);
      //   return response;
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default DeviceController;
