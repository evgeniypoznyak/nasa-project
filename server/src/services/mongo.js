const mongoose = require('mongoose');

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      // useFindAndModify: false,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    }, null)
  } catch (e) {
    console.error(`ERROR WITH MONGODB: ${e.message}`.red,)
  }
}

async function disconnectFromMongoDB() {
  await mongoose.disconnect()
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
