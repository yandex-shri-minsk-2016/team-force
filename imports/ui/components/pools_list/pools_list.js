Template.poolsList.helpers({
    pools: () => {
        return Pools.getCompanyPools(Meteor.user().profile.company);
    }
});
