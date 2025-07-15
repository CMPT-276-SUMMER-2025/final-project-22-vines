// starter template
require('dotenv').config(); // Loads .env variables

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Example route to test
app.get('/', (req, res) => {
  res.send('HealthMate Backend is running!');
});

// to add Edamam routes later here..

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
  console.log("Edamam APP ID:", process.env.EDAMAM_APP_ID);
});
