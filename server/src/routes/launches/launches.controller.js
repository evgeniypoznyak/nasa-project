const {
  getAllLaunches,
  addNewLaunch,
  launchExist,
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
  if (!launchExist(id)) {
    return res.status(404).json({
      error: `Launch does not exist with id: ${id}`
    })
  }
  const deletedLaunch = abortLaunch(id)
  return res.status(202).json(deletedLaunch)



}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
}
