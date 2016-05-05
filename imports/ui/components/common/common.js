Template.registerHelper('usermail', (userId) => {
    // let u = Meteor.users.findOne({ _id: userId });
    // @TODO fix quality code
    return 'email for: ' + userId;
});

Template.registerHelper('defEqual', (v1, v2) => {
    return v1 == v2;
});

Template.registerHelper('formatTime', (time, format) => {
    return moment(time).format(format);
});
