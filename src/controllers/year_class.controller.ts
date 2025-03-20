import { Elysia, t } from "elysia";
import YearModel from "../models/year.model";

export const YearAndClassController = (app: Elysia) =>
  app.group("/year-class", (app) =>
    app
      // เพิ่มปีการศึกษา
      .post(
        "/add",
        async ({ body, set }) => {
          try {
            const yearExists = await YearModel.findOne({ year: body.year });
            if (yearExists) {
              set.status = 400;
              return { message: "Year already exists" };
            }
            const newYear = new YearModel(body);
            newYear.save();
            set.status = 200;
            return { message: "Year added successfully", data: newYear };
          } catch (error) {
            set.status = 500;
            return { message: "เซิฟเวอร์ผิดพลาดในการเพิ่มปีการศึกษา" };
          }
        },
        {
          body: t.Object({
            year: t.Number(),
          }),
          tags: ["Year And Class"],
        }
      )
      //เพิ่มชั้นเรียนในปีการศึกษา
      .post(
        "/add-class",
        async ({ body, set }) => {
          if (body.class.length === 0) {
            set.status = 400;
            return { message: "กรุณากรอกชั้นเรียนที่ต้องการเพิ่ม" };
          }
          try {
            // หาปีการศึกษา
            const year = await YearModel.findOne({ year: body.year });
            if (!year) {
              set.status = 404;
              return { message: "ไม่พบปีการศึกษาที่ต้องการเพิ่มชั้นเรียน" };
            }
            // ลูปเช็คว่าชั้นเรียนมีห้องไหนบ้าง
            const existingClasses = year.class.map(
              (c) => `${c.grade}-${c.room}`
            );
            // กรองชั้นเรียนที่ยังไม่มีในปีการศึกษา
            const newClasses = body.class.filter(
              (c) => !existingClasses.includes(`${c.grade}-${c.room}`)
            );
            if (newClasses.length === 0) {
              set.status = 400;
              return { message: "ชั้นเรียนที่เพิ่มมีอยู่แล้ว", data: year };
            }
            year.class.push(...body.class);
            await year.save();
            set.status = 200;
            return { message: "เพื่มชั้นเรียนสำเร็จ", data: year };
          } catch (error) {
            set.status = 500;
            console.log(error);

            return { message: "เซิฟเวอร์ผิดพลาดในการเพิ่มชั้นเรียน" };
          }
        },
        {
          body: t.Object({
            year: t.Number(),
            class: t.Array(t.Object({ grade: t.Number(), room: t.Number() })),
          }),
          detail: {
            tags: ["Year And Class"],
            description: "เพิ่มชั้นเรียนลงในปีการศึกษา",
          },
        }
      )
      // อัพเดตปีการศึกษา
      .put(
        "/",
        async ({ body, set }) => {
          try {
          } catch (error) {
            set.status = 500;
            return { message: "เซิฟเวอร์ผิดพลาดในการอัพเดตปีการศึกษา" };
          }
        },
        {
          body: t.Object({
            year: t.Number(),
            classId: t.Array(t.Object({ _id: t.String() })),
          }),
          tags: ["Year And Class"],
        }
      )
      .post("/", () => {}, { body: t.Object({}) })
      .get("/", () => {})
      .put("/", () => {}, { body: t.Object({}) })
      .delete("/", () => {})
  );
