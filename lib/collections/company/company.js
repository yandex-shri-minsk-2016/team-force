/**
 * Company collection
 **/
import { Meteor } from 'meteor/meteor';

class CompanyCollection extends Mongo.Collection {
    constructor() {
        super(CompanyCollection._name);
    }

    isValid(data) {
        try {
            CompanyCollection.schema.validate(data);
        } catch (e) {
            throw e;
        }

        return true;
    }

    /**
     * @param data
     * @returns {Promise} resolved с id добавленного элемента
     */
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

    /**
     * Находит и возвращает компанию по ее названию
     * @param titleCompany название компании
     * @returns {Cursor}
     */
    getCompany(titleCompany) {
        let pattern = new RegExp(titleCompany, 'i');
        return super.find({ title: { $regex: pattern } });
    }
    
    isExistCompany(titleCompany) {
        return !!super.findOne({ title: titleCompany });
    }
}

CompanyCollection._name = 'Company';
CompanyCollection.schema = new SimpleSchema({
    title: {
        type: String,
        label: 'Short name of the company'
    }
});

Company = new CompanyCollection();
export default Company;
