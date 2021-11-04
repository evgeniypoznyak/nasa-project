const axios = require('axios')
const launches = require('./launches.mongo')
const planets = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API = 'https://api.spacexdata.com/v4/launches/query';

async function populateSpaceXLaunches() {
    const launches = []
    const response = await axios.post(SPACEX_API, {
      "options": {
        "pagination": false,
        "populate": [
          {
            "path": "rocket",
            "select": {
              "name": 1
            }
          },
          {
            "path": "payloads",
            "select": {
              "customers": 1
            }
          }
        ]
      }
    })

  if (response.status !== 200) {
    const error = `Can't connect to SpaceX API`.red
    console.log(error)
    throw new Error(error)
  }

  const spaceXData = response.data.docs

    for (const launchDoc of spaceXData) {
      const launchData = {
        flightNumber: launchDoc.flight_number,
        mission: launchDoc.name,
        rocket: launchDoc.rocket.name,
        launchDate: new Date(launchDoc.date_local),
        customers: launchDoc['payloads'].flatMap(p => p['customers']),
        upcoming: launchDoc.upcoming,
        success: launchDoc.success
      }
      await saveLaunch(launchData)
    }
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat '
  })
  if (firstLaunch) {
    console.log('Launch data exist'.yellow)
    return;
  }
  await populateSpaceXLaunches();
}

async function getAllLaunches(skip, limit) {
  console.log(skip, limit)
  return launches
    .find({}, { '_id': 0, '__v': 0 })
    .sort({flightNumber: 1}) // -1 for descending order
    .skip(skip)
    .limit(limit);
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
  await launches.findOneAndUpdate(
    { flightNumber: launch.flightNumber }, // how we find if this exist in db
    launch,
    {
      upsert: true
    }
  )
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target })
  if (!planet) {
    throw new Error('No matching planet was found')
  }
  const newLaunch = Object.assign(launch, {
    flightNumber: await getLatestFlightNumber() + 1,
    success: true,
    upcoming: true,
    customers: ['Evgeniy', 'Katia']
  })
  await saveLaunch(newLaunch)
}

async function findLaunch(filter) {
  return launches.findOne(filter)
}

async function launchExist(id) {
  return await findLaunch({ flightNumber: id })
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
  scheduleNewLaunch,
  loadLaunchesData,
  findLaunch
}
