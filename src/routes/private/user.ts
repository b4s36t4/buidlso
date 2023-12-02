import { FastifyPluginAsync } from "fastify";
import { Role, User } from "../../models";
import { IUpdateRoles, UpdateRoles } from "../../dto/roles";
import { Types } from "mongoose";

const UserPlugin: FastifyPluginAsync = async (app) => {
  app.get("/me", async (req, res) => {
    const user = req.user;
    if (!req.user?.email) {
      return res.status(401).send({ message: "Unauthorized", status: "error" });
    }

    await req.user.populate({
      path: "roles",
      populate: { path: "permissions", model: "Permission" },
    });

    if (!user) {
      return res
        .status(404)
        .send({ message: "No User found", status: "error" });
    }

    return res.send({ message: "success", data: user });
  });

  app.patch(
    "/user/roles",
    { schema: { body: UpdateRoles } },
    async (req, res) => {
      const { roleId } = req.body as IUpdateRoles;

      if (!Types.ObjectId.isValid(roleId)) {
        return res
          .status(400)
          .send({ message: "Invalid Body", status: "error" });
      }

      if (!req.user) {
        return res
          .status(401)
          .send({ message: "Unauthorized", status: "error" });
      }

      const { roles } = req.user;

      const isRoleAlreadyAdded = roles.find(
        (role) => role._id.toString() === roleId
      );

      if (isRoleAlreadyAdded) {
        return res.send({
          message: "Role added successfully",
          status: "success",
        });
      }

      const role = await Role.findById(roleId);

      if (!role) {
        return res.status(400).send("Invalid Role, please check again");
      }

      await req.user.updateOne({ $push: { roles: roleId } });

      return res.send({ message: "Role added successfully" });
    }
  );
};

export default UserPlugin;
