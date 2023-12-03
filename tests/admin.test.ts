import { Document } from "mongoose"
import { Permission, Role, User } from "../src/models"
import axios, { AxiosError } from "axios"

import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { PERMISSION, createPermission } from "../src/functions/permission"

const ADMIN_EMAIL = "admin@test.com"
const ADMIN_PASS = "admin"

const USER_EMAIL = "user@test.com"
const USER_PASS = "user"

const MANAGER_EMAIL = "manager@test.com"
const MANAGER_PASS = "manager"

let permissionResource: Document
let roleResource: Document
let role: Document
let admin: Document

const address = `http://${process.env.HOST}:${process.env.PORT}`


const setup = async () => {
    const adminPermissionValue = createPermission([PERMISSION.admin])
    permissionResource = await Permission.create({ name: "admin", resource: "permissions", value: adminPermissionValue })
    roleResource = await Permission.create({ name: "admin", resource: "roles", value: adminPermissionValue })

    role = await Role.create({ title: "Admin", permissions: [permissionResource._id, roleResource._id] })

    admin = await User.create({ firstName: "admin", lastName: "admin", email: ADMIN_EMAIL, password: ADMIN_PASS, roles: [role._id] })
}

const cleanUp = async () => {
    await role.deleteOne()
    await permissionResource.deleteOne()
    await roleResource.deleteOne()
    await admin.deleteOne()
}

const setUpBasicUserAccount = async () => {
    const readPermissionValue = createPermission([PERMISSION.read])
    const readPermissions = await Permission.create({ name: "read", resource: "tasks", value: readPermissionValue })
    const userRole = await Role.create({ title: "User", permissions: [readPermissions._id] })

    const user = await User.create({ firstName: "User", lastName: "Basic", email: USER_EMAIL, password: USER_PASS, roles: [userRole._id] })

    const cleanUp = async () => {
        await readPermissions.deleteOne()
        await userRole.deleteOne()
        await user.deleteOne()
    }

    return { user, readPermissions, userRole, cleanUp }
}


const setUpManagerAccount = async () => {
    const managePermissionValue = createPermission([PERMISSION.manage])
    const managePermissions = await Permission.create({ name: "manage", resource: "tasks", value: managePermissionValue })
    const managerRole = await Role.create({ title: "Manager", permissions: [managePermissions._id] })

    const manager = await User.create({ firstName: "User", lastName: "Basic", email: MANAGER_EMAIL, password: MANAGER_PASS, roles: [managerRole._id] })

    const cleanUp = async () => {
        await managePermissions.deleteOne()
        await managerRole.deleteOne()
        await manager.deleteOne()
    }

    return { manager, managePermissions, managerRole, cleanUp }
}

describe("Test Basic CRUD Operation for an admin User", async () => {
    let token: string
    beforeAll(async () => {
        axios.defaults.headers["common"]["Content-Type"] = "application/json"
        console.log("address", address)
        await setup()
        console.log("Setting UP mock data")
    })

    afterAll(async () => {
        await cleanUp()
        console.log("Cleaning UP...")
        axios.defaults.headers.common["Authorization"] = ""

    })
    test("Login User", async () => {
        const request = await axios.post(`${address}/login`, { email: ADMIN_EMAIL, password: ADMIN_PASS })
        expect(request.status).to.eq(200)
        expect(request.data.data.token).toBeTruthy()
        token = request.data.data.token

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    })

    test.concurrent("Can Create a Role", async () => {
        try {
            const request = await axios.post(`${address}/role`, { title: "Demo" })
            expect(request.status).to.eq(201)
            expect(request.data.data).is.toBeTypeOf("object")

            await Role.deleteOne({ title: "Demo" })
        } catch (error) {
            console.log(error, "error...")
            expect(true).to.eq(false)
        }
    })

    test.concurrent("Can Create a Permission", async () => {
        const request = await axios.post(`${address}/permission`,
            {
                "resource": "tasks",
                "name": "admin"
            })
        expect(request.status).to.eq(201)
        expect(request.data.data).is.toBeTypeOf("object")

        await Permission.findByIdAndDelete(request.data.data._id)
    })
})

describe("Test User Service Permissions", () => {
    let userSetup: { cleanUp: () => Promise<void> };
    let managerSetup: {
        cleanUp: () => Promise<void>
    };
    let serverAvailable: boolean = false

    let userServiceAddress: string;

    let createdTaskId: string

    beforeAll(async () => {
        userSetup = await setUpBasicUserAccount()
        managerSetup = await setUpManagerAccount()
        userServiceAddress = process.env.USER_SERVICE ?? ""
        axios.defaults.baseURL = userServiceAddress
    })

    afterAll(async () => {
        await userSetup.cleanUp()
        await managerSetup.cleanUp()
    })

    let token: string

    test("Should check if User-Service is running or not", async () => {
        try {
            const request = await axios.get("/")

            expect(request.status).to.eq(200)
            expect(request.data.version).to.eq("1.0.0")

            serverAvailable = true
        } catch (error) {
            console.log(error, "error")
        }
    })

    test("Login to User Account", async () => {
        if (!serverAvailable) {
            return
        }
        // await new Promise(r => setTimeout(r, 60000));

        const request = await axios.post(`${address}/login`, { email: USER_EMAIL, password: USER_PASS })
        expect(request.status).to.eq(200)
        expect(request.data.data.token).toBeTruthy()
        token = request.data.data.token

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    })



    test("Should fail creating a task with user", async () => {
        if (!serverAvailable) {
            return
        }
        try {
            const req = await axios.post("/tasks", { title: "test", endDate: "05-12-2023", description: "sample description" })
        } catch (error) {
            if (error instanceof AxiosError) {
                expect(error.response?.status).to.eq(403)
            }
        }
    })

    test("Should be able to read the list of tasks", async () => {
        if (!serverAvailable) {
            return
        }
        const request = await axios.get("/tasks");
        expect(request.status).to.eq(200);
        // No tasks
        expect(request.data).to.be.lengthOf(0)
    })

    test("Login to Manager Account Account", async () => {
        if (!serverAvailable) {
            return
        }
        // await new Promise(r => setTimeout(r, 60000));

        const request = await axios.post(`${address}/login`, { email: MANAGER_EMAIL, password: MANAGER_PASS })
        expect(request.status).to.eq(200)
        expect(request.data.data.token).toBeTruthy()
        token = request.data.data.token

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    })

    test("Should be able to create a task with manager account", async () => {
        if (!serverAvailable) {
            return
        }
        const req = await axios.post("/tasks", { title: "test", endDate: "05-12-2023", description: "sample description" })
        expect(req.status).to.eq(201)

        createdTaskId = req.data.data._id
    })

    test("Should be able to read the list of tasks", async () => {
        if (!serverAvailable) {
            return
        }
        const request = await axios.get("/tasks");
        expect(request.status).to.eq(200);
        // No tasks
        expect(request.data).to.be.lengthOf(1)
    })

    test("Should be able to delete with manager account", async () => {
        if (!serverAvailable) {
            return
        }

        const request = await axios.delete(`/tasks/${createdTaskId}`)

        expect(request.status).to.eq(200)
    })

    test("Should task length should match", async () => {
        if (!serverAvailable) {
            return
        }
        const request = await axios.get("/tasks");
        expect(request.status).to.eq(200);
        // No tasks
        expect(request.data).to.be.lengthOf(0)
    })
})
