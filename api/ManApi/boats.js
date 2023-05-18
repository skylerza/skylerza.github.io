const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');

const router = express.Router();
const PORT = 3001;

router.get('/:model', (req, res) => {
  const { model } = req.params;
  const results = [];

  fs.createReadStream('./api/boats.csv')
    .pipe(csv())
    .on('data', (data) => {
      results.push(data);
    })
    .on('end', () => {
      const modelData = results.find((row) => row.model === model);
      if (modelData) {
        const { model,length,freight,trailer,boatEngineAndTrailerFees,engineRigging,enginePreRigPrice,nmma,engineFreight,msrp } = modelData;
        res.json({ model,length,freight,trailer,boatEngineAndTrailerFees,engineRigging,enginePreRigPrice,nmma,engineFreight,msrp });
      } else {
        res.status(404).json({ error: `Model "${model}" not found` });
      }
    })
    .on('error', (error) => {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    });
});
