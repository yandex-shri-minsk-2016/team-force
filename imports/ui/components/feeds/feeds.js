Template.feeds.helpers({
    feeds: Feeds.find()
});

Template.feed.events({
    'mouseover .list-group': () => {
        Feeds.update(Template.instance().data._id, { $set: { seen: true } });
    }
});
