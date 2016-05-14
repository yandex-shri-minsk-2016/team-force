import utils from '../../../../lib/utils';

Template.header.helpers({
    feedsUnseenCount: () => {
        return Feeds.find({ userId: Meteor.userId(), seen: false }).count();
    },

    paidOrdersPrice: () => {
        return utils.getPriceWithFormat(Orders.getOrderIsPaidPriceForUser(Meteor.userId(), false));
    },

    isHaveFeeds: () => {
        return Feeds.find({ userId: Meteor.userId() }).count() > 0;
    },
    
    isAlreadyCreatedPool: () => {
        return Pools.find({ ownerId:Meteor.userId() }).count() > 0;
    },

    isAlreadyDebts: () => {
        return Orders.getOrderPriceForUser(Meteor.userId()) > 0;
    }

});
