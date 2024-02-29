const prisma = require("../lib/prisma");
const { check, validationResult } = require("express-validator");

exports.validateSchedule = [
  check("daysAfterSowing")
    .optional()
    .isNumeric()
    .withMessage("Days After Sowing must be a number"),
  check("fertiliser")
    .optional()
    .isString()
    .withMessage("Fertiliser must be a string"),
  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("Quantity must be a number"),
  check("quantityUnit")
    .optional()
    .isIn(["ton", "kg", "g", "L", "mL"])
    .withMessage(
      "Quantity Unit must be either ton, kg, g for solids or L, mL for liquids"
    ),
];

exports.getSchedules = async function (req, res) {
  await prisma.schedule
    .findMany()
    .then((schedules) => {
      res.json(schedules);
      console.log("Info: Total", schedules.length, "schedules found.");
    })
    .catch((error) => {
      res.json({ error: error.message });
      console.error("Error:", error.message);
    });
};

exports.addSchedule = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { daysAfterSowing, fertiliser, quantity, quantityUnit, farmId } =
    req.body;

  const farm = await prisma.farm.findUnique({
    where: {
      id: farmId,
    },
  });

  if (!farm) {
    return res.status(400).json({ error: "Farm ID does not exist" });
  }

  await prisma.schedule
    .create({
      data: {
        daysAfterSowing,
        fertiliser,
        quantity,
        quantityUnit,
        farmId,
      },
    })
    .then((schedule) => {
      res.json(schedule);
      console.log("Info: schedule with ID", schedule.id, "added.");
    })
    .catch((error) => {
      res.json({ error: error.message });
      console.error("Error:", error.message);
    });
};

exports.removeSchedule = async function (req, res) {
  const { id } = req.body;

  const schedule = await prisma.schedule.findUnique({
    where: {
      id: id,
    },
  });

  if (!schedule) {
    return res.status(400).json({ error: "Schedule ID does not exist" });
  }

  await prisma.schedule
    .delete({
      where: {
        id: id,
      },
    })
    .then((schedule) => {
      res.json(schedule);
      console.log("Info: schedule with ID", id, "removed.");
    })
    .catch((error) => {
      res.json({ error: error.message });
      console.error("Error:", error.message);
    });
};

exports.updateSchedule = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, daysAfterSowing, fertiliser, quantity, quantityUnit, farmId } =
    req.body;

  const schedule = await prisma.schedule.findUnique({
    where: {
      id: id,
    },
  });

  if (!schedule) {
    return res.status(400).json({ error: "Schedule ID does not exist" });
  }

  const farm = await prisma.farm.findUnique({
    where: {
      id: farmId,
    },
  });

  if (!farm) {
    return res.status(400).json({ error: "Farm ID does not exist" });
  }

  await prisma.schedule
    .update({
      where: {
        id: id,
      },
      data: {
        daysAfterSowing,
        fertiliser,
        quantity,
        quantityUnit,
        farmId,
      },
    })
    .then((schedule) => {
      res.json(schedule);
      console.log("Info: schedule with ID", id, "updated.");
    })
    .catch((error) => {
      res.json({ error: error.message });
      console.error("Error:", error.message);
    });
};

exports.getSchedulesDue = async function (req, res) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const schedules = await prisma.schedule.findMany({
    include: {
      farm: true,
    },
  });

  const dueSchedules = schedules.filter((schedule) => {
    const sowingDate = new Date(schedule.farm.sowingDate);
    const daysSinceSowing = Math.ceil(
      (today - sowingDate) / (1000 * 60 * 60 * 24)
    );
    const daysUntilDue = schedule.daysAfterSowing - daysSinceSowing;

    return daysUntilDue === 0 || daysUntilDue === 1;
  });

  res.json(dueSchedules);
  console.log("Info: Total", dueSchedules.length, "schedules due.");
};
