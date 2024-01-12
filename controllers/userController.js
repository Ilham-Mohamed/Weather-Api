const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'aaaaaa';

const login = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const isPasswordValid = await user.comparePassword(req.body.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Incorrect password' });
  }
  const token = jwt.sign({ user_id: user._id }, SECRET_KEY, {
    expiresIn: '6h',
  });

  res.json({ token });
};

const createUser = async (req, res) => {
  const { email, password, location } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ error: 'User with this email already exists' });
    }

    const newUser = await User.create({ email, password, location });

    const token = jwt.sign({ user_id: newUser._id }, SECRET_KEY, {
      expiresIn: '6h',
    });

    res.json({ token, newUser });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateLocation = async (req, res) => {
  const { userId } = req.params;
  const { location } = req.body;

  const tokenUserId = req.user.user_id;

  if (userId !== tokenUserId) {
    return res
      .status(403)
      .json({ error: 'Invalid User' });
  }

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
    
    const tokenUserId = req.user.user_id;

    if (userId !== tokenUserId) {
      return res.status(403).json({ error: 'Invalid User' });
    }

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
  login,
};
