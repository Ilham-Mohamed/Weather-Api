const express = require('express');
const router = express.Router();
const axios = require('axios');
const cron = require('node-cron');
const sgMail = require('@sendgrid/mail');
const User = require('../models/user.js');
const userController = require('../controllers/userController.js');
const { authenticate } = require('../middleware/authMiddleware.js');

sgMail.setApiKey(`${process.env.SENDGRID_KEY}`);

router.post('/login', userController.login);

router.post('/create-user', userController.createUser);
router.put(
  '/update-location/:userId',
  authenticate,
  userController.updateLocation
);
router.get(
  '/weather/:userId/:date',
  authenticate,
  userController.getWeatherData
);

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
      await user.save({ validateBeforeSave: false });

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
