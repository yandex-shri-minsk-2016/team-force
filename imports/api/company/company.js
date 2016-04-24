/**
 * Company collection
 **/
import { Meteor } from 'meteor/meteor';

class CompanyCollection extends Mongo.Collection {
    constructor() {
        super(CompanyCollection.name);
    }

    isValid(data) {
        try {
            CompanyCollection.schema.validate(data);
        } catch (e) {
            throw e;
            return false;
        }

        return true;
    }

    add(data) {
        return new Promise((resolve, reject) => {
            try {
                if (this.isValid(data)) {
                    if (this.isExistCompany(data.title)) {
                        resolve(super.findOne(data)._id);
                    }else {
                        super.insert(data, (error, id) => {
                            error ? reject(error) : resolve(id);
                        });
                    }
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    getCompany(titleCompany) {
        let pattern = new RegExp(titleCompany, 'i');
        return super.find({ title: { $regex: pattern } });
    }

    isExistCompany(titleCompany) {
        return !!super.findOne({ title: titleCompany });
    }
}

CompanyCollection.name = 'Company';
CompanyCollection.schema = new SimpleSchema({
    title: {
        type: String,
        label: 'Short name of the company'
    }
});

export default new CompanyCollection();
