const Sensor = require('../models/Sensor'); // Adjust the path as necessary

const createSensorData = async (punchingBagId, sessionData) => {
  let totalPower = 0;
  let successfulHits = 0;

  console.log('Creating sensor data for punchingBagId:', punchingBagId);
  console.log('Session data received:', JSON.stringify(sessionData, null, 2)); // Log formatted JSON

  // Process each session data entry
  for (const entry of sessionData) {
    totalPower += entry.power;
    if (entry.hit) {
      successfulHits++;
    }
  }

  const accuracy = (successfulHits / sessionData.length) * 100;
  console.log('Total Power:', totalPower);
  console.log('Successful Hits:', successfulHits);
  console.log('Calculated Accuracy:', accuracy.toFixed(2)); // Log accuracy with two decimal places

  // Create a new sensor entry in the database
  const sensor = new Sensor({ punchingBagId, accuracy, power: totalPower });
  try {
    await sensor.save();
    console.log('Sensor saved successfully:', sensor);
  } catch (error) {
    console.error('Error saving sensor:', error);
    throw new Error('Failed to save sensor data');
  }

  return { accuracy, totalPower, successfulHits };
};

const calculateScores = async (punchingBagId) => {
  console.log('Calculating scores for punchingBagId:', punchingBagId);
  
  // Fetch sensor data
  let sensors;
  try {
    sensors = await Sensor.find({ punchingBagId });
    console.log('Sensors retrieved:', JSON.stringify(sensors, null, 2)); // Log formatted JSON
  } catch (error) {
    console.error('Error fetching sensors:', error);
    throw new Error('Failed to retrieve sensor data');
  }

  // Check if sensors were found
  if (sensors.length === 0) {
    console.warn('No sensors found for punchingBagId:', punchingBagId);
    return [];
  }

  // Aggregate scores and sort to determine medals
  const scores = sensors.map(sensor => ({
    accuracy: sensor.accuracy,
    power: sensor.power,
  }));

  // Log scores before sorting
  console.log('Scores before sorting:', JSON.stringify(scores, null, 2)); // Log formatted JSON

  // Sort scores by accuracy and power
  scores.sort((a, b) => b.accuracy - a.accuracy || b.power - a.power);
  console.log('Scores after sorting:', JSON.stringify(scores, null, 2)); // Log formatted JSON

  // Get top three scores
  const medals = scores.slice(0, 3);
  console.log('Top three scores (medals):', JSON.stringify(medals, null, 2)); // Log formatted JSON

  return medals;
};

const getSensorsByPunchingBag = async (punchingBagId) => {
  console.log('Fetching sensors for punchingBagId:', punchingBagId);
  try {
    const sensors = await Sensor.find({ punchingBagId });
    console.log('Retrieved sensors:', JSON.stringify(sensors, null, 2)); // Log formatted JSON
    return sensors;
  } catch (error) {
    console.error('Error fetching sensors:', error);
    throw new Error('Failed to retrieve sensor data');
  }
};

module.exports = {
  createSensorData,
  calculateScores,
  getSensorsByPunchingBag,
};
