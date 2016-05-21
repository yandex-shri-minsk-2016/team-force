Template.feeds.helpers({
    feeds: () => {
        return Feeds.find({ ownerId: Meteor.userId() }, { sort: { created: -1 }, limit: Template.instance().data.feedsLimit });
    }
});

Template.feed.events({
    'mouseover .list-group': () => {
        Feeds.update(Template.instance().data._id, { $set: { seen: true } });
    }
});
