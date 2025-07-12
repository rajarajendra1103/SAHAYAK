import React, { useState, useEffect, useRef } from 'react';
import { Search, Volume2, BookOpen, Clock, Star, Lightbulb, Type, Globe } from 'lucide-react';

interface WordData {
  word: string;
  meaning: string;
  synonyms: string[];
  antonyms: string[];
  tenseForms: {
    present: string;
    past: string;
    future: string;
    presentParticiple: string;
    pastParticiple: string;
  };
  pronunciation: string;
  partOfSpeech: string;
  examples: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface SearchSuggestion {
  word: string;
  meaning: string;
  category: string;
}

const SmartDictionary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(['beautiful', 'knowledge', 'friendship']);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sample word database
  const wordDatabase: { [key: string]: WordData } = {
    'beautiful': {
      word: 'beautiful',
      meaning: 'Pleasing the senses or mind aesthetically; having beauty',
      synonyms: ['lovely', 'gorgeous', 'stunning', 'attractive', 'pretty'],
      antonyms: ['ugly', 'hideous', 'unattractive', 'plain'],
      tenseForms: {
        present: 'beautiful',
        past: 'beautiful',
        future: 'beautiful',
        presentParticiple: 'beautiful',
        pastParticiple: 'beautiful'
      },
      pronunciation: '/ˈbjuːtɪfʊl/',
      partOfSpeech: 'Adjective',
      examples: [
        'The sunset was beautiful tonight.',
        'She has a beautiful voice.',
        'The garden looks beautiful in spring.'
      ],
      difficulty: 'Easy'
    },
    'knowledge': {
      word: 'knowledge',
      meaning: 'Facts, information, and skills acquired through experience or education',
      synonyms: ['wisdom', 'understanding', 'learning', 'information', 'expertise'],
      antonyms: ['ignorance', 'inexperience', 'unfamiliarity'],
      tenseForms: {
        present: 'knowledge',
        past: 'knowledge',
        future: 'knowledge',
        presentParticiple: 'knowledge',
        pastParticiple: 'knowledge'
      },
      pronunciation: '/ˈnɒlɪdʒ/',
      partOfSpeech: 'Noun',
      examples: [
        'Knowledge is power.',
        'She has extensive knowledge of history.',
        'Sharing knowledge helps everyone learn.'
      ],
      difficulty: 'Medium'
    },
    'friendship': {
      word: 'friendship',
      meaning: 'The emotions or conduct of friends; the state of being friends',
      synonyms: ['companionship', 'fellowship', 'camaraderie', 'bond', 'relationship'],
      antonyms: ['enmity', 'hostility', 'animosity'],
      tenseForms: {
        present: 'friendship',
        past: 'friendship',
        future: 'friendship',
        presentParticiple: 'friendship',
        pastParticiple: 'friendship'
      },
      pronunciation: '/ˈfrɛn(d)ʃɪp/',
      partOfSpeech: 'Noun',
      examples: [
        'Their friendship lasted for decades.',
        'True friendship is built on trust.',
        'The children formed a strong friendship.'
      ],
      difficulty: 'Easy'
    },
    'run': {
      word: 'run',
      meaning: 'Move at a speed faster than a walk, never having both feet on the ground at the same time',
      synonyms: ['sprint', 'jog', 'dash', 'race', 'hurry'],
      antonyms: ['walk', 'crawl', 'stop'],
      tenseForms: {
        present: 'run',
        past: 'ran',
        future: 'will run',
        presentParticiple: 'running',
        pastParticiple: 'run'
      },
      pronunciation: '/rʌn/',
      partOfSpeech: 'Verb',
      examples: [
        'I run every morning.',
        'She ran to catch the bus.',
        'They will run in the marathon.'
      ],
      difficulty: 'Easy'
    }
  };

  const languages = [
    { value: 'english', label: 'English', flag: '🇺🇸' },
    { value: 'english-hindi', label: 'English + Hindi', flag: '🇮🇳' },
    { value: 'english-kannada', label: 'English + Kannada', flag: '🇮🇳' },
    { value: 'english-telugu', label: 'English + Telugu', flag: '🇮🇳' }
  ];

  // Generate suggestions based on search term
  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = Object.keys(wordDatabase)
        .filter(word => word.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 5)
        .map(word => ({
          word,
          meaning: wordDatabase[word].meaning.substring(0, 50) + '...',
          category: wordDatabase[word].partOfSpeech
        }));
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSearch = (word: string) => {
    setIsLoading(true);
    setShowSuggestions(false);
    
    // Simulate API call
    setTimeout(() => {
      const wordData = wordDatabase[word.toLowerCase()];
      if (wordData) {
        setSelectedWord(wordData);
        if (!recentSearches.includes(word)) {
          setRecentSearches(prev => [word, ...prev.slice(0, 4)]);
        }
      } else {
        // Handle word not found
        setSelectedWord({
          word: word,
          meaning: 'Word not found in dictionary. Please try another word.',
          synonyms: [],
          antonyms: [],
          tenseForms: {
            present: '',
            past: '',
            future: '',
            presentParticiple: '',
            pastParticiple: ''
          },
          pronunciation: '',
          partOfSpeech: 'Unknown',
          examples: [],
          difficulty: 'Easy'
        });
      }
      setIsLoading(false);
    }, 800);
  };

  const handleSuggestionClick = (word: string) => {
    setSearchTerm(word);
    handleSearch(word);
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      if (selectedLanguage.includes('hindi')) {
        utterance.lang = 'hi-IN';
      } else if (selectedLanguage.includes('kannada')) {
        utterance.lang = 'kn-IN';
      } else if (selectedLanguage.includes('telugu')) {
        utterance.lang = 'te-IN';
      } else {
        utterance.lang = 'en-US';
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Smart Dictionary
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Intelligent word lookup with pronunciation, meanings, and language support
          </p>
        </div>

        {/* Language Selection */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
              <div className="flex items-center space-x-4">
                <Globe className="w-5 h-5 text-gray-600" />
                <div className="flex space-x-2">
                  {languages.map(lang => (
                    <button
                      key={lang.value}
                      onClick={() => setSelectedLanguage(lang.value)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                        selectedLanguage === lang.value
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span className="text-sm font-medium">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Input */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Search className="w-6 h-6 mr-2 text-blue-600" />
                Word Search
              </h2>
              
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchTerm && handleSearch(searchTerm)}
                  placeholder="Type a word to search..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <button
                  onClick={() => searchTerm && handleSearch(searchTerm)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Autocomplete Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.word)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{suggestion.word}</p>
                          <p className="text-sm text-gray-600">{suggestion.meaning}</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {suggestion.category}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Searches */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-600" />
                Recent Searches
              </h3>
              <div className="space-y-2">
                {recentSearches.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(word)}
                    className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{word}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Word Details Section */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Looking up word...</p>
                </div>
              </div>
            ) : selectedWord ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
                {/* Word Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-3xl font-bold text-gray-900">{selectedWord.word}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedWord.difficulty)}`}>
                      {selectedWord.difficulty}
                    </span>
                  </div>
                  <button
                    onClick={() => speakWord(selectedWord.word)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Pronounce</span>
                  </button>
                </div>

                {/* Pronunciation and Part of Speech */}
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-lg text-gray-600">{selectedWord.pronunciation}</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {selectedWord.partOfSpeech}
                  </span>
                </div>

                {/* Meaning */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                    Meaning
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">{selectedWord.meaning}</p>
                </div>

                {/* Synonyms and Antonyms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Synonyms</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedWord.synonyms.map((synonym, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(synonym)}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors"
                        >
                          {synonym}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Antonyms</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedWord.antonyms.map((antonym, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(antonym)}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200 transition-colors"
                        >
                          {antonym}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tense Forms (for verbs) */}
                {selectedWord.partOfSpeech === 'Verb' && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                      <Type className="w-5 h-5 mr-2 text-blue-500" />
                      Tense Forms
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-600">Present</p>
                        <p className="text-gray-900">{selectedWord.tenseForms.present}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-600">Past</p>
                        <p className="text-gray-900">{selectedWord.tenseForms.past}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-600">Future</p>
                        <p className="text-gray-900">{selectedWord.tenseForms.future}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-600">Present Participle</p>
                        <p className="text-gray-900">{selectedWord.tenseForms.presentParticiple}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-600">Past Participle</p>
                        <p className="text-gray-900">{selectedWord.tenseForms.pastParticiple}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Examples */}
                {selectedWord.examples.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                      <Star className="w-5 h-5 mr-2 text-yellow-500" />
                      Examples
                    </h3>
                    <div className="space-y-3">
                      {selectedWord.examples.map((example, index) => (
                        <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-gray-800">{example}</p>
                          <button
                            onClick={() => speakWord(example)}
                            className="mt-2 text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Listen</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
                <div className="text-center text-gray-500">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Search for a word to see its details</p>
                  <p className="text-sm">Type in the search box above to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartDictionary;