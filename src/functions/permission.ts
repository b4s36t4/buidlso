export enum PERMISSION {
  read = 2,
  edit = 4,
  delete = 8,
  manage = 16,

  // Max-number to differ from other permissions
  admin = 2 ** 10,
}

export const createPermission = (permissions: PERMISSION[]) => {
  let finalPermissionValue = 1;

  permissions.forEach((permission) => {
    finalPermissionValue = finalPermissionValue * permission;
  });

  return finalPermissionValue;
};

export const hasPermission = (value: number) => {
  const readPermission = createPermission([PERMISSION.read]);
  const editPermission = createPermission([PERMISSION.edit]);
  const adminPermission = createPermission([PERMISSION.admin]);
  const deletePermission = createPermission([PERMISSION.delete]);
  const managePermission = createPermission([PERMISSION.manage])

  const permission = {
    canRead: false,
    canEdit: false,
    canDelete: false,
    admin: false,
  };

  if (value === readPermission) {
    permission.canRead = true;
  } else if (value === editPermission) {
    permission.canEdit = true;
    permission.canRead = true;
  } else if (value === deletePermission) {
    permission.canRead = true;
    permission.canDelete = true;
  } else if (value === managePermission) {
    permission.canRead = true
    permission.canEdit = true
    permission.canDelete = true
  } else if (value === adminPermission) {
    permission.admin = true;
  }

  return permission;
};
