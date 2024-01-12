const jwt = require('jsonwebtoken');
const SECRET_KEY = 'aaaaaa';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

module.exports = { authenticate };
