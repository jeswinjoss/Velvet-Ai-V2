
import React, { useState, useEffect, useRef } from 'react';
import { CharacterProfile, UserProfile } from '../types';
import { THEMES } from '../themes';
import { triggerHaptic } from '../utils/haptics';
import { getUserProfile, saveUserProfile } from '../services/persistenceService';
import { usageService } from '../services/usageService';

interface HomeViewProps {
    profiles: CharacterProfile[];
    activeProfileId: string;
    onProfileSelect: (profile: CharacterProfile) => void;
    onStartChat: () => void;
    onCreateNew: () => void;
    onRandomCompanion: (gender: 'male' | 'female') => void;
    onEditProfile: (profile: CharacterProfile) => void;
    onDeleteProfile: (id: string) => void;
    onThemeChange: (mode: 'morning' | 'afternoon' | 'night') => void;
    onCheckUpdate: () => void;
}

const VERSION_HISTORY = [
    { ver: "v1.6.0", desc: "Fresh & Cool Update: Complete Visual Overhaul to Cosmic Glass aesthetic. Cyan/Slate palette integration." },
    { ver: "v1.5.0", desc: "Ultra Privacy Update: Added Stealth Mode (blur messages), Storage Encryption, and Privacy Shield." },
    { ver: "v1.4.3", desc: "Updated Terms & Conditions. Enhanced update stability." },
    { ver: "v1.4.2", desc: "Improved deletion flow with animations." },
    { ver: "v1.4.1", desc: "Added API Usage Tracker & Rate Limit Timer." },
    { ver: "v1.4.0", desc: "User Profile System & Avatar Customization." },
    { ver: "v1.3.0", desc: "Photorealistic Image Engine." }
];

const APP_FEATURES = [
    { title: "Intelligent Personas", icon: "🧠", desc: "Unique AI personalities with distinct traits, memories, and emotional depth." },
    { title: "Photorealistic Visuals", icon: "📸", desc: "High-fidelity avatar generation using Google Imagen 3 & Gemini." },
    { title: "Ultra Privacy", icon: "🔒", desc: "Military-grade local storage encryption, stealth mode blurring, and auto-lock." },
    { title: "Dynamic Themes", icon: "🎨", desc: "Atmospheric backgrounds that adapt to real-world time and intimacy." },
    { title: "Smart Context", icon: "💾", desc: "Persistent chat history and relationship awareness." },
    { title: "Multi-Language", icon: "🌐", desc: "Native support for multiple languages including Manglish." }
];

export const HomeView: React.FC<HomeViewProps> = ({
    profiles,
    activeProfileId,
    onProfileSelect,
    onStartChat,
    onCreateNew,
    onRandomCompanion,
    onEditProfile,
    onDeleteProfile,
    onThemeChange,
    onCheckUpdate
}) => {
    const [userProfile] = useState<UserProfile>(getUserProfile());
    const [usageStats, setUsageStats] = useState(usageService.getStats());
    const [showTermsBanner, setShowTermsBanner] = useState(true);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showFeaturesModal, setShowFeaturesModal] = useState(false);
    const [deleteCandidate, setDeleteCandidate] = useState<CharacterProfile | null>(null);
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setUsageStats(usageService.getStats());
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const activeProfile = profiles.find(p => p.id === activeProfileId);

    return (
        <div className="relative w-full h-full flex flex-col bg-transparent text-white overflow-hidden font-sans">
            
            {/* Menu Drawer Overlay */}
            <div 
                className={`absolute inset-0 bg-dark-900/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Drawer (Slider) */}
            <div 
                className={`absolute top-0 left-0 h-full w-72 bg-[#0f172a] border-r border-slate-800 z-50 transform transition-transform duration-300 ease-out shadow-2xl flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Drawer Header / Profile */}
                <div className="p-6 border-b border-white/5 bg-[#1e293b]">
                    <div className="flex justify-between items-start mb-6">
                         <h2 className="text-xl font-bold text-white tracking-tight">Menu</h2>
                         <button onClick={() => setIsMenuOpen(false)} className="p-1.5 bg-white/5 rounded-full hover:bg-white/10 text-gray-400">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                         </button>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-brand-500/30 shadow-lg shadow-brand-500/10">
                            <img src={userProfile.avatarUrl} alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg leading-none">{userProfile.name}</h3>
                            <div className="flex items-center space-x-1.5 text-xs mt-1.5">
                                <span className={`w-2 h-2 rounded-full ${usageStats.isRateLimited ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`}></span>
                                <span className="text-gray-400 font-medium">{usageStats.isRateLimited ? 'Limit Reached' : 'Online'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <button 
                        onClick={() => { triggerHaptic(10); setShowFeaturesModal(true); setIsMenuOpen(false); }}
                        className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-slate-200 transition-colors border border-white/5"
                    >
                        <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-400">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                        </div>
                        <span className="font-medium">App Features & Updates</span>
                    </button>
                </div>

                {/* Drawer Footer / Stats */}
                <div className="p-5 border-t border-white/5 bg-[#0f172a]">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Usage Statistics</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Daily Interactions</span>
                            <span className="font-mono font-bold text-brand-400">{usageStats.rpd}/{usageStats.rpdLimit}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">API Status</span>
                            <span className={`font-bold ${usageStats.isRateLimited ? "text-red-400" : "text-emerald-400"}`}>
                                {usageStats.isRateLimited ? "Cooldown Active" : "Operational"}
                            </span>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/5 text-center">
                         <p className="text-[10px] text-slate-600">Velvet AI v1.6.0</p>
                    </div>
                </div>
            </div>
            
            {/* Top Bar */}
            <div className="flex justify-between items-center p-6 z-10 flex-none">
                {/* Left: Menu Trigger */}
                <button 
                    onClick={() => { triggerHaptic(10); setIsMenuOpen(true); }} 
                    className="p-2 -ml-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>

                {/* Right: Update Check */}
                <button onClick={() => { triggerHaptic(10); onCheckUpdate(); }} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition text-slate-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9"/></svg>
                </button>
            </div>

            {/* Terms Announcement Card - Updated to Blue/Cool Style */}
            {showTermsBanner && (
               <div className="w-full px-6 mb-4 z-20 animate-fade-in flex-none">
                   <div className="relative w-full mx-auto bg-[#0f172a] border-l-4 border-brand-500 rounded-r-xl shadow-lg flex items-center justify-between p-3 overflow-hidden">
                       {/* Content */}
                       <div className="flex-1 mr-2">
                           <p className="text-[10px] font-bold text-brand-400 uppercase tracking-wider mb-0.5">IMPORTANT</p>
                           <p className="text-xs font-medium text-slate-200">Our terms and conditions updated</p>
                       </div>
                       {/* Actions */}
                       <div className="flex items-center space-x-3">
                           <button 
                               onClick={() => { triggerHaptic(10); setShowTermsModal(true); }}
                               className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-[10px] font-bold rounded-md transition-colors shadow-md"
                           >
                               READ
                           </button>
                           <button 
                               onClick={() => { triggerHaptic(5); setShowTermsBanner(false); }}
                               className="text-slate-400 hover:text-white p-1"
                           >
                               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                           </button>
                       </div>
                   </div>
               </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-0 overflow-y-auto no-scrollbar">
                
                {profiles.length === 0 ? (
                    <div className="text-center space-y-6 p-8 animate-fade-in">
                        <div className="w-24 h-24 bg-brand-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse-slow ring-1 ring-brand-500/40">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-brand-400"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-indigo-400">Velvet AI</h1>
                            <p className="text-slate-400 mt-2 text-sm max-w-xs mx-auto">Create your perfect AI companion. Intelligent, emotional, and yours.</p>
                        </div>
                        <button onClick={() => { triggerHaptic(10); onCreateNew(); }} className="px-8 py-3 bg-gradient-to-r from-brand-500 to-brand-700 rounded-xl font-bold text-white shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:scale-105 transition-transform ring-1 ring-white/10">
                            Create Companion
                        </button>
                        <div className="flex gap-4 justify-center">
                            <button onClick={() => { triggerHaptic(10); onRandomCompanion('female'); }} className="px-4 py-2 bg-white/5 rounded-lg text-xs hover:bg-white/10 border border-white/5 text-slate-300">Random Female</button>
                            <button onClick={() => { triggerHaptic(10); onRandomCompanion('male'); }} className="px-4 py-2 bg-white/5 rounded-lg text-xs hover:bg-white/10 border border-white/5 text-slate-300">Random Male</button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-xs space-y-6 pb-24 pt-4 text-center animate-fade-in">
                        {/* Profile Card */}
                        <div className="relative group animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                            <div className="absolute inset-0 bg-gradient-to-b from-brand-500/20 to-purple-500/20 rounded-3xl blur-xl transition-opacity group-hover:opacity-100 opacity-50"></div>
                            <div className="relative bg-dark-800/60 backdrop-blur-md border border-white/10 rounded-3xl p-4 shadow-2xl overflow-hidden">
                                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 relative">
                                    <img src={activeProfile?.avatarUrl} alt={activeProfile?.name} className="w-full h-full object-cover" />
                                    <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent"></div>
                                    <div className="absolute bottom-3 left-3 text-left">
                                        <h2 className="text-2xl font-bold text-white">{activeProfile?.name}</h2>
                                        <p className="text-brand-400 text-xs font-bold uppercase tracking-wider">{activeProfile?.relationship}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <button onClick={() => { triggerHaptic(10); onStartChat(); }} className="col-span-2 py-3 bg-gradient-to-r from-white to-slate-200 text-black font-bold rounded-xl hover:from-gray-100 hover:to-gray-300 transition-all shadow-lg">
                                        Chat Now
                                    </button>
                                    <button onClick={() => activeProfile && onEditProfile(activeProfile)} className="py-2 bg-white/5 text-slate-300 text-sm font-medium rounded-xl hover:bg-white/10 border border-white/5">
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => { 
                                            if (activeProfile) {
                                                triggerHaptic(10);
                                                setDeleteCandidate(activeProfile);
                                            }
                                        }} 
                                        className="py-2 bg-red-500/10 text-red-400 text-sm font-medium rounded-xl hover:bg-red-500/20 border border-red-500/10"
                                    >
                                        Delete
                                    </button>
                                </div>
                                
                                <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-widest px-1">
                                    <span>{THEMES[activeProfile?.themeId || 'midnight'].name}</span>
                                    <span>{new Date(activeProfile?.createdAt || 0).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Scrollable List of Other Profiles */}
                        {profiles.length > 1 && (
                            <div className="flex space-x-3 overflow-x-auto pb-2 justify-center no-scrollbar">
                                {profiles.filter(p => p.id !== activeProfileId).map((p, idx) => (
                                    <button 
                                        key={p.id} 
                                        onClick={() => { triggerHaptic(5); onProfileSelect(p); }} 
                                        className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-white/10 overflow-hidden animate-slide-up hover:scale-110 transition-transform shadow-md"
                                        style={{ animationDelay: `${0.2 + (idx * 0.1)}s`, animationFillMode: 'both' }}
                                    >
                                        <img src={p.avatarUrl} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                                <button 
                                    onClick={onCreateNew} 
                                    className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all animate-slide-up"
                                    style={{ animationDelay: `${0.2 + ((profiles.length - 1) * 0.1)}s`, animationFillMode: 'both' }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                </button>
                            </div>
                        )}
                        
                        {profiles.length === 1 && (
                             <button onClick={onCreateNew} className="text-xs text-slate-500 hover:text-white transition-colors flex items-center justify-center space-x-1 mx-auto animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                <span>Create Another</span>
                             </button>
                        )}
                    </div>
                )}
            </div>
            
            {/* Footer Info */}
             <div className="p-6 text-center z-10 flex-none">
                <button onClick={() => setShowFeaturesModal(true)} className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors">
                    Velvet AI v1.6.0 • {usageStats.rpd}/{usageStats.rpdLimit} Daily Calls
                </button>
            </div>

            {/* Features & Updates Modal */}
            {showFeaturesModal && (
                <div className="fixed inset-0 z-[70] bg-dark-900/95 backdrop-blur-xl flex flex-col animate-fade-in overflow-hidden">
                    {/* Header */}
                    <div className="flex-none p-6 border-b border-white/5 flex justify-between items-center bg-[#0f172a]">
                        <div>
                            <h2 className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-violet-400">Features & Updates</h2>
                            <p className="text-xs text-slate-400 mt-1">What's new in Velvet AI</p>
                        </div>
                        <button onClick={() => setShowFeaturesModal(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {/* Features Section */}
                        <div className="mb-10">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 pl-1">Core Capabilities</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {APP_FEATURES.map((f, i) => (
                                    <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-start space-x-4 hover:bg-white/10 transition-colors">
                                        <div className="text-2xl bg-black/30 w-10 h-10 flex items-center justify-center rounded-full text-brand-400">{f.icon}</div>
                                        <div>
                                            <h4 className="font-bold text-slate-100 text-sm">{f.title}</h4>
                                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{f.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Changelog Section */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 pl-1">Version History</h3>
                            <div className="space-y-8 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                                {VERSION_HISTORY.map((v, i) => (
                                    <div key={i} className="pl-8 relative">
                                         <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-dark-900 ${i === 0 ? 'bg-brand-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]' : 'bg-slate-700'}`}></div>
                                         <div className="flex items-baseline justify-between mb-1">
                                             <span className={`font-mono font-bold text-sm ${i===0 ? 'text-brand-400' : 'text-slate-300'}`}>{v.ver}</span>
                                             {i === 0 && <span className="text-[10px] bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded-full font-bold">LATEST</span>}
                                         </div>
                                         <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Terms Modal */}
            {showTermsModal && (
               <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-col animate-fade-in">
                   <div className="flex-none p-6 border-b border-white/10 flex justify-between items-center bg-[#020617] shadow-md">
                       <h2 className="text-lg font-bold text-white">Terms & Conditions</h2>
                       <button onClick={() => setShowTermsModal(false)} className="p-2 hover:bg-white/10 rounded-full text-slate-300 transition-colors">
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                       </button>
                   </div>
                   <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-200 space-y-6 font-sans custom-scrollbar bg-[#020617]">
                        <div>
                            <p className="text-xs font-bold text-slate-500 mb-1">LAST UPDATED: NOVEMBER 2025</p>
                            <p className="text-red-400 font-bold uppercase text-xs mb-4">
                                IMPORTANT NOTICE: READ THIS DOCUMENT IN ITS ENTIRETY. BY USING THIS APPLICATION, YOU AGREE TO BE BOUND BY THESE TERMS. VIOLATION OF THESE TERMS, PARTICULARLY THOSE REGARDING ILLEGAL CONTENT AND CHILD SAFETY, WILL RESULT IN IMMEDIATE ACCOUNT TERMINATION AND REPORTING TO RELEVANT AUTHORITIES.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-2 text-base">1. ZERO TOLERANCE POLICY ON CHILD SEXUAL ABUSE MATERIAL (CSAM)</h3>
                            <p className="mb-2">Velvet AI maintains a strict, non-negotiable zero-tolerance policy regarding Child Sexual Abuse Material.</p>
                            <ul className="list-none space-y-2 pl-2 text-slate-400">
                                <li>a) Generation, request, or discussion of content depicting, describing, or promoting the sexual exploitation of minors (anyone under the age of 18) is strictly prohibited.</li>
                                <li>b) Any attempt to manipulate the AI to generate personas, narratives, or images resembling minors, or roleplaying scenarios involving minors, is a violation of international law and this agreement.</li>
                                <li>c) AUTOMATED REPORTING: Our systems utilize automated detection mechanisms. Any user identified as attempting to generate CSAM will have their metadata, IP address, and chat logs preserved and immediately reported to the National Center for Missing & Exploited Children (NCMEC) and relevant law enforcement agencies globally.</li>
                                <li>d) There are no warnings for this violation. You will be permanently banned, and legal action will be pursued.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-2 text-base">2. PROHIBITED ILLEGAL CONTENT AND DANGEROUS ACTIVITIES</h3>
                            <p className="mb-2">You agree not to use Velvet AI to generate content related to:</p>
                            <ul className="list-none space-y-2 pl-2 text-slate-400">
                                <li>a) Illegal Acts: Promotion of terrorism, human trafficking, drug manufacturing, or organized crime.</li>
                                <li>b) Violence: Realistic depictions of extreme gore, self-harm, suicide, or torture.</li>
                                <li>c) Non-Consensual Sexual Content: Content depicting sexual violence, non-consensual sexual behavior, or "deepfake" pornography of real individuals without their consent.</li>
                                <li>d) Hate Speech: Content that promotes violence, discrimination, or hostility against individuals or groups based on race, ethnicity, religion, disability, gender, age, sexual orientation, or veteran status.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-2 text-base">3. USER RESPONSIBILITY AND LIABILITY</h3>
                            <ul className="list-none space-y-2 pl-2 text-slate-400">
                                <li>a) You acknowledge that you are solely responsible for the prompts you enter and the interactions you have with the AI.</li>
                                <li>b) You agree to indemnify and hold Velvet AI harmless from any claims, damages, or legal liabilities arising from your violation of these terms or your illegal use of the service.</li>
                                <li>c) Velvet AI acts as a tool provider; however, we actively monitor for abuse patterns to ensure community safety.</li>
                            </ul>
                        </div>

                        <div>
                           <h3 className="text-white font-bold mb-2 text-base">4. AGE RESTRICTIONS</h3>
                           <ul className="list-none space-y-2 pl-2 text-slate-400">
                               <li>a) You must be at least 18 years of age to use this application.</li>
                               <li>b) By accessing this application, you verify that you are of legal age in your jurisdiction to view mature content.</li>
                               <li>c) Access by minors is strictly prohibited. Parents are advised to utilize parental control safeguards on their devices.</li>
                           </ul>
                       </div>

                       <div>
                           <h3 className="text-white font-bold mb-2 text-base">5. CONSEQUENCES OF VIOLATION</h3>
                           <p className="mb-2">If you violate these terms:</p>
                           <ul className="list-none space-y-2 pl-2 text-slate-400">
                               <li>a) Your access to the app will be immediately revoked.</li>
                               <li>b) Your device ID and IP address will be blacklisted.</li>
                               <li>c) In cases involving illegal content (CSAM, Terrorism, imminent threats to life), we are legally obligated to cooperate with government and law enforcement authorities. This includes surrendering user data, chat logs, and location data without prior notice to you.</li>
                           </ul>
                       </div>

                       <div>
                           <h3 className="text-white font-bold mb-2 text-base">6. AI GENERATED CONTENT DISCLAIMER</h3>
                           <ul className="list-none space-y-2 pl-2 text-slate-400">
                               <li>a) The personas and characters within this app are artificial intelligence. They are not real people.</li>
                               <li>b) Content generated is fictional. Any resemblance to real persons, living or dead, is coincidental.</li>
                               <li>c) Do not rely on the AI for medical, legal, or financial advice.</li>
                           </ul>
                       </div>

                       <div>
                           <h3 className="text-white font-bold mb-2 text-base">7. PRIVACY AND DATA RETENTION</h3>
                           <p className="text-slate-400">While we value user privacy, safety supersedes privacy in cases of illegal activity. We retain server logs for a period required by law to assist in the investigation of illegal activities.</p>
                       </div>

                       <div>
                           <h3 className="text-white font-bold mb-2 text-base">8. MODIFICATIONS TO TERMS</h3>
                           <p className="text-slate-400">We reserve the right to modify these terms at any time. Continued use of the application signifies your acceptance of the updated terms.</p>
                       </div>

                       <div className="pt-6 pb-8">
                           <p className="text-xs text-center text-slate-500 mb-4 uppercase">By closing this window, you acknowledge you have read and agreed to these terms.</p>
                           <button 
                               onClick={() => { triggerHaptic(10); setShowTermsModal(false); setShowTermsBanner(false); }}
                               className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg transition-colors"
                           >
                               I UNDERSTAND & AGREE
                           </button>
                       </div>
                   </div>
               </div>
            )}
            
            {/* Delete Confirmation Modal */}
            {deleteCandidate && (
                <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <div className="w-full max-w-sm bg-[#0f172a] border border-red-900/50 rounded-2xl p-6 shadow-2xl transform transition-all scale-100">
                        <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </div>
                        <h2 className="text-xl font-bold text-white text-center mb-2">Delete Companion?</h2>
                        <p className="text-slate-400 text-sm text-center mb-6">
                            Are you sure you want to delete <span className="text-white font-bold">{deleteCandidate.name}</span>? This action cannot be undone.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => { triggerHaptic(5); setDeleteCandidate(null); }}
                                className="px-4 py-3 rounded-xl text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => { 
                                    triggerHaptic(20); 
                                    onDeleteProfile(deleteCandidate.id); 
                                    setDeleteCandidate(null); 
                                }}
                                className="px-4 py-3 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};
