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

            const nextUrl = Session.get('nextUrl');
            if (nextUrl) {
                delete Session.keys.nextUrl;
                Router.go(nextUrl);
            }

        } catch (e) {
            console.log(e);
            throwNotification('danger', 'Возникла ошибка:(');
        }
    }
});

Template.profile.rendered = () => {
    const $profileAddress = $('#profileAddress');

    $profileAddress.typeahead({
        source: [],
        minLength: 2,
        items: 8,
        matcher: () => { return true; }
    });

    $profileAddress.on('paste keyup', function(event) {
        ymaps.geocode(event.target.value, {
            results: 8
        }).then((result) => {
            let resultAddress = [];

            for (var i = 0; i < 8; i++) {
                const item = result.geoObjects.get(i);
                if (item) {
                    resultAddress.push(item.properties.getAll().text);
                }
            }

            $(this).data('typeahead').source = resultAddress;
        }).catch(e => {
            console.log(e);
        });
    });
};
