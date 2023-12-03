import { FastifyInstance } from "fastify";
import { afterAll, beforeAll } from "vitest";
import { main } from "../src/main";

let address: string;
let app: FastifyInstance;

beforeAll(async () => {
    console.log(process.env, "env..")
    const server = await main()
    address = server.address
    console.log(address, "addres..")
    app = server.app
})

afterAll(async () => {
    await app.close()
})