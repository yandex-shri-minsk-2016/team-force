Template.user.helpers({
    profileUser: () => {
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

Template.user.onRendered(function() {
    const user = Meteor.users.findOne(Router.current().params.userId);
    let heatmap = new CalHeatMap();
    let objData = {};

    const data = Orders.find({ userId:user._id }).fetch()
        .map(order => {
            const pool = Pools.findOne(order.poolId);
            const timestamp = moment(pool.time).format('X');
            const value = order.items.reduce((result, item, key) => {
                return result + item.count;
            }, 0);
            return { timestamp: timestamp, value: value };
        })
        .map(obj => {
            objData[obj.timestamp] = obj.value;
            return obj;
        });

    heatmap.init({
        itemSelector: '#heatmap',
        domain: 'month',
        subDomain: 'x_day',
        data: objData,
        tooltip: true,
        cellSize: 20,
        cellPadding: 5,
        domainGutter: 20,
        range: 4,
        domainDynamicDimension: false,
        subDomainTextFormat: '%d',
        legend: [20, 40, 60, 80],
        domainLabelFormat: (date) => {
            moment.lang('ru');
            return moment(date).format('MMMM').toUpperCase();
        }
    });
});
