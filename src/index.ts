import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { jwt } from "@elysiajs/jwt";
const { JWT_SECRET } = process.env;

// Connect Database
import "./database/db.setup";

// Controllers
import { YearAndClassController } from "./controllers/year_class.controller";
import { TeacherController } from "./controllers/teacher.controller";
import { AuthController } from "./controllers/auth.controller";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .listen(3000)
  .use(jwt({ secret: JWT_SECRET }))
  .use(
    swagger({
      documentation: {
        tags: [
          { name: "App", description: "General endpoints" },
          { name: "Student", description: "Student endpoints" },
          { name: "Teacher", description: "Teacher endpoints" },
          { name: "Class", description: "Class endpoints" },
          { name: "Year", description: "Year endpoints" },
          { name: "Auth", description: "Auth endpoints" },
        ],
      },
    })
  )
  .group("/api/v1", (app) =>
    app
      .guard({}, (app) =>
        app
          .derive(async ({ jwt, cookie: { auth }, set }) => {
            if (!auth?.value) {
              set.status = 401;
              return { error: "Unauthorized: Token missing" };
            }
            try {
              const token = await jwt.verify(auth.value);

              if (!token) {
                set.status = 401;
                return { error: "Unauthorized: Invalid token" };
              }
              return { user: token };
            } catch (error) {
              throw new Error("Access Forbidden!!");
            }
          })
          .use(YearAndClassController)
          .use(TeacherController)
      )
      .use(AuthController)
  );

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
