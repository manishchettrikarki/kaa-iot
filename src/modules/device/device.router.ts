import express from "express";
import deviceController from "./index";
//
const deviceRouter = express.Router();

//
deviceRouter.post("/device/create", deviceController.createNewDevice);

//
export default deviceRouter;
