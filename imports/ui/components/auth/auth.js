
Accounts.onLogin(() => {
    FlowRouter.go('/');
})

Template.logoutButton.events({
    'click #action-logout': () => {
        Meteor.logout(() => {
            FlowRouter.go('/login');
        });
    }
});
