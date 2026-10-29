// Realistic mock profiles for instant demo without API key
export const MOCK_PROFILES = {
  "76561197960287930": {
    steamid: "76561197960287930",
    vanity: "gabelogannewell",
    summary: {
      steamid: "76561197960287930",
      personaname: "Gabe Newell",
      profileurl: "https://steamcommunity.com/id/gabelogannewell/",
      avatar: "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg",
      avatarmedium: "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
      avatarfull: "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
      personastate: 1, // Online
      personastateflags: 0,
      communityvisibilitystate: 3, // Public
      profilestate: 1,
      lastlogoff: Math.floor(Date.now() / 1000) - 3600,
      realname: "Gabe Logan Newell",
      primaryclanid: "103582791429521412",
      timecreated: 1063385784, // Sept 2003
      loccountrycode: "US",
      locstatecode: "WA"
    },
    bans: {
      CommunityBanned: false,
      VACBanned: false,
      NumberOfVACBans: 0,
      DaysSinceLastBan: 0,
      NumberOfGameBans: 0,
      EconomyBan: "none"
    },
    level: {
      player_level: 111,
      player_xp: 63850,
      player_xp_needed_to_level_up: 1200,
      player_xp_needed_current_level: 63000
    },
    friendsCount: 348,
    badges: [
      {
        badgeid: 1,
        level: 21,
        completion_time: 1694500000,
        xp: 1050,
        name: "Years of Service (21+)",
        description: "21 years as a member of the Steam Community",
        icon: "https://community.cloudflare.steamstatic.com/public/images/badges/02_years/steamyears20_80.png"
      },
      {
        badgeid: 13,
        level: 1,
        completion_time: 1324500000,
        xp: 500,
        name: "Valve Employee",
        description: "Valve Corporation Employee",
        icon: "https://community.cloudflare.steamstatic.com/public/images/badges/13_valve/valve_80.png"
      },
      {
        badgeid: 2,
        level: 5,
        completion_time: 1544500000,
        xp: 500,
        name: "Community Leader",
        description: "Completed all Steam Community pillars",
        icon: "https://community.cloudflare.steamstatic.com/public/images/badges/01_community/community03_80.png"
      },
      {
        badgeid: 48,
        level: 6,
        completion_time: 1684500000,
        xp: 600,
        name: "Steam Summer Sale Grand Prix",
        description: "Grand Prix Champion",
        icon: "https://community.cloudflare.steamstatic.com/public/images/badges/48_summer2019/level6_80.png"
      }
    ],
    games: [
      {
        appid: 570,
        name: "Dota 2",
        playtime_forever: 5240, // hours in minutes
        playtime_2weeks: 45,
        img_icon_url: "0e6382103f568600c25a075e8e847c2b64d1c1cf",
        rtime_last_played: Math.floor(Date.now() / 1000) - 86400
      },
      {
        appid: 730,
        name: "Counter-Strike 2",
        playtime_forever: 4120,
        playtime_2weeks: 180,
        img_icon_url: "afb89d532a84fe9828d00cf2999e29a97d91e605",
        rtime_last_played: Math.floor(Date.now() / 1000) - 7200
      },
      {
        appid: 440,
        name: "Team Fortress 2",
        playtime_forever: 3890,
        playtime_2weeks: 0,
        img_icon_url: "e3f595a92552da3d664ad7627059e03c5b092ff5",
        rtime_last_played: Math.floor(Date.now() / 1000) - 1500000
      },
      {
        appid: 1086940,
        name: "Baldur's Gate 3",
        playtime_forever: 2450,
        playtime_2weeks: 900,
        img_icon_url: "18b6fc8e4b752ea2bf22b516b2cf7dbbe33f3807",
        rtime_last_played: Math.floor(Date.now() / 1000) - 3600
      },
      {
        appid: 1245620,
        name: "ELDEN RING",
        playtime_forever: 1980,
        playtime_2weeks: 340,
        img_icon_url: "13511eb96bf0f05f778db10a8b13926cb12b23cb",
        rtime_last_played: Math.floor(Date.now() / 1000) - 48000
      },
      {
        appid: 1091500,
        name: "Cyberpunk 2077",
        playtime_forever: 1420,
        playtime_2weeks: 0,
        img_icon_url: "534720999ea92dfca4c6c9a30cfca494541bf705",
        rtime_last_played: Math.floor(Date.now() / 1000) - 4000000
      },
      {
        appid: 220,
        name: "Half-Life 2",
        playtime_forever: 1350,
        playtime_2weeks: 60,
        img_icon_url: "4203ae8d2b272365eb6db41d1a153401faaeec05",
        rtime_last_played: Math.floor(Date.now() / 1000) - 120000
      },
      {
        appid: 620,
        name: "Portal 2",
        playtime_forever: 940,
        playtime_2weeks: 0,
        img_icon_url: "d2a1119ddc202fd81d90e0c0ff735df9dd34e626",
        rtime_last_played: Math.floor(Date.now() / 1000) - 8000000
      },
      {
        appid: 550,
        name: "Left 4 Dead 2",
        playtime_forever: 880,
        playtime_2weeks: 15,
        img_icon_url: "7d5a243f9500d2fa609f8e97080922880290138f",
        rtime_last_played: Math.floor(Date.now() / 1000) - 600000
      },
      {
        appid: 252490,
        name: "Rust",
        playtime_forever: 720,
        playtime_2weeks: 0,
        img_icon_url: "40d1e57c6b41d2e5b7fb5eb4b971168f126f30a9",
        rtime_last_played: Math.floor(Date.now() / 1000) - 9500000
      },
      {
        appid: 271590,
        name: "Grand Theft Auto V",
        playtime_forever: 690,
        playtime_2weeks: 0,
        img_icon_url: "1e72f87eb927fa1485e68aefaff1434c44234033",
        rtime_last_played: Math.floor(Date.now() / 1000) - 12000000
      },
      {
        appid: 892970,
        name: "Valheim",
        playtime_forever: 430,
        playtime_2weeks: 0,
        img_icon_url: "97cb65860ecb38b1f7d43f07a72bca5362ffcd4c",
        rtime_last_played: Math.floor(Date.now() / 1000) - 18000000
      },
      {
        appid: 289070,
        name: "Sid Meier's Civilization VI",
        playtime_forever: 310,
        playtime_2weeks: 0,
        img_icon_url: "997b2f7091461ff948ff6dbb57688c22731d7e2e",
        rtime_last_played: Math.floor(Date.now() / 1000) - 22000000
      },
      {
        appid: 1145360,
        name: "Hades",
        playtime_forever: 290,
        playtime_2weeks: 0,
        img_icon_url: "53e7cbac16c271813dc06ffb7e47be4ea4394042",
        rtime_last_played: Math.floor(Date.now() / 1000) - 25000000
      },
      {
        appid: 367520,
        name: "Hollow Knight",
        playtime_forever: 185,
        playtime_2weeks: 0,
        img_icon_url: "8be8ca7fb60f5885e3cb7a87ea93ef64094770fc",
        rtime_last_played: Math.floor(Date.now() / 1000) - 30000000
      },
      {
        appid: 413150,
        name: "Stardew Valley",
        playtime_forever: 140,
        playtime_2weeks: 0,
        img_icon_url: "b216ee89d9724128fef657738ee6db36d0739c30",
        rtime_last_played: Math.floor(Date.now() / 1000) - 35000000
      },
      {
        appid: 105600,
        name: "Terraria",
        playtime_forever: 95,
        playtime_2weeks: 0,
        img_icon_url: "858961e95fbec86f2177741e573c091f09800be7",
        rtime_last_played: Math.floor(Date.now() / 1000) - 40000000
      },
      {
        appid: 230410,
        name: "Warframe",
        playtime_forever: 0,
        playtime_2weeks: 0,
        img_icon_url: "86adbe388e6e8e8f8dd44265cc2a2ab1fbcf9ee3",
        rtime_last_played: 0
      },
      {
        appid: 218620,
        name: "PAYDAY 2",
        playtime_forever: 0,
        playtime_2weeks: 0,
        img_icon_url: "a6873528b9c6f96615b6d92ec33246835a6eec89",
        rtime_last_played: 0
      },
      {
        appid: 4000,
        name: "Garry's Mod",
        playtime_forever: 0,
        playtime_2weeks: 0,
        img_icon_url: "755e1bf4f99990e64c20aa22e707e78112521f75",
        rtime_last_played: 0
      }
    ]
  },

  "76561198034202275": {
    steamid: "76561198034202275",
    vanity: "s1mplecs",
    summary: {
      steamid: "76561198034202275",
      personaname: "s1mple",
      profileurl: "https://steamcommunity.com/id/s1mplecs/",
      avatar: "https://avatars.steamstatic.com/c6f600f682859062088f12a3d0f73587b1c4b752.jpg",
      avatarmedium: "https://avatars.steamstatic.com/c6f600f682859062088f12a3d0f73587b1c4b752_medium.jpg",
      avatarfull: "https://avatars.steamstatic.com/c6f600f682859062088f12a3d0f73587b1c4b752_full.jpg",
      personastate: 1, // Online
      personastateflags: 0,
      communityvisibilitystate: 3,
      profilestate: 1,
      lastlogoff: Math.floor(Date.now() / 1000) - 1800,
      realname: "Oleksandr Kostyliev",
      primaryclanid: "103582791433477123",
      timecreated: 1290875200, // 2010
      loccountrycode: "UA"
    },
    bans: {
      CommunityBanned: false,
      VACBanned: false,
      NumberOfVACBans: 0,
      DaysSinceLastBan: 0,
      NumberOfGameBans: 0,
      EconomyBan: "none"
    },
    level: {
      player_level: 85,
      player_xp: 42100,
      player_xp_needed_to_level_up: 900,
      player_xp_needed_current_level: 41500
    },
    friendsCount: 284,
    badges: [
      {
        badgeid: 1,
        level: 14,
        completion_time: 1690000000,
        xp: 700,
        name: "Years of Service (14)",
        description: "14 years of service on Steam",
        icon: "https://community.cloudflare.steamstatic.com/public/images/badges/02_years/steamyears14_80.png"
      },
      {
        badgeid: 1001,
        level: 5,
        completion_time: 1660000000,
        xp: 500,
        name: "CS:GO Major Finalist",
        description: "PGL Major Winner & Legend",
        icon: "https://community.cloudflare.steamstatic.com/public/images/badges/01_community/community03_80.png"
      }
    ],
    games: [
      {
        appid: 730,
        name: "Counter-Strike 2",
        playtime_forever: 19850, // 19,850 hours!
        playtime_2weeks: 540,
        img_icon_url: "afb89d532a84fe9828d00cf2999e29a97d91e605",
        rtime_last_played: Math.floor(Date.now() / 1000) - 300
      },
      {
        appid: 570,
        name: "Dota 2",
        playtime_forever: 2150,
        playtime_2weeks: 80,
        img_icon_url: "0e6382103f568600c25a075e8e847c2b64d1c1cf",
        rtime_last_played: Math.floor(Date.now() / 1000) - 100000
      },
      {
        appid: 578080,
        name: "PUBG: BATTLEGROUNDS",
        playtime_forever: 1820,
        playtime_2weeks: 0,
        img_icon_url: "93d896e7d6ba8b11285876dce3dd220ab166503e",
        rtime_last_played: Math.floor(Date.now() / 1000) - 2000000
      },
      {
        appid: 1172470,
        name: "Apex Legends",
        playtime_forever: 940,
        playtime_2weeks: 20,
        img_icon_url: "6b8d651c5d03a11681a28a15993ab1f95a56ee89",
        rtime_last_played: Math.floor(Date.now() / 1000) - 300000
      },
      {
        appid: 252490,
        name: "Rust",
        playtime_forever: 630,
        playtime_2weeks: 0,
        img_icon_url: "40d1e57c6b41d2e5b7fb5eb4b971168f126f30a9",
        rtime_last_played: Math.floor(Date.now() / 1000) - 4000000
      }
    ]
  },

  "76561198123456789": {
    steamid: "76561198123456789",
    vanity: "collector_king",
    summary: {
      steamid: "76561198123456789",
      personaname: "The Steam Archivist",
      profileurl: "https://steamcommunity.com/id/collector_king/",
      avatar: "https://avatars.steamstatic.com/d944c2079bb1fdf87a5f64ba1cb364746654b73e.jpg",
      avatarmedium: "https://avatars.steamstatic.com/d944c2079bb1fdf87a5f64ba1cb364746654b73e_medium.jpg",
      avatarfull: "https://avatars.steamstatic.com/d944c2079bb1fdf87a5f64ba1cb364746654b73e_full.jpg",
      personastate: 1,
      personastateflags: 0,
      communityvisibilitystate: 3,
      profilestate: 1,
      lastlogoff: Math.floor(Date.now() / 1000) - 600,
      realname: "Alexey (Collector)",
      primaryclanid: "103582791429521413",
      timecreated: 1388534400,
      loccountrycode: "DE"
    },
    bans: {
      CommunityBanned: false,
      VACBanned: false,
      NumberOfVACBans: 0,
      DaysSinceLastBan: 0,
      NumberOfGameBans: 0,
      EconomyBan: "none"
    },
    level: {
      player_level: 320,
      player_xp: 521400,
      player_xp_needed_to_level_up: 3300,
      player_xp_needed_current_level: 518100
    },
    friendsCount: 712,
    badges: [
      {
        badgeid: 1,
        level: 11,
        completion_time: 1700000000,
        xp: 550,
        name: "Years of Service (11)",
        description: "11 years of service",
        icon: "https://community.cloudflare.steamstatic.com/public/images/badges/02_years/steamyears11_80.png"
      },
      {
        badgeid: 13,
        level: 100,
        completion_time: 1690000000,
        xp: 10000,
        name: "Game Collector: 3000+",
        description: "Over 3,000 games in library",
        icon: "https://community.cloudflare.steamstatic.com/public/images/badges/01_community/community03_80.png"
      }
    ],
    games: [
      {
        appid: 271590,
        name: "Grand Theft Auto V",
        playtime_forever: 2840,
        playtime_2weeks: 40,
        img_icon_url: "1e72f87eb927fa1485e68aefaff1434c44234033",
        rtime_last_played: Math.floor(Date.now() / 1000) - 50000
      },
      {
        appid: 1086940,
        name: "Baldur's Gate 3",
        playtime_forever: 1450,
        playtime_2weeks: 240,
        img_icon_url: "18b6fc8e4b752ea2bf22b516b2cf7dbbe33f3807",
        rtime_last_played: Math.floor(Date.now() / 1000) - 10000
      },
      {
        appid: 730,
        name: "Counter-Strike 2",
        playtime_forever: 1320,
        playtime_2weeks: 15,
        img_icon_url: "afb89d532a84fe9828d00cf2999e29a97d91e605",
        rtime_last_played: Math.floor(Date.now() / 1000) - 700000
      },
      {
        appid: 292030,
        name: "The Witcher 3: Wild Hunt",
        playtime_forever: 890,
        playtime_2weeks: 0,
        img_icon_url: "76a4dfd0f195d8525b6a71ca9dca682335198ff0",
        rtime_last_played: Math.floor(Date.now() / 1000) - 4000000
      },
      {
        appid: 1145360,
        name: "Hades",
        playtime_forever: 420,
        playtime_2weeks: 0,
        img_icon_url: "53e7cbac16c271813dc06ffb7e47be4ea4394042",
        rtime_last_played: Math.floor(Date.now() / 1000) - 8000000
      }
    ]
  }
};
