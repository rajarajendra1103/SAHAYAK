import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Heart, Share2, Play, Image as ImageIcon, Video, Music, FileText, Globe, Zap } from 'lucide-react';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  source: string;
  tags: string[];
  duration?: string;
  channelTitle?: string;
  publishedAt?: string;
  viewCount?: string;
}

const MediaSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'images' | 'videos'>('images');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // API Keys
  const YOUTUBE_API_KEY = 'AIzaSyA-ECuJ_4YIXs8AUw1WFkrzGrBeXf5R4zU';
  const GOOGLE_SEARCH_API_KEY = 'AIzaSyDwSA7ufpX8fAEKgkGe_UKHd_fCzTzv3d0';
  const GOOGLE_SEARCH_ENGINE_ID = '017576662512468239146:omuauf_lfve'; // Educational content search engine

  const languages = [
    { value: 'english', label: 'English', code: 'en' },
    { value: 'hindi', label: 'हिंदी (Hindi)', code: 'hi' },
    { value: 'kannada', label: 'ಕನ್ನಡ (Kannada)', code: 'kn' },
    { value: 'telugu', label: 'తెలుగు (Telugu)', code: 'te' },
    { value: 'tamil', label: 'தமிழ் (Tamil)', code: 'ta' },
    { value: 'marathi', label: 'मराठी (Marathi)', code: 'mr' },
    { value: 'gujarati', label: 'ગુજરાતી (Gujarati)', code: 'gu' },
    { value: 'bengali', label: 'বাংলা (Bengali)', code: 'bn' },
    { value: 'punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)', code: 'pa' },
    { value: 'malayalam', label: 'മലയാളം (Malayalam)', code: 'ml' }
  ];

  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
  const subjects = ['English', 'EVS', 'Life Skills', 'Computer', 'Math', 'Social Science', 'Science', 'History', 'Geography'];

  const searchYouTubeVideos = async (query: string): Promise<MediaItem[]> => {
    try {
      const languageCode = languages.find(lang => lang.value === selectedLanguage)?.code || 'en';
      const educationalChannels = [
        'UC_x5XG1OV2P6uZZ5FSM9Ttw', // Google for Education
        'UCsooa4yRKGN_zEE8iknghZA', // TED-Ed
        'UC2C_jShtL725hvbm1arSV9w', // CGP Grey
        'UCX6b17PVsYBQ0ip5gyeme-Q', // CrashCourse
        'UCV3Nm3T-XAgVhKH9jT0ViRg', // Veritasium
      ];

      const searchParams = new URLSearchParams({
        part: 'snippet',
        q: `${query} educational ${selectedGrade} ${selectedSubject}`,
        type: 'video',
        videoEmbeddable: 'true',
        videoSyndicated: 'true',
        videoCategoryId: '27', // Education category
        relevanceLanguage: languageCode,
        safeSearch: 'strict',
        maxResults: '12',
        key: YOUTUBE_API_KEY
      });

      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${searchParams}`);
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.items?.map((item: any) => ({
        id: item.id.videoId,
        type: 'video' as const,
        title: item.snippet.title,
        description: item.snippet.description,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        source: 'YouTube',
        tags: item.snippet.tags || [],
        channelTitle: item.snippet.channelTitle,
        publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString()
      })) || [];
    } catch (error) {
      console.error('YouTube search error:', error);
      return [];
    }
  };

  const searchGoogleImages = async (query: string): Promise<MediaItem[]> => {
    try {
      const searchParams = new URLSearchParams({
        key: GOOGLE_SEARCH_API_KEY,
        cx: GOOGLE_SEARCH_ENGINE_ID,
        q: `${query} educational diagram ${selectedGrade} ${selectedSubject}`,
        searchType: 'image',
        safe: 'active',
        imgType: 'clipart,face,lineart,news,photo',
        imgSize: 'medium,large,xlarge',
        num: '10'
      });

      const response = await fetch(`https://www.googleapis.com/customsearch/v1?${searchParams}`);
      
      if (!response.ok) {
        throw new Error(`Google Images API error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.items?.map((item: any, index: number) => ({
        id: `img_${index}`,
        type: 'image' as const,
        title: item.title,
        description: item.snippet || item.title,
        url: item.link,
        thumbnail: item.image?.thumbnailLink || item.link,
        source: item.displayLink,
        tags: []
      })) || [];
    } catch (error) {
      console.error('Google Images search error:', error);
      return [];
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a search term');
      return;
    }

    setIsSearching(true);
    setSearchResults([]);

    try {
      let results: MediaItem[] = [];
      
      if (selectedType === 'videos') {
        results = await searchYouTubeVideos(searchQuery);
      } else {
        results = await searchGoogleImages(searchQuery);
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handlePreview = (item: MediaItem) => {
    if (item.type === 'video') {
      window.open(item.url, '_blank');
    } else {
      window.open(item.url, '_blank');
    }
  };

  const handleDownload = (item: MediaItem) => {
    if (item.type === 'image') {
      const link = document.createElement('a');
      link.href = item.url;
      link.download = item.title;
      link.click();
    } else {
      alert('Video download not available. Please use the YouTube link.');
    }
  };

  const handleShare = async (item: MediaItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: item.url
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(item.url);
        alert('Link copied to clipboard!');
      } else {
        alert('Sharing not supported in this browser');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Search className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🔍 Educational Media Search
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover safe, educational content from YouTube and Google Images
          </p>
        </div>

        {/* Search Interface */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          {/* Media Type Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-2xl p-2 flex">
              <button
                onClick={() => setSelectedType('images')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                  selectedType === 'images'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <ImageIcon className="w-5 h-5" />
                <span className="font-semibold">🖼️ Images</span>
              </button>
              <button
                onClick={() => setSelectedType('videos')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                  selectedType === 'videos'
                    ? 'bg-white text-red-600 shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Video className="w-5 h-5" />
                <span className="font-semibold">🎞️ Videos</span>
              </button>
            </div>
          </div>

          {/* Search Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Search Bar */}
            <div className="lg:col-span-5 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder='e.g., "Parts of a Plant"'
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
              />
            </div>

            {/* Language Filter */}
            <div className="lg:col-span-2">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade Filter */}
            <div className="lg:col-span-2">
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">All Grades</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>

            {/* Subject Filter */}
            <div className="lg:col-span-2">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="lg:col-span-1">
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg font-semibold"
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Zap className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              🎯 Search Results
              {searchResults.length > 0 && (
                <span className="text-lg font-normal text-gray-600 ml-2">
                  ({searchResults.length} items found)
                </span>
              )}
            </h2>
          </div>

          {isSearching ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Searching for educational content...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Search className="w-20 h-20 mx-auto mb-6 text-gray-300" />
              <p className="text-xl font-medium mb-2">Start your search</p>
              <p className="text-gray-400">Enter keywords to find educational {selectedType}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((item) => {
                const isFavorite = favorites.includes(item.id);
                
                return (
                  <div key={item.id} className="group bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gray-200 overflow-hidden">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                      
                      {/* Type Badge */}
                      <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium ${
                        item.type === 'video' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                      }`}>
                        {item.type === 'video' ? (
                          <div className="flex items-center space-x-1">
                            <Video className="w-3 h-3" />
                            <span>Video</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <ImageIcon className="w-3 h-3" />
                            <span>Image</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Play Button for Videos */}
                      {item.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handlePreview(item)}
                            className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <Play className="w-8 h-8 text-gray-800 ml-1" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm">{item.title}</h3>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                      
                      {/* Source and Date */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span className="truncate">{item.source}</span>
                        {item.publishedAt && <span>{item.publishedAt}</span>}
                      </div>
                      
                      {/* Channel for Videos */}
                      {item.channelTitle && (
                        <p className="text-xs text-gray-500 mb-3 truncate">
                          📺 {item.channelTitle}
                        </p>
                      )}
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handlePreview(item)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(item)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleShare(item)}
                            className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                            title="Share"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => toggleFavorite(item.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            isFavorite 
                              ? 'text-red-600 bg-red-100' 
                              : 'text-gray-400 hover:text-red-600 hover:bg-red-100'
                          }`}
                          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaSearch;