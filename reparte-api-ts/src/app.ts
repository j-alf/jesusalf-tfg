import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import oauthRoutes from './routes/oauth.routes';
import groupRoutes from './routes/group.routes';
import memberRoutes from './routes/member.routes';
import expenseRoutes from './routes/expense.routes';
import balanceRoutes from './routes/balance.routes';
import userRoutes from './routes/user.routes';
import refundRoutes from './routes/refund.routes';

const app = express();

// Middleware
app.use(morgan(process.env.LOG ?? 'common'))
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/oauth', oauthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/refunds', refundRoutes);
app.use('/api/balances', balanceRoutes);

export default app;