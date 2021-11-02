const {
  getAllLaunches,
  launchExist,
  abortLaunch,
  saveLaunch,
  scheduleNewLaunch
} = require('../../models/launches.model');


async function httpGetAllLaunches(req, res) {
  try {
    return res.status(200).json(await getAllLaunches())
  } catch (e) {
    return res.status(400) // client related - Bad Request - syntax error
      .json({ error: e.message })
  }

}

async function httpAddNewLaunch(req, res) {
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
  await scheduleNewLaunch(launch)
  return res.status(201).json(launch)
}

async function httpAbortLaunch(req, res) {
  const id = +req.params.id
  if (!await launchExist(id)) {
    return res.status(404).json({
      error: `Launch does not exist with id: ${id}`
    })
  }
  const deletedLaunch = await abortLaunch(id)
  if (!deletedLaunch) {
    return res.status(400).json({
      error: `Can't delete launch with id: ${id}`
    })
  }
  return res.status(202).json({
    ok: true
  })



}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
}
