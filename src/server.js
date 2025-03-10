import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import initAuthRoutes from './routes/auth.route.js';
import initUsersRoutes from './routes/users.route.js';
import initUserPlansRoutes from './routes/user_plans.route.js';
import initPlansRoutes from './routes/plans.route.js';
import { connectMySQL } from './config/db.js';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression({
  level: 6,
  threshold: 100 * 1000,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(morgan('dev'));

initAuthRoutes(app);
initUsersRoutes(app);
initUserPlansRoutes(app);
initPlansRoutes(app);

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = Bun.env.PORT || 3000;

connectMySQL().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
  });
  
}).catch(() => {
  process.exit(1); 
});