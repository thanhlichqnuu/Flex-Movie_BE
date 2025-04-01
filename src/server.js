import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import initAuthRoutes from './routes/auth.route.js';
import initUsersRoutes from './routes/users.route.js';
import initUserPlansRoutes from './routes/user_plans.route.js';
import initPlansRoutes from './routes/plans.route.js';
import initTransactionRoutes from './routes/payment.route.js';
import initMoviesRoutes from './routes/movies.route.js';
import initGenresRoutes from './routes/genres.route.js';
import initCountriesRoutes from './routes/countries.route.js';
import initEpisodesRoutes from './routes/episodes.route.js';
import { connectMySQL } from './config/sequelize.config.js';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { initDir } from './utils/multer.util.js';

const UPLOAD_IMAGE_DIR = Bun.env.UPLOAD_IMAGE_DIR;
const UPLOAD_VIDEO_DIR = Bun.env.UPLOAD_VIDEO_DIR;

const app = express();

app.use(cors());
app.use(helmet());
app.use(cookieParser()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.use(morgan('dev'));

initAuthRoutes(app);
initUsersRoutes(app);
initUserPlansRoutes(app);
initPlansRoutes(app);
initTransactionRoutes(app);
initMoviesRoutes(app);
initGenresRoutes(app);
initCountriesRoutes(app);
initEpisodesRoutes(app);

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = Bun.env.PORT || 3000;

connectMySQL().then(async () => {
  initDir(UPLOAD_IMAGE_DIR);
  initDir(UPLOAD_VIDEO_DIR);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
  });
  
}).catch(() => {
  process.exit(1); 
});