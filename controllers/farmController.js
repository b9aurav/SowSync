const prisma = require("../lib/prisma");
const { check, validationResult } = require("express-validator");

exports.validateFarmInputs = [
  check("area").optional().isNumeric().withMessage("Area must be a number"),
  check("village")
    .optional()
    .isString()
    .withMessage("Village must be a string"),
  check("cropGrown")
    .optional()
    .isString()
    .withMessage("Crop Grown must be a string"),
  check("sowingDate")
    .optional()
    .isString()
    .withMessage("Sowing Date must be a valid date"),
  check("country")
    .optional()
    .isString()
    .withMessage("Country must be a string"),
  check("farmerId")
    .optional()
    .isString()
    .withMessage("Farmer ID must be a valid UUID"),
];

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

exports.getFarmById = async function (req, res) {
  const { id } = req.body;
  await prisma.farm
    .findUnique({
      where: {
        id: id,
      },
    })
    .then((farm) => {
      if (!farm) {
        return res.status(400).json({ error: "Farm ID does not exist" });
      }
      res.json(farm);
    });
};

exports.getFarmsByFarmerId = async function (req, res) {
  const { farmerId } = req.body;
  const farmer = await prisma.farmer.findUnique({
    where: {
      id: farmerId,
    },
  });

  if (!farmer) {
    return res.status(400).json({ error: "Farmer ID does not exist" });
  }

  await prisma.farm
    .findMany({
      where: {
        farmerId: farmerId,
      },
    })
    .then((farms) => {
      res.json(farms);
      console.log(
        "Info: Total",
        farms.length,
        "farms found for farmer ID",
        farmerId
      );
    });
};

exports.addFarm = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { area, village, cropGrown, sowingDate, country, farmerId } = req.body;

  const farmer = await prisma.farmer.findUnique({
    where: {
      id: farmerId,
    },
  });

  if (!farmer) {
    return res.status(400).json({ error: "Farmer ID does not exist" });
  }

  await prisma.farm
    .create({
      data: {
        area: parseFloat(area),
        village,
        cropGrown,
        sowingDate: new Date(sowingDate),
        country,
        farmerId,
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

  const farm = await prisma.farm.findUnique({
    where: {
      id: id,
    },
  });

  if (!farm) {
    return res.status(400).json({ error: "Farm ID does not exist" });
  }

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, area, village, cropGrown, sowingDate, country, farmerId } =
    req.body;

  const farm = await prisma.farm.findUnique({
    where: {
      id: id,
    },
  });

  if (!farm) {
    return res.status(400).json({ error: "Farm ID does not exist" });
  }

  const farmer = await prisma.farmer.findUnique({
    where: {
      id: farmerId,
    },
  });

  if (!farmer) {
    return res.status(400).json({ error: "Farmer ID does not exist" });
  }

  await prisma.farm
    .update({
      where: {
        id: id,
      },
      data: {
        area: parseFloat(area),
        village,
        cropGrown,
        sowingDate: sowingDate == null ? null : new Date(sowingDate),
        country,
        farmerId,
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
