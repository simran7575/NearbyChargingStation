const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");

// for swagger documentation
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
const corsOpts = {
  origin: "*",

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOpts));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//regular middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

//morgan middleware
app.use(morgan("tiny"));

//router middleware
const user = require("./routes/user");
const booking = require("./routes/booking");
const socket = require("./routes/socket");

app.use("/api/v1", user);
app.use("/api/v1", booking);
app.use("/api/v1", socket);

module.exports = app;
