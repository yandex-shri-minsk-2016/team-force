Template.logoutButton.events({
    'click #action-logout': () => {
        Meteor.logout(() => {
            Router.go('/login');
        });
    }
});
