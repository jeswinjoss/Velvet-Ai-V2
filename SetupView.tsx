
import React, { useState, useEffect } from 'react';
import { CharacterProfile, RelationshipType } from '../types';
import { Button } from '../components/Button';
import { triggerHaptic } from '../utils/haptics';
import { generateId } from '../services/persistenceService';

interface SetupViewProps {
  onComplete: (profile: CharacterProfile) => void;
  onCancel: () => void; 
  isGenerating: boolean;
  hasExistingProfiles: boolean;
  initialProfile?: CharacterProfile | null;
}

const PERSONALITY_TYPES = [
  "Caring", "Dominant", "Flirting", "Submissive", 
  "Shy", "Romantic", "Humorous", "Arrogant"
];

export const SetupView: React.FC<SetupViewProps> = ({ 
  onComplete, 
  onCancel, 
  isGenerating, 
  hasExistingProfiles,
  initialProfile 
}) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<string>(RelationshipType.GIRLFRIEND);
  const [isCustomRel, setIsCustomRel] = useState(false);
  const [customRel, setCustomRel] = useState('');
  const [traits, setTraits] = useState('');
  const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>([]);
  const [intimacyLevel, setIntimacyLevel] = useState<'normal' | 'medium' | 'high'>('medium');
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.name);
      setTraits(initialProfile.traits.split('\nAI Personality')[0]);
      setIntimacyLevel(initialProfile.intimacyLevel);
      if (initialProfile.tags) setSelectedPersonalities(initialProfile.tags);
      
      const isStandard = Object.values(RelationshipType).includes(initialProfile.relationship as any);
      if (isStandard) {
        setRelationship(initialProfile.relationship);
        setIsCustomRel(false);
      } else {
        setCustomRel(initialProfile.relationship);
        setIsCustomRel(true);
      }
    }
  }, [initialProfile]);

  const togglePersonality = (type: string) => {
    triggerHaptic(5);
    setSelectedPersonalities(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && traits) {
      triggerHaptic(10);
      const currentRel = isCustomRel ? customRel : relationship;
      if (currentRel.trim()) {
        setShowWarning(true);
      }
    }
  };

  const handleFinalConfirm = () => {
    triggerHaptic(10);
    const finalRel = isCustomRel ? customRel : relationship;
    const personalityStr = selectedPersonalities.length > 0 
      ? `\nAI Personality Types: ${selectedPersonalities.join(', ')}.` 
      : '';
    
    const fullTraits = `${traits}${personalityStr}`;

    const newProfile: CharacterProfile = { 
      id: initialProfile ? initialProfile.id : generateId(),
      createdAt: initialProfile ? initialProfile.createdAt : Date.now(),
      name, 
      relationship: finalRel, 
      traits: fullTraits,
      themeId: initialProfile ? initialProfile.themeId : 'midnight',
      intimacyLevel,
      tags: selectedPersonalities,
      avatarUrl: initialProfile?.avatarUrl 
    };

    onComplete(newProfile);
    setShowWarning(false);
  };

  const getIntimacyDescription = () => {
      switch(intimacyLevel) {
          case 'normal': return "Ambient Blue: Friendly, safe, and platonic connection.";
          case 'medium': return "Standard Mode: Romantic, teasing, and playful.";
          case 'high': return "Ambient Pink: Intense, bold, and unfiltered passion.";
          default: return "";
      }
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto bg-dark-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl max-h-[85vh] overflow-y-auto custom-scrollbar relative">
        
        <button 
            onClick={() => { triggerHaptic(5); onCancel(); }}
            className="absolute top-6 left-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="text-center mb-8 mt-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-brand-200">
            {initialProfile ? 'Edit Companion' : 'Design Companion'}
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            {initialProfile ? 'Update their personality & details.' : 'Create a new unique AI personality.'}
          </p>
        </div>
        
        <form onSubmit={handleInitialSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-dark-900/50 border border-dark-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none placeholder-gray-600"
              placeholder="e.g. Evelyn"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Relationship</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(RelationshipType).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    triggerHaptic(5);
                    setRelationship(type);
                    setIsCustomRel(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                    !isCustomRel && relationship === type
                      ? 'bg-brand-900/30 border-brand-500 text-brand-200'
                      : 'bg-dark-900/50 border-dark-600 text-gray-400 hover:border-dark-500'
                  }`}
                >
                  {type}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                    triggerHaptic(5);
                    setIsCustomRel(true);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                  isCustomRel
                    ? 'bg-brand-900/30 border-brand-500 text-brand-200'
                    : 'bg-dark-900/50 border-dark-600 text-gray-400 hover:border-dark-500'
                }`}
              >
                Add others
              </button>
            </div>
            
            {isCustomRel && (
              <input
                type="text"
                value={customRel}
                onChange={(e) => setCustomRel(e.target.value)}
                className="w-full mt-3 bg-dark-900/50 border border-brand-500/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none placeholder-gray-500 animate-fade-in"
                placeholder="Ex. Teacher, Manager etc"
                required={isCustomRel}
                autoFocus
              />
            )}
          </div>

          {/* Adult Depth Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-300">Adult Depth</label>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase transition-colors duration-300 ${
                intimacyLevel === 'high' ? 'bg-brand-500/20 text-brand-300' : 
                intimacyLevel === 'medium' ? 'bg-purple-500/20 text-purple-300' : 
                'bg-cyan-500/20 text-cyan-300'
              }`}>
                {intimacyLevel.toUpperCase()}
              </span>
            </div>
            
            <div className="relative flex items-center bg-dark-900/50 border border-dark-600 rounded-xl p-1 h-12 cursor-pointer overflow-hidden">
              {/* Sliding Background */}
              <div 
                className={`absolute top-1 bottom-1 rounded-lg shadow-md transition-all duration-300 ease-out z-0 w-[33%] ${
                  intimacyLevel === 'normal' 
                    ? 'left-1 bg-gradient-to-br from-cyan-600 to-blue-600 shadow-cyan-500/20' 
                    : intimacyLevel === 'medium'
                    ? 'left-[33.33%] bg-gradient-to-br from-purple-600 to-violet-600 shadow-purple-500/20'
                    : 'left-[66.66%] bg-gradient-to-br from-pink-600 to-brand-600 shadow-brand-500/20'
                }`}
              ></div>

              {/* Normal Button */}
              <button
                type="button"
                onClick={() => { triggerHaptic(15); setIntimacyLevel('normal'); }}
                className={`flex-1 relative z-10 text-xs font-bold transition-colors duration-300 ${
                  intimacyLevel === 'normal' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Normal
              </button>
              
              {/* Medium Button */}
              <button
                type="button"
                onClick={() => { triggerHaptic(15); setIntimacyLevel('medium'); }}
                className={`flex-1 relative z-10 text-xs font-bold transition-colors duration-300 ${
                  intimacyLevel === 'medium' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Medium
              </button>

              {/* High Button */}
              <button
                type="button"
                onClick={() => { triggerHaptic(15); setIntimacyLevel('high'); }}
                className={`flex-1 relative z-10 text-xs font-bold transition-colors duration-300 ${
                  intimacyLevel === 'high' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                High
              </button>
            </div>
            <p className={`text-xs px-1 transition-colors duration-300 ${
                intimacyLevel === 'high' ? 'text-pink-400/70' : 
                intimacyLevel === 'medium' ? 'text-purple-400/70' : 
                'text-cyan-400/70'
            }`}>
              {getIntimacyDescription()}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="traits" className="block text-sm font-medium text-gray-300">Personality & Appearance</label>
            <textarea
              id="traits"
              value={traits}
              onChange={(e) => setTraits(e.target.value)}
              className="w-full bg-dark-900/50 border border-dark-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none h-24 resize-none placeholder-gray-600"
              placeholder="Describe their appearance and vibes..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">AI Personal Type</label>
            <div className="flex flex-wrap gap-2">
              {PERSONALITY_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => togglePersonality(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    selectedPersonalities.includes(type)
                      ? 'bg-brand-600 text-white border-brand-500 shadow-[0_0_10px_rgba(225,29,72,0.3)]'
                      : 'bg-dark-900/50 border-dark-600 text-gray-400 hover:text-gray-300 hover:border-dark-500'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full font-bold tracking-wide mt-4"
            isLoading={isGenerating}
          >
            {initialProfile ? 'UPDATE COMPANION' : 'BRING TO LIFE'}
          </Button>
        </form>
      </div>

      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-dark-800 border border-red-900/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(159,18,57,0.3)] text-center transform transition-all scale-100">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-red-500">18+</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Content Warning</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              This experience involves generated personas and interactions that may be suitable for mature audiences only. User discretion is advised.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { triggerHaptic(5); setShowWarning(false); }}
                className="px-4 py-3 rounded-xl text-sm font-medium text-gray-300 bg-dark-700 hover:bg-dark-600 transition-colors"
              >
                EXIT
              </button>
              <button
                onClick={handleFinalConfirm}
                className="px-4 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-brand-800 hover:from-brand-500 hover:to-brand-700 shadow-lg shadow-brand-900/20 transition-all"
              >
                ENTER
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
