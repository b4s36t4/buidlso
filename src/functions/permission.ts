enum PERMISSION {
  read = 2,
  edit = 4,
  delete = 8,

  // Max-number to differ from other permissions
  admin = 2 ** 10,
}

const createPermission = (permissions: PERMISSION[]) => {
  let finalPermissionValue = 1;

  permissions.forEach((permission) => {
    finalPermissionValue = finalPermissionValue * permission;
  });

  return finalPermissionValue;
};

const hasPermission = (value: number, actionType: ActionType) => {
  const readPermission = createPermission([PERMISSION.read]);
  const editPermission = createPermission([PERMISSION.edit]);
  const adminPermission = createPermission([PERMISSION.admin]);
  const deletePermission = createPermission([PERMISSION.delete]);

  switch (actionType) {
    case ActionType.READ:
      return value === readPermission;

    case ActionType.EDIT:
      return value === editPermission;

    case ActionType.DELETE:
      return value === deletePermission;

    case ActionType.ADMIN:
      return value === adminPermission;

    default:
      return false;
  }
};
