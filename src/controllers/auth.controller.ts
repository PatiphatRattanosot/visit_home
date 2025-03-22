import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import UserModel from "../models/user_models/users.model";
const JWT_SECRET = process.env.JWT_SECRET;

export const AuthController = (app: Elysia) =>
  app.group("/auth", () =>
    app.use(jwt({ name: "jwt", secret: JWT_SECRET })).post(
      "/sign",
      async ({ body, set, jwt, cookie: { auth } }) => {
        try {
          const { email } = body;
          if (!email) {
            set.status = 400;
            return { error: "ต้องการอีเมล" };
          }
          const user = await UserModel.findOne({ email: email });

          if (!user) {
            set.status = 404; 
            return { error: "ไม่พบอีเมลนี้ในระบบ" };
          }
          const token = await jwt.sign({ email, role: user.role.toString() });
          auth.set({
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            path: "/",
          });
          set.status = 200;
          return {
            message: "เข้าสู่ระบบสำเร็จ",
            token,
            user,
          };
        } catch (error) {
          set.status = 500;
          console.log(error);
          return { message: "เซิฟเวอร์เกิดข้อผิดพลาดไม่สามารถเข้าสู่ระบบได้" };
        }
      },
      {
        body: t.Object({
          email: t.String(),
        }),
        detail: {
          tags: ["Auth"],
          description: "เข้าใช้งานระบบ",
        },
      }
    )
  );
