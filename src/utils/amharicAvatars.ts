export interface AmharicTheme {
  id: string;
  name: string;
  gradStart: string;
  gradEnd: string;
  textColor: string;
  accentBorder: string;
}

export interface AmharicLetterOption {
  letter: string;
  name: string;
  transliteration: string;
}

export const AMHARIC_THEMES: AmharicTheme[] = [
  { id: 'gold', name: 'Imperial Gold', gradStart: '#d97706', gradEnd: '#78350f', textColor: '#ffffff', accentBorder: '#f59e0b' },
  { id: 'emerald', name: 'Ethiopian Emerald', gradStart: '#059669', gradEnd: '#064e3b', textColor: '#ffffff', accentBorder: '#10b981' },
  { id: 'crimson', name: 'Royal Crimson', gradStart: '#dc2626', gradEnd: '#881337', textColor: '#ffffff', accentBorder: '#ef4444' },
  { id: 'indigo', name: 'Royal Indigo', gradStart: '#4f46e5', gradEnd: '#1e1b4b', textColor: '#ffffff', accentBorder: '#6366f1' },
  { id: 'violet', name: 'Noble Violet', gradStart: '#7c3aed', gradEnd: '#4c1d95', textColor: '#ffffff', accentBorder: '#8b5cf6' },
  { id: 'slate', name: 'Obsidian Slate', gradStart: '#334155', gradEnd: '#0f172a', textColor: '#ffffff', accentBorder: '#64748b' },
  { id: 'cyan', name: 'Oceanic Cyan', gradStart: '#0891b2', gradEnd: '#164e63', textColor: '#ffffff', accentBorder: '#06b6d4' },
  { id: 'bronze', name: 'Classic Bronze', gradStart: '#b45309', gradEnd: '#451a03', textColor: '#ffffff', accentBorder: '#d97706' },
];

export const AMHARIC_LETTERS: AmharicLetterOption[] = [
  { letter: 'ሀ', name: 'ሃሌታው ሀ', transliteration: 'Ha' },
  { letter: 'ለ', name: 'ላህሙ ለ', transliteration: 'Le' },
  { letter: 'ሐ', name: 'ሐመሩ ሐ', transliteration: 'Hha' },
  { letter: 'መ', name: 'ማይ መ', transliteration: 'Me' },
  { letter: 'ረ', name: 'ርዕሱ ረ', transliteration: 'Re' },
  { letter: 'ሰ', name: 'እሳቱ ሰ', transliteration: 'Se' },
  { letter: 'ሸ', name: 'ሻሹ ሸ', transliteration: 'She' },
  { letter: 'ቀ', name: 'ቃፉ ቀ', transliteration: 'Qe' },
  { letter: 'በ', name: 'ቤቱ በ', transliteration: 'Be' },
  { letter: 'ተ', name: 'ታው ተ', transliteration: 'Te' },
  { letter: 'ቸ', name: 'ቻይ ቸ', transliteration: 'Che' },
  { letter: 'ነ', name: 'ነሐሱ ነ', transliteration: 'Ne' },
  { letter: 'ኘ', name: 'ኘሐሱ ኘ', transliteration: 'Gne' },
  { letter: 'አ', name: 'አልፉ አ', transliteration: 'A' },
  { letter: 'ከ', name: 'ካፉ ከ', transliteration: 'Ke' },
  { letter: 'ወ', name: 'ዋዌ ወ', transliteration: 'We' },
  { letter: 'ዐ', name: 'ዐይን ዐ', transliteration: 'Aa' },
  { letter: 'ዘ', name: 'ዘዩ ዘ', transliteration: 'Ze' },
  { letter: 'ዠ', name: 'ዠዩ ዠ', transliteration: 'Zhe' },
  { letter: 'የ', name: 'የማኑ የ', transliteration: 'Ye' },
  { letter: 'ደ', name: 'ድንቱ ደ', transliteration: 'De' },
  { letter: 'ጀ', name: 'ጀመሩ ጀ', transliteration: 'Je' },
  { letter: 'ገ', name: 'ገምሉ ገ', transliteration: 'Ge' },
  { letter: 'ጠ', name: 'ጠይቱ ጠ', transliteration: 'T\'e' },
  { letter: 'ጨ', name: 'ጨመሩ ጨ', transliteration: 'Ch\'e' },
  { letter: 'ጸ', name: 'ጸሎቱ ጸ', transliteration: 'Ts\'e' },
  { letter: 'ፈ', name: 'ፈርዑ ፈ', transliteration: 'Fe' },
  { letter: 'ፐ', name: 'ፔ ፐ', transliteration: 'Pe' },
];

/**
 * Generates an SVG Data URI containing the selected Amharic letter with circular styling,
 * inner radial bevel, and refined typography.
 */
export function generateAmharicAvatarDataUrl(
  letter: string,
  themeId = 'gold'
): string {
  const theme = AMHARIC_THEMES.find(t => t.id === themeId) || AMHARIC_THEMES[0];
  const char = (letter || 'ሀ').trim().slice(0, 2);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
    <defs>
      <linearGradient id="bg-${theme.id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.gradStart}"/>
        <stop offset="100%" stop-color="${theme.gradEnd}"/>
      </linearGradient>
      <radialGradient id="ring-${theme.id}" cx="50%" cy="50%" r="50%">
        <stop offset="65%" stop-color="rgba(255,255,255,0.12)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.45)"/>
      </radialGradient>
      <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.45"/>
      </filter>
    </defs>
    <rect width="160" height="160" rx="36" fill="url(#bg-${theme.id})"/>
    <circle cx="80" cy="80" r="70" fill="none" stroke="${theme.accentBorder}" stroke-opacity="0.4" stroke-width="2"/>
    <circle cx="80" cy="80" r="66" fill="url(#ring-${theme.id})"/>
    <text x="50%" y="54%" dominant-baseline="central" text-anchor="middle" font-family="'Noto Sans Ethiopic', 'Abyssinica SIL', 'Nyala', 'Ethiopic', sans-serif" font-size="74" font-weight="900" fill="${theme.textColor}" filter="url(#shadow)">${char}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export interface PresetAmharicAvatar {
  id: string;
  letter: string;
  themeId: string;
  label: string;
  transliteration: string;
  url: string;
}

export const PRESET_AMHARIC_AVATARS: PresetAmharicAvatar[] = [
  { id: 'pre-ha-gold', letter: 'ሀ', themeId: 'gold', label: 'ሃሌታው (Ha)', transliteration: 'Ha', url: generateAmharicAvatarDataUrl('ሀ', 'gold') },
  { id: 'pre-le-emerald', letter: 'ለ', themeId: 'emerald', label: 'ላህሙ (Le)', transliteration: 'Le', url: generateAmharicAvatarDataUrl('ለ', 'emerald') },
  { id: 'pre-me-crimson', letter: 'መ', themeId: 'crimson', label: 'ማይ (Me)', transliteration: 'Me', url: generateAmharicAvatarDataUrl('መ', 'crimson') },
  { id: 'pre-re-indigo', letter: 'ረ', themeId: 'indigo', label: 'ርዕስ (Re)', transliteration: 'Re', url: generateAmharicAvatarDataUrl('ረ', 'indigo') },
  { id: 'pre-se-violet', letter: 'ሰ', themeId: 'violet', label: 'እሳት (Se)', transliteration: 'Se', url: generateAmharicAvatarDataUrl('ሰ', 'violet') },
  { id: 'pre-be-slate', letter: 'በ', themeId: 'slate', label: 'ቤት (Be)', transliteration: 'Be', url: generateAmharicAvatarDataUrl('በ', 'slate') },
  { id: 'pre-te-cyan', letter: 'ተ', themeId: 'cyan', label: 'ታው (Te)', transliteration: 'Te', url: generateAmharicAvatarDataUrl('ተ', 'cyan') },
  { id: 'pre-ne-bronze', letter: 'ነ', themeId: 'bronze', label: 'ነሐስ (Ne)', transliteration: 'Ne', url: generateAmharicAvatarDataUrl('ነ', 'bronze') },
  { id: 'pre-a-gold', letter: 'አ', themeId: 'gold', label: 'አልፍ (A)', transliteration: 'A', url: generateAmharicAvatarDataUrl('አ', 'gold') },
  { id: 'pre-ke-emerald', letter: 'ከ', themeId: 'emerald', label: 'ካፍ (Ke)', transliteration: 'Ke', url: generateAmharicAvatarDataUrl('ከ', 'emerald') },
  { id: 'pre-we-crimson', letter: 'ወ', themeId: 'crimson', label: 'ዋዌ (We)', transliteration: 'We', url: generateAmharicAvatarDataUrl('ወ', 'crimson') },
  { id: 'pre-ye-indigo', letter: 'የ', themeId: 'indigo', label: 'የማን (Ye)', transliteration: 'Ye', url: generateAmharicAvatarDataUrl('የ', 'indigo') },
  { id: 'pre-de-violet', letter: 'ደ', themeId: 'violet', label: 'ድንት (De)', transliteration: 'De', url: generateAmharicAvatarDataUrl('ደ', 'violet') },
  { id: 'pre-ge-gold', letter: 'ገ', themeId: 'gold', label: 'ገምል (Ge)', transliteration: 'Ge', url: generateAmharicAvatarDataUrl('ገ', 'gold') },
  { id: 'pre-te-emerald', letter: 'ጠ', themeId: 'emerald', label: 'ጠይት (T\'e)', transliteration: 'T\'e', url: generateAmharicAvatarDataUrl('ጠ', 'emerald') },
  { id: 'pre-fe-crimson', letter: 'ፈ', themeId: 'crimson', label: 'ፈርዕ (Fe)', transliteration: 'Fe', url: generateAmharicAvatarDataUrl('ፈ', 'crimson') },
];

/**
 * Suggests an Amharic initial letter given a Latin/Amharic first name
 */
export function getSuggestedAmharicLetter(name: string): string {
  if (!name) return 'ሀ';
  const first = name.trim().charAt(0);
  
  // If already an Ethiopic character
  if (first.charCodeAt(0) >= 0x1200 && first.charCodeAt(0) <= 0x137F) {
    return first;
  }

  const map: Record<string, string> = {
    A: 'አ', B: 'በ', C: 'ቸ', D: 'ደ', E: 'አ', F: 'ፈ', G: 'ገ',
    H: 'ሀ', I: 'ኢ', J: 'ጀ', K: 'ከ', L: 'ለ', M: 'መ', N: 'ነ',
    O: 'ኦ', P: 'ፐ', Q: 'ቀ', R: 'ረ', S: 'ሰ', T: 'ተ', U: 'ኡ',
    V: 'ቨ', W: 'ወ', X: 'ክ', Y: 'የ', Z: 'ዘ'
  };

  return map[first.toUpperCase()] || 'ሀ';
}
