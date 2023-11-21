const express = require("express");
const app = express();
const cors = require("cors");
const port = 10000;
const mongoose = require("mongoose");
const hash = {};

require("dotenv").config();
app.use(cors());
app.use(express.json());

const DBCommands = require("./mongo/services/index");

const PASS = process.env.HASH_KEY;

DBCommands.validateCollection();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/v1/validate/", (req, res) => {
  const { password } = req.body;

  res.status(200).send({ status: password === PASS });
});

app.get("/v1/hash", async (req, res) => {
  const { key, value, pass } = req.query;

  if (pass !== PASS) {
    return res.status(401).send("Unauthorized");
  }

  const newClient = await DBCommands.addNewClient(key, value);

  res.status(newClient.status).send(newClient.message);
});

app.get("/v1/hash/all", async (req, res) => {
  const entries = await DBCommands.getAllClients();
  res.status(entries.status).send({ hash: entries.entries });
});

app.get("/v1/hash/:key", async (req, res) => {
  const { key } = req.params;

  const projectValue = await DBCommands.getProjectByKey(key);

  if (projectValue.status == 404 || projectValue.status == 400) {
    res.status(projectValue.status).send(projectValue);
    return;
  }

  res.status(projectValue.status).send(projectValue);
});

app.get("/healthz", (req, res) => {
  res.status(200).send("Ok");
});

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

process.on("SIGINT", () => {
  console.log("Server is shutting down...");

  // Close the server, which triggers the 'close' event
  server.close(() => {
    console.log("Server is gracefully closed");
    mongoose.disconnect();

    process.exit(0);
  });
});
