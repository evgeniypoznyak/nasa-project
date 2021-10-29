const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');


const habitablePlanets = [];

const isHabitablePlanet = (planet) => {
  return planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
    ;
}
 // used in server.js in startServer()
function  loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
      .pipe(parse({
        comment: '#',
        columns: true,
      }))
      .on('data', (data) => {
        if (isHabitablePlanet(data)) {
          habitablePlanets.push(data)
        }
      })
      .on('error', (error) => {
        console.log('error: ', error)
        reject(error)
      })
      .on('end', () => {
        console.log(habitablePlanets.map(planet => {
          return planet['kepler_name']
        }))
        console.log(habitablePlanets.length)
        console.log('done')
        resolve()
      });
  })

}

function getAllPlanets() {
     return habitablePlanets
}


module.exports = {
  loadPlanetsData, // used in server.js in startServer()
  getAllPlanets
}
