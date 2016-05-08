Notifications = [];

if (Meteor.isClient) {
    Notifications = new Meteor.Collection(null);

    /**
     * Добавляет новое непрочитанное сообщение
     * @param type
     * @param message
     */
    throwNotification = (type, message) => {
        Notifications.insert({ type: type, message: message, seen: false });
    };

    /**
     * Удаляет из коллецкции все прочитанные уведомления
     */
    clearNotification = () => {
        Notifications.remove({ seen: true });
    };

}
