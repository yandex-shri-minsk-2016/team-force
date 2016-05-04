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
            let userId = Meteor.user()._id;
            Meteor.users.update({ _id:userId }, { $set: { emails: [{ address: email }] } });
            Meteor.users.update({ _id:userId }, { $set: { profile: profile } });
            throwNotification('success', 'Сохранено');
        } catch (e) {
            console.log(e);
            throwNotification('error', 'Возникла ошибка:(');
        }
    }
});
