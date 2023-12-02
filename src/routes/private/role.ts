import { FastifyPluginAsync } from "fastify";
import { Permission, Role } from "../../models";
import { Types } from "mongoose";
import { get } from "lodash";
import { hasPermission } from "../../functions/permission";
import { checkPermission } from "../../functions/checkPermission";
import { ActionType } from "../../type";

const RolePlugin: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    "/role",
    {
      preHandler: async (req, res) =>
        await checkPermission(req, res, ActionType.EDIT, "roles"),
    },
    async (req, res) => {
      if (!req.user) {
        return res
          .status(401)
          .send({ message: "Unauthorized", status: "error" });
      }

      const userId = req.user._id;

      const { title } = req.body as any;

      try {
        const newRole = await Role.create({
          title,
          createdBy: userId,
          state: "CREATED",
          permissions: [],
        });

        return res.status(201).send({
          message: "role created successfully",
          data: newRole,
          status: "success",
        });
      } catch {
        return res.status(500).send({
          message: "unknown error, please try again",
          status: "error",
        });
      }
    }
  );

  fastify.patch(
    "/role/:roleID",
    {
      preHandler: async (req, res) =>
        await checkPermission(req, res, ActionType.EDIT, "roles"),
    },
    async (req, res) => {
      const { roleID } = req.params as { roleID: string };

      const { permissionsID } = req.body as { permissionsID: string };

      if (!Types.ObjectId.isValid(permissionsID)) {
        return res.status(400).send({
          message: "Invalid type inside permissions",
          status: "error",
        });
      }

      if (!roleID) {
        return res.status(400).send("No path available");
      }

      if (!Types.ObjectId.isValid(roleID)) {
        return res
          .status(400)
          .send({ message: "Invalid roleId", status: "error" });
      }

      const role = await Role.findById(roleID);

      if (!role) {
        return res
          .status(404)
          .send({ message: "No Role found", status: "error" });
      }

      const permission = await Permission.findById(permissionsID);

      if (!permission) {
        return res.status(404).send({
          message: "Permission didn't found, please check",
          status: "error",
        });
      }

      role.permissions.push(permission._id);
      await role.save();

      return res.send({
        message: "Role permission update successfully",
        status: "status",
      });
    }
  );
};

export default RolePlugin;
