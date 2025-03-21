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
          return { message: "ไม่พบข้อมูลผู้ใช้", users: [] };
        }
        set.status = 200;
        return { message: "ดึงข้อมูลผู้ใช้สำเร็จ", users };
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
          return { message: "ไม่พบข้อมูลผู้ใช้", users: [] };
        }
        set.status = 200;
        return { message: "ดึงข้อมูลผู้ใช้สำเร็จ", users };
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
const make_admin = async (app: Elysia) =>
  app.patch(
    "/make/:email",
    async ({ set, params: { email } }) => {
      try {
        if (!email) {
          set.status = 400;
          return { message: "กรุณากรอกอีเมล์" };
        }
        const teacher = await UserModel.findOne({
          email,
        });
        console.log(teacher);

        if (!teacher) {
          set.status = 404;
          return { message: "ไม่พบครูที่ปรึกษา" };
        }
        if (teacher.role.includes("Admin")) {
          set.status = 200;
          return { message: "ครูที่ปรึกษาเป็นผู้ดูแลระบบอยู่แล้ว" };
        }

        teacher.role.push("Admin");
        await teacher.save();

        set.status = 200;
        return {
          message: `เพิ่มสิทธ์ผู้ดูแลให้ ${teacher.prefix} ${teacher.first_name} สำเร็จ`,
        };
      } catch (error) {
        console.error(error);
        set.status = 500;
        return { message: "เซิฟเวอร์ผิดพลาดไม่สามารถเพิ่มผู้ดูแลระบบได้" };
      }
    },
    {
      detail: { tags: ["Users"], description: "เพิ่มผู้ดูแลระบบ" },
    }
  );

const remove_admin = async (app: Elysia) =>
  app.patch(
    "/remove/:email",
    async ({ set, params: { email } }) => {
      try {
        if (!email) {
          set.status = 400;
          return { message: "กรุณากรอกอีเมล์" };
        }
        const teacher = await UserModel.findOne({ email });
        if (!teacher) {
          set.status = 404;
          return { message: "ไม่พบครูที่ปรึกษา" };
        }
        teacher.role = teacher.role.filter((r) => r !== "Admin");
        await teacher.save();
        set.status = 200;
        return {
          message: `ลบสิทธ์ผู้ดูแลให้ ${teacher.prefix} ${teacher.first_name} สำเร็จ`,
        };
      } catch (error) {
        set.status = 500;
        return { message: "เซิฟเวอร์ผิดพลาดไม่สามารถลบผู้ดูแลระบบได้" };
      }
    },
    {
      detail: { tags: ["Users"], description: "ลบผู้ดูแลระบบ" },
    }
  );

const delete_user = async (app: Elysia) =>
  app.delete(
    "",
    async ({ set, body }) => {
      try {
        const { _id } = body;
        if (!_id) {
          set.status = 400;
          return { message: "กรุณากรอกข้อมูลไอดี" };
        }
        const user = await UserModel.findByIdAndDelete(_id, { new: true });
        console.log(user);

        if (!user) {
          set.status = 404;
          return { message: "ไม่พบผู้ใช้" };
        }
        set.status = 200;
        return { message: "ลบผู้ใช้สำเร็จ" };
      } catch (error) {
        set.status = 500;
        return { message: "เซิฟเวอร์ผิดพลาดไม่สามารถลบผู้ใช้" };
      }
    },
    {
      body: t.Object({ _id: t.String() }),
      detail: { tags: ["Users"], description: "ลบผู้ใช้" },
    }
  );
const UsersControllers = {
  get_users,
  get_by_role,
  make_admin,
  remove_admin,
  delete_user,
};

export default UsersControllers;
