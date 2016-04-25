import Feeds from './../../../api/feeds/feeds';

Template.header.helpers({
    feedsUnseenCount: () => {
        return Feeds.find({ userId: Meteor.userId(), seen: false }).count();
    }
});
