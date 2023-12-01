import fastify from "fastify";
import dotenv from "dotenv";
import { connect } from "./db/connection";
import { ZodSchema } from "zod";

// Load the .env variables into process
dotenv.config();

const port = process.env.PORT || 3001;
const host = process.env.HOST || "0.0.0.0";

const app = fastify({ logger: { file: "log.txt" } });

app.setValidatorCompiler<ZodSchema>(({ schema }) => {
  return (data) => schema.parse(data);
});

app.listen({ port: Number(port), host: host }, async (error, address) => {
  if (error) {
    console.log("Failed to start server");
    return;
  }

  console.log("Starting server");
  await connect();
  console.log("Connected to Database");
  // Start any other services here itself
  console.log(`Server started at => ${address}`);
});
