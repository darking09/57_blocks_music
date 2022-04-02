// Dependencies
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import passportMiddleware from './middlewares/passport';


import authRoutes from './routes/auth.routes';
import privateRoutes from './routes/private.routes';

// Intializations
const app = express();

// Settings
app.set('port', process.env.PORT || 8080);

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
passport.use(passportMiddleware);

// Routes
app.get('/', (req, res) => {
  res.send('Hello World! 2');
});
app.use('/auth', authRoutes);
privateRoutes(app);

export default app;
