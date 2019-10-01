import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import axios from 'axios';

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
    res.send(data);
});

app.post('/save', async (req, res) => {
    const { data } = await request().get(`items?ids=${req.query.ids}`);
    const products = data.filter(item => item.code === 200).map(item => item.body)
    
    res.send(products);
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Running on port [${PORT}]`)
})