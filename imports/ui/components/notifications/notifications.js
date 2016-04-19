Template.notifications.helpers({
    notifications: () => {
        return Notifications.find();
    }
});

Template.notification.rendered = () => {
    var notification = this.data;
    Meteor.defer(() => {
        Notifications.update(notification._id, { $set: { seen: true } });
    });
};
