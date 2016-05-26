Template.user.helpers({
    profileUser: () => {
        console.log(Meteor.users.find().fetch());
        let profile = Meteor.users.findOne(Router.current().params.userId).profile;
        profile.company = Company.findOne({ _id: profile.company }).title;
        return profile;
    },

    isIam: () => {
        return Router.current().params.userId === Meteor.userId();
    },

    emailUser: () => {
        const user = Meteor.users.findOne(Router.current().params.userId);
        return user.emails[0].address;
    }

});

Template.user.rendered = () => {

};
