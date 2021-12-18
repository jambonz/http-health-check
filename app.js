const express = require('express');

module.exports = ({port, logger, path = '/', fn}) => {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.get(path, (req, res) => {
    try {
      const count = fn();
      if (count >= 0) return res.status(200).json({calls: count});
    } catch (err) {
      logger && logger.info({err}, 'health-checker fn threw error');
    }
    res.sendStatus(480);
  });

  try {
    app.listen(port, () => {
      logger && logger.info(`health-checker listening on ${port}`);
    });
  } catch (err) {
    logger && logger.info({err}, `health-checker failed to listen on port ${port}`);
  }
};
