import moment from 'moment';

Template.registerHelper('usermail', (userId) => {
    // let u = Meteor.users.findOne({ _id: userId });
    // @TODO fix quality code
    return 'email for: ' + userId;
});

Template.registerHelper('defEqual', (v1, v2) => {
    return v1 == v2;
});

Template.registerHelper('moreOne', (count) => {
    return count > 1;
});

Template.registerHelper('formatTime', (time, format) => {
    return moment(time).format(format);
});

Template.registerHelper('isPoolOwner', (poolId) => {
    return Meteor.userId() === Pools.findOne({ _id:poolId }).ownerId;
});

Template.registerHelper('isPoolArchived', (poolId) => {
    return utils.POOL_STATE.ARCHIVED === Pools.findOne({ _id:poolId }).state;
});
