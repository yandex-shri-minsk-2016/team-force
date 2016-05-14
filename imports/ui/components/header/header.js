import utils from '../../../../lib/utils';

Template.header.helpers({
    feedsUnseenCount: () => {
        return Feeds.find({ userId: Meteor.userId(), seen: false }).count();
    },

    paidOrdersPrice: () => {
        return utils.getPriceWithFormat(Orders.getOrderIsPaidPriceForUser(Meteor.userId(), false));
    }
});
