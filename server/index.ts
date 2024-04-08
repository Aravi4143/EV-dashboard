import express from "express";
import { handleVehicleRequest, handleFilteredVehicleRequest } from "./mappers/reqmapper";

const app = express();
const port = process.env.HOST_PORT || 3000;

// Get all vehicle data
app.get('/api/data', async (req, res) => {
  try {
    const vehicles = await handleVehicleRequest(req);
    res.json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error?.message || 'Error fetching vehicles', stacktrace: error?.stacktrace });
  }
});

// Get filtered vehicle data
app.get('/api/data/filtered', async (req, res) => {
  try {
    const vehicles = await handleFilteredVehicleRequest(req);
    res.json(vehicles);
} catch (error) {
  console.error(error);
  res.status(500).json({ message: error?.message || 'Error fetching filtered vehicles', stacktrace: error?.stack });
}
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Listening on ${process.env.HOST_URL}:${port}`);
  });
}

export default app;
