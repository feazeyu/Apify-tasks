/*
Alright, some context for this solution.
This is the solution I call "Magical christmasland" solution, which works only if the
API is written exactly like I would love it to be, meaning:
API calls return sorted products from cheapest to priciest
Products have information about their price
No two products are identical

Then, what it does is:
Initial call, get the total number of products and the first 1000.
    Calls API with no query (or minPrice=0&maxPrice=100000 if no query doesn't work)
    Save the 1000 products into my product array and move on with the mainLoop
Main Loop:
    If I have less products saved than there is in total, do the following:
        Call the API with the last product's price as minPrice and 100000 as maxPrice.
        Ignore all products that are returned before the last product I have saved and the last product I have saved
        Add all the remaining to my product array
    Repeat until I have all the products

Why is this a Magical christmasland solution?
In case products dont contain price info I'm screwed
If the API returns products that are not sorted correctly, I'm screwed
If two products are identical, I will sometimes get some duplicates in my product array => some of the last products will be missing
    */
const axios = require('axios');

const maxPrice = 100000;
var products = [];
const total = init();

function mainLoop(total){
    while(products.length < total){
        products.concat(addData());
    }
}

//Saves the first 1000 products and the total number
function init(){
    axios
    .get('https://api.ecommerce.com/products?minPrice=0&maxPrice=100000')
    .then(res => {
        products.concat(res.data.products);
        return res.data.total;
    })
    .catch(error => {
      console.error(error);
    });
    
}
//Looks at the last saved product, then sends a GET request with its price.
function addData(){
    let lastProduct = products[products.length-1];
    let data = minMaxRequest(lastProduct.price, maxPrice);

    //Here removes products that come before the last saved product
    while(!compareObjects(data.products[0], lastProduct)){
        data.products.shift();
    }

    //Removes last saved product
    data.products.shift();
    
    //Adds remaining products to the array
    return data.products;
}

//Sends a GET request with minPrice & maxPrice values
function minMaxRequest(min, max){
    axios
    .get('https://api.ecommerce.com/products?minPrice='+min+'&maxPrice='+max)
    .then(res => {
        return data;
    })
    .catch(error => {
      console.error(error);
    });
}

//I know, it's a mess.
//Compares two objects if they are identical, and all their children are identical.
function compareObjects(obj1, obj2, mirror = 1){
    let keys1 = Object.keys(obj1);
    for(i in keys1){
        if(typeof(obj1[keys1[i]]) === "object"){ //Check for nested objects
            try{
            if(!compareObjects(obj1[keys1[i]], obj2[keys1[i]])){ //Dive deeper, if false: return false, else continue comparing
                return false;
            }
            } catch(e){ //An error is thrown when something is undefined => not equal
                return false;
            }
        } else if(obj1[keys1[i]] !== obj2[keys1[i]]){ //If not object, compare simple values.
            return false;
        }
    }
    if(mirror === 1){ //Check the other way around, I am checking if an object contains all of the first one's keys and values, not if it contains extra
       return compareObjects(obj2, obj1, 0)
    }
    return true;
}

mainLoop(total);