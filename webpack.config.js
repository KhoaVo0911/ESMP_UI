const path = require("path");

module.exports = {
  resolve: {
    alias: {
      "mapbox-gl": path.resolve(
        __dirname,
        "node_modules/mapbox-gl/dist/mapbox-gl.js"
      ),
    },
  },
};
