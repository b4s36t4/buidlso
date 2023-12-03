import { FastifyReply, FastifyRequest } from "fastify";
import { get } from "lodash";
import { hasPermission } from "./permission";
import { ActionType } from "../type";

export const checkPermission = async (
  req: FastifyRequest,
  res: FastifyReply,
  action: ActionType,
  resource: string
) => {
  await req.user?.populate({
    path: "roles",
    populate: { path: "permissions", model: "Permission" },
  });

  const roles = get(req, "user.roles", []);

  if (!roles.length) {
    return res.status(401).send({
      message: "You don't have access to this resource",
      status: "error",
    });
  }

  for (const role of roles) {
    const rolePermissions = get(role, "permissions", []);
    const resourcePermission: any = rolePermissions.find(
      (permission: any) => permission.resource === resource
    );

    if (!rolePermissions.length || !resourcePermission) {
      return res.status(401).send({
        message: "You don't have access to this resource",
        status: "error",
      });
    }

    const permission = hasPermission(resourcePermission.value ?? 0);

    // If the user have admin permision move on to the request
    if (permission.admin) {
      return;
    }
    // if action is read (get request) and check for can read permission
    if (action === ActionType.READ && permission.canRead) {
      return;
    }
    if (action === ActionType.EDIT && (permission.canEdit)) {
      return;
    }

    if (action === ActionType.DELETE && permission.canDelete) {
      return;
    }

    if (action === ActionType.MANAGE && permission.canDelete && permission.canRead && permission.canEdit) {
      return;
    }
  }

  return res.status(401).send({
    message: "You don't have access to this resource",
    status: "error",
  });
};
