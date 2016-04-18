Notifications = [];

if (Meteor.isClient) {
    Notifications = new Meteor.Collection(null);

    throwNotification = function(type, message) {
        Notifications.insert({ type: type, message: message, seen: false });
    };

    clearNotification = function() {
        Notifications.remove({ seen: true });
    };

};

export default Notifications;
