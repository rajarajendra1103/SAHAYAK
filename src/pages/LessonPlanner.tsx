import React, { useState } from 'react';
import { Calendar, Clock, Play, Square, CheckCircle, ArrowRight, BookOpen, Edit3, Save, Target, Users, TrendingUp, Upload, FileText, Brain, Zap } from 'lucide-react';

interface Session {
  id: string;
  date: Date;
  startTime: string;
  endTime?: string;
  plannedContent: string;
  taughtContent?: string;
  status: 'in-progress' | 'completed';
}

interface Topic {
  id: string;
  subject: string;
  topicName: string;
  sessions: Session[];
  status: 'not-started' | 'in-progress' | 'completed';
  completedDate?: Date;
}

interface DocumentAnalysis {
  detectedSubjects: string[];
  suggestedTopics: string[];
  gradeLevel: string;
  keyTerms: string[];
  chapters: string[];
}

const LessonPlanner: React.FC = () => {
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [formData, setFormData] = useState({
    grade: '',
    subject: '',
    topicName: '',
    plannedContent: '',
    taughtContent: '',
    uploadedDocument: null as File | null
  });
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [documentAnalysis, setDocumentAnalysis] = useState<DocumentAnalysis | null>(null);
  const [topics, setTopics] = useState<Topic[]>([
    {
      id: '1',
      subject: 'EVS',
      topicName: 'Water Cycle',
      sessions: [
        {
          id: '1',
          date: new Date('2024-01-15'),
          startTime: '10:00 AM',
          endTime: '10:45 AM',
          plannedContent: 'Introduction to water cycle - evaporation and condensation',
          taughtContent: 'Covered evaporation with practical examples. Students understood the concept well.',
          status: 'completed'
        }
      ],
      status: 'in-progress'
    }
  ]);

  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
  const subjects = ['English', 'EVS', 'Life Skills', 'Computer', 'Math', 'Social Science', 'Kannada', 'Science', 'History', 'Geography'];

  // Simulate document analysis using AI
  const analyzeDocument = async (file: File) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      // Mock analysis based on filename and content simulation
      const fileName = file.name.toLowerCase();
      let analysis: DocumentAnalysis;

      if (fileName.includes('evs') || fileName.includes('environment')) {
        analysis = {
          detectedSubjects: ['EVS', 'Science'],
          suggestedTopics: ['Plants and Animals', 'Water Cycle', 'Our Environment', 'Natural Resources', 'Pollution'],
          gradeLevel: 'Grade 3-5',
          keyTerms: ['environment', 'plants', 'animals', 'water', 'air', 'soil'],
          chapters: ['Chapter 1: Our Environment', 'Chapter 2: Plants Around Us', 'Chapter 3: Water - A Precious Resource']
        };
      } else if (fileName.includes('math') || fileName.includes('mathematics')) {
        analysis = {
          detectedSubjects: ['Math', 'Mathematics'],
          suggestedTopics: ['Numbers', 'Addition and Subtraction', 'Multiplication', 'Shapes', 'Measurement'],
          gradeLevel: 'Grade 2-4',
          keyTerms: ['numbers', 'addition', 'subtraction', 'shapes', 'measurement'],
          chapters: ['Chapter 1: Numbers', 'Chapter 2: Basic Operations', 'Chapter 3: Geometry']
        };
      } else if (fileName.includes('english') || fileName.includes('language')) {
        analysis = {
          detectedSubjects: ['English', 'Language Arts'],
          suggestedTopics: ['Reading Comprehension', 'Grammar', 'Vocabulary', 'Writing Skills', 'Poetry'],
          gradeLevel: 'Grade 1-6',
          keyTerms: ['reading', 'writing', 'grammar', 'vocabulary', 'comprehension'],
          chapters: ['Chapter 1: Reading Skills', 'Chapter 2: Grammar Basics', 'Chapter 3: Creative Writing']
        };
      } else if (fileName.includes('kannada')) {
        analysis = {
          detectedSubjects: ['Kannada', 'Regional Language'],
          suggestedTopics: ['ಅಕ್ಷರ ಪರಿಚಯ', 'ಪದ ರಚನೆ', 'ವಾಕ್ಯ ರಚನೆ', 'ಕಥೆ ಓದುವಿಕೆ', 'ಕವಿತೆ'],
          gradeLevel: 'Grade 1-5',
          keyTerms: ['ಅಕ್ಷರ', 'ಪದ', 'ವಾಕ್ಯ', 'ಕಥೆ', 'ಕವಿತೆ'],
          chapters: ['ಅಧ್ಯಾಯ 1: ಅಕ್ಷರ ಪರಿಚಯ', 'ಅಧ್ಯಾಯ 2: ಪದ ರಚನೆ', 'ಅಧ್ಯಾಯ 3: ಸರಳ ವಾಕ್ಯಗಳು']
        };
      } else {
        analysis = {
          detectedSubjects: ['General'],
          suggestedTopics: ['Introduction', 'Basic Concepts', 'Practice Exercises', 'Review'],
          gradeLevel: 'Grade 1-10',
          keyTerms: ['learning', 'education', 'knowledge', 'skills'],
          chapters: ['Chapter 1: Introduction', 'Chapter 2: Main Content', 'Chapter 3: Summary']
        };
      }

      setDocumentAnalysis(analysis);
      
      // Auto-fill form with suggestions
      if (analysis.gradeLevel.includes('Grade')) {
        const gradeMatch = analysis.gradeLevel.match(/Grade (\d+)/);
        if (gradeMatch) {
          setFormData(prev => ({ ...prev, grade: `Grade ${gradeMatch[1]}` }));
        }
      }
      
      if (analysis.detectedSubjects.length > 0) {
        setFormData(prev => ({ ...prev, subject: analysis.detectedSubjects[0] }));
      }

      setIsAnalyzing(false);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (allowedTypes.includes(file.type)) {
        setFormData(prev => ({ ...prev, uploadedDocument: file }));
        analyzeDocument(file);
      } else {
        alert('Please select a valid document file (PDF, DOC, DOCX, TXT)');
      }
    }
  };

  const handleStartSession = () => {
    if (!formData.grade || !formData.subject || !formData.topicName || !formData.plannedContent) {
      alert('Please fill in all required fields');
      return;
    }

    const now = new Date();
    const newSession: Session = {
      id: Date.now().toString(),
      date: now,
      startTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      plannedContent: formData.plannedContent,
      status: 'in-progress'
    };

    let updatedTopic = currentTopic;
    if (!updatedTopic || updatedTopic.subject !== formData.subject || updatedTopic.topicName !== formData.topicName) {
      updatedTopic = {
        id: Date.now().toString(),
        subject: formData.subject,
        topicName: formData.topicName,
        sessions: [],
        status: 'in-progress'
      };
      setTopics(prev => [...prev, updatedTopic!]);
    }

    updatedTopic.sessions.push(newSession);
    setCurrentTopic(updatedTopic);
    setCurrentSession(newSession);
    setIsSessionActive(true);
    setFormData(prev => ({ ...prev, plannedContent: '', taughtContent: '' }));
  };

  const handleEndSession = () => {
    if (!currentSession || !formData.taughtContent) {
      alert('Please describe what you taught');
      return;
    }

    const updatedSession = {
      ...currentSession,
      endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      taughtContent: formData.taughtContent,
      status: 'completed' as const
    };

    setTopics(prev => prev.map(topic => 
      topic.id === currentTopic?.id 
        ? {
            ...topic,
            sessions: topic.sessions.map(session => 
              session.id === currentSession.id ? updatedSession : session
            )
          }
        : topic
    ));

    setIsSessionActive(false);
    setCurrentSession(null);
    setFormData(prev => ({ ...prev, taughtContent: '' }));
  };

  const handleCompleteTopic = () => {
    if (!currentTopic) return;

    const completedTopic = {
      ...currentTopic,
      status: 'completed' as const,
      completedDate: new Date()
    };

    setTopics(prev => prev.map(topic => 
      topic.id === currentTopic.id ? completedTopic : topic
    ));

    setCurrentTopic(null);
    setIsSessionActive(false);
    setCurrentSession(null);
    setFormData({ grade: '', subject: '', topicName: '', plannedContent: '', taughtContent: '', uploadedDocument: null });
    setDocumentAnalysis(null);
  };

  const handleContinueNextDay = () => {
    setIsSessionActive(false);
    setCurrentSession(null);
    setFormData(prev => ({ ...prev, plannedContent: '', taughtContent: '' }));
  };

  // Calculate statistics
  const totalSessions = topics.reduce((sum, topic) => sum + topic.sessions.length, 0);
  const completedTopics = topics.filter(topic => topic.status === 'completed').length;
  const activeSessions = topics.filter(topic => topic.status === 'in-progress').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            📅 Lesson Planner – SAHAYAK
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-blue-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Plan, track, and manage your teaching sessions with intelligent document analysis
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900">{totalSessions}</p>
                <p className="text-xs text-gray-500 mt-1">Teaching sessions</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed Topics</p>
                <p className="text-3xl font-bold text-green-600">{completedTopics}</p>
                <p className="text-xs text-gray-500 mt-1">Finished topics</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Sessions</p>
                <p className="text-3xl font-bold text-orange-600">{activeSessions}</p>
                <p className="text-xs text-gray-500 mt-1">In progress</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column - Setup & Controls */}
          <div className="space-y-8">
            {/* Smart Topic Setup */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-blue-600" />
                🧠 Smart Topic Setup
              </h2>
              
              <div className="space-y-6">
                {/* Document Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📄 Upload Document (Optional - for AI suggestions)
                  </label>
                  <div className="relative">
                    <label className="flex items-center justify-center w-full px-4 py-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer hover:from-blue-100 hover:to-purple-100 transition-all duration-200">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-blue-700 font-medium">
                          {formData.uploadedDocument ? formData.uploadedDocument.name : 'Upload syllabus, textbook, or lesson plan'}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">PDF, DOC, DOCX, TXT</p>
                      </div>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.txt"
                        className="hidden"
                      />
                    </label>
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-blue-700 font-medium">Analyzing document...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Analysis Results */}
                {documentAnalysis && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      🤖 AI Document Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold text-green-800 mb-1">Detected Grade Level:</p>
                        <p className="text-green-700">{documentAnalysis.gradeLevel}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-green-800 mb-1">Suggested Subjects:</p>
                        <div className="flex flex-wrap gap-1">
                          {documentAnalysis.detectedSubjects.map((subject, index) => (
                            <span key={index} className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <p className="font-semibold text-green-800 mb-2">Suggested Topics:</p>
                        <div className="flex flex-wrap gap-2">
                          {documentAnalysis.suggestedTopics.map((topic, index) => (
                            <button
                              key={index}
                              onClick={() => setFormData(prev => ({ ...prev, topicName: topic }))}
                              className="px-3 py-1 bg-white border border-green-300 text-green-800 rounded-lg text-sm hover:bg-green-100 transition-colors"
                            >
                              {topic}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Grade Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📘 Grade
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">Select Grade</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📚 Subject
                  </label>
                  <input
                    type="text"
                    list="subjects"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Type or select subject"
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                  <datalist id="subjects">
                    {subjects.map(subject => (
                      <option key={subject} value={subject} />
                    ))}
                    {documentAnalysis?.detectedSubjects.map(subject => (
                      <option key={subject} value={subject} />
                    ))}
                  </datalist>
                </div>

                {/* Topic */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📝 Topic
                  </label>
                  <input
                    type="text"
                    list="topics"
                    value={formData.topicName}
                    onChange={(e) => setFormData(prev => ({ ...prev, topicName: e.target.value }))}
                    placeholder="Type or select from suggestions"
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                  <datalist id="topics">
                    {documentAnalysis?.suggestedTopics.map(topic => (
                      <option key={topic} value={topic} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Class Flow Manager */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <Play className="w-6 h-6 mr-3 text-green-600" />
                ✅ Class Flow Manager
              </h2>

              {!isSessionActive ? (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">START SESSION</h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      What will you teach today?
                    </label>
                    <textarea
                      value={formData.plannedContent}
                      onChange={(e) => setFormData(prev => ({ ...prev, plannedContent: e.target.value }))}
                      placeholder="Describe your lesson plan..."
                      rows={4}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                    />
                  </div>
                  <button
                    onClick={handleStartSession}
                    className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg text-lg font-semibold"
                  >
                    <Play className="w-6 h-6" />
                    <span>🟢 START CLASS</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <Clock className="w-6 h-6 text-green-600" />
                      <span className="text-lg font-semibold text-green-800">
                        Session Active - {currentSession?.startTime}
                      </span>
                    </div>
                    <p className="text-green-700 leading-relaxed">
                      {currentSession?.plannedContent}
                    </p>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800">END SESSION</h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      What did you teach?
                    </label>
                    <textarea
                      value={formData.taughtContent}
                      onChange={(e) => setFormData(prev => ({ ...prev, taughtContent: e.target.value }))}
                      placeholder="Describe what was actually covered..."
                      rows={4}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                    />
                  </div>
                  <button
                    onClick={handleEndSession}
                    className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg text-lg font-semibold"
                  >
                    <Square className="w-6 h-6" />
                    <span>🔴 END CLASS</span>
                  </button>
                </div>
              )}
            </div>

            {/* Session Continuation Controls */}
            {currentTopic && !isSessionActive && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <ArrowRight className="w-6 h-6 mr-3 text-purple-600" />
                  🔁 Session Continuation Controls
                </h2>
                <div className="space-y-4">
                  <button
                    onClick={handleContinueNextDay}
                    className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg text-lg font-semibold"
                  >
                    <ArrowRight className="w-6 h-6" />
                    <span>🔄 Next Day ➝ Continue</span>
                  </button>
                  <button
                    onClick={handleCompleteTopic}
                    className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg text-lg font-semibold"
                  >
                    <CheckCircle className="w-6 h-6" />
                    <span>✅ Topic Complete ➝ End Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Logs & History */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Edit3 className="w-6 h-6 mr-3 text-purple-600" />
              📚 Logs & History
            </h2>

            {topics.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Calendar className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <p className="text-xl font-medium mb-2">No lessons planned yet</p>
                <p className="text-gray-400">Start your first session to see history here</p>
              </div>
            ) : (
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {topics.map((topic) => (
                  <div key={topic.id} className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {topic.subject} - {topic.topicName}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          topic.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : topic.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {topic.status === 'completed' && '✓ '}
                          {topic.status.replace('-', ' ')}
                          {topic.completedDate && ` on ${topic.completedDate.toLocaleDateString()}`}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {topic.sessions.map((session) => (
                        <div key={session.id} className="bg-white rounded-xl p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">
                              📅 {session.date.toLocaleDateString()} - {session.startTime}
                              {session.endTime && ` to ${session.endTime}`}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              session.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {session.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-2">
                            <p><span className="font-semibold">Planned:</span> {session.plannedContent}</p>
                            {session.taughtContent && (
                              <p><span className="font-semibold">Taught:</span> {session.taughtContent}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanner;