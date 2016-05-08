Template.logoutButton.events({
    'click .js-logout': () => {
        Meteor.logout(() => {
            Router.go('/login');
        });
    }
});
