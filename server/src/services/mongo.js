const mongoose = require('mongoose');

const MONGO_URL = 'mongodb://localhost:8002/nasa';

async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      // useFindAndModify: false,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    })
  } catch (e) {
    console.error(`ERROR WITH MONGODB: ${e.message}`.red,)
  }
}

async function disconnectFromMongoDB() {

}

mongoose.connection.on('open', () => {
  console.info('Successfully connected to MongoDB'.yellow)
})
mongoose.connection.on('error', (e) => {
  console.error(`ERROR WITH MONGODB: ${e.message}`.red,)
})

module.exports = {
  connectToMongoDB,
  disconnectFromMongoDB
}
