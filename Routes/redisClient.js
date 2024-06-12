const redis = require("redis");

const client = redis.createClient({
  password: "BqNAC2mcNfO4GnVwVv0jNrRbDYkANFM7",
  host: "redis-16938.c301.ap-south-1-1.ec2.redns.redis-cloud.com",
  port: 16938,
});

client.on("connect", () => {
  console.log("Client connected to Redis");
});

client.on("ready", () => {
  console.log("Client connected to Redis and ready to use...");
});

client.on("error", (err) => {
  console.log("Redis Client Error", err);
});

client.on("end", () => {
  console.log("Client disconnected from Redis");
});

process.on("SIGINT", () => {
  client.quit();
});

module.exports = client;
