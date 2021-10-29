const launches = new Map();
let latestFlightNumber = 100;

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

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values())
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(latestFlightNumber,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ['Evgeniy', 'Katia'],
      flightNumber: latestFlightNumber
    })
  )
}

function abortLaunch(id) {
  launches.delete(id)
  return !launches.has(id);
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
}
