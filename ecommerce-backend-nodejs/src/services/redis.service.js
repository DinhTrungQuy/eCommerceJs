"use strict";

const redis = require("redis");
const { ErrorResponse } = require("../core/error.response");
const { reservationInventory } = require("../models/resitories/inventory.repo");
class RedisService {
  constructor() {
    this.createClient();
  }
  async createClient() {
    this.client = await redis
      .createClient()
      .on("error", (err) => new ErrorResponse("Redis Client Error: " + err))
      .connect();
    return this.client;
  }

  async acquireLock({ product_id, quantity, cart_id }) {
    const lockKey = `lock:${product_id}`;
    const retryTimes = 10;
    const expiredTime = 5000; // lock product in 1s
    for (let index = 0; index < retryTimes; index++) {
      const result = await this.client.setNX(lockKey, "locked");
      if (result) {
        const isReservation = await reservationInventory({
          cart_id,
          product_id,
          quantity,
        });
        if (isReservation.modifiedCount) {
          await this.client.pExpire(lockKey, expiredTime);
          return lockKey;
        }
        return null;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }
  }

  async releaseLock(lockKey) {
    return await this.client.del(lockKey);
  }

  static createService() {
    if (!this.instance) {
      this.instance = new RedisService();
    }
    return this.instance;
  }
}

module.exports = RedisService;
