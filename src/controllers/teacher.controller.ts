import { Elysia, t } from "elysia";
import TeacherModel from "../models/user_models/teacher.model";

export const TeacherController = (app: Elysia) =>
  app.group("/teacher", (app) =>
    app.guard((app) =>
      app
        // เพิ่มครูที่ปรึกษาเข้าระบบ
        .post(
          "/",
          async ({ body, set }) => {
            try {
              const { email, name, prefix, role, teacherId } = body;
              const teacherExist = await TeacherModel.findOne({ teacherId });
              if (teacherExist) {
                set.status = 409;
                return { message: "ครูที่ปรึกษานี้มีอยู่ในระบบแล้ว" };
              }
              const teacher = new TeacherModel({
                email,
                name,
                prefix,
                role,
                teacherId,
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
              email: t.String(),
              name: t.String(),
              prefix: t.String(),
              role: t.String(),
              teacherId: t.String(),
            }),
            detail: { tags: ["Teacher"] },
          }
        )
        .get(
          "/",
          async ({ user }) => {
            console.log(user);
            return `User email: ${user.email}, Role: ${user.role}`;
          },
          {
            user: t.Object({
              email: t.String(),
              role: t.String(),
            }),
            detail: { tags: ["Teacher"] },
          }
        )
        .put("/", () => {})
        .delete("/", () => {})
    )
  );
