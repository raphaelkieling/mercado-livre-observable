import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import axios from 'axios';
import * as mongoose from 'mongoose';
import Product from './models/Product';
import config from './config';
import { CronJob } from 'cron';

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

app.get('/item', async (req, res) => {
    const { user_email } = req.headers;
    let products = await Product.find({ 'created_by.email': user_email })
    res.send(products);
});

app.get('/item/:id', async (req, res) => {
    const { id } = req.params;
    let product = await Product.findById(id);
    res.send(product);
});

app.get('/search', async (req, res) => {
    const query = req.query;
    const { data } = await request().get(`sites/MLB/search?q=${query.q}`);
    res.send(data.results);
});

app.post('/save', async (req, res) => {
    const { user_email } = req.headers;
    const { data } = await request().get(`items?ids=${req.query.ids}`);
    const products = data
        .filter(item => item.code === 200)
        .map(item => item.body);

    for (let item of products) {
        const ProductInstance = new Product({
            ...item,
            base_price: item.base_price,
            last_price: item.price,
            price: item.price,
            created_by: {
                email: user_email
            },
            currency: item.currency_id,
            quantity: item.available_quantity,
            link: item.permalink,
            price_history: [
                {
                    price: item.price,
                    date: Date.now()
                }
            ]
        });

        await ProductInstance.save();
    }

    res.send(products);
});

const PORT = process.env.PORT || 3000;

mongoose.connect(config.mongodburi, { useNewUrlParser: true });
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', onOpenConnection);

function onOpenConnection() {
    app.listen(PORT, () => {
        console.log(`Running on port [${PORT}]`)
    })

    new CronJob('1 * * * * *', function () {
        console.log("[LOG]: cronjob");

        Product.find(async (err, products: any[]) => {
            for (let product of products) {
                const { data } = await request().get(`items?id=${product.id}`);

                if (product.last_price == data.price) {
                    console.log('[IGNORE]: Same price')
                    return;
                }

                product.last_price = product.price;
                product.price = data.price;
                product.quantity = data.available_quantity;
                product.price_history.push({
                    price: product.price,
                    date: Date.now()
                });

                await product.save();
            }
        })
    }, null, true, 'America/Sao_Paulo');

}

