const { resolve } = require("path");

const defaultRoutes = {
  erp: "erp",
  login: "authentication",
};

module.exports = (app) => {
  for (let route in defaultRoutes) {
    app.use(`/${route}`, require(resolve(`routes/${defaultRoutes[route]}`)));
  }
  app.use(`/`, require(resolve(`routes/home`)));
};
