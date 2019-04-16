const { Item, Shop } = require('../src/gilded-rose');

test('E1: Quality degrades twice as fast after the sell-by date (which is when sellIn = 0).', () => {
	let shop = new Shop([new Item('Test Item', 0, 10)]);
	shop.updateQuality();
	expect(shop.items[0].quality).toEqual(8);
});

test('E2: Quality is never negative.', () => {
	let items = [new Item('Test Item 1', 10, 0), new Item('Test Item 2', 0, 0)];
	let shop = new Shop(items);
	shop.updateQuality();
	expect(shop.items[0].quality).toEqual(0);
	expect(shop.items[1].quality).toEqual(0);
});

test('E3: Aged Brie increases in quality by 1 on update, or by 2 after the sell-by date (which is when sellIn = 0).', () => {
	let items = [new Item('Aged Brie', 10, 10), new Item('Aged Brie', 0, 10)];
	let shop = new Shop(items);
	shop.updateQuality();
	expect(shop.items[0].quality).toEqual(11);
	expect(shop.items[1].quality).toEqual(12);
});

test('E4: The quality of items with increasing values (Aged Brie and Backstage passes) never increase above 50, although there is no rule (currently) about items that are created with a value greater than 50.', () => {
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

test('E5: Sulfuras quality never changes (always = 80).', () => {
	let items = [new Item('Sulfuras', 0, 80), new Item('Sulfuras', 10, 80)];
	let shop = new Shop(items);
	shop.updateQuality();
	shop.items.forEach(item => {
		expect(item.quality).toEqual(80);
	});
});

test('E5: Sulfuras sellIn never changes (it never has to be sold).', () => {
	let items = [new Item('Sulfuras', 0, 80), new Item('Sulfuras', 10, 80)];
	let shop = new Shop(items);
	const itemsSellinBeforeUpdate = shop.items.map(item => item.sellIn);
	shop.updateQuality();
	shop.items.forEach((item, i) => {
		expect(item.sellIn).toEqual(itemsSellinBeforeUpdate[i]);
	});
});

test('E6: Backstage passes increase in quality by 1 if sellIn is 11 or greater.', () => {
	let items = [
		new Item('Backstage passes', 11, 20),
		new Item('Backstage passes', 20, 20),
		new Item('Backstage passes', 100, 20)
	];
	let shop = new Shop(items);
	shop.updateQuality();
	shop.items.forEach(item => {
		expect(item.quality).toEqual(21);
	});
});

test('E6: Backstage passes increase in quality by 2 if sellIn is in the range [10, 6].', () => {
	let items = [
		new Item('Backstage passes', 6, 20),
		new Item('Backstage passes', 7, 20),
		new Item('Backstage passes', 8, 20),
		new Item('Backstage passes', 9, 20),
		new Item('Backstage passes', 10, 20)
	];
	let shop = new Shop(items);
	shop.updateQuality();
	shop.items.forEach(item => {
		expect(item.quality).toEqual(22);
	});
});

test('E6: Backstage passes increase in quality by 3 if sellIn is in the range [5, 1].', () => {
	let items = [
		new Item('Backstage passes', 1, 20),
		new Item('Backstage passes', 2, 20),
		new Item('Backstage passes', 3, 20),
		new Item('Backstage passes', 4, 20),
		new Item('Backstage passes', 5, 20)
	];
	let shop = new Shop(items);
	shop.updateQuality();
	shop.items.forEach(item => {
		expect(item.quality).toEqual(23);
	});
});

test('E6: Backstage pass quality gets set to 0 if sellIn is 0 or less.', () => {
	let items = [
		new Item('Backstage passes', 0, 20),
		new Item('Backstage passes', -1, 20),
		new Item('Backstage passes', -10, 20)
	];
	let shop = new Shop(items);
	shop.updateQuality();
	shop.items.forEach(item => {
		expect(item.quality).toEqual(0);
	});
});
