Template.header.helpers({
    feedsUnseenCount: () => {
        return Feeds.find({ userId: Meteor.userId(), seen: false }).count();
    }
});
