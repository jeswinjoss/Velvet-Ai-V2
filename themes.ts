
import { ThemeId } from './types';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  fontFamily: string;
  // Container styles
  containerBg: string;
  headerBg: string;
  headerText: string;
  headerSubtext: string;
  // Chat Bubble Styles
  userBubbleBg: string;
  userBubbleText: string;
  modelBubbleBg: string;
  modelBubbleText: string;
  modelBubbleBorder: string;
  // Input Area Styles
  inputBg: string;
  inputText: string;
  inputPlaceholder: string;
  inputBorder: string;
  sendButtonBg: string;
  // Scrollbar thumb color (mapped to Tailwind classes roughly)
  scrollbarThumb: string;
  // Menu specific
  menuBg: string;
  menuBorder: string;
  menuItemHover: string;
  accentColor: string; // For active states
  gradientColors: string[];
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  midnight: {
    id: 'midnight',
    name: 'Cosmic Blue',
    description: 'Deep, futuristic, and cool.',
    fontFamily: 'font-sans',
    containerBg: 'bg-[#020617]', // Slate 950
    headerBg: 'bg-[#0f172a]/80', // Slate 900
    headerText: 'text-sky-50',
    headerSubtext: 'text-brand-400',
    
    userBubbleBg: 'bg-gradient-to-br from-brand-600 to-brand-800',
    userBubbleText: 'text-white',
    
    modelBubbleBg: 'bg-[#1e293b]', // Slate 800
    modelBubbleText: 'text-slate-200',
    modelBubbleBorder: 'border-slate-700/50',
    
    inputBg: 'bg-[#0f172a]',
    inputText: 'text-sky-50',
    inputPlaceholder: 'placeholder-slate-500',
    inputBorder: 'border-slate-700',
    sendButtonBg: 'bg-brand-500 hover:bg-brand-400 shadow-lg shadow-brand-500/20',
    scrollbarThumb: 'bg-slate-700',
    
    menuBg: 'bg-[#020617]/95',
    menuBorder: 'border-slate-800',
    menuItemHover: 'hover:bg-slate-800',
    accentColor: 'bg-brand-500',
    gradientColors: ['#0ea5e9', '#3b82f6', '#020617'] // Cyan -> Blue -> Dark
  },
  crimson: {
    id: 'crimson',
    name: 'Electric Violet',
    description: 'Vibrant, intense, and magnetic.',
    fontFamily: 'font-sans',
    containerBg: 'bg-[#17082e]', // Deep Violet Black
    headerBg: 'bg-[#2e1065]/80', // Violet 900
    headerText: 'text-purple-50',
    headerSubtext: 'text-purple-300',
    
    userBubbleBg: 'bg-gradient-to-br from-violet-600 to-fuchsia-600',
    userBubbleText: 'text-white',
    
    modelBubbleBg: 'bg-[#2e1065]',
    modelBubbleText: 'text-purple-100',
    modelBubbleBorder: 'border-purple-500/20',
    
    inputBg: 'bg-[#2e1065]',
    inputText: 'text-purple-50',
    inputPlaceholder: 'placeholder-purple-400/50',
    inputBorder: 'border-purple-500/30',
    sendButtonBg: 'bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-500/30',
    scrollbarThumb: 'bg-purple-900',
    
    menuBg: 'bg-[#17082e]/95',
    menuBorder: 'border-purple-500/20',
    menuItemHover: 'hover:bg-purple-500/20',
    accentColor: 'bg-violet-500',
    gradientColors: ['#8b5cf6', '#d946ef', '#17082e'] // Violet -> Fuchsia -> Dark
  },
  aurora: {
    id: 'aurora',
    name: 'Neo Mint',
    description: 'Fresh, clean, and energetic.',
    fontFamily: 'font-sans',
    containerBg: 'bg-[#042f2e]', // Teal 950
    headerBg: 'bg-[#115e59]/80', // Teal 800
    headerText: 'text-teal-50',
    headerSubtext: 'text-emerald-300',
    
    userBubbleBg: 'bg-gradient-to-r from-teal-500 to-emerald-500',
    userBubbleText: 'text-white',
    
    modelBubbleBg: 'bg-[#134e4a]', // Teal 900
    modelBubbleText: 'text-teal-100',
    modelBubbleBorder: 'border-teal-500/30',
    
    inputBg: 'bg-[#115e59]',
    inputText: 'text-teal-50',
    inputPlaceholder: 'placeholder-teal-300/50',
    inputBorder: 'border-teal-500/30',
    sendButtonBg: 'bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20',
    scrollbarThumb: 'bg-teal-800',
    
    menuBg: 'bg-[#042f2e]/95',
    menuBorder: 'border-teal-500/20',
    menuItemHover: 'hover:bg-teal-500/20',
    accentColor: 'bg-emerald-400',
    gradientColors: ['#14b8a6', '#10b981', '#042f2e'] // Teal -> Emerald -> Dark
  },
  sunset: {
    id: 'sunset',
    name: 'Solar Flare',
    description: 'Warm, glowing, and radiant.',
    fontFamily: 'font-serif',
    containerBg: 'bg-[#1c1917]', // Stone 900
    headerBg: 'bg-[#292524]/80', // Stone 800
    headerText: 'text-orange-50',
    headerSubtext: 'text-amber-400',
    
    userBubbleBg: 'bg-gradient-to-br from-orange-500 to-rose-500',
    userBubbleText: 'text-white',
    
    modelBubbleBg: 'bg-[#292524]',
    modelBubbleText: 'text-orange-100',
    modelBubbleBorder: 'border-orange-500/20',
    
    inputBg: 'bg-[#292524]',
    inputText: 'text-orange-50',
    inputPlaceholder: 'placeholder-orange-800',
    inputBorder: 'border-orange-500/20',
    sendButtonBg: 'bg-orange-500 hover:bg-orange-400 shadow-lg shadow-orange-500/20',
    scrollbarThumb: 'bg-stone-700',
    
    menuBg: 'bg-[#1c1917]/95',
    menuBorder: 'border-orange-500/20',
    menuItemHover: 'hover:bg-orange-500/10',
    accentColor: 'bg-amber-500',
    gradientColors: ['#f97316', '#f43f5e', '#1c1917'] // Orange -> Rose -> Dark
  },
  pastel: {
    id: 'pastel',
    name: 'Cloud Nine',
    description: 'Soft, airy, and dreamy.',
    fontFamily: 'font-rounded',
    containerBg: 'bg-[#f8fafc]', // Slate 50
    headerBg: 'bg-white/80',
    headerText: 'text-slate-700',
    headerSubtext: 'text-sky-400',
    
    userBubbleBg: 'bg-gradient-to-br from-sky-400 to-indigo-400',
    userBubbleText: 'text-white',
    
    modelBubbleBg: 'bg-white shadow-sm',
    modelBubbleText: 'text-slate-600',
    modelBubbleBorder: 'border-slate-200',
    
    inputBg: 'bg-white',
    inputText: 'text-slate-700',
    inputPlaceholder: 'placeholder-slate-300',
    inputBorder: 'border-slate-200',
    sendButtonBg: 'bg-sky-400 hover:bg-sky-500 shadow-lg shadow-sky-200',
    scrollbarThumb: 'bg-slate-300',
    
    menuBg: 'bg-white/95',
    menuBorder: 'border-slate-200',
    menuItemHover: 'hover:bg-slate-50',
    accentColor: 'bg-sky-400',
    gradientColors: ['#7dd3fc', '#818cf8', '#f8fafc'] // Sky -> Indigo -> Light
  }
};