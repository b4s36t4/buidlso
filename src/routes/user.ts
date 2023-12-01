import { FastifyPluginAsync } from "fastify";
import { CreateUser, ICreateUser } from "../dto/user";
import { User } from "../models/user";
import { encryptPassword } from "../functions/password";

const UserPlugin: FastifyPluginAsync = async (fastify, options) => {
  fastify.post(
    "/signup",
    { schema: { body: CreateUser } },
    async (req, res) => {
      const { firstName, lastName, email, password } = req.body as ICreateUser;

      const findUser = await User.findOne({ email: email });

      if (findUser) {
        return res.status(400).send({
          message: "Account already exists with this email",
          status: "error",
        });
      }

      const encryptedPassword = encryptPassword(password);
      const createdUser = await User.create({
        email,
        firstName,
        lastName,
        password: encryptedPassword,
      });

      delete createdUser["password"];
      return res.send(createdUser);

      // Get the current logged user details
    }
  );
  fastify.post("/", (req, res) => {
    // Create a new user account
  });

  fastify.patch("/:userId", (req, res) => {
    // Update roles for user
  });
};

export default UserPlugin;
