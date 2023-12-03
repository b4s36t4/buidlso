import { FastifyPluginAsync } from "fastify";
import mongoose from "mongoose";
import { PERMISSION, createPermission } from "../../functions/permission";
import { Permission } from "../../models";
import { CreatePermission, ICreatePermission } from "../../dto/permission";
import { checkPermission } from "../../functions/checkPermission";
import { ActionType } from "../../type";

const PermissionPlugin: FastifyPluginAsync = async (fastify, options) => {
  fastify.addHook("preHandler", async (req, res) => {
    const { resource } = req.body ?? {} as any;

    if (!resource) return;

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    const isResourceValue = collections.find(
      (collection) => collection.name.toLowerCase() === resource.toLowerCase()
    );

    if (!isResourceValue) {
      return res.status(400).send({
        message: "There is no resource available to have permissions",
        status: "error",
      });
    }
  });

  fastify.post(
    "/permission",
    {
      schema: { body: CreatePermission },
      preHandler: async (req, res) =>
        await checkPermission(req, res, ActionType.EDIT, "permissions"),
    },
    async (req, res) => {
      if (!req.user) return;
      const { resource, name } = req.body as ICreatePermission;

      let permission: PERMISSION;

      switch (name) {
        case "admin":
          permission = PERMISSION.admin;
          break;

        case "edit":
          permission = PERMISSION.edit;
          break;
        case "delete":
          permission = PERMISSION.delete;
          break;
        case "read":
          permission = PERMISSION.read;
          break;

        default: {
          permission = PERMISSION.read;
        }
      }

      const permissionValue = createPermission([permission]);

      const createdPermission = await Permission.create({
        resource: resource,
        name: name,
        value: permissionValue,
        createdBy: req.user._id,
      });

      return res.status(201).send({
        message: "New permission has been created",
        data: createdPermission,
        status: "success",
      });
    }
  );

  fastify.get("/permissions", { preHandler: async (req, res) => await checkPermission(req, res, ActionType.ADMIN, "permissions") }, async (req, res) => {
    console.log("hi?")
    const { page, page_size } = (req.params ?? {}) as { page: number, page_size: number }
    const permissions = await Permission.find().limit(page_size).skip(page_size * page)
    return permissions
  })
};

export default PermissionPlugin;
