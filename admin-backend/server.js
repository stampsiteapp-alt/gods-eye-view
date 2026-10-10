/**
 * Admin Backend Server
 * Handles secure API key management, user auth, and analytics
 */

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4174;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(morgan('combined'));
app.use(express.json());

// In-memory data (replace with database in production)
const users = new Map();
const sessions = new Map();
const apiLogs = [];

// Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Login endpoint
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Simple validation (replace with proper auth in production)
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ email, id: uuidv4() }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.json({ token, email });
  }

  res.status(401).json({ error: 'Invalid credentials' });
});

// Get user session
app.get('/session', authenticate, (req, res) => {
  const session = sessions.get(req.user.id) || {
    id: req.user.id,
    email: req.user.email,
    createdAt: new Date(),
  };

  sessions.set(req.user.id, session);
  res.json(session);
});

// List API providers and their status
app.get('/api/providers', authenticate, (req, res) => {
  const providers = [
    { name: 'OpenAI', key: 'openai', status: !!process.env.OPENAI_API_KEY },
    { name: 'Cesium Ion', key: 'cesium', status: !!process.env.CESIUM_ION_TOKEN },
    { name: 'Google Maps', key: 'google', status: !!process.env.GOOGLE_MAPS_API_KEY },
    { name: 'AISStream', key: 'aisstream', status: !!process.env.AISSTREAM_API_KEY },
    { name: 'NASA FIRMS', key: 'firms', status: !!process.env.FIRMS_MAP_KEY },
    { name: 'TomTom', key: 'tomtom', status: !!process.env.TOMTOM_API_KEY },
    { name: 'OpenSky', key: 'opensky', status: true },
  ];

  res.json({ providers });
});

// Proxy API requests (with provider rate limiting)
app.post('/api/proxy', authenticate, async (req, res) => {
  const { provider, endpoint, method = 'GET', params = {} } = req.body;

  // Log request
  apiLogs.push({
    timestamp: new Date(),
    user: req.user.email,
    provider,
    endpoint,
  });

  try {
    // Rate limiting per provider
    const userLogs = apiLogs.filter(
      (log) => log.user === req.user.email && log.provider === provider
    );
    const lastMinuteLogs = userLogs.filter(
      (log) => new Date() - log.timestamp < 60000
    );

    if (lastMinuteLogs.length > 60) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    // Forward request to provider (simplified)
    const response = {
      provider,
      endpoint,
      data: null,
      cached: false,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics endpoint
app.get('/analytics', authenticate, (req, res) => {
  const analytics = {
    totalRequests: apiLogs.length,
    userRequests: apiLogs.filter((log) => log.user === req.user.email).length,
    providersUsed: [...new Set(apiLogs.map((log) => log.provider))],
    lastRequest: apiLogs[apiLogs.length - 1]?.timestamp,
  };

  res.json(analytics);
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: error.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🌐 Gods Eye View Admin Backend`);
  console.log(`📍 Running on http://localhost:${PORT}`);
  console.log(`✅ Health check: GET http://localhost:${PORT}/health\n`);
});
