const User = require('../models/user.js');

const createUser = async (req, res) => {
  const { email, location } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ error: 'User with this email already exists' });
    }

    const user = await User.create({ email, location });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateLocation = async (req, res) => {
  const { userId } = req.params;
  const { location } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { location },
      { new: true }
    );

    if (user) {
      res.json({ message: 'Location updated successfully', user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getWeatherData = async (req, res) => {
  const { userId, date } = req.params;

  try {
    const user = await User.findById(userId);
    const weatherData = user.weatherData.filter(
      (data) => data.date.toISOString().split('T')[0] === date
    );

    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createUser,
  updateLocation,
  getWeatherData,
};
