
Accounts.onLogin(() => {
    FlowRouter.go('/');
});

Template.logoutButton.events({
    'click #action-logout': () => {
        Meteor.logout(() => {
            FlowRouter.go('/login');
        });
    }
});

Template.registerHelper('usermail', (userId) => {
    let u = Meteor.users.findOne({ _id: userId });
    // @TODO fix quality code
    return u.emails[0].address;
});
