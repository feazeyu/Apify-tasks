/*
Non-Ideal API solution!
Here, I expect the API to be uncollaborative.
-Results are not sorted
-Products can be identical
-Products don't contain any info about themselves, they are blank

What this one does, is get the max range, if ti returns more than 999 products, halve the range we're looking at
This solution uses way more API calls, but it doesn't care about what the products look like

When does this solution fail, how to fix it?
-This solution in particular doesn't expect decimal prices, could be fixed by changing lines 31 and 32 to the commented ones to the right

When do both of these solutions fail and there is no way to fix it?
-When all the products have the same cost, we cannot get a result with less than 1000 products returned
-When two searches with the same query return different results, we cannot be sure we have fetched data about all the products
*/
const axios = require('axios');

const maxPrice = 100000;
var products = [];

//If GET request returns more than 999 results, try again with a smaller price range, else add all the products to our global variable
//Annull is here because I'm using a global variable, just to clear it with every call outside of the function
function getAll(min, max, annull = true){
if(annull){
  products = [];
}
let data = minMaxRequest(min, max);
if(data.count > 999){
  getAll(min, Math.floor(max/2), false); //getAll(min, max/2, false);
  getAll(Math.ceil(max/2), max, false);  //getAll(max/2+0.001, max, false); The added value has to be smaller than any decimal value of a product that could occur, This one counts on 1.001$ price not happening etc, could just add more 0's
} else {
  products.concat(data.products)
}
}

//Simple get request with the min and max parameters
function minMaxRequest(min, max){
    axios
    .get('https://api.ecommerce.com/products?minPrice='+min+'&maxPrice='+max)
    .then(res => {
        return res.data;
    })
    .catch(error => {
      console.error(error);
    });
}

getAll(0, maxPrice);