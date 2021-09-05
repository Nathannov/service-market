/**
    * @class MarketableList
    * @memberof Dao
    *
    @ classdesc This class contains de functions to get and set data for marketable_list
    *
    * @author Jonathan Valencia Navarro <nathannov111@gmail.com>
    *
*/
class MarketableList {
    constructor() { }

    /**
     * @function getAllActualMarketable
     * @memberof Dao.MarketableList
     *
     * @desc This function get all name generated actual marketable active
     *
     *
     * @return {Promise} data marketable for all pairs
     */
    getAllActualMarketable() {
        return new Promise(async (resolve) => {
            global.mongodb.searchDistinct('marketable_list', {
                status: true
            }, 'name', function (err, marketables) {
                if (err) return resolve([]);
                return resolve(marketables);
            });
        });
    }
}
module.exports = new MarketableList();