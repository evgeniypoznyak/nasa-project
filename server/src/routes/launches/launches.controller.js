const {
  getAllLaunches,
  addNewLaunch,
  abortLaunch
} = require('../../models/launches.model');


function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches())
}

function httpAddNewLaunch(req, res) {
  const launch = req.body
  if (!launch.launchDate || !launch.mission || !launch.rocket || !launch.target) {
    return res.status(400) // client related - Bad Request - syntax error
      .json({ error: 'Missing required launch property' })
  }
  launch.launchDate = new Date(req.body.launchDate)
  if (isNaN(launch.launchDate) /*launch.launchDate.toString() === 'Invalid Date'*/) {
    return res.status(400) // client related - Bad Request - syntax error
      .json({ error: 'Invalid launch date' })
  }
  addNewLaunch(launch)
  return res.status(201).json(launch)
}

function httpAbortLaunch(req, res) {
  const id = +req.params.id
  console.log(id)
  const result = abortLaunch(id)
  if (result) {
    return res.status(202).json({})
  }
  return res.status(400).json({
    error: `Launch does not exist with id: ${id}`
  })

}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
}
