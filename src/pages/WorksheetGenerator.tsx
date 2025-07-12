import React, { useState } from 'react';
import { FileText, Upload, Download, Printer, Share2, Image as ImageIcon, CheckCircle, Zap, BookOpen, Target } from 'lucide-react';

interface WorksheetSection {
  id: string;
  title: string;
  content: string[];
  color: string;
  icon: string;
}

const WorksheetGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    grade: '',
    subject: '',
    topic: '',
    uploadedFile: null as File | null,
    uploadedImage: null as File | null
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [worksheet, setWorksheet] = useState<WorksheetSection[] | null>(null);

  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
  const subjects = ['English', 'EVS', 'Life Skills', 'Computer', 'Math', 'Social Science', 'Kannada', 'Science'];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'topic' | 'image') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'topic') {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedTypes.includes(file.type)) {
          setFormData(prev => ({ ...prev, uploadedFile: file }));
        } else {
          alert('Please select a valid document file (PDF, DOC, DOCX)');
        }
      } else {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
        if (allowedTypes.includes(file.type)) {
          setFormData(prev => ({ ...prev, uploadedImage: file }));
        } else {
          alert('Please select a valid image file (JPG, PNG, SVG)');
        }
      }
    }
  };

  const generateWorksheet = () => {
    if (!formData.grade || !formData.subject || !formData.topic) {
      alert('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);

    // Simulate worksheet generation
    setTimeout(() => {
      const generatedWorksheet: WorksheetSection[] = [
        {
          id: '1',
          title: 'Vocabulary Matching',
          color: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200',
          icon: '🟩',
          content: [
            'Match the English words with their meanings:',
            '1. Water - Essential liquid for life',
            '2. Tree - Large plant with trunk and branches',
            '3. Sun - Star that gives us light and heat',
            '4. Moon - Earth\'s natural satellite'
          ]
        },
        {
          id: '2',
          title: 'Fill in the Blanks',
          color: 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200',
          icon: '🟨',
          content: [
            'Complete the sentences:',
            '1. Plants need _______ and sunlight to grow.',
            '2. The _______ gives us light during the day.',
            '3. We should _______ water and not waste it.',
            '4. Trees give us fresh _______ to breathe.'
          ]
        },
        {
          id: '3',
          title: 'Label the Diagram',
          color: 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200',
          icon: '🟦',
          content: formData.uploadedImage 
            ? ['Label the parts of the diagram:', '[Uploaded image would appear here]', 'Add labels for: roots, stem, leaves, flowers']
            : ['Draw and label a simple plant:', '• Roots', '• Stem', '• Leaves', '• Flowers']
        },
        {
          id: '4',
          title: 'Short Answer / MCQs',
          color: 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200',
          icon: '🟥',
          content: [
            'Answer the following questions:',
            '1. Why are plants important for us? (2 marks)',
            '2. Multiple Choice: What do plants need to make food?',
            '   a) Only water   b) Only sunlight   c) Water and sunlight   d) Only soil',
            '3. Name two things we get from trees. (2 marks)'
          ]
        }
      ];

      setWorksheet(generatedWorksheet);
      setIsGenerating(false);
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSavePDF = () => {
    alert('PDF saved successfully!');
  };

  const handleShare = () => {
    alert('Worksheet shared successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📄 Worksheet Generator
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create engaging, customized worksheets with AI-powered content generation
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Target className="w-6 h-6 mr-3 text-blue-600" />
              🏫 Input Panel
            </h2>
            
            <div className="space-y-8">
              {/* Grade Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  📘 Grade Selector
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Select Grade ▼</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>

              {/* Subject Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  📚 Subject Input
                </label>
                <input
                  type="text"
                  list="subjects"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Type to search subjects..."
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <datalist id="subjects">
                  {subjects.map(subject => (
                    <option key={subject} value={subject} />
                  ))}
                </datalist>
              </div>

              {/* Topic Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  📝 Topic Input / Upload
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="Enter topic or upload file below"
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 mb-4"
                />
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors">
                    <Upload className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-700 font-medium">📤 Upload Topic File</span>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, 'topic')}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                  </label>
                  {formData.uploadedFile && (
                    <span className="text-sm text-gray-600 font-medium">{formData.uploadedFile.name}</span>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  🖼️ Upload Image (Optional – for diagrams)
                </label>
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <ImageIcon className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700 font-medium">Choose File</span>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, 'image')}
                      accept=".jpg,.jpeg,.png,.svg"
                      className="hidden"
                    />
                  </label>
                  {formData.uploadedImage && (
                    <span className="text-sm text-gray-600 font-medium">{formData.uploadedImage.name}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">Supported formats: JPG, PNG, SVG</p>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateWorksheet}
                disabled={isGenerating}
                className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg text-lg font-semibold"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6" />
                    <span>🎯 GENERATE WORKSHEET</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Worksheet */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-purple-600" />
              📄 Generated Worksheet
            </h2>
            
            {!worksheet ? (
              <div className="text-center py-16 text-gray-500">
                <FileText className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <p className="text-xl font-medium mb-2">Generate a worksheet to see the preview</p>
                <p className="text-gray-400">Fill in the details and click generate</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Worksheet Header */}
                <div className="text-center border-b border-gray-200 pb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {formData.subject} - {formData.topic}
                  </h3>
                  <p className="text-lg text-gray-600 mb-3">{formData.grade}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Name: _________________________</span>
                    <span>Date: _____________</span>
                    <span>Roll No: _______</span>
                  </div>
                </div>

                {/* Worksheet Sections */}
                <div className="space-y-6">
                  {worksheet.map((section) => (
                    <div key={section.id} className={`border rounded-2xl p-6 ${section.color} shadow-sm`}>
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">{section.icon}</span>
                        {section.title}
                      </h4>
                      <div className="space-y-3">
                        {section.content.map((item, index) => (
                          <p key={index} className="text-gray-700 leading-relaxed">{item}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={handlePrint}
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors shadow-lg"
                  >
                    <Printer className="w-5 h-5" />
                    <span>🖨️ Print</span>
                  </button>
                  <button
                    onClick={handleSavePDF}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg"
                  >
                    <Download className="w-5 h-5" />
                    <span>💾 Save PDF</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>📤 Share</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorksheetGenerator;