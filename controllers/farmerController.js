const prisma = require("../lib/prisma");
const { check, validationResult } = require("express-validator");

exports.validateFarmer = [
  check("name").optional().isString().withMessage("Name must be a string"),
  check("phoneNumber")
    .optional()
    .isString()
    .withMessage("Phone number must be in form of string"),
  check("language")
    .optional()
    .isString()
    .withMessage("Language must be a string"),
];

exports.validateBillInputs = [
  check("farmerId")
    .isString()
    .withMessage("Farmer ID must be in form of string"),
  check("fertiliserPrices")
    .isObject()
    .withMessage(
      "Fertiliser prices must be in form of object {fertiliser: price}"
    ),
];

exports.getFarmers = async function (req, res) {
  await prisma.farmer
    .findMany()
    .then((farmers) => {
      res.json(farmers);
      console.log("Info: Total", farmers.length, "farmers found.");
    })
    .catch((error) => {
      res.json({ error: error.message });
      console.error("Error:", error.message);
    });
};

exports.getFarmerById = async function (req, res) {
  const { id } = req.body;
  await prisma.farmer
    .findUnique({
      where: {
        id: id,
      },
    })
    .then((farmer) => {
      if (!farmer) {
        return res.status(400).json({ error: "Farmer ID does not exist" });
      }
      res.json(farmer);
    });
};

exports.addFarmer = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, phoneNumber, language } = req.body;
  await prisma.farmer
    .create({
      data: {
        name,
        phoneNumber,
        language,
      },
    })
    .then((farmer) => {
      res.json(farmer);
      console.log("Info: Farmer with ID", farmer.id, "added.");
    })
    .catch((error) => {
      res.json({ error: error.message });
      console.error("Error:", error.message);
    });
};

exports.removeFarmer = async function (req, res) {
  const { id } = req.body;

  const farmer = await prisma.farmer.findUnique({
    where: {
      id: id,
    },
  });

  if (!farmer) {
    return res.status(400).json({ error: "Farmer ID does not exist" });
  }

  await prisma.schedule.deleteMany({
    where: {
      farm: {
        farmerId: id,
      },
    },
  });

  await prisma.farm.deleteMany({
    where: {
      farmerId: id,
    },
  });

  await prisma.farmer
    .delete({
      where: {
        id: id,
      },
    })
    .then((farmer) => {
      res.json(farmer);
      console.log("Info: Farmer with ID", id, "removed.");
    })
    .catch((error) => {
      res.json({ error: error.message });
      console.error("Error:", error.message);
    });
};

exports.updateFarmer = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, name, phoneNumber, language } = req.body;

  const farmer = await prisma.farmer.findUnique({
    where: {
      id: id,
    },
  });

  if (!farmer) {
    return res.status(400).json({ error: "Farmer ID does not exist" });
  }

  await prisma.farmer
    .update({
      where: {
        id: id,
      },
      data: {
        name,
        phoneNumber,
        language,
      },
    })
    .then((farmer) => {
      res.json(farmer);
      console.log("Info: Farmer with ID", id, "updated.");
    })
    .catch((error) => {
      res.json({ error: error.message });
      console.error("Error:", error.message);
    });
};

exports.getFarmersGrowingCrop = async function (req, res) {
  await prisma.farmer
    .findMany({
      where: {
        farms: {
          some: {
            cropGrown: {
              not: "",
            },
          },
        },
      },
      include: {
        farms: true,
      },
    })
    .then((farmers) => {
      res.json(farmers);
      console.log("Info: Total", farmers.length, "farmers growing crop.");
    })
    .catch((error) => {
      res.json({ error: error.message });
      console.error("Error:", error.message);
    });
};

exports.calculateBill = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { farmerId, fertiliserPrices } = req.body;

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
        farmerId: req.body.farmerId,
      },
      include: {
        schedules: true,
      },
    })
    .then((farms) => {
      let totalCost = 0;
      for (const farm of farms) {
        for (const schedule of farm.schedules) {
          const fertiliserPrice = fertiliserPrices[schedule.fertiliser];
          if (fertiliserPrice) {
            const priceUnit = fertiliserPrice.unit;
            const convertedQuantity = convertQuantity(
              schedule.quantity,
              schedule.quantityUnit,
              priceUnit
            );
            console.log(convertedQuantity);
            totalCost += fertiliserPrice.price * convertedQuantity;
          } else {
            res.json({
              error: `Fertiliser ${schedule.fertiliser} not found in prices list`,
            });
            console.error(
              `Error: Fertiliser ${schedule.fertiliser} not found in prices list`
            );
            return;
          }
        }
      }
      res.json({ totalCost: totalCost });
      console.log("Info: Total cost calculated for farmer with ID", farmerId);
    })
    .catch((error) => {
      res.json({ error: error.message });
      console.error("Error:", error.message);
    });
};

function convertQuantity(quantity, quantityUnit, priceUnit) {
  const conversionRates = {
    g: {
      kg: 0.001,
      ton: 0.000001,
    },
    kg: {
      g: 1000,
      ton: 0.001,
    },
    ton: {
      g: 1000000,
      kg: 1000,
    },
    mL: {
      L: 0.001,
    },
    L: {
      mL: 1000,
    },
  };

  return quantity * (conversionRates[quantityUnit][priceUnit] || 1);
}
