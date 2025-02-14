import express from 'express';
import cors from 'cors';
import eventUserRoutes from './routes/eventUserRoutes';
import activationRoutes from './routes/activationRoutes';
import conversationRoutes from './routes/conversationRoutes';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import parkingRoutes from './routes/parkingRoutes';
const app = express();

// Move dotenv config to the top, before any other code
dotenv.config();

// Update CORS configuration
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // or your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Enable JSON body parsing
app.use(express.json());

// Add this before any routes
app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url, req.path);
  console.log('Request body:', req.body);
  next();
});

// Add debug log
console.log('Backend API Key:', process.env.GROQ_API_KEY);

// Use routes - Important: Order matters!
app.use('/api/conversations', (req, res, next) => {
  console.log('Hitting conversations middleware');
  next();
}, conversationRoutes);

app.use('/api/event-users', eventUserRoutes);

// Add logging before activation routes
app.use('/api', (req, res, next) => {
  console.log('Hitting activation routes middleware');
  next();
}, activationRoutes);

app.use('/api/parking', parkingRoutes);

// Add catch-all route for debugging
app.use('*', (req, res) => {
  console.log('No route matched:', req.method, req.originalUrl);
  res.status(404).json({ error: 'Route not found' });
});

export default app;
