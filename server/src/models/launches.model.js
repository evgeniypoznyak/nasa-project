const launches = new Map();
let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 20, 2030'),
  destination: 'Kepler-442 b',
  customers: ['Evgeniy','NASA'],
  upcoming: true,
  success: true,
}

const launch2 = {
  flightNumber: 200,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 21, 2031'),
  destination: 'Kepler-442 b',
  customers: ['Evgeniy','NASA'],
  upcoming: true,
  success: true,
}

launches.set(launch.flightNumber, launch);
launches.set(launch2.flightNumber, launch2);

function getAllLaunches() {
  return Array.from(launches.values())
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(launch.flightNumber,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ['Evgeniy', 'Katia'],
      flightNumber: latestFlightNumber
    })
  )
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
}
