const request = require("supertest");
const app = require("./index");
const server = require("./index");

let farmer, farm, schedule;

beforeAll(async () => {
  // Create a farmer
  const farmerRes = await request(app).post("/addFarmer").send({
    name: "John Doe",
    phoneNumber: "1234567890",
    language: "English",
  });
  farmer = farmerRes.body;

  // Create a farm
  const farmRes = await request(app).post("/addFarm").send({
    area: 100,
    village: "Village 1",
    cropGrown: "Wheat",
    sowingDate: "2021-01-01",
    country: "United States",
    farmerId: farmer.id,
  });
  farm = farmRes.body;

  // Create a schedule
  const scheduleRes = await request(app).post("/addSchedule").send({
    daysAfterSowing: 10,
    fertiliser: "Fertiliser A",
    quantity: 5,
    quantityUnit: "kg",
    farmId: farm.id,
  });
  schedule = scheduleRes.body;
});

afterAll(async () => {
  // Remove the schedule
  await request(app).post("/removeSchedule").send({ id: schedule.id });

  // Remove the farm
  await request(app).post("/removeFarm").send({ id: farm.id });

  // Remove the farmer
  await request(app).post("/removeFarmer").send({ id: farmer.id });

  server.close();
});

describe("POST /getSchedulesDue", () => {
  it("should return a list of schedules due for today/tomorrow", async () => {
    const res = await request(app)
      .post("/getSchedulesDue")
      .expect("Content-Type", /json/)
      .expect(200);

    console.log("Schedules due:", res.body);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("POST /getFarmersGrowingCrop", () => {
  it("should return a list of farmers who are growing a crop", async () => {
    const res = await request(app)
      .post("/getFarmersGrowingCrop")
      .expect("Content-Type", /json/)
      .expect(200);

    console.log("Farmers who are growing crop:", res.body);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("POST /calculateBill", () => {
  it("should calculate the bill of materials for a single farmer", async () => {
    const body = {
      farmerId: farmer.id,
      fertiliserPrices: {
        "Fertiliser A": 10,
        "Fertiliser B": 20,
        "Fertiliser C": 30,
      },
    };

    const res = await request(app)
      .post("/calculateBill")
      .send(body)
      .expect("Content-Type", /json/)
      .expect(200);

    console.log(res.body);
    expect(typeof res.body.totalCost).toBe("number");
  });
});
