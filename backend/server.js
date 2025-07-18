require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// adding Edamam routes
const edamamRoutes = require('./routes/edamamRoutes');
app.use('/api/edamam', edamamRoutes);

app.get('/', (req, res) => {
  res.send('HealthMate Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
  console.log("Edamam APP ID:", process.env.EDAMAM_APP_ID);
});
