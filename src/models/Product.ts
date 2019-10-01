import * as mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    id: String,
    title: String,
    price: Number,
    old_price: Number,
    currency: String,
    quantity: Number,
    condition: String,
    link: String,
    thumbnail: String
})

const Product = mongoose.model('Product', productSchema);

export default Product;