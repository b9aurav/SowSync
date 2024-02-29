const prisma = require("../lib/prisma");

exports.getFarms = async function (req, res) {
  await prisma.farm
    .findMany()
    .then((farms) => {
      res.json(farms);
      console.log("Info: Total", farms.length, "farms found.");
    })
    .catch((error) => {
      res.json({ error: error.message });
      console.error("Error:", error.message);
    });
};

exports.addFarm = async function (req, res) {
  const { area, village, cropGrown, sowingDate, country, farmerId } = req.body;
  await prisma.farm
    .create({
      data: {
        area,
        village,
        cropGrown,
        sowingDate: new Date(sowingDate),
        country,
        farmerId
      },
    })
    .then((farm) => {
      res.json(farm);
      console.log("Info: farm with ID", farm.id, "added.");
    })
    .catch((error) => {
      res.json({ error: error.message });
      console.error("Error:", error.message);
    });
};

exports.removeFarm = async function (req, res) {
  const { id } = req.body;
  await prisma.farm
    .delete({
      where: {
        id: id,
      },
    })
    .then((farm) => {
      res.json(farm);
      console.log("Info: farm with ID", id, "removed.");
    })
    .catch((error) => {
      res.json({ error: error.message });
      console.error("Error:", error.message);
    });
};

exports.updateFarm = async function (req, res) {
  const { id, area, village, cropGrown, sowingDate, country, farmerId } = req.body;
  await prisma.farm
    .update({
      where: {
        id: id,
      },
      data: {
        area,
        village,
        cropGrown,
        sowingDate: new Date(sowingDate),
        country,
        farmerId
      },
    })
    .then((farm) => {
      res.json(farm);
      console.log("Info: farm with ID", id, "updated.");
    })
    .catch((error) => {
      res.json({ error: error.message });
      console.error("Error:", error.message);
    });
};
