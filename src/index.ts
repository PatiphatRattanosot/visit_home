import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { jwt } from "@elysiajs/jwt";
import { cors } from "@elysiajs/cors";
const { JWT_SECRET } = process.env;

// Connect Database
import "./database/db.setup";

// Controllers
import YearAndClassController from "./controllers/year.controller";
import UsersControllers from "./controllers/users.controller";
import TeacherController from "./controllers/teacher.controller";
import { AuthController } from "./controllers/auth.controller";
//.derive
const app = new Elysia()
  .use(
    cors({
      origin: "*",
    })
  )
  .listen(3000)
  .use(jwt({ secret: JWT_SECRET }))
  .use(
    swagger({
      documentation: {
        info: {
          title: "เอกสาร API ระบบเยี่ยมบ้าน",
          version: "1.0.0",
        },
        tags: [
          { name: "App", description: "API ทั่วไปของระบบ" },
          { name: "Student", description: "API สำหรับจัดการข้อมูลนักเรียน" },
          { name: "Teacher", description: "API สำหรับจัดการข้อมูลครู" },
          { name: "Admin", description: "API สำหรับการจัดการผู้ดูแลระบบ" },
          {
            name: "Year And Class",
            description: "API สำหรับจัดการข้อมูลระดับชั้นและห้องเรียน",
          },
          {
            name: "Auth",
            description: "API สำหรับการเข้าสู่ระบบและยืนยันตัวตน",
          },
        ],
      },
    })
  )
  .group("/api/v1", (app) =>
    app
      .guard(
        {
          beforeHandle({ jwt, set, cookie: { auth } }) {
            if (!auth?.value) return { message: "Unauthorized: No token" };
            try {
              const token = jwt.verify(auth.value);
              if (!token) {
                set.status = 401;
                return "Unauthorized: Invalid token";
              }
            } catch {
              set.status = 403;
              return "Forbidden: Invalid or expired token";
            }
          },
        },
        (app) =>
          app
            .group("/yclass", (app) =>
              app
                .use(YearAndClassController.create_year)
                .use(YearAndClassController.create_class)
                .use(YearAndClassController.get_year)
                .use(YearAndClassController.get_years)
                .use(YearAndClassController.update_class)
                .use(YearAndClassController.delete_class)
                .use(YearAndClassController.delete_year)
            )
            .group("/users", (app) =>
              app
                .use(UsersControllers.get_users)
                .use(UsersControllers.get_by_role)
                .use(UsersControllers.make_admin)
                .use(UsersControllers.remove_admin)
                .use(UsersControllers.delete_user)
                .group("/teacher", (app) =>
                  app
                    .use(TeacherController.create_teacher)
                    .use(TeacherController.update_teacher)
                )
            )
      )
      .use(AuthController)
      .get("/", () => "Hello Elysia", { detail: { tags: ["App"] } })
  );

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
