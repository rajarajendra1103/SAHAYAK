import React, { useState } from 'react';
import { BookOpen, Globe, Target, FileText, Download, Printer, Share2, Zap, Lightbulb, Heart } from 'lucide-react';

interface GeneratedContent {
  id: string;
  type: string;
  prompt: string;
  learningOutcome: string;
  language: string;
  englishVersion: string;
  localVersion: string;
  vocabularyLevel: string;
  subjectDetected: string;
  timestamp: Date;
}

const StoryGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    contentType: 'story',
    prompt: '',
    learningOutcome: '',
    language: 'bilingual'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const contentTypes = [
    { value: 'story', label: 'Story', icon: '📖', description: 'Narrative with characters and plot' },
    { value: 'poem', label: 'Poem', icon: '🎵', description: 'Rhythmic verses with rhyme' },
    { value: 'letter', label: 'Story as Letter', icon: '✉️', description: 'Story told through letters' },
    { value: 'conversation', label: 'Story as Conversation', icon: '💬', description: 'Dialogue-based narrative' },
    { value: 'diary', label: 'Story as Diary Entry', icon: '📔', description: 'Personal journal format' },
    { value: 'others', label: 'Others', icon: '📝', description: 'Custom format' }
  ];

  const languages = [
    { value: 'english', label: 'English Only', flag: '🇺🇸' },
    { value: 'local', label: 'Local Language Only', flag: '🇮🇳' },
    { value: 'bilingual', label: 'Bilingual (English + Local)', flag: '🌐' },
    { value: 'auto-detect', label: 'Auto-detect Language', flag: '🤖' }
  ];

  const generateContent = () => {
    if (!formData.prompt.trim() || !formData.learningOutcome.trim()) {
      alert('Please fill in both the prompt and learning outcome fields');
      return;
    }

    setIsGenerating(true);

    // Simulate content generation
    setTimeout(() => {
      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        type: formData.contentType,
        prompt: formData.prompt,
        learningOutcome: formData.learningOutcome,
        language: formData.language,
        englishVersion: generateEnglishContent(),
        localVersion: generateLocalContent(),
        vocabularyLevel: 'Grade 4',
        subjectDetected: detectSubject(formData.prompt),
        timestamp: new Date()
      };

      setGeneratedContent(newContent);
      setIsGenerating(false);
    }, 3000);
  };

  const generateEnglishContent = (): string => {
    const contentType = formData.contentType;
    const prompt = formData.prompt;

    switch (contentType) {
      case 'story':
        return `Once upon a time in a small village, there lived a kind boy named Raju. ${prompt.includes('kindness') ? 'He was known throughout the village for his helpful nature and caring heart.' : 'He learned an important lesson about life.'} One day, he discovered the true meaning of ${formData.learningOutcome.toLowerCase()}. Through his journey, he realized that small acts of kindness can make a big difference in the world. The villagers were inspired by his actions and began to follow his example. From that day forward, the village became a happier and more caring place for everyone.`;
      
      case 'poem':
        return `🌟 A Little Light of Kindness 🌟\n\nIn a world so big and wide,\nWhere people live side by side,\nA little act of kindness bright,\nCan fill the world with golden light.\n\nShare a smile, lend a hand,\nHelp others when they cannot stand,\nFor kindness is a gift so free,\nThat makes the world a joy to see.`;
      
      case 'letter':
        return `Dear Friend,\n\nI hope this letter finds you well. I wanted to share with you an amazing story about ${formData.prompt}. Yesterday, I witnessed something that taught me about ${formData.learningOutcome}.\n\nIt made me realize how important it is to be kind and helpful to others. I hope this story inspires you as much as it inspired me.\n\nWith warm regards,\nYour friend`;
      
      case 'conversation':
        return `Teacher: "Good morning, children! Today let's talk about ${formData.prompt}."\n\nStudent 1: "What does that mean, teacher?"\n\nTeacher: "It means ${formData.learningOutcome}. Can anyone give me an example?"\n\nStudent 2: "When we help our friends, that's being kind!"\n\nTeacher: "Excellent! And how does it make you feel when someone is kind to you?"\n\nStudent 1: "It makes me happy and want to be kind to others too!"`;
      
      case 'diary':
        return `Dear Diary,\n\nToday was a special day. I learned something important about ${formData.prompt}. In the morning, I saw how ${formData.learningOutcome} can change everything.\n\nIt started when I decided to help my neighbor carry her heavy bags. Her smile made me realize that small acts of kindness create ripples of happiness. I felt so good inside that I decided to help more people throughout the day.\n\nI'm going to remember this lesson forever.\n\nGoodnight,\n[Student's name]`;
      
      default:
        return `This is a wonderful story about ${formData.prompt}. The main lesson we learn is about ${formData.learningOutcome}. Through this tale, we understand the importance of being good to one another and making positive choices in our daily lives.`;
    }
  };

  const generateLocalContent = (): string => {
    // Simulated local language content (Kannada example)
    return `ಒಂದು ಸಣ್ಣ ಹಳ್ಳಿಯಲ್ಲಿ ರಾಜು ಎಂಬ ಒಳ್ಳೆಯ ಹುಡುಗ ವಾಸಿಸುತ್ತಿದ್ದ. ಅವನು ತನ್ನ ದಯೆ ಮತ್ತು ಸಹಾಯದ ಸ್ವಭಾವಕ್ಕೆ ಹೆಸರುವಾಸಿಯಾಗಿದ್ದ. ಒಂದು ದಿನ ಅವನು ${formData.learningOutcome} ಬಗ್ಗೆ ಮಹತ್ವದ ಪಾಠವನ್ನು ಕಲಿತ. ಅವನ ಕಾರ್ಯಗಳಿಂದ ಪ್ರೇರಿತರಾದ ಹಳ್ಳಿಗರು ಅವನ ಉದಾಹರಣೆಯನ್ನು ಅನುಸರಿಸಲು ಪ್ರಾರಂಭಿಸಿದರು.`;
  };

  const detectSubject = (prompt: string): string => {
    const keywords = {
      'Life Skills': ['kindness', 'helping', 'friendship', 'sharing', 'caring'],
      'EVS': ['environment', 'nature', 'animals', 'plants', 'water'],
      'English': ['story', 'reading', 'writing', 'communication'],
      'Math': ['counting', 'numbers', 'shapes', 'measurement'],
      'Science': ['experiment', 'discovery', 'observation', 'learning']
    };

    for (const [subject, words] of Object.entries(keywords)) {
      if (words.some(word => prompt.toLowerCase().includes(word))) {
        return subject;
      }
    }
    return 'General';
  };

  const handlePrint = () => {
    if (generatedContent) {
      const printContent = `
        <h1>${formData.contentType.charAt(0).toUpperCase() + formData.contentType.slice(1)}</h1>
        <h2>English Version:</h2>
        <p>${generatedContent.englishVersion}</p>
        ${formData.language !== 'english' ? `<h2>Local Language Version:</h2><p>${generatedContent.localVersion}</p>` : ''}
        <h2>Learning Outcome:</h2>
        <p>${generatedContent.learningOutcome}</p>
      `;
      const printWindow = window.open('', '_blank');
      printWindow?.document.write(`
        <html>
          <head><title>Generated ${formData.contentType}</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">${printContent}</body>
        </html>
      `);
      printWindow?.print();
    }
  };

  const handleSavePDF = () => {
    alert('PDF saved successfully!');
  };

  const handleShare = () => {
    alert('Content shared successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📝 Story Generator
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-600 to-purple-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create engaging educational stories with AI-powered content generation
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-3 text-yellow-500" />
              🧩 CONTENT GENERATOR
            </h2>
            
            {/* Step 1: Content Type */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">📚 Step 1: Select Content Type</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contentTypes.map((type) => (
                  <label key={type.value} className={`group flex flex-col p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                    formData.contentType === type.value
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value={type.value}
                      checked={formData.contentType === type.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, contentType: e.target.value }))}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{type.icon}</span>
                      <span className="font-semibold text-gray-900">{type.label}</span>
                    </div>
                    <span className="text-sm text-gray-600">{type.description}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 2: Enter Details */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">✍️ Step 2: Enter Details</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📝 Prompt Box
                  </label>
                  <textarea
                    value={formData.prompt}
                    onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                    placeholder="Write a story about kindness in a village"
                    rows={4}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    🎯 Learning Outcome
                  </label>
                  <input
                    type="text"
                    value={formData.learningOutcome}
                    onChange={(e) => setFormData(prev => ({ ...prev, learningOutcome: e.target.value }))}
                    placeholder="Students will understand the value of helping others and being empathetic."
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-2">Mandatory to guide content tone and purpose</p>
                </div>
              </div>
            </div>

            {/* Language Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                🌐 Language Selection
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {languages.map(lang => (
                  <label key={lang.value} className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    formData.language === lang.value
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value={lang.value}
                      checked={formData.language === lang.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium text-gray-900">{lang.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateContent}
              disabled={isGenerating}
              className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:from-pink-700 hover:to-purple-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg text-lg font-semibold"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6" />
                  <span>🎯 GENERATE CONTENT</span>
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Heart className="w-6 h-6 mr-3 text-red-500" />
              📄 OUTPUT BLOCK
            </h2>
            
            {!generatedContent ? (
              <div className="text-center py-16 text-gray-500">
                <BookOpen className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <p className="text-xl font-medium mb-2">Generate content to see the output</p>
                <p className="text-gray-400">Fill in the details and click generate</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* English Version */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-4">📘 English Version:</h3>
                  <div className="text-blue-800 whitespace-pre-line leading-relaxed">
                    {generatedContent.englishVersion}
                  </div>
                </div>

                {/* Local Language Version */}
                {formData.language !== 'english' && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-green-900 mb-4">🌱 Local Language Version:</h3>
                    <div className="text-green-800 whitespace-pre-line leading-relaxed">
                      {generatedContent.localVersion}
                    </div>
                  </div>
                )}

                {/* Learning Metadata */}
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-yellow-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    🎓 Learning Metadata Summary
                  </h3>
                  <div className="space-y-3 text-yellow-800">
                    <p><span className="font-semibold">Vocabulary Level:</span> {generatedContent.vocabularyLevel}</p>
                    <p><span className="font-semibold">Subject Detected:</span> {generatedContent.subjectDetected}</p>
                    <p><span className="font-semibold">Linked Learning Outcome:</span> {generatedContent.learningOutcome}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">⚙️ Actions</h3>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={handlePrint}
                      className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors shadow-lg"
                    >
                      <Printer className="w-5 h-5" />
                      <span>📄 Print</span>
                    </button>
                    <button
                      onClick={handleSavePDF}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg"
                    >
                      <Download className="w-5 h-5" />
                      <span>📥 Save as PDF</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>📤 Share via WhatsApp / Google Drive</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryGenerator;