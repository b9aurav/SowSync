# Steps to deploy

### 1. Clone the repository

```
git clone https://github.com/b9aurav/SowSync.git
cd SowSync
```

### 2. Install required packages

```
npm install
```

### 3. Rename `.env.example` file to `.env` and replace mongodb url in `.env` file.

```
mongodb://USERNAME:PASSWORD@HOST:PORT/DATABASE     //Example
```

### 4. Create database using Prisma ORM.

```
npx prisma db push
```

Note: It will automatically create tables with defined schema in `prisma.schema` file.

### 5. Run node application to expose api endpoints.

```
node index.js
```

Note: The enpoints should be exposed on 3000 port. E.g. http://localhost:3000

### To run basic unit tests,

```
npm test
```

# Endpoints with parameters

## Farmer:

##### `/getFarmers` - Get all farmers from database.

##### `/getFarmerById` - Get farmer details by ID.

```
{
    "id": "farmer_id" //String
}
```

##### `/addFarmer` - Add new farmer to database.

```
{
    "name": "farmer_name", //String
    "phoneNumber": phoneNumber, //String
    "language": "language" //String
}
```

##### `/removeFarmer` - Remove farmer from database.

```
{
    "id": "farmer_id" //String
}
```

##### `/updateFarmer` - Update farmer details.

```
{
    "id": "farmer_id", //String
    "name": "farmer_name", //optional String
    "phoneNumber": phoneNumber, //optional String
    "language": "new_value" //optional String
}
```

##### `/getFarmersGrowingCrop` - Get all farmers who are growing crop.

##### `/calculateBill` - Calculate the bill of fertiliser for a single farmer.

```
{
  "farmerId": "farmer_id", //String
  "fertiliserPrices": {
    "Fertiliser 1": { "price": 10, "unit": "g" },
    "Fertiliser 2": { "price": 20, "unit": "kg" },
    "Fertiliser 3": { "price": 30, "unit": "ton" }
  }
}
```

## Farm

##### `/getFarms` - Get all farms from database.

##### `/getFarmById` - Get farm details by ID.

```
{
    "id": "farm_id" //String
}
```

##### `/getFarmsByFarmerId` - Get all farm details of a farmer.

```
{
    "farmerId": "farmer_id" //String
}
```

##### `/addFarm` - Add new farm to database.

```
{
    "area": area, //Float
    "village": "village_name", //String
    "cropGrown": "crop_name", //optional String
    "sowingDate": "sowing_date", //optional String
    "country": "country_name", //String
    "farmerId": "farmer_id" //String
}
```

##### `/removeFarm` - Remove farm from database.

```
{
    "id": "farm_id" //String
}
```

##### `/updateFarm` - Update farm details.

```
{
    "id": "farm_id", //String
    "area": area, //optional Float
    "village": "village_name", //optional String
    "cropGrown": "crop_name", //optional String
    "sowingDate": "sowing_date", //optional String
    "country": "country_name", //optional String
    "farmerId": "farmer_id" //optional String
}
```

## Schedule

##### `/getSchedules` - Get all schedules from database.

##### `/getScheduleById` - Get schedule details by ID.

```
{
    "id": "schedule_id" //String
}
```

##### `/getSchedulesByFarmId` - Get all schedules of a farm.

```
{
    "farmId": "farm_id" //String
}
```

##### `/addSchedule` - Add new schedule to database.

```
{
    "daysAfterSowing": daysAfterSowing, //Int
    "fertiliser": "fertiliser_name", //String
    "quantity": qty, //Float
    "quantityUnit": "qty.unit", // ["ton", "kg", "g", "L", "mL"], String
    "farmId": "farm_id" //String
}
```

##### `/removeSchedule` - Remove schedule from database.

```
{
    "id": "schedule_id" //String
}
```

##### `/updateSchedule` - Update schedule details.

```
{
    "id": "schedule_id", //String
    "daysAfterSowing": daysAfterSowing, //optional Int
    "fertiliser": "fertiliser_name", //optional String
    "quantity": qty, //optional Float
    "quantityUnit": "qty.unit", // ["ton", "kg", "g", "L", "mL"] optional String
    "farmId": "farm_id" //optional String
}
```

##### `/getSchedulesDue` - Get all schedules due for today/tomorrow.

# Tech-stack

[ Node.js ] -
[ Express ] -
[ MongoDB ] -
[ Prisma ORM ]
