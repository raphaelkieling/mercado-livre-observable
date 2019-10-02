import * as mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    id: String,
    created_by: {
        email: String
    },
    title: String,
    price: Number,
    last_price: Number,
    currency: String,
    quantity: Number,
    condition: String,
    link: String,
    thumbnail: String,
    price_history: [
        {
            price: Number,
            date: Date
        }
    ]
})

const Product = mongoose.model('Product', productSchema);

export default Product;