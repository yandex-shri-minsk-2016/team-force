Notifications = [];

if (Meteor.isClient) {
    Notifications = new Meteor.Collection(null);

    throwNotification = (type, message) => {
        Notifications.insert({ type: type, message: message, seen: false });
    };

    clearNotification = () => {
        Notifications.remove({ seen: true });
    };

}

export default Notifications;
