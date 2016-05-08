Template.notifications.helpers({
    notifications: () => {
        return Notifications.find({ seen: false });
    }
});

Template.notification.rendered = () => {
    let notification = Template.instance().data;

    setTimeout((function(notification) {
        return function() {
            Notifications.update(notification._id, { $set: { seen: true } });
        };
    })(notification), 3000);

};
