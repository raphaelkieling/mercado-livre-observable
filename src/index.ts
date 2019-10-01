import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import axios from 'axios';
import * as mongoose from 'mongoose';
import Product from './models/Product';

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

const baseURL = "https://api.mercadolibre.com";

function request() {
    return axios.create({
        baseURL
    })
}

app.get('/search', async (req, res) => {
    const query = req.query;
    const { data } = await request().get(`sites/MLB/search?q=${query.q}`);
    res.send(data.results);
});

app.post('/save', async (req, res) => {
    const { data } = await request().get(`items?ids=${req.query.ids}`);
    const products = data
        .filter(item => item.code === 200)
        .map(item => item.body)

    for (let item of products) {
        const ProductInstance = new Product({
            ...item,
            old_price: item.base_price,
            currency: item.currency_id,
            quantity: item.available_quantity,
            link: item.permalink
        });

        await ProductInstance.save();
    }

    res.send(products);
});

const PORT = 3000;

mongoose.connect('mongodb://root:1mbitubA@ds239692.mlab.com:39692/mercado-libre-watch', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    app.listen(PORT, () => {
        console.log(`Running on port [${PORT}]`)
    })
});
