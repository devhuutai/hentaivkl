const Redis = require("ioredis");
const redis = new Redis();
const db = require("./database");
const updateViewCountInDatabase = async (cacheKey, viewCount) => {
  try {
    const slug = cacheKey?.replaceAll("/", "");
    const connection = await db.getConnection();
    const [[rows]] = await connection.execute("SELECT views FROM noah_products WHERE slug = ?", [slug]);
    if (!rows) {
      connection.release();
      return res.status(404).json({ msg: "ngu" });
    }
    const currentView = rows?.views?.map((x) => x.view)?.reduce((a, b) => a + b);
    const views = rows.views || [];
    views.push({ time: Date.now(), view: currentView > viewCount ? currentView - viewCount : viewCount - currentView });
    await connection.execute("UPDATE noah_products SET views = ? WHERE slug = ?", [views, slug]);
    connection.release();
  } catch (err) {
    console.error("Error updating view count in the database:", err);
  }
};
exports.cacheUpdateCountViewDetail = async (req, res, next) => {
  try {
    const cacheKey = req.originalUrl;
    const cachedData = await redis.get(cacheKey);
    const parsedData = JSON.parse(cachedData);
    if (cachedData) {
      parsedData.views = (parsedData.views || 0) + 1;
      const timeNow = Date.now();
      const timeCache = parsedData.timeCache || 0;
      if (timeNow > timeCache) {
        await updateViewCountInDatabase(cacheKey, parsedData.views);
        const newTimeCache = timeNow + 3600000; // 1 giờ
        parsedData.timeCache = newTimeCache;
        await redis.set(cacheKey, JSON.stringify(parsedData));
      }
      7;
      return (res.locals.cachedData = parsedData);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Lỗi máy chủ nội bộ" });
  }
};

exports.cacheMiddleware = async (req, res) => {
  try {
    const cacheKey = req.originalUrl;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return (res.locals.cachedData = parsedData);
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({ msg: "Error get cached" });
  }
};

exports.saveCache = async (data, time) => {
  return async (req, res, next) => {
    try {
      const cacheKey = req.originalUrl;
      await redis.set(cacheKey, JSON.stringify(data), "EX", time);
      next();
    } catch (err) {
      console.log(err);
      return res.status(404).json({ msg: "error save cache" });
    }
  };
};
