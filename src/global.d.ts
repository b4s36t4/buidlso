interface IRole {
  title: string;
  createdBy: unknown;
  permissions: unknown;
  state: "DELETED" | "CREATED";
  _id: any;
}

interface IUser {
  email: string;
}
