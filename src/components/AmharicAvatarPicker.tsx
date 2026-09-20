import React, { useState, useEffect } from 'react';
import { 
  AMHARIC_LETTERS, 
  AMHARIC_THEMES, 
  PRESET_AMHARIC_AVATARS, 
  generateAmharicAvatarDataUrl, 
  getSuggestedAmharicLetter,
  PresetAmharicAvatar
} from '../utils/amharicAvatars';
import { Sparkles, Palette, Check, RefreshCw } from 'lucide-react';

interface AmharicAvatarPickerProps {
  selectedAvatarUrl: string;
  onSelectAvatar: (avatarUrl: string, letter?: string) => void;
  studentFirstName?: string;
  label?: string;
}

export const AmharicAvatarPicker: React.FC<AmharicAvatarPickerProps> = ({
  selectedAvatarUrl,
  onSelectAvatar,
  studentFirstName = '',
  label = 'Choose Your Official Amharic Letter Avatar'
}) => {
  const [tab, setTab] = useState<'presets' | 'custom'>('presets');
  const [selectedLetter, setSelectedLetter] = useState<string>(() => {
    return getSuggestedAmharicLetter(studentFirstName) || 'ሀ';
  });
  const [selectedThemeId, setSelectedThemeId] = useState<string>('gold');

  // Auto-suggest when first name changes if not manually set
  useEffect(() => {
    if (studentFirstName && !selectedAvatarUrl) {
      const suggested = getSuggestedAmharicLetter(studentFirstName);
      setSelectedLetter(suggested);
      const url = generateAmharicAvatarDataUrl(suggested, selectedThemeId);
      onSelectAvatar(url, suggested);
    }
  }, [studentFirstName]);

  const handleSelectPreset = (preset: PresetAmharicAvatar) => {
    setSelectedLetter(preset.letter);
    setSelectedThemeId(preset.themeId);
    onSelectAvatar(preset.url, preset.letter);
  };

  const handleLetterChange = (letter: string) => {
    setSelectedLetter(letter);
    const newUrl = generateAmharicAvatarDataUrl(letter, selectedThemeId);
    onSelectAvatar(newUrl, letter);
  };

  const handleThemeChange = (themeId: string) => {
    setSelectedThemeId(themeId);
    const newUrl = generateAmharicAvatarDataUrl(selectedLetter, themeId);
    onSelectAvatar(newUrl, selectedLetter);
  };

  const handleAutoSuggest = () => {
    const suggested = getSuggestedAmharicLetter(studentFirstName);
    setSelectedLetter(suggested);
    const newUrl = generateAmharicAvatarDataUrl(suggested, selectedThemeId);
    onSelectAvatar(newUrl, suggested);
  };

  const currentPreviewUrl = selectedAvatarUrl || generateAmharicAvatarDataUrl(selectedLetter, selectedThemeId);

  return (
    <div className="space-y-4 p-4 rounded-2xl bg-[#090b10] border border-[#232733] shadow-inner" id="amharic-avatar-picker-container">
      {/* Header with Active Preview */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-[#1c202c]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={currentPreviewUrl} 
              alt="Selected Amharic Avatar" 
              className="w-14 h-14 rounded-2xl object-cover border-2 border-[#c5832b] shadow-lg shadow-amber-900/30"
            />
            <span className="absolute -bottom-1 -right-1 bg-[#c5832b] text-[9px] font-black text-white px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
              Ethiopic
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                {label}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Select an authentic Ge&apos;ez script letter to represent your scholar profile &amp; ID card.
            </p>
          </div>
        </div>

        {/* Suggest Button */}
        {studentFirstName && (
          <button
            type="button"
            onClick={handleAutoSuggest}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#181a24] hover:bg-[#232738] text-amber-300 hover:text-amber-200 border border-amber-500/30 text-[11px] font-semibold transition-all cursor-pointer"
            title="Auto-match Amharic initial from your first name"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Match &apos;{studentFirstName}&apos; ({getSuggestedAmharicLetter(studentFirstName)})</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-[#12141c] p-1 rounded-xl border border-[#222634]">
        <button
          type="button"
          onClick={() => setTab('presets')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
            tab === 'presets'
              ? 'bg-[#c5832b] text-white shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Featured Presets (16)
        </button>
        <button
          type="button"
          onClick={() => setTab('custom')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
            tab === 'custom'
              ? 'bg-[#c5832b] text-white shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          All 28 Alphabet Letters &amp; Colors
        </button>
      </div>

      {/* Tab 1: Presets Grid */}
      {tab === 'presets' && (
        <div className="space-y-2">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 max-h-48 overflow-y-auto p-1 pr-1.5 custom-scrollbar">
            {PRESET_AMHARIC_AVATARS.map((preset) => {
              const isSelected = selectedAvatarUrl === preset.url;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`group relative flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 scale-105 shadow-md shadow-amber-950/50'
                      : 'bg-[#12151e] border-[#222736] hover:border-amber-400/60 hover:bg-[#191d2a]'
                  }`}
                  id={`btn-amharic-preset-${preset.id}`}
                >
                  <img 
                    src={preset.url} 
                    alt={preset.label} 
                    className="w-10 h-10 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform"
                  />
                  <span className="text-[10px] font-bold text-zinc-300 mt-1 truncate max-w-full text-center">
                    {preset.letter} ({preset.transliteration})
                  </span>
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-amber-400 text-black rounded-full p-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-zinc-500 italic text-right">
            Click any avatar to select it for your official profile.
          </p>
        </div>
      )}

      {/* Tab 2: Custom Letters & Themes */}
      {tab === 'custom' && (
        <div className="space-y-3.5">
          {/* Theme Palette Bar */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Palette className="w-3.5 h-3.5 text-zinc-400" />
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                1. Select Academy Color Theme:
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AMHARIC_THEMES.map((th) => {
                const isActive = selectedThemeId === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => handleThemeChange(th.id)}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'border-amber-400 bg-[#1e2330] text-white ring-1 ring-amber-400'
                        : 'border-[#222736] bg-[#12151e] text-zinc-400 hover:text-white hover:border-zinc-600'
                    }`}
                  >
                    <span 
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-white/20" 
                      style={{ background: `linear-gradient(135deg, ${th.gradStart}, ${th.gradEnd})` }}
                    />
                    <span className="truncate text-[11px]">{th.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Letter Picker Grid */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              2. Select Ge&apos;ez Alphabet Letter ({AMHARIC_LETTERS.length}):
            </label>
            <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 max-h-44 overflow-y-auto p-1 bg-[#0d0f15] rounded-xl border border-[#1d212c] custom-scrollbar">
              {AMHARIC_LETTERS.map((item) => {
                const isSelected = selectedLetter === item.letter;
                return (
                  <button
                    key={item.letter}
                    type="button"
                    onClick={() => handleLetterChange(item.letter)}
                    className={`flex flex-col items-center justify-center p-1.5 rounded-lg font-bold transition-all cursor-pointer text-sm ${
                      isSelected
                        ? 'bg-[#c5832b] text-white shadow-md shadow-amber-900/40 ring-2 ring-amber-400 scale-105'
                        : 'bg-[#151822] text-zinc-300 hover:bg-[#202535] hover:text-white border border-[#232735]'
                    }`}
                    title={`${item.name} (${item.transliteration})`}
                  >
                    <span className="text-base leading-none font-black">{item.letter}</span>
                    <span className="text-[9px] opacity-75 mt-0.5 leading-none">{item.transliteration}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
