import express, { Application } from "express";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware";
import { router } from "./router/index";
import dotenv from "dotenv";

const app: Application = express();
const port: number = 3000;
const serverUrl: string = `http://localhost:${port}`;

dotenv.config();
app.use(express.json()); // Essential for parsing JSON request bodies
app.use(express.urlencoded({ extended: true })); // Good for parsing URL-encoded bodies
app.use(router);

app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(
    `Server is running on port ${port}.\nYou can run your app on ${serverUrl}`
  );
});
