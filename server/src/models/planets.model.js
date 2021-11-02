const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');
const planets = require('./planets.mongo')

const isHabitablePlanet = (planet) => {
  return planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
    ;
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      { keplerName: planet.kepler_name }, // how we find if this exist in db
      {
        keplerName: planet.kepler_name
      },
      {
        upsert: true
      }
    );
  } catch (e) {
    console.error(`savePlanet, ERROR WITH MONGODB: ${e.message}`.red,)
  }

}

// used in server.js in startServer()
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
      .pipe(parse({
        comment: '#',
        columns: true,
      }))
      .on('data', async (data) => {
        if (isHabitablePlanet(data)) {
          await savePlanet(data);
        }
      })
      .on('error', (error) => {
        console.log('error: ', error)
        reject(error)
      })
      .on('end', async () => {
        const countPlanetsFound = (await getAllPlanets()).length
        console.log(`Found habitable planets: ${countPlanetsFound}`.blue)
        resolve()
      });
  })

}

async function getAllPlanets() {
  return planets.find({});
}


module.exports = {
  loadPlanetsData, // used in server.js in startServer()
  getAllPlanets
}
