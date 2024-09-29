const { ObjectId } = require('mongodb');

module.exports = {
  async up(db, client) {
    await db.collection('products').insertMany([
      {
        _id: new ObjectId('66e6c5de6b072dc22ae411fe'),
        title: 'Grey Trousers',
        description:
          'Really comfy trousers for working out and relaxing on the beach',
        quantity: '12',
        price: '2300',
        images: [],
        primaryImage:
          'https://nomadapparel.pk/cdn/shop/files/DSC09472_f5ebf475-8085-4a5c-af3c-6018f18604a7.jpg?v=1704470575&width=900',
        userId: '66d44f85d7694f7ee01862e7',
      },
      {
        _id: new ObjectId('66e6c6306b072dc22ae41201'),
        title: 'Blue Summer Dress',
        description:
          'Relaxing cute blue dress for summer. Pair this delicate mini with lace-up sandals and some dramatic cat-eye sunnies for a glamorous beachside vibe. These sleeves and neckline are totally on trend for this summer ',
        quantity: '10',
        price: '4300',
        images: [],
        primaryImage:
          'https://publish.purewow.net/wp-content/uploads/sites/2/2022/07/cute-summer-dresses-jcrew.jpg?fit=728%2C524',
        userId: '66d44f85d7694f7ee01862e7',
      },
      {
        _id: new ObjectId('66e6c6936b072dc22ae41203'),
        title: 'Mens Blue Shirt',
        description:
          'Elevate your wardrobe with blue cotton formal shirt for men, blending style and comfort seamlessly',
        quantity: '10',
        price: '3900',
        images: [],
        primaryImage:
          'https://zellbury.com/cdn/shop/files/formal-shirts-e003-5_9760eda9-a782-4e13-a062-e9a7b89583d5.jpg?v=1711608551&width=823',
        userId: '66d44f85d7694f7ee01862e7',
      },
      {
        _id: new ObjectId('66e6c6bd6b072dc22ae41205'),
        title: 'Mens Black Shirt',
        description:
          'Elevate your wardrobe with black cotton formal shirt for men, blending style and comfort seamlessly',
        quantity: '10',
        price: '3900',
        images: [],
        primaryImage:
          'https://zellbury.com/cdn/shop/files/MFSP0002-1-1.jpg?v=1720694869&width=823',
        userId: '66d44f85d7694f7ee01862e7',
      },
      {
        _id: new ObjectId('66e6c6ea6b072dc22ae41207'),
        title: 'Zinc Casual Shirt',
        description:
          ' This shirt combines style and comfort, making it a versatile choice for various occasions. Crafted from high-quality fabric, this shirt offers a slim fit that flatters your physique. The zinc color adds a sophisticated touch, while the casual design makes it suitable for both formal and informal settings.',
        quantity: '10',
        price: '3900',
        images: [],
        primaryImage:
          'https://img.drz.lazcdn.com/static/pk/p/e682c0c1a31688520105c8f5d4ba361c.jpg_720x720q80.jpg',
        userId: '66d44f85d7694f7ee01862e7',
      },
      {
        _id: new ObjectId('66e6c70f6b072dc22ae41209'),
        title: 'Women Red Top',
        description:
          'Casual Wear Single Jersey Stuff (Mix Cotton) Best for daily routine and casual gatherings.',
        quantity: '10',
        price: '3300',
        images: [],
        primaryImage:
          'https://rising.com.pk/cdn/shop/products/G04.jpg?v=1639564872',
        userId: '66d44f85d7694f7ee01862e7',
      },
      {
        _id: new ObjectId('66e6c74c6b072dc22ae4120b'),
        title: 'Navy Blue Shirt',
        description:
          'Casual Wear Single Jersey Stuff (Mix Cotton) Best for daily routine and casual gatherings.',
        quantity: '10',
        price: '3300',
        images: [],
        primaryImage:
          'https://assets.ajio.com/medias/sys_master/root/20230624/mHwl/64964ef3a9b42d15c9d9ec5b/-473Wx593H-465282949-navy-MODEL.jpg',
        userId: '66d44f85d7694f7ee01862e7',
      },
      {
        _id: new ObjectId('66e6c7706b072dc22ae4120d'),
        title: 'Blue and White stripes dress',
        description:
          'You can use buttons and bows to a dress to make it cuter. You can also make use of frills since it will give your dress a very adorable look.',
        quantity: '10',
        price: '3300',
        images: [],
        primaryImage:
          'https://www.libasejamila.com/wp-content/uploads/2020/03/cute-summer-dresses-for-women-5a-768x980.jpg',
        userId: '66d44f85d7694f7ee01862e7',
      },
      {
        _id: new ObjectId('66e6c7a06b072dc22ae4120f'),
        title: 'White Stuff A Line Dress',
        description:
          'In an A-line shirt style that you will wear again and again, this midi dress from White Stuff offers a breathable and light fit thanks to its linen blended construction. Confidently cut with a collar and elbow length sleeves, it is visually elevated with striping.',
        quantity: '10',
        price: '3300',
        images: [],
        primaryImage:
          'https://www.lulus.com/images/product/xlarge/4118790_797762.jpg?w=560&hdpi=1',
        userId: '66d44f85d7694f7ee01862e7',
      },
      {
        _id: new ObjectId('66e6c7cb6b072dc22ae41211'),
        title: 'Shalwar Qameez',
        description:
          'Designed with finesse for the men who want to make a statement, this season!',
        quantity: '10',
        price: '8700',
        images: [],
        primaryImage:
          'https://www.colorsoutlet.com/wp-content/uploads/2022/03/c-110-8499.jpg',
        userId: '66d44f85d7694f7ee01862e7',
      },
      {
        _id: new ObjectId('66e6c7ef6b072dc22ae41213'),
        title: 'Brown Checked dress',
        description:
          'Get the latest style news and features from PEOPLE.com, including breakdowns of what celebrities are wearing and sale updates on major brands.',
        quantity: '10',
        price: '8700',
        images: [],
        primaryImage:
          'https://i.pinimg.com/736x/36/06/fb/3606fb778a1998b926771ec4f1f7e812.jpg',
        userId: '66d44f85d7694f7ee01862e7',
      },
      {
        _id: new ObjectId('66e6c8146b072dc22ae41215'),
        title: 'Cute Yellow Dress',
        description: 'Yellow Safari Puff Sleeves Midi Dress',
        quantity: '10',
        price: '6100',
        images: [],
        primaryImage:
          'https://www.jaipuriadaah.com/cdn/shop/files/DSC_4106copy_800x.jpg?v=1719489929',
        userId: '66d44f85d7694f7ee01862e7',
      },
    ]);
    // Insert featured products referencing product IDs
    await db.collection('featuredproducts').insertOne({
      _id: new ObjectId('66e5edbd4bdb9c1600f6d0ef'),
      products: [
        '66e6c6936b072dc22ae41203',
        '66e6c7706b072dc22ae4120d',
        '66e6c7cb6b072dc22ae41211',
        '66e6c6bd6b072dc22ae41205',
      ],
    });
  },

  async down(db, client) {
    // Logic to undo this migration
    await db.collection('products').deleteMany({
      title: {
        $in: [
          'Grey Trousers',
          'Blue Summer Dress',
          'Mens Blue Shirt',
          'Mens Black Shirt',
          'Zinc Casual Shirt',
          'Women Red Top',
          'Navy Blue Shirt',
          'Blue and White stripes dress',
          'White Stuff A Line Dress',
          'Shalwar Qameez',
          'Brown Checked dress',
          'Cute Yellow Dress',
        ],
      },
    });
    await db.collection('featuredproducts').deleteOne({
      _id: '66e5edbd4bdb9c1600f6d0ef',
    });
  },
};
