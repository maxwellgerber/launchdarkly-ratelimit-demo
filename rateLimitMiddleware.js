const rateLimit = require('express-rate-limit');

const SDK_KEY = process.env.LD_SDK_KEY;
if (!SDK_KEY) {
  throw Error('Expected a launchdarkly SDK key');
}

const LaunchDarkly = require('launchdarkly-node-server-sdk')
  .init(SDK_KEY);

const DEFAULT_LIMIT = 3;
const UNLIMITED = Number.MAX_SAFE_INTEGER;

/**
 * See: https://www.npmjs.com/package/express-rate-limit
 * A rate limiting middleware that uses LaunchDarkly user targeting to
 * determine limits.
 * Could be hooked up to Redis for data storage with
 * https://npmjs.com/package/rate-limit-redis
 */
const rateLimitMiddleware = rateLimit({
  // 1 minute
  windowMs: 60 * 1000,
  keyGenerator: (req) => req.user.userId,
  max: async (req) => {
    // This is set for us by Passport
    const { username, userId, customerAccountId } = req.user;
    const ldUser = {
      key: userId,
      name: username,
      avatar: `https://i.pravatar.cc/150?img=${userId}`,
      custom: { customerAccountId },
    };
    await LaunchDarkly.waitForInitialization();
    const variation = await LaunchDarkly.variation('rate-limiting', ldUser, DEFAULT_LIMIT);

    if (variation === -1) {
      return UNLIMITED;
    }
    return variation;
  },
});

module.exports = rateLimitMiddleware;
