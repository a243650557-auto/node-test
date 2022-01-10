const redis = require("redis");

const redisClient = redis.createClient(6379, "127.0.0.1");
redisClient.on("error", (err) => {
  console.error(err);
});

redisClient.set("myname1", "test", redis.print);
redisClient.get("myname1", (err, val) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("val", val);
  redisClient.quit();
});
