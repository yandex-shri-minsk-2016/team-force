import moment from 'moment';

Template.registerHelper('usermail', userId => {
    return utils.getUsermail(userId);
});

Template.registerHelper('avatarUser', (userId, size) => {
    return utils.getAvatar(userId, size);
});

Template.registerHelper('defEqual', (v1, v2) => {
    return v1 == v2;
});

Template.registerHelper('moreOne', count => {
    return count > 1;
});

Template.registerHelper('formatTime', (time, format) => {
    return moment(time).format(format);
});

Template.registerHelper('timeFromNow', (time) => {
    return moment(time).fromNow();
});

Template.registerHelper('formatTimeDiff', (tDiff) => {
    return (tDiff > 0) ? `(+${moment(tDiff, 'X').diff(0, 'minutes')} минут)` : '';
});

Template.registerHelper('isOrderOwner', orderId => {
    return Meteor.userId() === Orders.findOne({ _id: orderId }).userId;
});

Template.registerHelper('isPoolOwner', poolId => {
    return Meteor.userId() === Pools.findOne({ _id: poolId }).ownerId;
});

Template.registerHelper('isPoolArchived', poolId => {
    return utils.POOL_STATE.ARCHIVED === Pools.findOne({ _id:poolId }).state;
});

Template.registerHelper('isPoolPending', poolId => {
    return utils.POOL_STATE.PENDING === Pools.findOne({ _id: poolId }).state;
});

Template.registerHelper('getPriceWithFormat', price => {
    return utils.getPriceWithFormat(price);
});

Template.registerHelper('getOrderPrice', orderId => {
    return utils.getPriceWithFormat(Orders.getOrderPrice(orderId));
});

Template.registerHelper('getOrderIsPaidPrice', (orderId, isPaid) => {
    return utils.getPriceWithFormat(Orders.getOrderIsPaidPrice(orderId, isPaid));
});

Template.registerHelper('getPoolPrice', poolId => {
    return utils.getPriceWithFormat(Pools.getPoolPrice(poolId));
});

Template.registerHelper('getPoolIsPaidPrice', (poolId, isPaid) => {
    return utils.getPriceWithFormat(Pools.getPoolIsPaidPrice(poolId, isPaid));
});

Template.registerHelper('getUserDebts', (poolId, isPaid) => {
    return utils.getPriceWithFormat(Pools.getPoolIsPaidPrice(poolId, isPaid));
});

Template.registerHelper('dateByDayOfYear', dayOfYear => {
    if (dayOfYear === moment(new Date()).format('DDD')) {
        return 'Сегодня';
    }

    return moment(dayOfYear, 'DDD').format('DD.MM.YYYY');
});

Template.registerHelper('getShopMail', poolId => {
    return utils.getShopMail(Pools.findOne(poolId).shop);
});

Template.registerHelper('isExistShop', poolId => {
    return utils.isExistShop(poolId);
});

Template.registerHelper('noUntitled', shop => {
    return (shop === 'Untitled') ? false : shop;
});

Template.registerHelper('feedActor', userId => {
    return (userId === Meteor.userId()) ? 'Я' : utils.getUsermail(userId);
});

Template.registerHelper('feedMessage', msg => {
    // @TODO: обработать сообщение, вставить ссылки pool/item
    return msg;
});
