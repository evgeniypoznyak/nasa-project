const http = require('http')
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model')

const server = http.createServer(app)
const PORT = process.env.PORT || '' + 8000;
const HOST = process.env.HOST = 'http://localhost';

async function startServer() {
  await loadPlanetsData()

  server.listen(PORT, () => console.log(`Listening on port: ${PORT}...
${HOST}:${PORT}
`));
}

startServer()


