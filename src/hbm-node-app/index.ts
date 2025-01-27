import express, { Express, Request, Response, Router } from "express";
import dotenvx from "@dotenvx/dotenvx"
import { defaultRoute } from "./routes";

dotenvx.config();

const app: Express = express();
const port = process.env.APP_PORT ? process.env.APP_PORT : (() => { throw new Error("PORT is not defined"); })();

// Add routes

app.use(defaultRoute);

// Run server

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// Graceful shutdown

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received.');
  server.close(() => {
      console.log('Closed out remaining connections');
      process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received.');
  server.close(() => {
      console.log('Closed out remaining connections');
      process.exit(0);
  });
});
