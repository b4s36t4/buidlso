import { FastifyPluginAsync } from "fastify";
import { CreateUser, ICreateUser, ILoginUser, LoginUser } from "../dto/user";
import { User } from "../models";
import { encryptPassword, verifyPassword } from "../functions/password";
import { createJWT } from "../functions/jwt";

const AuthPlugin: FastifyPluginAsync = async (fastify, options) => {
  fastify.post(
    "/signup",
    { schema: { body: CreateUser } },
    async (req, res) => {
      console.log("here, coming?");
      const { firstName, lastName, email, password } = req.body as ICreateUser;

      const findUser = await User.findOne({ email: email });

      if (findUser) {
        return res.status(400).send({
          message: "Account already exists with this email",
          status: "error",
        });
      }

      const encryptedPassword = await encryptPassword(password);
      const createdUser = await User.create({
        email,
        firstName,
        lastName,
        password: encryptedPassword,
        roles: [],
      });

      return res.status(201).send({
        message: "Account created successfully",
        data: { email, id: createdUser._id.toString() },
        status: "success",
      });

      // Get the current logged user details
    }
  );
  fastify.post("/login", { schema: { body: LoginUser } }, async (req, res) => {
    const { email, password } = req.body as ILoginUser;

    const emailUser = await User.findOne({ email: email })
      .select("+password")
      .populate<{ roles: IRole[] }>("roles")
      .exec();

    if (!emailUser) {
      return res
        .status(404)
        .send({ message: "No user found with provided mail", status: "error" });
    }

    const encryptedPassword = emailUser["password"] ?? "";

    const isPasswordMatches = verifyPassword(encryptedPassword, password);

    if (!isPasswordMatches) {
      return res.send(403).send({
        message: "Invalid details, please check again",
        status: "error",
      });
    }

    const parsedRoles = emailUser.roles.map((role) => role.title);

    const payload = {
      email: email,
      id: emailUser["_id"].toString(),
      roles: parsedRoles,
    };

    const token = createJWT(payload);

    return res.status(200).send({
      message: "Login Successful",
      data: { token },
      status: "success",
    });
    // Create a new user account
  });
};

export default AuthPlugin;
