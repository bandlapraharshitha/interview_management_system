import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import interviewerRoutes from './routes/interviewer.routes.js';
import availabilityRoutes from './routes/availability.routes.js';
import interviewRoutes from './routes/interview.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Main Route
app.get('/', (req, res) => {
  res.send('Wingmann API is running...');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/interviewers', interviewerRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/interviews', interviewRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
