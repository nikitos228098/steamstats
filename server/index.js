import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveSteamId, getPlayerFullStats } from './steamService.js';
import { MOCK_PROFILES } from './mockData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// List demo profiles for one-click browsing
app.get('/api/demo-profiles', (req, res) => {
  const demos = [
    {
      id: '76561197960287930',
      name: 'Gabe Newell (Гейб Ньюэлл)',
      tag: 'Valve CEO',
      avatar: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
      vanity: 'gabelogannewell',
      level: 111,
      games: 20
    },
    {
      id: '76561198034202275',
      name: 's1mple (Александр Костылев)',
      tag: 'Киберспортсмен / CS2',
      avatar: 'https://avatars.steamstatic.com/c6f600f682859062088f12a3d0f73587b1c4b752_full.jpg',
      vanity: 's1mplecs',
      level: 85,
      games: 19850
    },
    {
      id: '76561198123456789',
      name: 'The Steam Archivist',
      tag: 'Коллекционер (320 lvl)',
      avatar: 'https://avatars.steamstatic.com/d944c2079bb1fdf87a5f64ba1cb364746654b73e_full.jpg',
      vanity: 'collector_king',
      level: 320,
      games: 3000
    }
  ];
  res.json({ success: true, demos });
});

// Health & configuration status
app.get('/api/status', (req, res) => {
  const hasEnvKey = Boolean(process.env.STEAM_API_KEY && process.env.STEAM_API_KEY.trim() !== '');
  res.json({
    status: 'ok',
    hasServerApiKey: hasEnvKey,
    version: '1.0.0'
  });
});

// Main player statistics endpoint
app.get('/api/player/:identifier', async (req, res) => {
  const { identifier } = req.params;
  const userApiKey = req.headers['x-steam-api-key'] || process.env.STEAM_API_KEY || null;

  try {
    // 1. Resolve identifier to SteamID64
    const steamId = await resolveSteamId(identifier, userApiKey);

    // 2. Fetch full stats
    const stats = await getPlayerFullStats(steamId, userApiKey);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error(`[Error] Fetching player stats for ${identifier}:`, error.message);
    res.status(400).json({
      success: false,
      error: error.message || 'Ошибка при получении данных профиля Steam'
    });
  }
});

// Serve frontend in production build if present
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('SteamStats API Server is running. Start the client dev server with `npm run client`.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`SteamStats Server running on http://localhost:${PORT}`);
  if (!process.env.STEAM_API_KEY) {
    console.log(`Note: No STEAM_API_KEY in .env. Real profiles will require user key in UI, or demo profiles will be used.`);
  }
});
