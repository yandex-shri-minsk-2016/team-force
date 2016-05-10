import urlApi from 'url';

Template.profile.helpers({
    profileUser: () => {
        let profile = Meteor.user().profile;
        profile.company = Company.findOne({ _id: profile.company }).title;
        return profile;
    },

    emailUser: () => {
        return Meteor.user().emails[0].address;
    }
});

Template.profile.events({
    'submit .js-saveProfile': (event) => {
        event.preventDefault();
        const email = event.target.profileEmail.value;

        const companyName = event.target.profileCompany.value;
        if (!Company.isExistCompany(companyName)) {
            Company.add({ title: companyName });
        }

        const profile = {
            username: event.target.profileUsername.value,
            phone: event.target.profilePhone.value,
            address: event.target.profileAddress.value,
            company: Company.findOne({ title: companyName })._id
        };

        try {
            const userId = Meteor.user()._id;
            Meteor.users.update({ _id:userId }, { $set: { emails: [{ address: email }] } });
            Meteor.users.update({ _id:userId }, { $set: { profile: profile } });
            throwNotification('success', 'Сохранено');

            const link = urlApi.parse(Router.current().url);
            if (link.query) {
                Router.go(link.query);
            }

        } catch (e) {
            console.log(e);
            throwNotification('danger', 'Возникла ошибка:(');
        }
    }
});
