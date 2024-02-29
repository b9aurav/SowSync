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

# Endpoints

### Farmer:
##### `/getFarmers` - Get all farmers from database.
##### `/addFarmer` - Add new farmer to database.
##### `/removeFarmer` - Remove farmer from database.
##### `/updateFarmer` - Update farmer details.
##### `/getFarmersGrowingCrop` - Get all farmers who are growing crop.
##### `/calculateBill` - Calculate the bill of fertiliser for a single farmer.

### Farm
##### `/getFarms` - Get all farms from database.
##### `/addFarm` - Add new farm to database.
##### `/removeFarm` - Remove farm from database.
##### `/updateFarm` - Update farm details.

### Schedule
##### `/getSchedules` - Get all schedules from database.
##### `/addSchedule` - Add new schedule to database.
##### `/removeSchedule` - Remove schedule from database.
##### `/updateSchedule` - Update schedule details.
##### `/getSchedulesDue` - Get all schedules due for today/tomorrow.

# Tech-stack

[ Node.js ] -
[ Express ] -
[ MongoDB ] -
[ Prisma ORM ]