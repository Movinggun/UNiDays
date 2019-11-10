const fs = require('fs');

//--- Start of my class
class UnidaysDiscountChallenge {

    //---My constructer for the class.
    constructor(ruleset) {
        this.basket = {};
        this.returnObject = {
            'total': 0,
            'deliveryCharge': 0
        }
        this.ruleSet = ruleset;
        this.price = 0;
    }

    //--- First required method. Takes an item as type string as an argument 
    AddToBasket(item) {
        //--- Check to see if an item is already in the basket, if it is lets just add one onto the value. If the item in the basket doesn't exist lets create it and set it to 1.
        if (this.basket.hasOwnProperty(item)) {
            this.basket[item]++;
        }       
        else {
            this.basket[item] = 1;
        }
    }

    //--- Second required method. Calculates the delivery charge and total price of the basket with discount. Returns a JS Object.
    CalculateTotalPrice() {
        //--- Open, parse and store the json from the Ruleset file passed through the constructor
        let items = JSON.parse(fs.readFileSync(this.ruleSet));

        //--- loops through each item in the basket
        for (let item in this.basket) {
            let amount = this.basket[item]; //--- Stores the amount of each item are in the basket
            let itemRuleSet = items[item]; //--- Stores the ruleset for select item in the for loop
            
            //--- Check if the item has a possible discount. If it doesn't charge the normal price.
            if (itemRuleSet.discount){
                let discountItemRequirement = itemRuleSet['discount']['amount']; //--- Stores the amount of items needed in the basket for the discount to be valid
                let invalidDiscount = (amount % discountItemRequirement); //--- Returns the amount of items that can't be discounted
                this.price += itemRuleSet['price'] * invalidDiscount; //--- Charge the normal amount for all the items that can't be discounted
                
                let discountAmount = (amount - invalidDiscount) / discountItemRequirement; //--- This takes the total count of a item in the basket then subtracts all the invalid discounts that are charged at full price. Then it divides that number by how many items are required for a discount.
                this.price += discountAmount * itemRuleSet['discount']['price']; //--- This adds to the total price with the discount added to items that can be discounted
            } else {
                this.price += itemRuleSet['price'] * amount;
            }
        }

        this.returnObject['total'] = this.price; //--- Setting the total price to be returned in the JS Object 
        this.returnObject['deliveryCharge'] = (this.price >= 50 ? 0:7); //--- If the total price is greater than or equal to 50 then delivery is free otherwise delviery os £7.00
        return this.returnObject; //--- return thr method.

    }

}

/*********************
*    Example Usage   *
*********************/

var example = new UnidaysDiscountChallenge('ruleset.json'); //--- creates a new  instance of class UnidaysDiscountChallenge passing the ruleset file RuleSet.json to the constructor

//--- Add some items to the basket
example.AddToBasket('B');
example.AddToBasket('B');
example.AddToBasket('B');
example.AddToBasket('B');
example.AddToBasket('C');
example.AddToBasket('C');
example.AddToBasket('C');

let result = example.CalculateTotalPrice(); //--- Get the JS OBJECT from the method that works out the total cost and delivery charge 

let totalPrice = result.total; //--- Variable that holds the total price
let deliveryCharge = result.deliveryCharge; //--- Variable that hols the delivery charge
let overallTotal = totalPrice + deliveryCharge; //--- This adds up the total price and delivery charge

//--- Just some chat output :)
console.log('==========================================');
console.log(`The total cost of your basket is: £${totalPrice.toFixed(2)}`);
console.log(`The total cost of your delivery is: £${deliveryCharge.toFixed(2)}`);
console.log(`Your total is: £${overallTotal.toFixed(2)}`);
console.log('==========================================');



