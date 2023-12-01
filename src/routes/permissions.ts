import { FastifyPluginAsync } from "fastify";

const PermissionPlugin: FastifyPluginAsync = async (fastify, options) => {
  fastify.post("/", (req, res) => {
    // Create a new Permission
  });

  fastify.put("/:permissionID", (req, res) => {
    // Updated permission value for a permission
  });
};

export default PermissionPlugin;
