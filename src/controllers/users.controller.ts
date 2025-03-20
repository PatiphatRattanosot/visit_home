import { set } from "mongoose";
import UserModel from "../models/user_models/users.model";
import { Elysia, t } from "elysia";

const get_users = async (app: Elysia) =>
  app.get(
    "/",
    async ({ set }) => {
      try {
        const users = await UserModel.find();
        if (!users) {
          set.status = 200;
          return { message: "ไม่พบข้อมูลผู้ใช้" };
        }
        set.status = 200;
        return { message: "ดึงข้อมูลผู้ใช้สำเร็จ", data: users };
      } catch (error) {
        set.status = 500;
        return { message: "เซิฟเวอร์ผิดพลาดในการดึงข้อมูลผู้ใช้" };
      }
    },
    {
      detail: { tags: ["Users"], description: "ดึงข้อมูลผู้ใช้" },
    }
  );

const get_by_role = async (app: Elysia) =>
  app.post(
    "/role",
    async ({ body, set }) => {
      const { role } = body;

      try {
        if (!role || role.length === 0) {
          set.status = 400;
          return { message: "กรุณากรอกข้อมูลให้ครบ" };
        }
        const users = await UserModel.find({ role: { $in: role } });
        if (users.length === 0) {
          set.status = 200;
          return { message: "ไม่พบข้อมูลผู้ใช้", data: [] };
        }
        set.status = 200;
        return { message: "ดึงข้อมูลผู้ใช้สำเร็จ", data: users };
      } catch (error) {
        set.status = 500;
        return { message: "เซิฟเวอร์ผิดพลาดไม่สามารถดึงข้อมูลผู้ใช้ได้" };
      }
    },
    {
      body: t.Object({ role: t.Array(t.String()) }), //body:{role:["Admin"]}
      detail: { tags: ["Users"], description: "ดึงข้อมูลผู้ใช้ตามสิทธิ์" },
    }
  );

const UsersControllers = {
  get_users,
  get_by_role,
};

export default UsersControllers;
