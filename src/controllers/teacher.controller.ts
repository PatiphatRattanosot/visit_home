import { Elysia, t } from "elysia";
import TeacherModel from "../models/user_models/teacher.model";

const create_teacher = async (app: Elysia) =>
  app.post(
    "/",
    async ({ set, body }) => {
      const { first_name, last_name, prefix, role, user_id, phone } = body;
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
          phone,
        });
        teacher.save();
        set.status = 201;
        return { message: "เพิ่มครูที่ปรึกษาสำเร็จ", teacher };
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

const update_teacher = async (app: Elysia) =>
  app.put(
    "/",
    async ({ set, body }) => {
      try {
        const { first_name, last_name, prefix, phone, user_id } = body;
        const email = `bp${user_id}@bangpaeschool.ac.th`;
        const user = await TeacherModel.findOne({ email });

        if (!user) {
          set.status = 404;
          return { message: "ไม่พบครูที่ปรึกษา" };
        }
        await user.save();
        set.status = 200;
      } catch (error) {
        set.status = 500;
        return {
          message: "เซิฟเวอร์ผิดพลาดไม่สามารถแก้ไขข้อมูลครูที่ปรึกษาได้",
        };
      }
    },
    {
      body: t.Object({
        user_id: t.String(),
        prefix: t.String(),
        first_name: t.String(),
        last_name: t.String(),
        phone: t.String(),
      }),
      detail: { tags: ["Teacher"], description: "แก้ไขข้อมูลครูที่ปรึกษา" },
    }
  );

const TeacherController = {
  create_teacher,
  update_teacher,
};
export default TeacherController;
