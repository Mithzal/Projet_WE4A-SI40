// middleware/logs.js
const Log = require('../models/log');
const logController = require('../controllers/logController');

/**
 * Middleware to create logs automatically for various actions
 * @param {string} type - Type of log (logging, disconnect, post, reading, homework, creation, delete, update, assign)
 * @param {Function} messageGenerator - Function that takes the request and response to generate a log message
 */
const createLog = (type, messageGenerator) => {
    return async (req, res, next) => {
        const originalJson = res.json;

        // Override res.json to intercept the response
        res.json = function (data) {
          // First, call the original json method to ensure response is sent
          const result = originalJson.call(this, data);

          // Then handle logging separately to avoid affecting the response
          try {
            // Only create log for successful responses
            if (res.statusCode >= 200 && res.statusCode < 300) {
              try {
                if (!req.userData || !req.userData.userId) {
                  console.warn(`Skipping log creation for ${type} - no authenticated user found`);
                  return result;
                }

                const userId = req.userData.userId;
                // Generate the log message using the provided function
                let message = "Action performed";
                try {
                  message = messageGenerator(req, data);
                } catch (msgErr) {
                  console.error('Error generating log message:', msgErr);
                  message = `${type} action at ${new Date().toLocaleString()}`;
                }

                // Create a new log instance using the log model
                const log = new Log({
                  type,
                  message,
                  userId,
                  timestamp: new Date()
                });

                // Save the log without interrupting the response flow
                log.save()
                  .then(() => console.log(`Log created successfully: ${type} - ${message}`))
                  .catch(err => console.error('Error saving log to database:', err));

              } catch (err) {
                console.error('Error in log creation process:', err);
              }
            }
          } catch (outerErr) {
            console.error('Critical error in logging middleware:', outerErr);
          }

          // Return the original result
          return result;
        };

        next();
    };
};

module.exports = createLog;
