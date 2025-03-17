import { Elysia, t } from "elysia";
import YearModel from "../models/year.model";
import ClassModel from "../models/class.model";

export const YearAndClassController = (app: Elysia) =>
  app.group("/year-class", (app) =>
    app
      // เพิ่มปีการศึกษา
      .post(
        "/",
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
          tags: ["Year"],
        }
      )
      //เพิ่มชั้นเรียนในปีการศึกษา
      .post(
        "/add-class",
        async ({ body, set }) => {
          try {
            const year = await YearModel.findOne({ year: body.year });
            if (!year) {
              set.status = 404;
              return { message: "ไม่พบปีการศึกษาที่ต้องการเพิ่มชั้นเรียน" };
            }
            const newClass = new ClassModel({
              grade: body.grade,
              room: body.room,
            });
            year.classId.push(newClass._id);
            await newClass.save();
            await year.save();
            set.status = 200;
            return { message: "เพื่มชั้นเรียนสำเร็จ", data: newClass };
          } catch (error) {
            set.status = 500;
            return { message: "เซิฟเวอร์ผิดพลาดในการเพิ่มชั้นเรียน" };
          }
        },
        {
          body: t.Object({
            grade: t.Number(),
            room: t.Number(),
            year: t.Number(),
          }),
          detail: {
            tags: ["Year"],
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
          tags: ["Year"],
        }
      )
      .post("/", () => {}, { body: t.Object({}) })
      .get("/", () => {})
      .put("/", () => {}, { body: t.Object({}) })
      .delete("/", () => {})
  );
