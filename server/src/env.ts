import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number(),
  REDIS_URL: z.string(),
});

const env = envSchema.parse(process.env);

export default env;
