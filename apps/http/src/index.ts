import express from 'express'
import 'dotenv/config'
import cors from 'cors';
import shape from './routes/shape.route'

const app = express();
const port = process.env.HTTP_PORT;
// console.log("port",port);

app.use(express.json());
app.use(cors());

app.use('/api/v1',shape);

app.listen(port,()=>{
    console.log(`App is listening on ${port}`);
})
