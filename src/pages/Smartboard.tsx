import React, { useState } from 'react';
import { Brain, Volume2, Printer, FileText, History, Globe, Lightbulb } from 'lucide-react';

interface Explanation {
  id: string;
  prompt: string;
  english: string;
  localLanguage: string;
  analogy: string;
  timestamp: Date;
  language: string;
}

const Smartboard: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english-kannada');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState<Explanation | null>(null);
  const [history, setHistory] = useState<Explanation[]>([
    {
      id: '1',
      prompt: 'Why does the sky look blue?',
      english: 'Blue light scatters more than other colors because of the way it interacts with air molecules.',
      localLanguage: 'ನೀಲಿ ಬೆಳಕು ಇತರ ಬಣ್ಣಗಳಿಗಿಂತ ಹೆಚ್ಚು ಚದುರುತ್ತದೆ ಏಕೆಂದರೆ ಅದು ಗಾಳಿಯ ಅಣುಗಳೊಂದಿಗೆ ಸಂವಹನ ನಡೆಸುವ ರೀತಿ.',
      analogy: 'Sunlight is like a box of crayons – the blue ones get thrown around more in the sky!',
      timestamp: new Date('2024-01-15T10:30:00'),
      language: 'english-kannada'
    }
  ]);
  const [showHistory, setShowHistory] = useState(false);

  const languages = [
    { value: 'english-kannada', label: 'English + Kannada' },
    { value: 'english-hindi', label: 'English + Hindi' },
    { value: 'english-telugu', label: 'English + Telugu' },
    { value: 'english-marathi', label: 'English + Marathi' },
    { value: 'english-only', label: 'English Only' }
  ];

  const generateExplanation = () => {
    if (!prompt.trim()) {
      alert('Please enter a question or topic');
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      const newExplanation: Explanation = {
        id: Date.now().toString(),
        prompt: prompt,
        english: `This is a simplified explanation of "${prompt}". The concept involves understanding the basic principles and how they apply to everyday life.`,
        localLanguage: selectedLanguage.includes('kannada') 
          ? `ಇದು "${prompt}" ಬಗ್ಗೆ ಸರಳೀಕೃತ ವಿವರಣೆಯಾಗಿದೆ. ಈ ಪರಿಕಲ್ಪನೆಯು ಮೂಲಭೂತ ತತ್ವಗಳನ್ನು ಮತ್ತು ಅವು ದೈನಂದಿನ ಜೀವನಕ್ಕೆ ಹೇಗೆ ಅನ್ವಯಿಸುತ್ತವೆ ಎಂಬುದನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದನ್ನು ಒಳಗೊಂಡಿರುತ್ತದೆ.`
          : selectedLanguage.includes('hindi')
          ? `यह "${prompt}" का एक सरल विवरण है। इस अवधारणा में बुनियादी सिद्धांतों को समझना और वे दैनिक जीवन में कैसे लागू होते हैं, यह शामिल है।`
          : 'Local language translation would appear here based on selection.',
        analogy: `Think of it like a simple everyday example that makes the concept easy to understand and remember!`,
        timestamp: new Date(),
        language: selectedLanguage
      };

      setCurrentExplanation(newExplanation);
      setHistory(prev => [newExplanation, ...prev]);
      setIsGenerating(false);
      setPrompt('');
    }, 2000);
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech not supported in this browser');
    }
  };

  const handlePrint = () => {
    if (currentExplanation) {
      const printContent = `
        <h2>${currentExplanation.prompt}</h2>
        <h3>English Explanation:</h3>
        <p>${currentExplanation.english}</p>
        <h3>Local Language:</h3>
        <p>${currentExplanation.localLanguage}</p>
        <h3>Analogy:</h3>
        <p>${currentExplanation.analogy}</p>
      `;
      const printWindow = window.open('', '_blank');
      printWindow?.document.write(`
        <html>
          <head><title>Smartboard Explanation</title></head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow?.print();
    }
  };

  const createWorksheet = () => {
    if (currentExplanation) {
      // This would integrate with the worksheet generator
      alert(`Worksheet created for topic: ${currentExplanation.prompt}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Brain className="w-8 h-8 mr-3 text-blue-600" />
          🧠 Smartboard
        </h1>
        <div className="w-full h-px bg-gray-200"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📝 Teacher Input Section</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher Prompt:
                </label>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Why does the sky look blue?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language Selector:
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={generateExplanation}
                disabled={isGenerating}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    <span>🎯 GENERATE EXPLANATION</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Output Section */}
          {currentExplanation && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">🧾 AI Output Section</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-blue-900">✅ English Explanation:</h3>
                    <button
                      onClick={() => playAudio(currentExplanation.english)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Play Audio"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-blue-800">{currentExplanation.english}</p>
                </div>

                {!selectedLanguage.includes('only') && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-green-900">✅ Local Language Translation:</h3>
                      <button
                        onClick={() => playAudio(currentExplanation.localLanguage)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Play Audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-green-800">{currentExplanation.localLanguage}</p>
                  </div>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-yellow-900 flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      ✨ Analogy / Visualization Aid:
                    </h3>
                    <button
                      onClick={() => playAudio(currentExplanation.analogy)}
                      className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                      title="Play Audio"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-yellow-800">{currentExplanation.analogy}</p>
                </div>
              </div>

              {/* Teacher Tools */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">🎛️ Teacher Tools</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handlePrint}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>📄 Print</span>
                  </button>
                  <button
                    onClick={() => playAudio(`${currentExplanation.english} ${currentExplanation.analogy}`)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>🎤 Play Audio</span>
                  </button>
                  <button
                    onClick={createWorksheet}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>✏️ Create Worksheet</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* History & Offline Access */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <History className="w-6 h-6 mr-2 text-blue-600" />
              📜 History
            </h2>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              {showHistory ? 'Hide' : 'Show'}
            </button>
          </div>

          {showHistory && (
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No history yet</p>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">
                        🕒 {item.timestamp.toLocaleString()}
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setCurrentExplanation(item)}
                          className="text-blue-600 hover:text-blue-700 text-xs"
                          title="Re-generate"
                        >
                          🔁
                        </button>
                        <button
                          onClick={() => setHistory(prev => prev.filter(h => h.id !== item.id))}
                          className="text-red-600 hover:text-red-700 text-xs"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">🔤 {item.prompt}</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{item.english}</p>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              <Globe className="w-4 h-4" />
              <span className="text-sm">📥 Save for Offline Viewing</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Smartboard;