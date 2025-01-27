import pg from "pg";
import amqp from "amqplib";
import * as redis from "redis";
import axios from "axios";
import express, { Router } from "express";

export const defaultRoute = Router();

defaultRoute.use(express.json());

defaultRoute.get('/', (req, res) => {
  console.log("Serving / route");
  res.send("Hello, I am hbm-node-app.");
});

defaultRoute.get('/env', (req, res) => {
  console.log("Serving /env route");
  res.json(process.env);
});

defaultRoute.get('/health', async (req, res) => {

  console.log("Serving /health route");

  // postgress
  let pgStatus = 'Success';
  const client = new pg.Client(process.env.PG_URL);
  try {
    await client.connect();
    await client.query('SELECT 1;');
  }
  catch (err) {
    pgStatus = 'Failed';
    console.error(err);
  }
  finally {
    await client.end();
  }
  
  // RabbitMQ
  let rmqStatus = 'Success';
  let rmqConnection: amqp.Connection | undefined;
  try {
    rmqConnection = await amqp.connect(process.env.RABBITMQ_URL!);
  }
  catch (err) {
    rmqStatus = 'Failed';
    console.error(err);
  }
  finally {
    if (rmqConnection) {
      await rmqConnection.close();
    }
  }

  // Redis
  let redisStatus = 'Success';
  let redisClient: ReturnType<typeof redis.createClient> | undefined;
  try {
    redisClient = redis.createClient({ url: process.env.REDIS_URL });
    await redisClient.connect();
    await redisClient.ping();
  }
  catch (err) {
    redisStatus = 'Failed';
    console.error(err);
  }
  finally {
    if (redisClient) {
      redisClient.quit();
    }
  }

  res.json({
    postgres: pgStatus,
    rabbitmq: rmqStatus,
    redis: redisStatus
  });

});

defaultRoute.post('/connect', async (req, res) => {
  console.log("Serving /connect route");

  const host = req.body.host;
  const port = req.body.port;

  if (!host || !port) {
    res.status(400).send('host and port are required');
    return;
  }

  const url = `http://${host}:${port}/env`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error fetching env from ${url}`);
  }

});