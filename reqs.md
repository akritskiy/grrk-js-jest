Constraints:
C1. The team CAN add new code
C2. The team CAN change the updateQuality method
C3. The team CANNOT change the Item class
C4. The team CANNOT change the items prop in Shop

"...as those belong to the goblin in the corner who will insta-rage and one-shot you as he doesn't believe in shared code ownership..." (haha... that's actually pretty funny)

Basic system requirements (BSR):
BSR1. All items have a sellIn prop which denotes the number of days until the item expires

BSR2. All items have a quality prop which denotes its value

BSR3. At the end of each day, the system lowers both values for each item in the shop by running the updateQuality method.

Exceptions:
E1. Once the sell by date has passed, Quality degrades twice as fast. Means: if sellIn == 0, running updateQuality decreases quality by 2, not 1.

E2. The Quality of an item is never negative

E3. Aged Brie actually increases in Quality the older it gets. Means: The quality of Aged Brie increases over time, presumably by +1, and +2 after the sell-by date.

E4. The Quality of an item is never more than 50. Means: Have to ensure the two items that increase in value, Aged Brie and Backstage passes, never increase above 50.

NOTE: I'm not sure if this includes items on creation. For example, say I create an item with value 100, or value 80 but its name is not Sulfuras, does that mean the updateQuality method should catch this and set the value to something else? Should it update the quality to the upper bound, which is 50?

UPDATE: Piggy-backing on the stuff I just figured out in E6, I ran a very similar test with this shop:
let items = [
new Item('Backstage passes', 15, 100),
new Item('Normal item', 11, 100),
new Item('Aged Brie', 10, 100)
];
And got:
console.log test/exceptions.test.js:93
[
Item { name: 'Backstage passes', sellIn: 14, quality: 100 },
Item { name: 'Normal item', sellIn: 10, quality: 99 },
Item { name: 'Aged Brie', sellIn: 9, quality: 100 }
]
This means items with quality > 50 can be created and the update method doesn't auto-correct them to be 50 or less. On update, the normal item's value decreased by 1 as expected, but Backstage passes and Aged Brie stayed the same. This means the quality upper-bound only applies to items' values as they increase in value, which means it only affects Backstage passes and Aged Brie. I confirmed this by running update on a shop w/ item qualities set to 50 and 49. Items w/ 50 did not increase, but items w/ 49 increased to 50.

E5. "Sulfuras", being a legendary item, never has to be sold or decreases in Quality.

NOTE: Not sure what "never has to be sold" means. Does this mean the sellIn value does not decrease, or it does decrease but it's always non-negative, or... does it can count down forever even into neg numbers as long as the quality never changes? Not sure. I guess I'll discover this at some point and (hopefully) remember to update this note.

UPDATE: Created this shop:
let items = [ new Item('Sulfuras', 0, 80), new Item('Sulfuras', 10, 80) ];
After one update, the state of the shop is:
console.log test/exceptions.test.js:43
SHOP ITEMS AFTER UPDATE:
[ Item { name: 'Sulfuras', sellIn: -1, quality: 78 }, Item { name: 'Sulfuras', sellIn: 9, quality: 79 } ]
The test failed, since the quality (for both items) isn't 80, so something is broken here...

UPDATE2: gilded-rose.js references Sulfuras as 'Sulfuras, Hand of Ragnaros', so I guess I have two options, either change the name in gilded-rose.js, or change the reqs and change my test code... The reqs clearly state 'Sulfuras', not the longer name, and somehow changing the reqs to fit the code I inherited feels wrong so... I'll just change the gilded-rose.js file and replace 3 occurences of 'Sulfuras, Hand of Ragnaros' to just 'Sulfuras'. I'm pretty sure this is a safe change and I can make it.

UPDATE3: After update 2, the same shop after one updateQuality looks like this:
console.log test/exceptions.test.js:43
SHOP ITEMS AFTER UPDATE: [ Item { name: 'Sulfuras', sellIn: 0, quality: 80 },
Item { name: 'Sulfuras', sellIn: 10, quality: 80 } ]
So it looks like the intended functionality is that neither the sellIn nor the quality changes for Sulfuras. I'll write a test for that.

E6. "Backstage passes", like aged brie, increases in Quality as its SellIn value approaches; Quality increases by 2 when there are 10 days or less and by 3 when there are 5 days or less, but the Quality drops to 0 after the concert

NOTE: Here we have the same issue as with Sulfuras, the name in gilded-rose.js is different from the name in the reqs, so change the name to 'Backstage passes'.

NOTE2: Okay so... again, this is a bit confusing so I'm going to have to check the behavior just to make sure I understand what is intended.

UPDATE: Created this shop:
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
Running one update results in:
console.log test/exceptions.test.js:80
[
Item { name: 'Backstage passes', sellIn: 14, quality: 21 },
Item { name: 'Backstage passes', sellIn: 10, quality: 21 }, // sellIn was 11
Item { name: 'Backstage passes', sellIn: 9, quality: 22 }, // sellIn was 10
Item { name: 'Backstage passes', sellIn: 8, quality: 22 },
Item { name: 'Backstage passes', sellIn: 7, quality: 22 },
Item { name: 'Backstage passes', sellIn: 6, quality: 22 },
Item { name: 'Backstage passes', sellIn: 5, quality: 22 }, // sellIn was 6
Item { name: 'Backstage passes', sellIn: 4, quality: 23 }, // sellIn was 5
Item { name: 'Backstage passes', sellIn: 3, quality: 23 },
Item { name: 'Backstage passes', sellIn: 2, quality: 23 },
Item { name: 'Backstage passes', sellIn: 1, quality: 23 },
Item { name: 'Backstage passes', sellIn: 0, quality: 23 }, // sellIn was 1
Item { name: 'Backstage passes', sellIn: -1, quality: 0 }, // sellIn was 0
Item { name: 'Backstage passes', sellIn: -2, quality: 0 },
Item { name: 'Backstage passes', sellIn: -6, quality: 0 }
]
This reveals some behavior that was unclear from the req. The backstage passes increase in value by 1 if sellIn is 11 or greater, by 2 if sellIn is in the range [10, 6], and by 3 if sellIn is in the range [5, 1]. When sellIn is 0 or less, the quality is updated to 0.

E7. An item can never have its Quality increase above 50

E8. "Sulfuras" is a legendary item and as such its Quality is 80 and it never alters

Conjured:
We have recently signed a supplier of conjured items. This requires an update to our system:
CONJ1. "Conjured" items degrade in Quality twice as fast as normal items
