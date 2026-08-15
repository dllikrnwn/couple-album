export const getThemeStyle = (themeId) => {
  const themes = {
    'default': {
      backgroundColor: '#ffffff',
      backgroundImage: 'none',
      backgroundSize: 'auto',
    },
    'lined_paper': {
      backgroundColor: '#ffffff',
      backgroundImage: `repeating-linear-gradient(
        transparent,
        transparent 27px,
        #e0e0e0 27px,
        #e0e0e0 28px
      )`,
      backgroundSize: '100% 28px',
    },
    'grid_paper': {
      backgroundColor: '#ffffff',
      backgroundImage: `
        linear-gradient(#e0e0e0 1px, transparent 1px),
        linear-gradient(90deg, #e0e0e0 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px',
    },
    'kraft_paper': {
      backgroundColor: '#c4a77d',
      backgroundImage: 'none',
    },
    'pastel_pink': {
      background: 'linear-gradient(135deg, #ffeef8 0%, #fff5f5 100%)',
    },
    'pastel_blue': {
      background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
    },
    'pastel_purple': {
      background: 'linear-gradient(135deg, #f3e5f5 0%, #ede7f6 100%)',
    },
    'pastel_green': {
      background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
    },
    'floral_pink': {
      backgroundColor: '#fff5f8',
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a5a5' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    },
    'floral_blue': {
      backgroundColor: '#f0f4ff',
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2390caf9' fill-opacity='0.15'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    },
    'polka_dots': {
      backgroundColor: '#ffffff',
      backgroundImage: `radial-gradient(#d4a5a5 1.5px, transparent 1.5px)`,
      backgroundSize: '20px 20px',
    },
    'watercolor': {
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ffecd2 100%)',
    },
    'vintage': {
      backgroundColor: '#f4e4bc',
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`,
    },
    'gradient_sunset': {
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    },
    'kawaii': {
      backgroundColor: '#fff5f7',
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='44' height='40' viewBox='0 0 44 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4a5a5' fill-opacity='0.2' fill-rule='evenodd'%3E%3Cpath d='M18 0h2v2h-2V0zm8 0h2v2h-2V0zM0 18h2v2H0v-2zm42 0h2v2h-2v-2zM20 38h4v2h-4v-2z'/%3E%3Cpath d='M20 4c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 14c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z'/%3E%3Ccircle cx='17' cy='10' r='1'/%3E%3Ccircle cx='23' cy='10' r='1'/%3E%3Cpath d='M19 13h2v1h-2z'/%3E%3C/g%3E%3C/svg%3E")`,
    },
  };

  return themes[themeId] || themes['default'];
};

export const getFrameStyle = (frameId) => {
  const frames = {
    'none': {
      border: 'none',
      padding: '30px',
    },
    'simple_black': {
      border: '2px solid #1a1a1a',
      padding: '28px',
    },
    'simple_white': {
      border: '10px solid #ffffff',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      padding: '20px',
    },
    'polaroid_white': {
      border: '12px solid #ffffff',
      borderBottom: '50px solid #ffffff',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      padding: '18px',
    },
    'polaroid_black': {
      border: '12px solid #1a1a1a',
      borderBottom: '50px solid #1a1a1a',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
      padding: '18px',
    },
    'wood_light': {
      border: '15px solid #d4a574',
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23d4a574' width='100' height='100'/%3E%3Cpath d='M0 0h100v1H0zM0 20h100v1H0zM0 40h100v1H0zM0 60h100v1H0zM0 80h100v1H0z' fill='%23c49660' opacity='0.3'/%3E%3C/svg%3E")`,
      padding: '20px',
    },
    'wood_dark': {
      border: '15px solid #5d4037',
      padding: '20px',
    },
    'gold_classic': {
      border: '8px solid #d4af37',
      boxShadow: `
        inset 0 0 0 2px #b8941f,
        0 4px 12px rgba(0, 0, 0, 0.2)
      `,
      padding: '22px',
    },
    'tape': {
      border: 'none',
      position: 'relative',
      padding: '30px',
    },
    'hearts_border': {
      border: '3px solid #d4a5a5',
      padding: '27px',
    },
  };

  return frames[frameId] || frames['none'];
};

export const getThemeName = (themeId) => {
  const names = {
    'default': 'Default White',
    'lined_paper': 'Lined Paper',
    'grid_paper': 'Grid Paper',
    'kraft_paper': 'Kraft Paper',
    'pastel_pink': 'Pastel Pink',
    'pastel_blue': 'Pastel Blue',
    'pastel_purple': 'Pastel Purple',
    'pastel_green': 'Pastel Green',
    'floral_pink': 'Floral Pink',
    'floral_blue': 'Floral Blue',
    'polka_dots': 'Polka Dots',
    'watercolor': 'Watercolor',
    'vintage': 'Vintage',
    'gradient_sunset': 'Gradient Sunset',
    'kawaii': 'Kawaii',
  };
  return names[themeId] || 'Default';
};

export const getFrameName = (frameId) => {
  const names = {
    'none': 'No Frame',
    'simple_black': 'Simple Black',
    'simple_white': 'Simple White',
    'polaroid_white': 'Polaroid White',
    'polaroid_black': 'Polaroid Black',
    'wood_light': 'Light Wood',
    'wood_dark': 'Dark Wood',
    'gold_classic': 'Gold Classic',
    'tape': 'Washi Tape',
    'hearts_border': 'Hearts Border',
  };
  return names[frameId] || 'No Frame';
};
