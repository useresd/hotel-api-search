const superagent = require('superagent');
const validateRange = require('../utils/validateRange');
const sortObjectsArray = require('sort-objects-array');

exports.index = (req, res) => {
    
    superagent.get('http://fake-hotel-api.herokuapp.com/api/hotels')

        .then(response => {

            // fetch hotel list from the api
            var hotels = JSON.parse(response.text);
            var params = new Object();
            
            // validate/Sanitize the query parameters
            var allowedQueryParams = ["priceRange", "hotelName", "destination", "dateRange", "sortBy"];
            var submittedQueryParams = Object.keys(req.query);
            var invalidQueryParams = [];

            if(submittedQueryParams.length) {
                submittedQueryParams.forEach(each => {
                    if(allowedQueryParams.indexOf(each) === -1) {
                        invalidQueryParams.push(each);
                    }
                })
            }

            if(invalidQueryParams.length > 0) {
                return res.status(422).json({
                    message: "Invalid query parameters!",
                    invalid_parameters: invalidQueryParams,
                    allowed_parameters: allowedQueryParams
                });
            }

            // search by price range [500:900]
            if(req.query.priceRange) {

                validateRange(req.query.priceRange, (error, range) => {
                    if(error) return res.status(422).json({query: "priceRange", message: error.message});
                    minPrice = range.min;
                    maxPrice = range.max;
                });

                var minPrice = Number(minPrice);
                var maxPrice = Number(maxPrice);
                if(minPrice > maxPrice) return res.status(422).json({query: "priceRange", message: "min price cannot be greater than max price! (min:max)"});
                
                // validete the supplied prices to be a number
                if(isNaN(minPrice) || isNaN(maxPrice)) {
                    return res.status(422).json({query: "priceRange", message: "Non numeric value was supplied as price!"});
                }
                
                params.priceRange = {minPrice, maxPrice};
                hotels = hotels.filter(each => each.price >= minPrice && each.price <= maxPrice);
            }

            // search by hotel name
            if(req.query.hotelName) {

                params.hotelName = req.query.hotelName;
                hotels = hotels.filter(each => each.name.toLowerCase().indexOf(req.query.hotelName.toLowerCase()) > -1);
            }

            // search by destination [City]
            if(req.query.destination) {
                params.destination = req.query.destination;
                hotels = hotels.filter(each => each.city.toLowerCase().indexOf(req.query.destination.toLowerCase()) > -1);
            }

            // search by date range [2020-01-01:2020-05-01]
            if(req.query.dateRange) {
                
                validateRange(req.query.dateRange, (error, range) => {
                    if(error) return res.status(422).json({query: "dateRange", message: error.message});
                    minDate = range.min;
                    maxDate = range.max;
                });
                
                minDate = new Date(minDate);
                maxDate = new Date(maxDate);

                if(minDate > maxDate) return res.status(422).json({query: "dateRage", message: "min date cannot be greater than max date (min:max)"})

                // new Date("dateString") will return NaN if non-date string was supplied!
                if(isNaN(minDate) || isNaN(maxDate)) {
                    return res.status(422).json({query: "dateRange", error: "Invalid date in supplied in the search parameters"});
                }

                params.dateRange = {minDate, maxDate};

                hotels = hotels.filter(each => new Date(each.date_start) >= minDate && new Date(each.date_end) <= maxDate);
            }

            // sort by Price or Name
            if(req.query.sortBy) {

                // basic validation/sanitizing for the sort by
                var sortable = ["name", "price"];
                var directions = ["desc", "asc"];

                // assign the sort parameter
                var sortParam = req.query.sortBy.split(":");
                var sortBy = sortParam[0];
                // validate the sort parameter
                if(sortable.indexOf(sortBy) === -1) return res.status(422).json({param: "sortBy", message: `Cannot sort by ${sortBy}. Only name and price are sortable!`});
                
                // assign the direction of sorting
                var dir = sortParam.length === 2 ? sortParam[1] : "asc";
                // validate the correct direction is provided!
                if(directions.indexOf(dir) === -1) return res.status(422).json({param: "sortBy", message: "Invalid sort direction! Only 'asc' or 'desc' are accepted!"});
                
                // perform the actual sorting using a third party plugin!
                hotels = sortObjectsArray(hotels, sortBy, dir);
            }

            // return the response
            return res.json({
                count: hotels.length,
                params: params,
                hotels: hotels
            });

        })
        .catch(error => {
            res.json(error);
        })
}