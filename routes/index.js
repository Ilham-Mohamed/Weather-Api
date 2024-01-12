require('dotenv').config();
const express = require('express');
const User = require('../model/user.js');
const axios = require('axios');
const cron = require('node-cron');
const sgMail = require('@sendgrid/mail');

const router = express.Router();
sgMail.setApiKey(`${process.env.SENDGRID_KEY}`);

router.post('/user', async (req, res) => {
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
});

router.put('/update-location/:userId', async (req, res) => {
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
});

router.get('/weather/:userId/:date', async (req, res) => {
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
});

cron.schedule('0 */3 * * *', async () => {
  const users = await User.find();

  users.forEach(async (user) => {
    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${user.location}&appid=${process.env.WEATHERMAP_KEY}`
      );

      const {
        main: { temp, humidity },
      } = weatherResponse.data;

      user.weatherData.push({ data: { temp, humidity } });
      await user.save();

      const msg = {
        to: user.email,
        from: 'ilham1998evr@gmail.com',
        subject: 'Hourly Weather Report',
        text: `Temperature: ${temp}K,\nHumidity: ${humidity}%`,
      };

      await sgMail.send(msg);
    } catch (error) {
      console.error(error.message);
    }
  });
});

module.exports = router;
