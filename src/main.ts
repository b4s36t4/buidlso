import fastify from "fastify";
import dotenv from "dotenv";
import { connect } from "./db/connection";
import { ZodSchema } from "zod";
import AuthPlugin from "./routes/auth";
import PrivateRoutes from "./routes/private";

// Load the .env variables into process
dotenv.config();

const port = process.env.PORT || 3001;
const host = process.env.HOST || "0.0.0.0";

const app = fastify({ logger: { file: "log.txt" } });

app.setValidatorCompiler<ZodSchema>(({ schema }) => {
  return (data) => {
    if (!schema) {
      return { value: data };
    }
    return schema.parse(data);
  };
});

app.register(AuthPlugin);

app.register(PrivateRoutes);

async function main() {
  const address = await app.listen({ port: Number(port), host });
  console.log("Starting server");
  await connect();
  console.log("Connected to Database");
  // Start any other services here itself
  console.log(`Server started at => ${address}`);
}

main();

// app.listen({ port: Number(port), host: host }, async (error, address) => {
//   if (error) {
//     console.log("Failed to start server");
//     return;
//   }
// });
