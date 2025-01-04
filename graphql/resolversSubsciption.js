const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();

const resolversSubsciption = {
  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator(["USER_CREATED"]),
    },
    userUpdated: {
      subscribe: () => pubsub.asyncIterator(["USER_UPDATED"]),
    },
    userDeleted: {
      subscribe: () => pubsub.asyncIterator(["USER_DELETED"]),
    },
  },
};

module.exports = resolversSubsciption;
