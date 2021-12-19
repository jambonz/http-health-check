const express = require('express');
const assert = require('assert');

module.exports = ({port, logger, path = '/', app:existingApp, fn}) => {
  assert.ok(typeof fn === 'function', 'http-health-check: \'fn\' function not suuplied');
  const app = existingApp || express();
  if (!existingApp) {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
  }
  app.get(path, async(req, res) => {
    try {
      const count = await fn();
      if (count >= 0) return res.status(200).json({calls: count});
    } catch (err) {
      logger && logger.info({err}, 'health-checker fn threw error');
    }
    res.sendStatus(480);
  });

  try {
    if (!existingApp) app.listen(port, () => {
      logger && logger.info(`health-checker listening on ${port}`);
    });
  } catch (err) {
    logger && logger.info({err}, `health-checker failed to listen on port ${port}`);
  }
};
