'use strict';

const { ValidationError } = require("@strapi/utils").errors;

/**
 * post service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::post.post", ({ strapi }) => ({
  // finds id from unique_id
  // returns null if not found
  async findIdByUniqueId(unique_id) {
    // Have to use findMany instead of fineOne to search by unique_id
    const postIds = await strapi.entityService.findMany("api::post.post", {
      filters: { unique_id: unique_id },
      fields: ["id"],
    });
    return postIds.length > 0 ? postIds[0].id : null;
  },

  async create(reqBody = {}) {
    return strapi.entityService.create("api::post.post", reqBody);
  },

  async update(postId, reqBody = {}) {
    return strapi.entityService.update("api::post.post", postId, reqBody);
  },

  async schedule(postId, reqBody = {}) {
    // Extract the scheduled_at field from the reqBody object
    const { scheduled_at } = reqBody.data;
    // update only the scheduled_at field
    return strapi.entityService.update("api::post.post", postId, {
      data: { scheduled_at },
    });
  },

  async publish(postId) {
    // update only the publishedAt field
    return strapi.entityService.update("api::post.post", postId, {
      data: { publishedAt: new Date() },
    });
  },

  async unpublish(postId) {
    // update only the publishedAt field
    return strapi.entityService.update("api::post.post", postId, {
      data: { publishedAt: null },
    });
  },

  validatePublishedAt(publishedAt) {
    if (publishedAt > new Date()) {
      throw new ValidationError("publishedAt must be a past date");
    }
    return true;
  },

  generateUniqueId() {
    // Generate 8-digit hex string
    const randomNum = Math.floor(Math.random() * 4294967295);
    const hexString = randomNum.toString(16);
    return hexString.padStart(8, "0");
  },
}));
