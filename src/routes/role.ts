import { FastifyPluginAsync } from "fastify";

const RolePlugin: FastifyPluginAsync = async (fastify, options) => {
  fastify.get("/{roleID}", (req, res) => {
    // Get details about a single role
  });
  fastify.post("/", (req, res) => {
    // Create a new role with defined permissions
  });

  fastify.put("/:userId", (req, res) => {
    // Update
  });
};

export default RolePlugin;
