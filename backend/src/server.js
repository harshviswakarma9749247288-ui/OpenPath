import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import learningRoutes from './routes/learningRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import employerRoutes from './routes/employerRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { seedInitialData } from './config/seed.js';

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      ENV.CLIENT_URL,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger for development
if (ENV.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
  });
}

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    product: 'OpenPath API',
    timestamp: new Date().toISOString(),
    env: ENV.NODE_ENV,
  });
});

// Mount Routes (strict adherence to TRD & Backend Blueprint)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/learning-recommendations', learningRoutes);
app.use('/api/learning-resources', learningRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/notifications', notificationRoutes);

// Centralized error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  await connectDB();
  // Auto-seed sample catalog if collection is empty
  await seedInitialData();

  app.listen(ENV.PORT, () => {
    console.log(`🚀 OpenPath Backend running on http://localhost:${ENV.PORT}`);
    console.log(`📡 REST API baseline active at http://localhost:${ENV.PORT}/api`);
  });
};

startServer();

export default app;
