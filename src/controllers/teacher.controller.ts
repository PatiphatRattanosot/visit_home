import { Elysia, t } from "elysia";
import TeacherModel from "../models/user_models/teacher.model";
import UserModel from "../models/user_models/users.model";

const create_teacher = async (app: Elysia) =>
  app.post(
    "/",
    async ({ set, body }) => {
      const { first_name, last_name, prefix, role, user_id } = body;
      if (!first_name || !last_name || !prefix || !role || !user_id) {
        set.status = 400;
        return { message: "กรุณากรอกข้อมูลให้ครบ" };
      }
      const email = `bp${user_id}@bangpaeschool.ac.th`;
      try {
        const teacherExist = await TeacherModel.findOne({ user_id });
        if (teacherExist) {
          set.status = 409;
          return { message: "ครูที่ปรึกษานี้มีอยู่ในระบบแล้ว" };
        }
        const teacher = new TeacherModel({
          email,
          first_name,
          last_name,
          prefix,
          role,
          user_id,
        });
        teacher.save();
        set.status = 201;
        return { message: "เพิ่มครูที่ปรึกษาสำเร็จ", data: teacher };
      } catch (error) {
        set.status = 500;
        return {
          message: "เซิฟเวอร์ผิดพลาดไม่สามารถเพิ่มครูที่ปรึกษาได้",
        };
      }
    },
    {
      body: t.Object({
        prefix: t.String(),
        first_name: t.String(),
        last_name: t.String(),
        role: t.Array(t.String()),
        user_id: t.String(),
        phone: t.String(),
      }),
      detail: { tags: ["Teacher"], description: "เพิ่มครูที่ปรึกษา" },
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
      detail: { tags: ["Teacher"], description: "เพิ่มผู้ดูแลระบบ" },
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
      detail: { tags: ["Teacher"], description: "ลบผู้ดูแลระบบ" },
    }
  );

const TeacherController = { create_teacher, make_admin, remove_admin };
export default TeacherController;
