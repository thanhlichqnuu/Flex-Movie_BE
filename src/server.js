import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import initAuthRoutes from './routes/auth.route.js';
import { connectMySQL } from './config/db.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

initAuthRoutes(app);

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = Bun.env.PORT || 3000;

connectMySQL().then(() => {
  app.listen(PORT, () => {
      console.log(`Server đang chạy trên cổng ${PORT}`);
  });
}).catch(() => {
  process.exit(1); 
});
