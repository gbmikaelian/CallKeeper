import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import passport from './middlewares/passport';
import { api as apiRoutes, auth as authRoutes } from './routes';

const app = express();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

app.use(passport.initialize());

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/api', passport.authenticate('jwt', { session: false }), apiRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening at http://localhost:${port}`));