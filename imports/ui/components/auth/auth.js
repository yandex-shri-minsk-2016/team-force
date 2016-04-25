Template.logoutButton.events({
    'click #action-logout': () => {
        Meteor.logout(() => {
            Router.go('/login');
        });
    }
});

Template.registerHelper('usermail', (userId) => {
    // let u = Meteor.users.findOne({ _id: userId });
    // @TODO fix quality code
    return 'email for: ' + userId;
});
