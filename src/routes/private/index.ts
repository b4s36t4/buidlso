import { FastifyPluginAsync } from "fastify";
import UserPlugin from "./user";
import { verifyJWT } from "../../functions/jwt";
import { User } from "../../models";
import get from "lodash/get";
import { Document, Types } from "mongoose";
import RolePlugin from "./role";
import PermissionPlugin from "./permission";

type UserDocument = Document<
  unknown,
  {},
  {
    createdAt: NativeDate;
    updatedAt: NativeDate;
  } & {
    roles: Types.ObjectId[];
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    email?: string | null | undefined;
    password?: string | null | undefined;
  }
> & {
  createdAt: NativeDate;
  updatedAt: NativeDate;
} & {
  roles: Types.ObjectId[];
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  email?: string | null | undefined;
  password?: string | null | undefined;
} & {};

declare module "fastify" {
  interface FastifyRequest {
    // you must reference the interface and not the type
    user: (Omit<UserDocument, "roles"> & { roles: IRole[] }) | null;
  }
}

const PrivateRoutes: FastifyPluginAsync = async (app) => {
  // register user plugin

  app.decorateRequest("user", null);

  app.addHook("preHandler", async (req, res) => {
    const token = req.headers["authorization"];

    if (!token) {
      return res
        .status(403)
        .send({ message: "Unauthenticated", status: "error" });
    }

    // Removing Bearer from the header value
    const token_value = token.split(" ")[1];

    try {
      const data = verifyJWT(token_value);
      const user = await User.findOne({
        email: get(data, "email", ""),
      }).populate<{ roles: IRole[] }>("roles");

      if (!user) {
        return res
          .status(401)
          .send({ message: "Unauthorized", status: "error" });
      }

      req.user = user;
    } catch (err) {
      return res
        .status(400)
        .send({ message: "Invalid token", status: "error" });
    }
  });

  app.register(UserPlugin);

  app.register(RolePlugin);

  app.register(PermissionPlugin);
};

export default PrivateRoutes;
