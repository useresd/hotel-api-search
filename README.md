# Hotel API Search Task

[![Maintainability](https://api.codeclimate.com/v1/badges/abe38927957a045e541a/maintainability)](https://codeclimate.com/github/useresd/hotel-api-search/maintainability)

## To Start the Project
1. clone the github repository.
2. Install dependencies by running `npm install`
3. start the project on port 8002 by running `npm run start` or change the port on the app.js file.

## Usage

url: /hotels  
method: GET  
query parameters: priceRange, hotelName, dateRange, destination, sortBy

## Query Parameters

### priceRange
Should be in the range format 100:900. Where first number should always be less than the second one!

### hotelName
hotelName is a string to find the hotel by its name.

### dateRange
Should be in the range format 2020-01-01:2020-05-10. The first date should be less than the second date! date is to be supplied in the ISO format!

### destination
String to search the city of the hotel

### sortBy
sortBy is composed of two sections! parameter:direction.  
The first section should be either name or price! The second section is optional and have a default value of asc! but both asc and desc can be provided to sort the result!

## Large Datasets
Normally the task of searching and sorting large datasets should be done on the database level! As in this task I don't have access to any database, I have to fetch all the records from somewhere and then perform the filtering on the javascript array of objects!  
In case of databse avaiabilty must of this task work should be reduced!

## Dependencies
1. Expressjs.
2. Superagent.
3. sort-objects-array.  

Other utility functions are written for this task!