### Constraints (C)
* (C1) The team CAN add new code
* (C2) The team CAN change the updateQuality method
* (C3) The team CANNOT change the Item class
* (C4) The team CANNOT change the items prop in Shop
> "...as those belong to the goblin in the corner who will insta-rage and one-shot you as he doesn't believe in shared code ownership..."

### Basic system requirements (BSR)
* (BSR1) All items have a sellIn prop which denotes the number of days until the item expires
* (BSR2) All items have a quality prop which denotes its value
* (BSR3) At the end of each day, the system lowers both values for each item in the shop by running the updateQuality method.

### Exceptions (E)
#### (E1) Once the sell by date has passed, Quality degrades twice as fast.
sellIn is described as the number of days the store has to sell the item, so a sellIn of 0 should be past the sell-by date. Running a few tests clarifies this. Indeed, when sellIn = 0, the quality of normal items decreases by 2, not 1.
#### (E2) The Quality of an item is never negative.
#### (E3) Aged Brie increases in Quality the older it gets.
The req is a bit unclear on the increase amount, but it's easy to check...
```
console.log test/exceptions.test.js:27
[ 
  Item { name: 'Aged Brie', sellIn: 100, quality: 10 },
  Item { name: 'Aged Brie', sellIn: 5, quality: 10 },
  Item { name: 'Aged Brie', sellIn: 1, quality: 10 },
  Item { name: 'Aged Brie', sellIn: 0, quality: 10 },
  Item { name: 'Aged Brie', sellIn: -1, quality: 10 },
  Item { name: 'Aged Brie', sellIn: -5, quality: 10 },
  Item { name: 'Aged Brie', sellIn: -100, quality: 10 }
 ]
console.log test/exceptions.test.js:30
[
  Item { name: 'Aged Brie', sellIn: 99, quality: 11 },
  Item { name: 'Aged Brie', sellIn: 4, quality: 11 },
  Item { name: 'Aged Brie', sellIn: 0, quality: 11 },
  Item { name: 'Aged Brie', sellIn: -1, quality: 12 },
  Item { name: 'Aged Brie', sellIn: -2, quality: 12 },
  Item { name: 'Aged Brie', sellIn: -6, quality: 12 },
  Item { name: 'Aged Brie', sellIn: -101, quality: 12 }
]
```
We can see that when sellIn is 1 or greater, the quality increases by 1, and when sellIn is 0 or less, the quality increases by 2... So Aged Brie basically behaves the opposite of normal items.
#### (E4) The Quality of an item is never more than 50.
I'm not sure if this includes items on creation. For example, say I create an item with value 100, or value 80 but its name is not Sulfuras, does that mean the quality gets changed to something less than or equal to 50 on update?
We can check this by creating the following shop and running update.
```
let items = [
  new Item('Backstage passes', 15, 100),
  new Item('Normal item', 11, 100),
  new Item('Aged Brie', 10, 100)
];
```
We get:
```
console.log test/exceptions.test.js:93
[
  Item { name: 'Backstage passes', sellIn: 14, quality: 100 },
  Item { name: 'Normal item', sellIn: 10, quality: 99 },
  Item { name: 'Aged Brie', sellIn: 9, quality: 100 }
]
```
This means items with quality greater than 50 **can** be created and the update method does not auto-correct them. On update, the normal item's quality decreased by 1 as expected, but Backstage passes and Aged Brie stayed the same. This means the quality upper-bound only applies to items with increasing qualities: Backstage passes and Aged Brie. I confirmed this by running update on a shop with item qualities set to 50 and 49. Items with 50 did not increase, but items with 49 increased to 50.
#### E5. "Sulfuras", being a legendary item, never has to be sold or decreases in Quality.
NOTE: I'm not sure what "never has to be sold" means. Does this mean the sellIn value does not decrease? Not sure... Let's test it: I created the following shop and ran update.
`let items = [ new Item('Sulfuras', 0, 80), new Item('Sulfuras', 10, 80) ];`
The result:
```
console.log test/exceptions.test.js:43
[ Item { name: 'Sulfuras', sellIn: -1, quality: 78 }, Item { name: 'Sulfuras', sellIn: 9, quality: 79 } ]
```
The test failed, since the quality (for both items) isn't 80, so something is broken here... Turns out gilded-rose.js references Sulfuras as 'Sulfuras, Hand of Ragnaros', so I guess I have two options: either change the name in gilded-rose.js, or change the reqs and use the name 'Sulfuras, Hand of Ragnaros.' The reqs clearly state 'Sulfuras', not the longer name, and somehow changing the reqs to fit the code I inherited feels wrong so... I'll just change the gilded-rose.js file and replace 3 occurences of 'Sulfuras, Hand of Ragnaros' to just 'Sulfuras'. I'm pretty sure this is a safe change to make, and running my test suite again confirmed that.

The updated shop now looked like this:
```
console.log test/exceptions.test.js:43
[ Item { name: 'Sulfuras', sellIn: 0, quality: 80 }, Item { name: 'Sulfuras', sellIn: 10, quality: 80 } ]
```
It looks like the intended functionality is that neither the sellIn nor the quality changes for Sulfuras. I'll write a test for that.

#### (E6) "Backstage passes", like Aged Brie, increase in Quality as their sell-by date approaches; Quality increases by 2 when there are 10 days or less and by 3 when there are 5 days or less, but the Quality drops to 0 after the concert.
Here we have the same issue as with Sulfuras: the name in gilded-rose.js is different from the name in the reqs, so I'll change the name to 'Backstage passes'. Now that I've done that, let's analyze the statement. Since it's a bit confusing, I'm going to check the behavior by creating the following shop and running update.
```
let items = [
  new Item('Backstage passes', 15, 20),
  new Item('Backstage passes', 11, 20),
  new Item('Backstage passes', 10, 20),
  new Item('Backstage passes', 9, 20),
  new Item('Backstage passes', 8, 20),
  new Item('Backstage passes', 7, 20),
  new Item('Backstage passes', 6, 20),
  new Item('Backstage passes', 5, 20),
  new Item('Backstage passes', 4, 20),
  new Item('Backstage passes', 3, 20),
  new Item('Backstage passes', 2, 20),
  new Item('Backstage passes', 1, 20),
  new Item('Backstage passes', 0, 20),
  new Item('Backstage passes', -1, 20),
  new Item('Backstage passes', -5, 20)
];
```
Running one update results in:
```
console.log test/exceptions.test.js:80
[
  Item { name: 'Backstage passes', sellIn: 14, quality: 21 },
  Item { name: 'Backstage passes', sellIn: 10, quality: 21 },   // sellIn was 11
  Item { name: 'Backstage passes', sellIn: 9, quality: 22 },    // sellIn was 10
  Item { name: 'Backstage passes', sellIn: 8, quality: 22 },
  Item { name: 'Backstage passes', sellIn: 7, quality: 22 },
  Item { name: 'Backstage passes', sellIn: 6, quality: 22 },
  Item { name: 'Backstage passes', sellIn: 5, quality: 22 },    // sellIn was 6
  Item { name: 'Backstage passes', sellIn: 4, quality: 23 },    // sellIn was 5
  Item { name: 'Backstage passes', sellIn: 3, quality: 23 },
  Item { name: 'Backstage passes', sellIn: 2, quality: 23 },
  Item { name: 'Backstage passes', sellIn: 1, quality: 23 },
  Item { name: 'Backstage passes', sellIn: 0, quality: 23 },    // sellIn was 1
  Item { name: 'Backstage passes', sellIn: -1, quality: 0 },    // sellIn was 0
  Item { name: 'Backstage passes', sellIn: -2, quality: 0 },
  Item { name: 'Backstage passes', sellIn: -6, quality: 0 }
]
```
This reveals some behavior that was unclear from the req. The backstage passes increase in value by 1 if sellIn is 11 or greater, by 2 if sellIn is in the range [10, 6], and by 3 if sellIn is in the range [5, 1]. When sellIn is 0 or less, the quality is updated to 0.
##### NOTE: The reqs above are covered by tests. The reqs below are not.

#### (E7) An item can never have its Quality increase above 50.
#### (E8) "Sulfuras" is a legendary item and as such its Quality is 80 and it never alters.

### Conjured
> We have recently signed a supplier of conjured items. This requires an update to our system...
#### (CONJ1) "Conjured" items degrade in Quality twice as fast as normal items.
