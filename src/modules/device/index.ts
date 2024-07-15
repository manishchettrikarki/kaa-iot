import DeviceBusiness from "./device.business";
import DeviceController from "./device.controller";
import DeviceService from "./device.service";

//
import axiosInstance from "../../utils/axios";

//
const deviceBusiness = new DeviceBusiness();
const deviceService = new DeviceService(axiosInstance);
const deviceController = new DeviceController(deviceService);

//
export default deviceController;
