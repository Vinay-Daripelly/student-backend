const request = require("supertest");
const { expect } = require("chai");
const app = require("../server");   // ✅ Import Express App

describe("Student Management API Tests", function () {

  let createdStudentId = "";

  // ✅ Test 1: GET all students
  it("should GET all students", async function () {
    const res = await request(app).get("/students");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  // ✅ Test 2: POST a new student
  it("should POST a new student", async function () {
    const res = await request(app)
      .post("/students")
      .send({
        name: "Vinay",
        rollNo: "102",
        department: "CSE",
        year: "4th",
      });

    expect(res.status).to.equal(201);
    expect(res.body.student).to.have.property("id");

    createdStudentId = res.body.student.id;
  });

  // ✅ Test 3: PATCH update student
  it("should UPDATE student using PATCH", async function () {
    const res = await request(app)
      .patch(`/students/${createdStudentId}`)
      .send({ year: "Final Year" });

    expect(res.status).to.equal(200);
  });

  // ✅ Test 4: DELETE student
  it("should DELETE student", async function () {
    const res = await request(app).delete(`/students/${createdStudentId}`);
    expect(res.status).to.equal(200);
  });

});
