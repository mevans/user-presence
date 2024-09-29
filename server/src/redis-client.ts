import { createClient } from "redis";
import env from "./env";

console.log("Initializing Redis Client...", env.REDIS_URL);

const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Error connecting to Redis:", err);
  }
})();

export default redisClient;
