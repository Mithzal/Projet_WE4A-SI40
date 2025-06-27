const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import User model to fetch user details

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Store basic user data from token
    req.userData = {
      userId: decodedToken.userId,
      role: decodedToken.role
    };

    // Fetch additional user information from database for logs
    try {
      const user = await User.findById(decodedToken.userId);
      if (user) {
        // Add user name to userData
        req.userData.name = user.name;
      }
    } catch (dbError) {
      console.warn('Could not fetch user details for logs:', dbError.message);
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};
