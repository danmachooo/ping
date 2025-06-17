import express, { Application } from "express";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware";
import { router } from "./router/index";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { config } from "./config";

const app: Application = express();
const serverUrl: string = config.appBaseUrl;

dotenv.config();
app.use(express.json()); // Essential for parsing JSON request bodies
app.use(express.urlencoded({ extended: true })); // Good for parsing URL-encoded bodies
app.use(cookieParser());
app.use(router);

app.use(errorHandlerMiddleware);

app.listen(config.port, () => {
  console.log(
    `Server is running on port ${config.port}.\nYou can run your app on ${serverUrl}`
  );
});
