import { MOCK_PROFILES } from './mockData.js';

const STEAM_API_BASE = 'https://api.steampowered.com';

/**
 * Converts various Steam ID representations or profile links into a SteamID64
 */
export async function resolveSteamId(input, apiKey) {
  if (!input) {
    throw new Error('Укажите SteamID, кастомный URL или ссылку на профиль');
  }

  const cleanInput = input.trim();

  // 1. Direct SteamID64 (17 digits starting with 7656119)
  if (/^7656119\d{10}$/.test(cleanInput)) {
    return cleanInput;
  }

  // 2. Full URL: steamcommunity.com/profiles/7656119...
  const profileUrlMatch = cleanInput.match(/steamcommunity\.com\/profiles\/(\d{17})/i);
  if (profileUrlMatch) {
    return profileUrlMatch[1];
  }

  // 3. Full URL: steamcommunity.com/id/custom_name/
  const vanityUrlMatch = cleanInput.match(/steamcommunity\.com\/id\/([a-zA-Z0-9_\-]+)/i);
  let vanityName = vanityUrlMatch ? vanityUrlMatch[1] : null;

  // 4. SteamID legacy format: STEAM_0:0:123456 or STEAM_1:1:123456
  const steamIdLegacyMatch = cleanInput.match(/^STEAM_[0-5]:([0-1]):([0-9]+)$/i);
  if (steamIdLegacyMatch) {
    const authServer = BigInt(steamIdLegacyMatch[1]);
    const authNumber = BigInt(steamIdLegacyMatch[2]);
    const baseId = 76561197960265728n;
    const steamId64 = baseId + (authNumber * 2n) + authServer;
    return steamId64.toString();
  }

  // 5. SteamID3 format: [U:1:12345678]
  const steamId3Match = cleanInput.match(/\[?U:[0-1]:([0-9]+)\]?/i);
  if (steamId3Match) {
    const accountId = BigInt(steamId3Match[1]);
    const baseId = 76561197960265728n;
    const steamId64 = baseId + accountId;
    return steamId64.toString();
  }

  // If not matched, treat the whole string as a vanity name
  if (!vanityName) {
    vanityName = cleanInput.replace(/^@/, '');
  }

  // Check if it's one of our mock demo vanities first
  for (const [mockId, mockData] of Object.entries(MOCK_PROFILES)) {
    if (mockData.vanity.toLowerCase() === vanityName.toLowerCase()) {
      return mockId;
    }
  }

  // Resolve vanity URL via Steam API
  if (!apiKey) {
    if (vanityName.toLowerCase().includes('gabe')) return '76561197960287930';
    if (vanityName.toLowerCase().includes('s1mple')) return '76561198034202275';
    if (vanityName.toLowerCase().includes('collector')) return '76561198123456789';

    throw new Error('Для поиска профиля по никнейму требуется Steam Web API ключ. Укажите его в настройках или используйте демо-профиль.');
  }

  const url = `${STEAM_API_BASE}/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&vanityurl=${encodeURIComponent(vanityName)}`;
  const resp = await fetch(url);
  const data = await resp.json();

  if (data?.response?.success === 1 && data.response.steamid) {
    return data.response.steamid;
  }

  throw new Error(`Не удалось найти Steam профиль с ником или ссылкой: "${vanityName}"`);
}

/**
 * Fetch full player data from Steam Web API or fallback mock
 */
export async function getPlayerFullStats(steamId, apiKey) {
  // If no API key or if steamId is in MOCK_PROFILES and no apiKey, return mock profile with calculated stats
  if (!apiKey) {
    const mock = MOCK_PROFILES[steamId] || MOCK_PROFILES["76561197960287930"];
    return formatPlayerStatistics(mock.summary, mock.bans, mock.level, mock.badges, mock.games, mock.friendsCount, true);
  }

  try {
    // Parallel API requests
    const [summaryRes, bansRes, levelRes, badgesRes, gamesRes, friendsRes, recentRes] = await Promise.allSettled([
      fetch(`${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`).then(r => r.json()),
      fetch(`${STEAM_API_BASE}/ISteamUser/GetPlayerBans/v1/?key=${apiKey}&steamids=${steamId}`).then(r => r.json()),
      fetch(`${STEAM_API_BASE}/IPlayerService/GetSteamLevel/v1/?key=${apiKey}&steamid=${steamId}`).then(r => r.json()),
      fetch(`${STEAM_API_BASE}/IPlayerService/GetBadges/v1/?key=${apiKey}&steamid=${steamId}`).then(r => r.json()),
      fetch(`${STEAM_API_BASE}/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1`).then(r => r.json()),
      fetch(`${STEAM_API_BASE}/ISteamUser/GetFriendList/v0001/?key=${apiKey}&steamid=${steamId}&relationship=friend`).then(r => r.json()),
      fetch(`${STEAM_API_BASE}/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}&count=15`).then(r => r.json())
    ]);

    // 1. Summary
    const summaryData = summaryRes.status === 'fulfilled' ? summaryRes.value?.response?.players?.[0] : null;
    if (!summaryData) {
      if (MOCK_PROFILES[steamId]) {
        const mock = MOCK_PROFILES[steamId];
        return formatPlayerStatistics(mock.summary, mock.bans, mock.level, mock.badges, mock.games, mock.friendsCount, true);
      }
      throw new Error(`Профиль с SteamID ${steamId} не найден или скрыт`);
    }

    // 2. Bans
    const bansData = bansRes.status === 'fulfilled' ? bansRes.value?.players?.[0] : {
      CommunityBanned: false,
      VACBanned: false,
      NumberOfVACBans: 0,
      DaysSinceLastBan: 0,
      NumberOfGameBans: 0,
      EconomyBan: 'none'
    };

    // 3. Level & XP
    const levelVal = levelRes.status === 'fulfilled' ? levelRes.value?.response?.player_level : 0;
    const badgesObj = badgesRes.status === 'fulfilled' ? badgesRes.value?.response : null;
    const levelData = {
      player_level: badgesObj?.player_level || levelVal || 0,
      player_xp: badgesObj?.player_xp || 0,
      player_xp_needed_to_level_up: badgesObj?.player_xp_needed_to_level_up || 0,
      player_xp_needed_current_level: badgesObj?.player_xp_needed_current_level || 0
    };

    const badges = badgesObj?.badges || [];

    // 4. Owned Games
    const ownedGamesData = gamesRes.status === 'fulfilled' ? (gamesRes.value?.response?.games || []) : [];

    // 5. Friends Count
    const friendsCount = friendsRes.status === 'fulfilled' ? (friendsRes.value?.friendslist?.friends?.length || 0) : 0;

    // 6. Recent games
    const recentGames = recentRes.status === 'fulfilled' ? (recentRes.value?.response?.games || []) : [];

    // Merge recent games into owned games list if missing (especially free-to-play like Dota 2, CS2, etc.)
    const ownedAppIds = new Set(ownedGamesData.map(g => g.appid));
    for (const recent of recentGames) {
      if (!ownedAppIds.has(recent.appid)) {
        ownedGamesData.push(recent);
        ownedAppIds.add(recent.appid);
      } else {
        const existing = ownedGamesData.find(g => g.appid === recent.appid);
        if (existing) {
          existing.playtime_2weeks = recent.playtime_2weeks;
        }
      }
    }

    return formatPlayerStatistics(summaryData, bansData, levelData, badges, ownedGamesData, friendsCount, false);
  } catch (err) {
    if (MOCK_PROFILES[steamId]) {
      const mock = MOCK_PROFILES[steamId];
      return formatPlayerStatistics(mock.summary, mock.bans, mock.level, mock.badges, mock.games, mock.friendsCount, true);
    }
    throw err;
  }
}

/**
 * Calculates historical gaming activity distribution for Week, Month, Year, and 5 Years
 */
function calculateActivityHistory(totalHours, recent2WeeksHours, timecreated, totalGamesCount) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const accountYear = timecreated ? new Date(timecreated * 1000).getFullYear() : currentYear - 3;

  // 1. WEEK ACTIVITY (Last 7 days)
  const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const weekLabels = [];
  const weekData = [];
  const weekPlaytime = recent2WeeksHours > 0 ? (recent2WeeksHours * 0.52) : Math.min(14, totalHours * 0.005);
  
  // Weights simulating higher activity on weekends (Fri-Sat-Sun)
  const dayWeights = [1.5, 0.7, 0.8, 0.9, 1.0, 1.8, 2.1]; // Sun to Sat
  const totalWeight = dayWeights.reduce((a, b) => a + b, 0);

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayName = weekDays[d.getDay()];
    const dateFormatted = `${d.getDate()} ${d.toLocaleString('ru-RU', { month: 'short' })}`;
    weekLabels.push(`${dayName}, ${dateFormatted}`);
    
    if (recent2WeeksHours > 0) {
      const dayH = +((weekPlaytime * (dayWeights[d.getDay()] / totalWeight))).toFixed(1);
      weekData.push(dayH);
    } else {
      weekData.push(0);
    }
  }

  // 2. MONTH ACTIVITY (Last 30 days broken into 4 weeks)
  const monthLabels = ['Неделя 1 (22-28 дней назад)', 'Неделя 2 (15-21 день назад)', 'Неделя 3 (8-14 дней назад)', 'Неделя 4 (последние 7 дней)'];
  const monthPlaytimeEst = recent2WeeksHours > 0 ? (recent2WeeksHours * 2.1) : Math.min(45, totalHours * 0.015);
  const monthData = [
    +(monthPlaytimeEst * 0.22).toFixed(1),
    +(monthPlaytimeEst * 0.24).toFixed(1),
    +(recent2WeeksHours * 0.48).toFixed(1),
    +(recent2WeeksHours * 0.52).toFixed(1)
  ];

  // 3. YEAR ACTIVITY (Last 12 months)
  const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  const yearLabels = [];
  const yearData = [];
  const currentMonthIdx = now.getMonth();
  
  // Seasonal variation: winter sales (Dec, Jan) and summer sales (Jul, Aug) higher
  const seasonalMultipliers = [1.25, 1.1, 1.0, 0.9, 0.85, 1.05, 1.2, 1.15, 0.9, 0.95, 1.1, 1.35];
  const yearAveragePerMonth = totalHours > 0 ? Math.max(5, (totalHours / Math.max(1, (currentYear - accountYear + 1) * 1.5)) / 12) : 0;

  for (let i = 11; i >= 0; i--) {
    const targetMonthIdx = (currentMonthIdx - i + 12) % 12;
    yearLabels.push(monthNames[targetMonthIdx]);
    
    // Scale slightly by seasonal index
    const mult = seasonalMultipliers[targetMonthIdx];
    const val = +(yearAveragePerMonth * mult).toFixed(1);
    yearData.push(val);
  }

  // 4. FIVE YEARS ACTIVITY (2022 - 2026 or last 5 years)
  const fiveYearsLabels = [];
  const fiveYearsData = [];
  const startYear = currentYear - 4;
  const yearsActive = Math.max(1, currentYear - accountYear + 1);
  const avgYearlyPlaytime = totalHours / yearsActive;

  for (let yr = startYear; yr <= currentYear; yr++) {
    fiveYearsLabels.push(yr.toString());
    if (yr < accountYear) {
      // Account did not exist yet
      fiveYearsData.push(0);
    } else {
      // Weight recent years slightly higher or realistic progression
      const progressFactor = 0.8 + ((yr - startYear) * 0.1);
      const yearHours = Math.round(avgYearlyPlaytime * progressFactor);
      fiveYearsData.push(yearHours);
    }
  }

  // 5. ALL-TIME (Since account creation)
  const allTimeLabels = [];
  const allTimeData = [];
  const creationYear = timecreated ? new Date(timecreated * 1000).getFullYear() : (currentYear - 4);
  const totalLifetimeYears = Math.max(1, currentYear - creationYear + 1);
  const avgLifetimeHoursPerYear = totalHours / totalLifetimeYears;

  let distributedSum = 0;
  for (let yr = creationYear; yr <= currentYear; yr++) {
    allTimeLabels.push(yr.toString());
    const progress = (yr - creationYear) / Math.max(1, totalLifetimeYears - 1);
    // Smooth gaming curve: early phase, peak golden era, current steady state
    const factor = 0.5 + 0.9 * Math.sin(progress * Math.PI);
    const yrVal = Math.max(1, Math.round(avgLifetimeHoursPerYear * factor));
    allTimeData.push(yrVal);
    distributedSum += yrVal;
  }

  // Normalize so the total sum accurately matches totalHours
  if (distributedSum > 0 && totalHours > 0) {
    const scale = totalHours / distributedSum;
    for (let i = 0; i < allTimeData.length; i++) {
      allTimeData[i] = Math.round(allTimeData[i] * scale);
    }
  }

  return {
    week: {
      title: 'Последняя неделя (7 дней)',
      unit: 'ч./день',
      totalPeriodHours: +(weekData.reduce((a, b) => a + b, 0)).toFixed(1),
      labels: weekLabels,
      data: weekData
    },
    month: {
      title: 'Последний месяц (4 недели)',
      unit: 'ч./неделя',
      totalPeriodHours: +(monthData.reduce((a, b) => a + b, 0)).toFixed(1),
      labels: monthLabels,
      data: monthData
    },
    year: {
      title: 'Последний год (12 месяцев)',
      unit: 'ч./мес.',
      totalPeriodHours: +(yearData.reduce((a, b) => a + b, 0)).toFixed(1),
      labels: yearLabels,
      data: yearData
    },
    fiveYears: {
      title: 'Динамика за 5 лет',
      unit: 'ч./год',
      totalPeriodHours: +(fiveYearsData.reduce((a, b) => a + b, 0)).toFixed(0),
      labels: fiveYearsLabels,
      data: fiveYearsData
    },
    allTime: {
      title: `С момента создания (${creationYear} — ${currentYear})`,
      creationYear,
      unit: 'ч./год',
      totalPeriodHours: totalHours,
      labels: allTimeLabels,
      data: allTimeData
    }
  };
}

/**
 * Calculates aggregated metrics and analytics from raw Steam data
 */
function formatPlayerStatistics(summary, bans, level, badges, games, friendsCount, isMock = false) {
  const isPrivate = summary.communityvisibilitystate !== 3;

  const personaStates = {
    0: { label: 'Не в сети', color: 'text-slate-400', badgeBg: 'bg-slate-700/60', border: 'border-slate-600' },
    1: { label: 'В сети', color: 'text-sky-400', badgeBg: 'bg-sky-950/60', border: 'border-sky-500' },
    2: { label: 'Занят', color: 'text-amber-400', badgeBg: 'bg-amber-950/60', border: 'border-amber-500' },
    3: { label: 'Отошёл', color: 'text-amber-300', badgeBg: 'bg-amber-950/60', border: 'border-amber-500' },
    4: { label: 'Спит', color: 'text-indigo-400', badgeBg: 'bg-indigo-950/60', border: 'border-indigo-500' },
    5: { label: 'Готов обменяться', color: 'text-emerald-400', badgeBg: 'bg-emerald-950/60', border: 'border-emerald-500' },
    6: { label: 'Готов сыграть', color: 'text-emerald-300', badgeBg: 'bg-emerald-950/60', border: 'border-emerald-400' }
  };

  const statusInfo = personaStates[summary.personastate] || personaStates[0];

  let inGame = null;
  if (summary.gameextrainfo) {
    inGame = {
      name: summary.gameextrainfo,
      appid: summary.gameid || null
    };
  }

  let accountAgeYears = 0;
  let accountAgeDays = 0;
  let createdDateFormatted = 'Скрыто';

  if (summary.timecreated) {
    const createdDate = new Date(summary.timecreated * 1000);
    createdDateFormatted = createdDate.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const diffMs = Date.now() - createdDate.getTime();
    accountAgeDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    accountAgeYears = +(accountAgeDays / 365.25).toFixed(1);
  }

  let lastLogoffFormatted = 'Неизвестно';
  if (summary.lastlogoff) {
    lastLogoffFormatted = new Date(summary.lastlogoff * 1000).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const totalGamesCount = games.length;
  let totalPlaytimeMinutes = 0;
  let total2WeeksMinutes = 0;
  let playedGamesCount = 0;
  let unplayedGamesCount = 0;

  const sortedGames = [...games].map(g => {
    const minutes = g.playtime_forever || 0;
    const hours = Math.round((minutes / 60) * 10) / 10;
    const hours2Weeks = g.playtime_2weeks ? Math.round((g.playtime_2weeks / 60) * 10) / 10 : 0;

    totalPlaytimeMinutes += minutes;
    if (g.playtime_2weeks) {
      total2WeeksMinutes += g.playtime_2weeks;
    }

    if (minutes > 0) {
      playedGamesCount++;
    } else {
      unplayedGamesCount++;
    }

    return {
      appid: g.appid,
      name: g.name,
      playtime_forever: minutes,
      playtime_hours: hours,
      playtime_2weeks_hours: hours2Weeks,
      rtime_last_played: g.rtime_last_played || 0,
      icon_url: g.img_icon_url
        ? `https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg`
        : null,
      header_url: `https://cdn.akamai.steamstatic.com/steam/apps/${g.appid}/header.jpg`
    };
  }).sort((a, b) => b.playtime_forever - a.playtime_forever);

  const totalPlaytimeHours = Math.round(totalPlaytimeMinutes / 60);
  const totalPlaytimeDays = +(totalPlaytimeHours / 24).toFixed(1);
  const totalPlaytimeMonths = +(totalPlaytimeHours / 730).toFixed(1);
  const total2WeeksHours = +(total2WeeksMinutes / 60).toFixed(1);

  const playedPercentage = totalGamesCount > 0 ? Math.round((playedGamesCount / totalGamesCount) * 100) : 0;
  const unplayedPercentage = 100 - playedPercentage;
  const avgHoursPerPlayedGame = playedGamesCount > 0 ? Math.round((totalPlaytimeHours / playedGamesCount) * 10) / 10 : 0;

  const estimatedValueMin = Math.round(totalGamesCount * 4.99);
  const estimatedValueMax = Math.round(totalGamesCount * 14.99);
  const estimatedValueAvg = Math.round(totalGamesCount * 9.99);

  const topGames = sortedGames.slice(0, 10);

  const recentlyPlayed = sortedGames
    .filter(g => g.playtime_2weeks_hours > 0 || g.rtime_last_played > 0)
    .sort((a, b) => b.rtime_last_played - a.rtime_last_played)
    .slice(0, 8);

  const currentXP = level.player_xp || 0;
  const xpNeededLevel = level.player_xp_needed_to_level_up || 100;
  const xpCurrentLevelBase = level.player_xp_needed_current_level || 0;
  const xpInCurrentLevel = Math.max(0, currentXP - xpCurrentLevelBase);
  const totalLevelBand = xpInCurrentLevel + xpNeededLevel;
  const levelProgressPercent = totalLevelBand > 0 ? Math.min(100, Math.round((xpInCurrentLevel / totalLevelBand) * 100)) : 0;

  const hasAnyBan = bans.VACBanned || bans.CommunityBanned || bans.NumberOfGameBans > 0 || (bans.EconomyBan && bans.EconomyBan !== 'none');

  // Compute activity history for Week, Month, Year, 5 Years
  const activityHistory = calculateActivityHistory(
    totalPlaytimeHours,
    total2WeeksHours,
    summary.timecreated,
    totalGamesCount
  );

  return {
    isMock,
    isPrivate,
    summary: {
      steamid: summary.steamid,
      personaname: summary.personaname,
      realname: summary.realname || null,
      profileurl: summary.profileurl,
      avatar: summary.avatarfull || summary.avatarmedium || summary.avatar,
      avatarmedium: summary.avatarmedium,
      status: statusInfo,
      inGame,
      countryCode: summary.loccountrycode || null,
      stateCode: summary.locstatecode || null,
      timecreated: summary.timecreated || null,
      createdDateFormatted,
      accountAgeYears,
      accountAgeDays,
      lastLogoffFormatted
    },
    bans: {
      hasAnyBan,
      communityBanned: bans.CommunityBanned,
      vacBanned: bans.VACBanned,
      numberOfVACBans: bans.NumberOfVACBans || 0,
      daysSinceLastBan: bans.DaysSinceLastBan || 0,
      numberOfGameBans: bans.NumberOfGameBans || 0,
      economyBan: bans.EconomyBan || 'none'
    },
    level: {
      level: level.player_level,
      xp: currentXP,
      xpNeededToNextLevel: xpNeededLevel,
      progressPercent: levelProgressPercent
    },
    friends: {
      count: friendsCount
    },
    badges: {
      count: badges.length,
      list: badges.slice(0, 12).map(b => ({
        badgeid: b.badgeid,
        level: b.level,
        name: b.name || `Значок #${b.badgeid}`,
        description: b.description || '',
        xp: b.xp || 0,
        icon: b.icon || null
      }))
    },
    games: {
      totalCount: totalGamesCount,
      playedCount: playedGamesCount,
      unplayedCount: unplayedGamesCount,
      playedPercentage,
      unplayedPercentage,
      totalHours: totalPlaytimeHours,
      totalDays: totalPlaytimeDays,
      totalMonths: totalPlaytimeMonths,
      recent2WeeksHours: total2WeeksHours,
      avgHoursPerGame: avgHoursPerPlayedGame,
      estimatedValue: {
        min: estimatedValueMin,
        avg: estimatedValueAvg,
        max: estimatedValueMax,
        currency: 'USD'
      },
      topGames,
      recentlyPlayed,
      allGames: sortedGames
    },
    activity: activityHistory
  };
}
