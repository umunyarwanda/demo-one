import { useState, useEffect } from "react";

interface Phonetic {
  text: string;
  audio?: string;
}

interface Definition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface DictionaryEntry {
  word: string;
  phonetic: string;
  phonetics: Phonetic[];
  origin?: string;
  meanings: Meaning[];
}

export function Welcome() {
  const [searchTerm, setSearchTerm] = useState("keyboard");
  const [dictionaryData, setDictionaryData] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fontFamily, setFontFamily] = useState("serif");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Check localStorage and system preference for dark mode
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    } else {
      // Default to dark mode if no preference is saved
      setIsDarkMode(true);
    }
  }, []);

  // Apply dark mode to document and save to localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Update page title when component mounts
  useEffect(() => {
    document.title = "Dictionary";
  }, []);

  const searchWord = async (word: string) => {
    if (!word.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Word not found");
        } else {
          setError("Failed to fetch definition");
        }
        setDictionaryData([]);
        return;
      }
      
      const data = await response.json();
      setDictionaryData(data);
    } catch (err) {
      setError("Network error");
      setDictionaryData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchWord(searchTerm);
  };

  const playAudio = (audioUrl: string) => {
    try {
      // Handle both relative and absolute URLs
      let fullAudioUrl = audioUrl;
      if (audioUrl.startsWith('//')) {
        fullAudioUrl = `https:${audioUrl}`;
      } else if (audioUrl.startsWith('/')) {
        fullAudioUrl = `https://api.dictionaryapi.dev${audioUrl}`;
      } else if (!audioUrl.startsWith('http')) {
        fullAudioUrl = `https://api.dictionaryapi.dev/${audioUrl}`;
      }
      
      const audio = new Audio(fullAudioUrl);
      
      // Add event listeners for better user feedback
      audio.addEventListener('loadstart', () => {
        setIsPlayingAudio(true);
      });
      
      audio.addEventListener('canplay', () => {
        setIsPlayingAudio(true);
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        setIsPlayingAudio(false);
        alert('Unable to play audio. Please try again.');
      });
      
      audio.addEventListener('ended', () => {
        setIsPlayingAudio(false);
      });
      
      // Play the audio
      audio.play().catch((error) => {
        console.error('Failed to play audio:', error);
        setIsPlayingAudio(false);
        alert('Unable to play audio. Please try again.');
      });
    } catch (error) {
      console.error('Error setting up audio:', error);
      setIsPlayingAudio(false);
      alert('Audio playback is not supported in this browser.');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Search on component mount
  useEffect(() => {
    searchWord(searchTerm);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-950' : 'bg-white'
    }`}>
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <span className="text-xl font-semibold text-black dark:text-white">Dictionary</span>
        
        <div className="flex items-center gap-4">
          {/* Font Family Selector */}
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className={`px-3 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-black'
            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            <option value="serif">Serif</option>
            <option value="sans">Sans</option>
            <option value="mono">Mono</option>
          </select>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a word..."
              className={`w-full px-4 py-3 text-lg rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-black placeholder-gray-500'
              }`}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-purple-600 hover:text-purple-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Searching...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 text-lg font-medium">{error}</p>
          </div>
        )}

        {/* Dictionary Results */}
        {dictionaryData.length > 0 && !isLoading && (
          <div className="space-y-8">
            {dictionaryData.map((entry, index) => (
              <div key={index} className="space-y-6">
                {/* Word Header */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                                          <h1 className={`text-4xl font-bold mb-2 text-black dark:text-white ${
                        fontFamily === 'serif' ? 'font-serif' : 
                        fontFamily === 'mono' ? 'font-mono' : 'font-sans'
                      }`}>
                        {entry.word}
                      </h1>
                      {entry.phonetic && (
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                          {entry.phonetic}
                        </p>
                      )}
                  </div>
                  
                  {/* Audio Button */}
                  {entry.phonetics.find(p => p.audio) && (
                    <button
                      onClick={() => {
                        const audioPhonetic = entry.phonetics.find(p => p.audio);
                        if (audioPhonetic?.audio) {
                          playAudio(audioPhonetic.audio);
                        }
                      }}
                      disabled={isPlayingAudio}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all ${
                        isPlayingAudio 
                          ? 'bg-purple-400 cursor-not-allowed' 
                          : 'bg-purple-600 hover:bg-purple-700 hover:scale-105'
                      }`}
                      aria-label={isPlayingAudio ? "Playing pronunciation" : "Play pronunciation"}
                    >
                      {isPlayingAudio ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>

                {/* Origin */}
                {entry.origin && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Origin:</span> {entry.origin}
                  </div>
                )}

                {/* Meanings */}
                <div className="space-y-6">
                  {entry.meanings.map((meaning, meaningIndex) => (
                    <div key={meaningIndex} className="space-y-4">
                      <h2 className="text-xl font-bold text-black dark:text-white">
                        {meaning.partOfSpeech}
                      </h2>
                      
                      <div className="space-y-4">
                        <h3 className="font-semibold text-black dark:text-white">Meaning</h3>
                        <ul className="space-y-3">
                          {meaning.definitions.map((definition, defIndex) => (
                            <li key={defIndex} className="space-y-2">
                              <p className="text-black dark:text-white">
                                {definition.definition}
                              </p>
                              {definition.example && (
                                <p className="text-gray-600 dark:text-gray-400 italic">
                                  "{definition.example}"
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                        
                        {/* Synonyms */}
                        {meaning.definitions.some(d => d.synonyms.length > 0) && (
                          <div>
                            <h4 className="font-semibold text-black dark:text-white mb-2">Synonyms</h4>
                            <div className="flex flex-wrap gap-2">
                              {meaning.definitions.flatMap(d => d.synonyms).map((synonym, synIndex) => (
                                                              <span
                                key={synIndex}
                                className="text-black dark:text-white font-medium"
                              >
                                {synonym}
                              </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Source */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-black dark:text-white">Source:</span>{' '}
                    <a
                      href={`https://en.wiktionary.org/wiki/${entry.word}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline inline-flex items-center gap-1"
                    >
                      https://en.wiktionary.org/wiki/{entry.word}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
