const prisma = require("../lib/prisma");

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

exports.addFarmer = async function (req, res) {
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
  const { id, name, phoneNumber, language } = req.body;
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
    await prisma.farmer.findMany({
        where: {
            farms: {
                some: {
                    cropGrown: {
                        not: ""
                    }
                }
            }
        },
        include: {
            farms: true
        }
    })
    .then((farmers) => {
      res.json(farmers);
      console.log("Info: Total", farmers.length, "farmers growing crop.");
    })
    .catch((error) => {
      res.json({ error: error.message });
      console.error("Error:", error.message);
    });
}

exports.calculateBill = async function (req, res) {
    const { farmerId, fertiliserPrices } = req.body;
    await prisma.farm.findMany({
        where: {
            farmerId: req.body.farmerId
        },
        include: {
            schedules: true
        }
    })
    .then((farms) => {
        let totalCost = 0;
        for (const farm of farms) {
            for (const schedule of farm.schedules) {
                const fertiliserPrice = fertiliserPrices[schedule.fertiliser];
                if (fertiliserPrice) {
                    totalCost += fertiliserPrice * schedule.quantity;
                } else {
                    res.json({ error: `Fertiliser ${schedule.fertiliser} not found in prices list` });
                    console.error(`Error: Fertiliser ${schedule.fertiliser} not found in prices list`);
                    return;
                }
            }
        }
        res.json({ "totalCost": totalCost });
        console.log("Info: Total cost calculated for farmer with ID", farmerId);
    })
    .catch((error) => {
      res.json({ error: error.message });
      console.error("Error:", error.message);
    });
}