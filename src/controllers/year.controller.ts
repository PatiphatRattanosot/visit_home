import { Elysia, t } from "elysia";
import YearModel from "../models/year_class.model";
import mongoose from "mongoose";

const create_year = async (app: Elysia) =>
  app.post(
    "/add",
    async ({ set, body }) => {
      try {
        const yearExists = await YearModel.findOne({ year: body.year });
        if (yearExists) {
          set.status = 400;
          return { message: "ปีการศึกษานี้มีอยู่แล้ว" };
        }
        const newYear = new YearModel(body);
        newYear.save();
        set.status = 200;
        return { message: "เพิ่มปีการศึกษาสำเร็จ", newYear };
      } catch (error) {
        set.status = 500;
        return { message: "เซิฟเวอร์ผิดพลาดในการเพิ่มปีการศึกษา" };
      }
    },
    {
      body: t.Object({
        year: t.Number(),
      }),
      detail: {
        tags: ["Year"],
        description: "เพิ่มปีการศึกษา",
      },
    }
  );
// เพิ่มชั้นเรียนในปีการศึกษา
const create_class = async (app: Elysia) =>
  app.post(
    "/add-class",
    async ({ set, body }) => {
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
          (c) => `${c.grade}-${c.room}-${c.teacher_id}`
        );
        // กรองชั้นเรียนที่ยังไม่มีในปีการศึกษา
        const newClasses = body.class.filter(
          (c) =>
            !existingClasses.includes(`${c.grade}-${c.room}-${c.teacher_id}`)
        );
        if (newClasses.length === 0) {
          set.status = 400;
          return { message: "ชั้นเรียนที่เพิ่มมีอยู่แล้ว", year };
        }
        year.class.push(...body.class);
        await year.save();
        set.status = 200;
        return { message: "เพื่มชั้นเรียนสำเร็จ", year };
      } catch (error) {
        set.status = 500;
        console.log(error);

        return { message: "เซิฟเวอร์ผิดพลาดในการเพิ่มชั้นเรียน" };
      }
    },
    {
      body: t.Object({
        year: t.Number(),
        class: t.Array(
          t.Object({
            grade: t.Number(),
            room: t.Number(),
            teacher_id: t.String(),
          })
        ),
      }),
      detail: {
        tags: ["Year"],
        description: "เพิ่มชั้นเรียนลงในปีการศึกษา",
      },
    }
  );
// ดึงข้อมูลปีการศึกษา
const get_year = async (app: Elysia) =>
  app.get(
    "/",
    async ({ set }) => {
      try {
        // ใช้ populate เพื่อดึงข้อมูลของ teacher_id (ซึ่งเชื่อมโยงกับ _id ของ User)
        const years = await YearModel.find().populate("class.teacher_id");

        set.status = 200;
        return { years };
      } catch (error) {
        console.log(error);
        set.status = 500;
        return { message: "เซิฟเวอร์ผิดพลาดในการดึงข้อมูลปีการศึกษา" };
      }
    },
    { detail: { tags: ["Year"] } }
  );

const get_years = async (app: Elysia) =>
  app.get(
    "/years",
    async ({ set }) => {
      try {
        const years = await YearModel.find().select("year");
        set.status = 200;
        return { years };
      } catch (error) {
        set.status = 500;
        return { message: "เซิฟเวอร์ผิดพลาดในการดึงรายการปีการศึกษา" };
      }
    },
    { detail: { tags: ["Year"] } }
  );

const update_class = async (app: Elysia) =>
  app.put(
    "/",
    async ({ set, body }) => {
      try {
        const { class_id, grade, room, teacher_id } = body;
        if (!class_id) {
          set.status = 400;
          return { message: "กรุณากรอกข้อมูล _id ชั้นเรียน" };
        }

        // ค้นหาปีที่มีชั้นเรียนที่ตรงกับ class_id
        const year = await YearModel.findOne({
          "class._id": class_id, // ค้นหาชั้นเรียนที่มี _id ตรงกับ class_id
        });

        if (!year) {
          set.status = 404;
          return { message: "ไม่พบชั้นเรียน" };
        }

        // หาชั้นเรียนที่ตรงกับ class_id จาก array class
        const classToUpdate = year.class.find(
          (c) => c._id.toString() === class_id
        );

        if (!classToUpdate) {
          set.status = 404;
          return { message: "ไม่พบชั้นเรียนที่ต้องการอัพเดต" };
        }

        // อัพเดตข้อมูลใน class
        classToUpdate.grade = grade;
        classToUpdate.room = room;

        // อัปเดตข้อมูลครู
        const new_teacher_id = new mongoose.Types.ObjectId(teacher_id);
        if (teacher_id) {
          classToUpdate.teacher_id = new_teacher_id;
        }

        // บันทึกข้อมูล
        await year.save();

        set.status = 200;
        return { message: "อัพเดตชั้นเรียนและครูสำเร็จ", year };
      } catch (error) {
        set.status = 500;
        return { message: "เซิฟเวอร์ผิดพลาดในการอัพเดตชั้นเรียนและครู" };
      }
    },
    {
      body: t.Object({
        class_id: t.String(),
        grade: t.Number(),
        room: t.Number(),
        teacher_id: t.String(), // ตัวนี้จะอัปเดตข้อมูลครู
      }),
      detail: { tags: ["Year"] },
    }
  );

const delete_class = async (app: Elysia) =>
  app.delete(
    "/delete-class",
    async ({ set, body }) => {
      try {
        const { class_id } = body;
        if (!class_id) {
          set.status = 400;
          return { message: "กรุณากรอกข้อมูล _id ชั้นเรียน" };
        }
        const year = await YearModel.findOne({
          class: { $elemMatch: { _id: class_id } },
        });
        if (!year) {
          set.status = 404;
          return { message: "ไม่พบชั้นเรียน" };
        }
        console.log(year.class);

        set.status = 200;
        return { message: "ลบชั้นเรียนสำเร็จ", year };
      } catch (error) {
        set.status = 500;
        return { message: "เซิฟเวอร์ผิดพลาดในการลบชั้นเรียน" };
      }
    },
    {
      body: t.Object({ class_id: t.String() }),
      detail: { tags: ["Year"] },
    }
  );

const delete_year = async (app: Elysia) =>
  app.delete(
    "/delete-year",
    async ({ set, body }) => {
      try {
        const { year_id } = body;
        if (!year_id) {
          set.status = 400;
          return { message: "กรุณากรอกข้อมูล _id ปีการศึกษา" };
        }
        const year = await YearModel.findOne({ _id: year_id });
        if (!year) {
          set.status = 404;
          return { message: "ไม่พบปีการศึกษา" };
        }
        await year.deleteOne();
        set.status = 200;
        return { message: `ลบปีการศึกษา ${year.year} สำเร็จ` };
      } catch (error) {
        set.status = 500;
        return { message: "เซิฟเวอร์ผิดพลาดในการลบชั้นเรียน" };
      }
    },
    {
      body: t.Object({ year_id: t.String() }),
      detail: { tags: ["Year"] },
    }
  );
const YearAndClassController = {
  create_year,
  create_class,
  get_year,
  get_years,
  update_class,
  delete_class,
  delete_year,
};
export default YearAndClassController;
