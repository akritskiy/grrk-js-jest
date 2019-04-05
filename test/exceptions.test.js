const { Item, Shop } = require('../src/gilded-rose');

test('E1: quality should degrade twice as fast after the sell-by date. This means if sellIn == 0, running updateQuality should decrease the quality by 2.', () => {
  let shop = new Shop([ new Item('Test Item', 0, 10) ]);
  shop.updateQuality();
  expect(shop.items[0].quality).toEqual(8);
});

test('E2: quality should never be negative.', () => {
  let items = [
    new Item('Test Item 1', 10, 0),
    new Item('Test Item 2', 0, 0)
  ];
  let shop = new Shop(items);
  shop.updateQuality();
  expect(shop.items[0].quality).toEqual(0);
  expect(shop.items[1].quality).toEqual(0);
});

test('E3: Aged Brie quality should increase by 1 when updateQuality runs, or by 2 after the sell-by date.', () => {
  let items = [
    new Item('Aged Brie', 10, 10),
    new Item('Aged Brie', 0, 10)
  ];
  let shop = new Shop(items);
  shop.updateQuality();
  expect(shop.items[0].quality).toEqual(11);
  expect(shop.items[1].quality).toEqual(12);
});

test('E4: quality should never be more than 50.', () => {
  let items = [
    new Item('Aged Brie', 10, 50),
    new Item('Aged Brie', 0, 50),
    new Item('Backstage passes to a TAFKAL80ETC concert', 10, 50),
    new Item('Backstage passes to a TAFKAL80ETC concert', 5, 50)
  ];
  let shop = new Shop(items);
  shop.updateQuality();
  shop.items.forEach(item => {
    expect(item.quality).toBeLessThanOrEqual(50);
  });
});

test('E5: Sulfuras quality should always be 80 and "it never has to be sold."', () => {
  let items = [
    new Item('Sulfuras', 0, 80),
    new Item('Sulfuras', 10, 80)
  ];
  let shop = new Shop(items);
  shop.updateQuality();
  shop.items.forEach(item => {
    expect(item.quality).toEqual(80);
  });
});
