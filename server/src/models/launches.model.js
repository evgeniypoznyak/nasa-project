const launches = require('./launches.mongo')
const planets = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 20, 2030'),
  target: 'Kepler-442 b',
  customers: ['Evgeniy', 'NASA'],
  upcoming: true,
  success: true,
}

try {
  saveLaunch(launch)
} catch (e) {
  console.error(e.message)
}

async function getAllLaunches() {
  return launches.find({}, { '_id': 0, '__v': 0 })
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches
    .findOne()
    .sort('-flightNumber') // '-' is for Descending order
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target })
  if (!planet) {
    throw new Error('No matching planet was found')
  }

  await launches.findOneAndUpdate(
    { flightNumber: launch.flightNumber }, // how we find if this exist in db
    launch,
    {
      upsert: true
    }
  )
}

async function scheduleNewLaunch(launch) {
  const newLaunch = Object.assign(launch, {
    flightNumber: await getLatestFlightNumber() + 1,
    success: true,
    upcoming: true,
    customers: ['Evgeniy', 'Katia']
  })
 await saveLaunch(newLaunch)
}

async function launchExist(id) {
  return launches.findOne({ flightNumber: id })
}

async function abortLaunch(id) {
  const result = await launches.updateOne({ flightNumber: id }, {
    upcoming: false,
    success: false,
  })
  console.log(result)
  console.log(result.ok)
  console.log(result.nModified)
  return result.acknowledged === true && result.modifiedCount === 1
}

module.exports = {
  getAllLaunches,
  launchExist,
  abortLaunch,
  saveLaunch,
  scheduleNewLaunch,
}
