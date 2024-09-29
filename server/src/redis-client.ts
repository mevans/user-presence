import { createClient } from "redis";
import env from "./env";

console.log("Initializing Redis Client...", env.REDIS_URL);

export const redisClient = createClient({
  url: env.REDIS_URL,
});
export const pubSubClient = redisClient.duplicate();
