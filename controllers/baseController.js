const utilities = require("../utilities/");
const baseController = {};

/* ******************************
 *  Build Home View
 ****************************** */
baseController.buildHome = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("index", { title: "Home", nav });
  } catch (error) {
    console.error("Error rendering home page:", error);  // Logs the error for debugging
    next(error);  // Passes the error to Express's error handler
  }
};

module.exports = baseController;
