# LaunchDarkly Ratelimit Demo

Example Express app that shows how to use LaunchDarkly's [node SDK](https://github.com/launchdarkly/node-server-sdk) as a 
rate limit provider for [express-rate-limit](https://www.npmjs.com/package/express-rate-limit).

This shows how LaunchDarkly [operational feature flags](https://launchdarkly.com/blog/operational-flags-best-practices/)
can be used for service protection. Here - we allow detailed targeting at the user or customer account level. 

In order to make this example production-ready, the following changes must be made:

1. Rate limiting should be unique per endpoint, or class of endpoints
1. Replace the in-memory store with a [redis store](https://www.npmjs.com/package/rate-limit-redis)
1. Consider rate limiting un-authenticated requests as well  


### Accompanying LaunchDarkly Setup

1. Create a single feature flag called `rate-limiting`
1. Create the following rules

|Name|Count|
|----|-----|
|Suspended|  1|
|Low   |  3|
|High  | 10|
|Unlimited| -1|

3. Add user targeting so `alice` is served the `Suspended` variation
4. Add user targeting so `max` is served the `Unlimited` variation
5. Add rule targeting so `customerAccountId=2` is served the `High` variation
