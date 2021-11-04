require('colors'); // coloring strings in console
require('dotenv').config() // making .env file readable
const http = require('http')
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model')
const { loadLaunchesData } = require('./models/launches.model')
const { connectToMongoDB } = require('./services/mongo');

const server = http.createServer(app)
const PORT = process.env.PORT || '' + 8000;
const HOST = process.env.HOST = 'http://localhost';


async function startServer() {
  await connectToMongoDB();
  await loadPlanetsData()
  await loadLaunchesData()

  server.listen(PORT, () => console.log(`Listening on port: ${PORT}...
${HOST}:${PORT}
`));
}

startServer()


