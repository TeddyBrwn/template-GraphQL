const { PubSub } = require("graphql-subscriptions");
const User = require("../models/User");

const pubsub = new PubSub();

const resolversMutation = {
  Mutation: {
    createUser: async (_, { name, email }) => {
      const user = new User({ name, email });
      await user.save();

      // Publish sự kiện userCreated
      pubsub.publish("USER_CREATED", { userCreated: user });

      return user;
    },
    updateUser: async (_, { id, name, email }) => {
      const user = await User.findByIdAndUpdate(
        id,
        { name, email },
        { new: true }
      );

      // Publish sự kiện userUpdated
      pubsub.publish("USER_UPDATED", { userUpdated: user });

      return user;
    },
    deleteUser: async (_, { id }) => {
      const user = await User.findByIdAndDelete(id);

      // Publish sự kiện userDeleted
      pubsub.publish("USER_DELETED", { userDeleted: user });

      return user;
    },
  },
};

module.exports = resolversMutation;
