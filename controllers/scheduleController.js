const prisma = require("../lib/prisma");

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
  const { daysAfterSowing, fertilizer, quantity, quantityUnit, farmId } = req.body;
  await prisma.schedule
    .create({
      data: {
        daysAfterSowing,
        fertilizer,
        quantity,
        quantityUnit,
        farmId
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
  const { daysAfterSowing, fertilizer, quantity, quantityUnit, farmId } = req.body;
  await prisma.schedule
    .update({
      where: {
        id: id,
      },
      data: {
        daysAfterSowing,
        fertilizer,
        quantity,
        quantityUnit,
        farmId
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
