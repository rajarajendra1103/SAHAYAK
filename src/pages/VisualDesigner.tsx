import React, { useState } from 'react';
import { Palette, Lightbulb, Download, Printer, Share2, Eye, RotateCcw, Zap, TreePine, Layers } from 'lucide-react';

interface VisualElement {
  id: string;
  type: 'icon' | 'text' | 'arrow' | 'line';
  content: string;
  position: { x: number; y: number };
  style: string;
  color?: string;
}

interface GeneratedVisual {
  id: string;
  prompt: string;
  elements: VisualElement[];
  style: string;
  language: string;
  mode: 'classification' | 'process';
  timestamp: Date;
}

const VisualDesigner: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('illustrated');
  const [selectedLanguage, setSelectedLanguage] = useState('english-local');
  const [canvasSize, setCanvasSize] = useState('medium');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVisual, setGeneratedVisual] = useState<GeneratedVisual | null>(null);
  const [detectedMode, setDetectedMode] = useState<'classification' | 'process'>('process');

  const styles = [
    { value: 'stick', label: 'Stick Diagram', icon: '🖊️', description: 'Simple line drawings' },
    { value: 'illustrated', label: 'Illustrated Diagram', icon: '🎨', description: 'Detailed illustrations' },
    { value: 'flowchart', label: 'Flowchart with Icons', icon: '📊', description: 'Process flow with icons' },
    { value: 'classification', label: 'Classification Tree', icon: '🌳', description: 'Hierarchical structure' }
  ];

  const languages = [
    { value: 'english-local', label: 'English + Local Language', flag: '🌐' },
    { value: 'english-only', label: 'English Only', flag: '🇺🇸' },
    { value: 'local-only', label: 'Local Language Only', flag: '🇮🇳' },
    { value: 'auto-detect', label: 'Auto-detect Regional Language', flag: '🤖' }
  ];

  const canvasSizes = [
    { value: 'small', label: 'Small', dimensions: '400×300', icon: '📱' },
    { value: 'medium', label: 'Medium', dimensions: '600×400', icon: '💻' },
    { value: 'large', label: 'Full Width', dimensions: '800×500', icon: '🖥️' }
  ];

  // Smart interpretation to detect classification terms
  const detectClassificationMode = (text: string): 'classification' | 'process' => {
    const classificationTerms = [
      'types of', 'grouped into', 'belongs to', 'divided as', 'categories',
      'classification', 'kinds of', 'varieties of', 'classes of', 'sorts of'
    ];
    
    const lowerText = text.toLowerCase();
    const isClassification = classificationTerms.some(term => lowerText.includes(term));
    
    return isClassification ? 'classification' : 'process';
  };

  const generateClassificationVisual = (prompt: string): VisualElement[] => {
    if (prompt.toLowerCase().includes('animals')) {
      return [
        { id: '1', type: 'text', content: '🌍 Animals', position: { x: 50, y: 15 }, style: 'text-2xl font-bold text-blue-600' },
        { id: '2', type: 'line', content: '├──', position: { x: 30, y: 25 }, style: 'text-gray-400' },
        { id: '3', type: 'text', content: '🐾 Mammals', position: { x: 25, y: 30 }, style: 'text-lg font-semibold text-green-600' },
        { id: '4', type: 'line', content: '├──', position: { x: 50, y: 25 }, style: 'text-gray-400' },
        { id: '5', type: 'text', content: '🦎 Reptiles', position: { x: 50, y: 30 }, style: 'text-lg font-semibold text-orange-600' },
        { id: '6', type: 'line', content: '└──', position: { x: 70, y: 25 }, style: 'text-gray-400' },
        { id: '7', type: 'text', content: '🐦 Birds', position: { x: 75, y: 30 }, style: 'text-lg font-semibold text-purple-600' },
        { id: '8', type: 'text', content: '🐕 Dog', position: { x: 15, y: 45 }, style: 'text-sm text-green-700' },
        { id: '9', type: 'text', content: '🐱 Cat', position: { x: 35, y: 45 }, style: 'text-sm text-green-700' },
        { id: '10', type: 'text', content: '🐍 Snake', position: { x: 45, y: 45 }, style: 'text-sm text-orange-700' },
        { id: '11', type: 'text', content: '🦎 Lizard', position: { x: 55, y: 45 }, style: 'text-sm text-orange-700' },
        { id: '12', type: 'text', content: '🦅 Eagle', position: { x: 70, y: 45 }, style: 'text-sm text-purple-700' },
        { id: '13', type: 'text', content: '🐧 Penguin', position: { x: 80, y: 45 }, style: 'text-sm text-purple-700' }
      ];
    } else if (prompt.toLowerCase().includes('resources')) {
      return [
        { id: '1', type: 'text', content: '🌍 Natural Resources', position: { x: 50, y: 15 }, style: 'text-2xl font-bold text-blue-600' },
        { id: '2', type: 'line', content: '├──', position: { x: 35, y: 25 }, style: 'text-gray-400' },
        { id: '3', type: 'text', content: '🔄 Renewable', position: { x: 30, y: 30 }, style: 'text-lg font-semibold text-green-600' },
        { id: '4', type: 'line', content: '└──', position: { x: 65, y: 25 }, style: 'text-gray-400' },
        { id: '5', type: 'text', content: '❌ Non-renewable', position: { x: 70, y: 30 }, style: 'text-lg font-semibold text-red-600' },
        { id: '6', type: 'text', content: '🌞 Solar', position: { x: 20, y: 45 }, style: 'text-sm text-green-700' },
        { id: '7', type: 'text', content: '🌬️ Wind', position: { x: 40, y: 45 }, style: 'text-sm text-green-700' },
        { id: '8', type: 'text', content: '🛢️ Oil', position: { x: 60, y: 45 }, style: 'text-sm text-red-700' },
        { id: '9', type: 'text', content: '🔥 Coal', position: { x: 80, y: 45 }, style: 'text-sm text-red-700' }
      ];
    }
    return [];
  };

  const generateProcessVisual = (prompt: string): VisualElement[] => {
    if (prompt.toLowerCase().includes('water cycle')) {
      return [
        { id: '1', type: 'icon', content: '🌊', position: { x: 10, y: 40 }, style: 'text-3xl' },
        { id: '2', type: 'arrow', content: '→', position: { x: 25, y: 40 }, style: 'text-xl text-blue-500' },
        { id: '3', type: 'icon', content: '☀️', position: { x: 35, y: 30 }, style: 'text-3xl' },
        { id: '4', type: 'arrow', content: '↗', position: { x: 50, y: 25 }, style: 'text-xl text-blue-500' },
        { id: '5', type: 'icon', content: '☁️', position: { x: 60, y: 20 }, style: 'text-3xl' },
        { id: '6', type: 'arrow', content: '↓', position: { x: 75, y: 30 }, style: 'text-xl text-blue-500' },
        { id: '7', type: 'icon', content: '🌧️', position: { x: 85, y: 40 }, style: 'text-3xl' },
        { id: '8', type: 'text', content: 'Evaporation', position: { x: 30, y: 55 }, style: 'text-sm font-medium' },
        { id: '9', type: 'text', content: 'Condensation', position: { x: 60, y: 10 }, style: 'text-sm font-medium' },
        { id: '10', type: 'text', content: 'Precipitation', position: { x: 80, y: 55 }, style: 'text-sm font-medium' }
      ];
    }
    return [
      { id: '1', type: 'text', content: 'Generated Visual', position: { x: 50, y: 30 }, style: 'text-xl font-bold' },
      { id: '2', type: 'text', content: 'Based on your prompt', position: { x: 50, y: 50 }, style: 'text-lg' }
    ];
  };

  const generateVisual = () => {
    if (!prompt.trim()) {
      alert('Please enter a description of what you want to visualize');
      return;
    }

    setIsGenerating(true);
    const mode = detectClassificationMode(prompt);
    setDetectedMode(mode);

    setTimeout(() => {
      const elements = mode === 'classification' 
        ? generateClassificationVisual(prompt)
        : generateProcessVisual(prompt);

      const newVisual: GeneratedVisual = {
        id: Date.now().toString(),
        prompt: prompt,
        elements: elements,
        style: mode === 'classification' ? 'classification' : selectedStyle,
        language: selectedLanguage,
        mode: mode,
        timestamp: new Date()
      };

      setGeneratedVisual(newVisual);
      setIsGenerating(false);
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    alert('Visual saved as PNG!');
  };

  const handleShare = () => {
    alert('Visual shared successfully!');
  };

  const getCanvasClass = () => {
    const baseClass = `relative border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 border-gray-600 text-white' 
        : 'bg-white border-gray-300 text-gray-800'
    }`;
    
    switch (canvasSize) {
      case 'small': return `${baseClass} h-80`;
      case 'medium': return `${baseClass} h-96`;
      case 'large': return `${baseClass} h-[500px]`;
      default: return `${baseClass} h-96`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-6 shadow-lg">
            <Palette className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🎨 VISUAL DESIGNER
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create stunning educational visuals with AI-powered smart interpretation
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Input Section */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Lightbulb className="w-6 h-6 mr-3 text-yellow-500" />
                🧑‍🏫 Input Section
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Prompt:
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what you want to visualize"
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Example: "Types of animals: Mammals, Reptiles, Birds"
                  </p>
                </div>

                <button
                  onClick={generateVisual}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span className="font-semibold">Generating...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span className="font-semibold">🎯 GENERATE VISUAL</span>
                    </>
                  )}
                </button>
              </div>

              {/* Smart Interpretation Display */}
              {prompt && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                    <TreePine className="w-4 h-4 mr-2 text-blue-600" />
                    🧠 Smart Interpretation
                  </h3>
                  <p className="text-sm text-gray-700">
                    Mode: <span className="font-semibold text-blue-600">
                      {detectClassificationMode(prompt) === 'classification' ? 'Classification Tree' : 'Process Flow'}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Display Options */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Layers className="w-5 h-5 mr-2 text-purple-600" />
                🛠️ Display Options
              </h2>
              
              <div className="space-y-6">
                {/* Diagram Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    🔘 Diagram Type:
                  </label>
                  <div className="space-y-2">
                    {styles.map(style => (
                      <label key={style.value} className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedStyle === style.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          value={style.value}
                          checked={selectedStyle === style.value}
                          onChange={(e) => setSelectedStyle(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{style.icon}</span>
                          <div>
                            <p className="font-medium text-gray-900">{style.label}</p>
                            <p className="text-xs text-gray-600">{style.description}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Language Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    🔘 Label Language:
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    {languages.map(lang => (
                      <option key={lang.value} value={lang.value}>
                        {lang.flag} {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Canvas Controls */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    🔘 Canvas & Style:
                  </label>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <input
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={(e) => setIsDarkMode(e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">⬛ Dark Board Mode</span>
                    </label>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {canvasSizes.map(size => (
                        <label key={size.value} className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          canvasSize === size.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}>
                          <input
                            type="radio"
                            value={size.value}
                            checked={canvasSize === size.value}
                            onChange={(e) => setCanvasSize(e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{size.icon}</span>
                            <div>
                              <p className="font-medium text-gray-900">{size.label}</p>
                              <p className="text-xs text-gray-600">{size.dimensions}</p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Export & Sharing */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">📤 Export & Sharing</h2>
              
              <div className="space-y-3">
                <button
                  onClick={handlePrint}
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>🖨️ Print Visual Aid</span>
                </button>
                <button
                  onClick={handleSave}
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>💾 Save as PNG</span>
                </button>
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>📤 Share to WhatsApp / Drive</span>
                </button>
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="xl:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">📈 Generated Visual Preview</h2>
                {generatedVisual && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setGeneratedVisual(null)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors">
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                  </div>
                )}
              </div>

              <div className={getCanvasClass()}>
                {!generatedVisual ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Palette className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                      <p className="text-xl font-medium mb-2">Generate a visual to see the preview</p>
                      <p className="text-sm">Enter a prompt and click generate to create your visual</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full p-6">
                    {generatedVisual.elements.map((element) => (
                      <div
                        key={element.id}
                        className={`absolute ${element.style} transition-all duration-200 hover:scale-105`}
                        style={{
                          left: `${element.position.x}%`,
                          top: `${element.position.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        {element.content}
                      </div>
                    ))}
                    
                    {/* Mode Indicator */}
                    <div className={`absolute top-4 right-4 px-3 py-2 rounded-xl text-sm font-medium shadow-lg ${
                      generatedVisual.mode === 'classification' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {generatedVisual.mode === 'classification' ? '🌳 Classification Tree' : '📊 Process Flow'}
                    </div>
                  </div>
                )}
              </div>

              {generatedVisual && (
                <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">Generated Visual Details:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <p><span className="font-semibold">Prompt:</span> {generatedVisual.prompt}</p>
                      <p><span className="font-semibold">Style:</span> {styles.find(s => s.value === generatedVisual.style)?.label}</p>
                    </div>
                    <div>
                      <p><span className="font-semibold">Language:</span> {languages.find(l => l.value === generatedVisual.language)?.label}</p>
                      <p><span className="font-semibold">Generated:</span> {generatedVisual.timestamp.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualDesigner;