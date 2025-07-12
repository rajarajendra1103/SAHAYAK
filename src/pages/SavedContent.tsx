import React, { useState } from 'react';
import { BookOpen, Download, Share2, Eye, Trash2, Filter, Search, FileText, Image, Video, Star, Calendar, Tag, FolderOpen } from 'lucide-react';

interface SavedItem {
  id: string;
  type: 'worksheet' | 'story' | 'visual' | 'lesson' | 'media';
  title: string;
  subject: string;
  grade: string;
  date: string;
  size: string;
  icon: string;
  tags: string[];
  isFavorite: boolean;
  description?: string;
}

const SavedContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [savedItems, setSavedItems] = useState<SavedItem[]>([
    {
      id: '1',
      type: 'worksheet',
      title: 'Grade 3 EVS Worksheet - Plants and Animals',
      subject: 'EVS',
      grade: 'Grade 3',
      date: '2024-01-15',
      size: '2.3 MB',
      icon: '📄',
      tags: ['plants', 'animals', 'nature'],
      isFavorite: true,
      description: 'Comprehensive worksheet covering plant and animal classification'
    },
    {
      id: '2',
      type: 'story',
      title: 'Kindness Story (Bilingual)',
      subject: 'Life Skills',
      grade: 'Grade 4',
      date: '2024-01-14',
      size: '1.8 MB',
      icon: '📘',
      tags: ['kindness', 'moral', 'bilingual'],
      isFavorite: false,
      description: 'Heartwarming story about kindness in English and local language'
    },
    {
      id: '3',
      type: 'visual',
      title: 'Water Cycle Diagram',
      subject: 'Science',
      grade: 'Grade 5',
      date: '2024-01-13',
      size: '3.1 MB',
      icon: '🎨',
      tags: ['water', 'cycle', 'diagram'],
      isFavorite: true,
      description: 'Interactive visual diagram explaining the water cycle process'
    },
    {
      id: '4',
      type: 'lesson',
      title: 'Math Shapes Lesson Plan',
      subject: 'Math',
      grade: 'Grade 2',
      date: '2024-01-12',
      size: '1.5 MB',
      icon: '📋',
      tags: ['shapes', 'geometry', 'lesson'],
      isFavorite: false,
      description: 'Complete lesson plan for teaching basic geometric shapes'
    },
    {
      id: '5',
      type: 'media',
      title: 'Solar System Animation',
      subject: 'Science',
      grade: 'Grade 6',
      date: '2024-01-11',
      size: '15.2 MB',
      icon: '🎬',
      tags: ['space', 'planets', 'animation'],
      isFavorite: true,
      description: 'Educational animation showing planets in our solar system'
    }
  ]);

  const filterTypes = [
    { value: 'all', label: 'All Content', icon: '📁', count: savedItems.length },
    { value: 'worksheet', label: 'Worksheets', icon: '📄', count: savedItems.filter(item => item.type === 'worksheet').length },
    { value: 'story', label: 'Stories', icon: '📘', count: savedItems.filter(item => item.type === 'story').length },
    { value: 'visual', label: 'Visual Aids', icon: '🎨', count: savedItems.filter(item => item.type === 'visual').length },
    { value: 'lesson', label: 'Lesson Plans', icon: '📋', count: savedItems.filter(item => item.type === 'lesson').length },
    { value: 'media', label: 'Media Files', icon: '🎬', count: savedItems.filter(item => item.type === 'media').length }
  ];

  const sortOptions = [
    { value: 'date', label: 'Date Created' },
    { value: 'name', label: 'Name' },
    { value: 'size', label: 'File Size' },
    { value: 'subject', label: 'Subject' },
    { value: 'grade', label: 'Grade' }
  ];

  const filteredItems = savedItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.title.localeCompare(b.title);
      case 'size':
        return parseFloat(a.size) - parseFloat(b.size);
      case 'subject':
        return a.subject.localeCompare(b.subject);
      case 'grade':
        return a.grade.localeCompare(b.grade);
      case 'date':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const handleDownload = (item: SavedItem) => {
    alert(`Downloading ${item.title}...`);
  };

  const handleShare = (item: SavedItem) => {
    alert(`Sharing ${item.title}...`);
  };

  const handlePreview = (item: SavedItem) => {
    alert(`Opening preview for ${item.title}...`);
  };

  const handleDelete = (item: SavedItem) => {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      setSavedItems(prev => prev.filter(i => i.id !== item.id));
    }
  };

  const toggleFavorite = (itemId: string) => {
    setSavedItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const handleExportAll = () => {
    alert('Exporting all content...');
  };

  const handleSendToDevice = () => {
    alert('Sending to WhatsApp/Bluetooth...');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'worksheet': return 'bg-blue-100 text-blue-800';
      case 'story': return 'bg-purple-100 text-purple-800';
      case 'visual': return 'bg-green-100 text-green-800';
      case 'lesson': return 'bg-orange-100 text-orange-800';
      case 'media': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            💾 Save & Share Hub
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-blue-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Centralized storage for all your teaching materials with smart organization
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search your saved content..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            
            {/* Filters and Actions */}
            <div className="flex flex-wrap gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                {filterTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label} ({type.count})
                  </option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    Sort by {option.label}
                  </option>
                ))}
              </select>
              
              <button
                onClick={handleExportAll}
                className="flex items-center space-x-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Download className="w-5 h-5" />
                <span>💾 Export All</span>
              </button>
              
              <button
                onClick={handleSendToDevice}
                className="flex items-center space-x-2 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg"
              >
                <Share2 className="w-5 h-5" />
                <span>📤 Send to Device</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Type Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {filterTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setFilterType(type.value)}
              className={`flex flex-col items-center p-6 rounded-2xl transition-all duration-200 ${
                filterType === type.value
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:shadow-lg hover:scale-105'
              } border border-white/20`}
            >
              <span className="text-2xl mb-2">{type.icon}</span>
              <span className="font-semibold text-sm text-center">{type.label}</span>
              <span className="text-xs opacity-75">{type.count} items</span>
            </button>
          ))}
        </div>

        {/* Saved Materials */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FolderOpen className="w-6 h-6 mr-3 text-blue-600" />
              📂 Saved Materials
              {sortedItems.length > 0 && (
                <span className="text-lg font-normal text-gray-600 ml-2">
                  ({sortedItems.length} items)
                </span>
              )}
            </h2>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className="w-5 h-5 grid grid-cols-2 gap-1">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className="w-5 h-5 flex flex-col gap-1">
                  <div className="bg-current h-1 rounded-sm"></div>
                  <div className="bg-current h-1 rounded-sm"></div>
                  <div className="bg-current h-1 rounded-sm"></div>
                </div>
              </button>
            </div>
          </div>

          {sortedItems.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <BookOpen className="w-20 h-20 mx-auto mb-6 text-gray-300" />
              <p className="text-xl font-medium mb-2">No content found</p>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedItems.map((item) => (
                <div key={item.id} className="group bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                            {item.type}
                          </span>
                          {item.isFavorite && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm line-clamp-2">{item.title}</h3>
                      </div>
                    </div>
                  </div>
                  
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      📘 {item.grade}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      📚 {item.subject}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                    <span>📦 {item.size}</span>
                  </div>

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
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          item.isFavorite 
                            ? 'text-yellow-600 bg-yellow-100' 
                            : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-100'
                        }`}
                        title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                      {item.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                        {item.isFavorite && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                          {item.type}
                        </span>
                        <span>📘 {item.grade}</span>
                        <span>📚 {item.subject}</span>
                        <span>📦 {item.size}</span>
                        <span>🕓 {new Date(item.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
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
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        item.isFavorite 
                          ? 'text-yellow-600 bg-yellow-100' 
                          : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-100'
                      }`}
                      title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedContent;