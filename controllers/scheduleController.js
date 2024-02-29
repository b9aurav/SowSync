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
  const { daysAfterSowing, fertiliser, quantity, quantityUnit, farmId } = req.body;
  await prisma.schedule
    .create({
      data: {
        daysAfterSowing,
        fertiliser,
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
  const { daysAfterSowing, fertiliser, quantity, quantityUnit, farmId } = req.body;
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
    const daysSinceSowing = Math.ceil((today - sowingDate) / (1000 * 60 * 60 * 24));
    const daysUntilDue = schedule.daysAfterSowing - daysSinceSowing;

    return daysUntilDue === 0 || daysUntilDue === 1;
  });

  res.json(dueSchedules);
  console.log("Info: Total", dueSchedules.length, "schedules due.");
}