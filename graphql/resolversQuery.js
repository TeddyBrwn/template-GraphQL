const User = require("../models/User");

const resolversQuery = {
  Query: {
    users: async () => await User.find(),
  },
};

module.exports = resolversQuery;
