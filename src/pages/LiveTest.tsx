import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Volume2, RotateCcw, CheckCircle, XCircle, Download, Share2, Users, Target, Clock, Award, Zap, Headphones, Mic, MicOff, Upload, FileText } from 'lucide-react';

interface TestResult {
  id: string;
  timestamp: Date;
  student: string;
  section: 'A' | 'B';
  questionType: 'fill-blank' | 'mcq' | 'match-pairs' | 'spelling';
  question: string;
  correctAnswer: string;
  studentAnswer: string;
  isCorrect: boolean;
  duration: number;
}

interface Question {
  id: string;
  type: 'fill-blank' | 'mcq' | 'match-pairs';
  question: string;
  answer: string;
  options?: string[];
  category?: string;
}

interface TestSetup {
  testType: 'section-a' | 'section-b';
  grade: string;
  subject: string;
  topic: string;
  wordList?: File;
}

const LiveTest: React.FC = () => {
  const [testSetup, setTestSetup] = useState<TestSetup>({
    testType: 'section-a',
    grade: '',
    subject: '',
    topic: '',
    wordList: undefined
  });
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('The animal that gives us milk is a ______.');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('cow');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentStudent, setCurrentStudent] = useState('');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState<'A' | 'B'>('A');
  const [results, setResults] = useState<TestResult[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recordingStartTime = useRef<number>(0);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);
  const animationFrame = useRef<number>(0);

  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
  const subjects = ['English', 'EVS', 'Life Skills', 'Computer', 'Math', 'Social Science', 'Kannada', 'Science'];

  const languages = [
    { value: 'english', label: 'English', flag: '🇺🇸', gradient: 'from-blue-500 to-blue-600' },
    { value: 'english-kannada', label: 'English + Kannada', flag: '🇮🇳', gradient: 'from-orange-500 to-orange-600' },
    { value: 'english-hindi', label: 'English + Hindi', flag: '🇮🇳', gradient: 'from-green-500 to-green-600' },
    { value: 'english-telugu', label: 'English + Telugu', flag: '🇮🇳', gradient: 'from-purple-500 to-purple-600' }
  ];

  const sectionAQuestions: Question[] = [
    {
      id: '1',
      type: 'fill-blank',
      question: 'The animal that gives us milk is a ______.',
      answer: 'cow',
      category: 'Animals'
    },
    {
      id: '2',
      type: 'mcq',
      question: 'Which one is a domestic animal?',
      answer: 'B. Cow',
      options: ['A. Lion', 'B. Cow', 'C. Tiger', 'D. Wolf'],
      category: 'Animals'
    },
    {
      id: '3',
      type: 'match-pairs',
      question: 'Match: Fruit with Mango',
      answer: '1 with A',
      category: 'Food'
    },
    {
      id: '4',
      type: 'fill-blank',
      question: 'The sun rises in the ______.',
      answer: 'east',
      category: 'Geography'
    }
  ];

  const sectionBWords = ['cat', 'dog', 'book', 'water', 'school', 'happy', 'friend', 'house'];

  // Cleanup function
  useEffect(() => {
    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const updateAudioLevel = () => {
    if (analyserRef.current && isRecording) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      setAudioLevel(Math.min(100, (average / 255) * 100));
      
      animationFrame.current = requestAnimationFrame(updateAudioLevel);
    }
  };

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Voice recording is not supported in this browser. Please use a modern browser like Chrome or Firefox.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        source.connect(analyserRef.current);
      } catch (e) {
        console.warn('Audio visualization not available:', e);
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setIsProcessing(true);
        
        setTimeout(() => {
          const simulatedAnswer = currentSection === 'B' 
            ? correctAnswer.split('').join('-').toUpperCase()
            : Math.random() > 0.3 ? correctAnswer : 'incorrect answer';
          
          setStudentAnswer(simulatedAnswer);
          checkAnswer(simulatedAnswer);
          setIsProcessing(false);
        }, 1500);
      };

      mediaRecorder.start();
      setIsRecording(true);
      recordingStartTime.current = Date.now();
      setRecordingDuration(0);
      
      durationInterval.current = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - recordingStartTime.current) / 1000));
      }, 1000);

      updateAudioLevel();
      
      setTimeout(() => {
        if (currentSection === 'B') {
          speakText(`Spell the word: ${currentQuestion}`);
        } else {
          speakText(currentQuestion);
        }
      }, 500);

    } catch (error) {
      console.error('Microphone access error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'NotFoundError') {
          alert('No microphone found. Please check that a microphone is connected and enabled in your system settings, then try again.');
        } else if (error.name === 'NotAllowedError') {
          alert('Microphone access denied. Please allow microphone access in your browser settings and try again.');
        } else if (error.name === 'NotReadableError') {
          alert('Microphone is already in use by another application. Please close other applications using the microphone and try again.');
        } else if (error.name === 'OverconstrainedError') {
          alert('Microphone constraints could not be satisfied. Please try with a different microphone or check your audio settings.');
        } else {
          alert(`Microphone error: ${error.message}. Please check your microphone settings and try again.`);
        }
      } else {
        alert('An unknown microphone error occurred. Please check your microphone settings and try again.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setAudioLevel(0);
      
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
      }
      
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      if (selectedLanguage.includes('kannada')) {
        utterance.lang = 'kn-IN';
      } else if (selectedLanguage.includes('hindi')) {
        utterance.lang = 'hi-IN';
      } else if (selectedLanguage.includes('telugu')) {
        utterance.lang = 'te-IN';
      } else {
        utterance.lang = 'en-US';
      }
      
      speechSynthesis.speak(utterance);
    } else {
      console.warn('Text-to-speech not supported in this browser');
    }
  };

  const checkAnswer = (answer: string) => {
    const normalizedAnswer = answer.toLowerCase().trim();
    const normalizedCorrect = correctAnswer.toLowerCase().trim();
    
    let correct = false;
    if (currentSection === 'B') {
      const answerLetters = normalizedAnswer.replace(/[-\s]/g, '');
      const correctLetters = normalizedCorrect.replace(/[-\s]/g, '');
      correct = answerLetters === correctLetters;
    } else {
      const synonyms: { [key: string]: string[] } = {
        'cow': ['cow', 'cattle', 'bull'],
        'east': ['east', 'eastern'],
        'b. cow': ['b', 'cow', 'option b', 'b. cow'],
        '1 with a': ['1 with a', '1a', 'one with a']
      };
      
      const acceptableAnswers = synonyms[normalizedCorrect] || [normalizedCorrect];
      correct = acceptableAnswers.some(acceptable => 
        normalizedAnswer === acceptable || 
        normalizedAnswer.includes(acceptable) ||
        acceptable.includes(normalizedAnswer)
      );
    }

    setIsCorrect(correct);
    setShowResult(true);

    setTimeout(() => {
      if (correct) {
        speakText('Correct! Great job.');
      } else {
        if (currentSection === 'B') {
          speakText(`Try again. The correct spelling is ${correctAnswer.split('').join('-').toUpperCase()}.`);
        } else {
          speakText(`Try again. The correct answer is ${correctAnswer}.`);
        }
      }
    }, 500);
  };

  const submitAnswer = () => {
    if (!currentStudent.trim()) {
      alert('Please enter student name');
      return;
    }

    const duration = recordingDuration;
    const newResult: TestResult = {
      id: Date.now().toString(),
      timestamp: new Date(),
      student: currentStudent,
      section: currentSection,
      questionType: currentSection === 'B' ? 'spelling' : sectionAQuestions[currentQuestionIndex]?.type || 'fill-blank',
      question: currentSection === 'B' ? `Spell: "${currentQuestion}"` : currentQuestion,
      correctAnswer: correctAnswer,
      studentAnswer: studentAnswer,
      isCorrect: isCorrect,
      duration: duration
    };

    setResults(prev => [newResult, ...prev]);
    
    loadNextQuestion();
    
    setShowResult(false);
    setStudentAnswer('');
    setRecordingDuration(0);
  };

  const loadNextQuestion = () => {
    if (currentSection === 'A') {
      const nextIndex = (currentQuestionIndex + 1) % sectionAQuestions.length;
      setCurrentQuestionIndex(nextIndex);
      
      const nextQuestion = sectionAQuestions[nextIndex];
      setCurrentQuestion(nextQuestion.question);
      setCorrectAnswer(nextQuestion.answer);
    } else {
      const nextIndex = (currentQuestionIndex + 1) % sectionBWords.length;
      setCurrentQuestionIndex(nextIndex);
      
      const nextWord = sectionBWords[nextIndex];
      setCurrentQuestion(nextWord);
      setCorrectAnswer(nextWord);
    }
  };

  const retakeRecording = () => {
    setShowResult(false);
    setStudentAnswer('');
    setRecordingDuration(0);
  };

  const downloadResults = () => {
    const csvContent = [
      ['Time', 'Student', 'Section', 'Question Type', 'Prompt/Word', 'Response', 'Result', 'Duration (s)'].join(','),
      ...results.map(result => [
        result.timestamp.toLocaleString(),
        result.student,
        `Section ${result.section}`,
        result.questionType,
        `"${result.question}"`,
        result.studentAnswer,
        result.isCorrect ? 'Correct' : 'Incorrect',
        result.duration.toString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `live-test-results-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Live Test Results',
          text: `Live test completed with ${results.length} attempts`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      if (navigator.clipboard) {
        const shareText = `Live Test Results:\n${results.length} total attempts\nAccuracy: ${Math.round((results.filter(r => r.isCorrect).length / results.length) * 100)}%`;
        await navigator.clipboard.writeText(shareText);
        alert('Results copied to clipboard!');
      } else {
        alert('Sharing not supported in this browser');
      }
    }
  };

  const startTest = () => {
    if (!testSetup.grade || !testSetup.subject || !testSetup.topic) {
      alert('Please fill in all required fields');
      return;
    }

    if (testSetup.testType === 'section-b' && !testSetup.wordList) {
      alert('Please upload a word list for Section B (Spelling Quiz)');
      return;
    }

    setCurrentSection(testSetup.testType === 'section-a' ? 'A' : 'B');
    setIsTestStarted(true);
    
    if (testSetup.testType === 'section-a') {
      setCurrentQuestion(sectionAQuestions[0].question);
      setCorrectAnswer(sectionAQuestions[0].answer);
    } else {
      setCurrentQuestion(sectionBWords[0]);
      setCorrectAnswer(sectionBWords[0]);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['text/csv', 'text/plain'];
      if (allowedTypes.includes(file.type)) {
        setTestSetup(prev => ({ ...prev, wordList: file }));
      } else {
        alert('Please select a valid CSV or TXT file');
        event.target.value = '';
      }
    }
  };

  // Calculate statistics
  const totalTests = results.length;
  const correctAnswers = results.filter(r => r.isCorrect).length;
  const accuracy = totalTests > 0 ? Math.round((correctAnswers / totalTests) * 100) : 0;
  const averageDuration = totalTests > 0 ? (results.reduce((sum, r) => sum + r.duration, 0) / totalTests).toFixed(1) : '0';

  if (!isTestStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              🎤 SAHAYAK – Live Test Module
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dual-mode voice-based assessment tool for comprehensive student evaluation
            </p>
          </div>

          {/* Test Setup Panel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-blue-600" />
              🔧 Test Setup Panel
            </h2>

            <div className="space-y-6">
              {/* Test Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Test Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`relative flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    testSetup.testType === 'section-a' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="section-a"
                      checked={testSetup.testType === 'section-a'}
                      onChange={(e) => setTestSetup(prev => ({ ...prev, testType: e.target.value as 'section-a' }))}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        testSetup.testType === 'section-a' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}>
                        {testSetup.testType === 'section-a' && <div className="w-3 h-3 bg-white rounded-full" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Section A – Q&A</p>
                        <p className="text-sm text-gray-600">Text Question → Spoken Answer</p>
                        <p className="text-xs text-gray-500 mt-1">Fill blanks, MCQs, Match pairs</p>
                      </div>
                    </div>
                  </label>
                  
                  <label className={`relative flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    testSetup.testType === 'section-b' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="section-b"
                      checked={testSetup.testType === 'section-b'}
                      onChange={(e) => setTestSetup(prev => ({ ...prev, testType: e.target.value as 'section-b' }))}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        testSetup.testType === 'section-b' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                      }`}>
                        {testSetup.testType === 'section-b' && <div className="w-3 h-3 bg-white rounded-full" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Section B – Spelling</p>
                        <p className="text-sm text-gray-600">Spoken Question → Spelling Answer</p>
                        <p className="text-xs text-gray-500 mt-1">English-only spelling quiz</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Grade, Subject, Topic */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Grade
                  </label>
                  <select
                    value={testSetup.grade}
                    onChange={(e) => setTestSetup(prev => ({ ...prev, grade: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Grade 1 – 10</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    list="subjects"
                    value={testSetup.subject}
                    onChange={(e) => setTestSetup(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="e.g., English, EVS, Math"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <datalist id="subjects">
                    {subjects.map(subject => (
                      <option key={subject} value={subject} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Topic
                  </label>
                  <input
                    type="text"
                    value={testSetup.topic}
                    onChange={(e) => setTestSetup(prev => ({ ...prev, topic: e.target.value }))}
                    placeholder="Type or select from uploaded syllabus"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Word List Upload for Section B */}
              {testSetup.testType === 'section-b' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Word List (Section B only)
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl cursor-pointer hover:bg-purple-100 transition-colors">
                      <Upload className="w-5 h-5 text-purple-600" />
                      <span className="text-purple-700 font-medium">📂 Upload .csv / .txt</span>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".csv,.txt"
                        className="hidden"
                      />
                    </label>
                    {testSetup.wordList && (
                      <span className="text-sm text-gray-600">
                        {testSetup.wordList.name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">One word per line</p>
                </div>
              )}

              {/* Start Test Button */}
              <button
                onClick={startTest}
                className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg text-lg font-semibold"
              >
                <Play className="w-6 h-6" />
                <span>🎬 Start Test</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🎤 Live Test – Section {currentSection}: {currentSection === 'A' ? 'Q&A' : 'Spelling'}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {currentSection === 'A' ? 'Text Question → Spoken Answer' : 'Spoken Question → Spoken Spelling Answer'}
          </p>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Tests</p>
                <p className="text-3xl font-bold text-gray-900">{totalTests}</p>
                <p className="text-xs text-gray-500 mt-1">Completed sessions</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Accuracy Rate</p>
                <p className="text-3xl font-bold text-emerald-600">{accuracy}%</p>
                <p className="text-xs text-gray-500 mt-1">Success percentage</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Correct Answers</p>
                <p className="text-3xl font-bold text-green-600">{correctAnswers}</p>
                <p className="text-xs text-gray-500 mt-1">Right responses</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg Response Time</p>
                <p className="text-3xl font-bold text-blue-600">{averageDuration}s</p>
                <p className="text-xs text-gray-500 mt-1">Per question</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Enhanced Student Interface */}
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Student Assessment</h2>
                  <p className="text-gray-600">Interactive voice-based testing platform</p>
                </div>
              </div>
              
              {/* Student Name Input */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Student Information
                </label>
                <input
                  type="text"
                  value={currentStudent}
                  onChange={(e) => setCurrentStudent(e.target.value)}
                  placeholder="Enter student name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Enhanced Question Card */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Current Question</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Question {currentQuestionIndex + 1}
                  </span>
                </div>
                <p className="text-xl text-gray-800 mb-4 leading-relaxed">
                  {currentSection === 'B' 
                    ? `Spell the word: "${currentQuestion}"`
                    : currentQuestion
                  }
                </p>
                
                {/* Question Type Display for Section A */}
                {currentSection === 'A' && (
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {sectionAQuestions[currentQuestionIndex]?.type === 'fill-blank' && '✅ Fill in the Blanks'}
                      {sectionAQuestions[currentQuestionIndex]?.type === 'mcq' && '✅ Multiple Choice Questions (MCQs)'}
                      {sectionAQuestions[currentQuestionIndex]?.type === 'match-pairs' && '✅ Match the Pairs'}
                    </span>
                  </div>
                )}

                {/* MCQ Options */}
                {currentSection === 'A' && sectionAQuestions[currentQuestionIndex]?.type === 'mcq' && (
                  <div className="mt-4 space-y-2">
                    {sectionAQuestions[currentQuestionIndex]?.options?.map((option, index) => (
                      <div key={index} className="p-2 bg-white rounded-lg border border-gray-200">
                        <span className="text-gray-700">{option}</span>
                      </div>
                    ))}
                    <p className="text-sm text-gray-600 mt-2">
                      Spoken response: "Option B" or "Cow"
                    </p>
                  </div>
                )}

                <button
                  onClick={() => speakText(currentSection === 'B' ? `Spell the word: ${currentQuestion}` : currentQuestion)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Headphones className="w-4 h-4" />
                  <span>Listen to Question</span>
                </button>
              </div>

              {/* Enhanced Language Selection */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Language & Voice Settings
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {languages.map(lang => (
                    <label key={lang.value} className={`relative flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedLanguage === lang.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        value={lang.value}
                        checked={selectedLanguage === lang.value}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
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

              {/* Enhanced Recording Controls */}
              <div className="text-center space-y-6">
                {/* Recording Duration */}
                {(isRecording || recordingDuration > 0) && (
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span className="text-lg font-medium text-gray-700">
                      {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                )}

                {/* Main Recording Button */}
                <div className="flex justify-center">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isProcessing}
                    className={`relative w-24 h-24 rounded-full transition-all duration-300 transform hover:scale-105 ${
                      isRecording 
                        ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/25' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25'
                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}`}
                  >
                    {isProcessing ? (
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : isRecording ? (
                      <Square className="w-8 h-8 text-white mx-auto" />
                    ) : (
                      <Mic className="w-8 h-8 text-white mx-auto" />
                    )}
                  </button>
                </div>

                <p className="text-sm font-medium text-gray-600">
                  {isProcessing ? 'Processing your response...' : 
                   isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                </p>

                {/* Audio Level Visualization */}
                {isRecording && (
                  <div className="flex justify-center items-end space-x-1 h-16">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t transition-all duration-150"
                        style={{
                          width: '6px',
                          height: `${Math.max(8, (audioLevel / 100) * 60 + Math.random() * 20)}px`
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                {showResult && (
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={retakeRecording}
                      className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                      <span>Retake</span>
                    </button>
                    <button
                      onClick={submitAnswer}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Submit Answer</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Enhanced Result Display */}
              {showResult && (
                <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    System Check
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Correct Answer</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Your Answer</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white">
                          <td className="py-3 px-4 font-medium">{correctAnswer}</td>
                          <td className="py-3 px-4">{studentAnswer}</td>
                          <td className="py-3 px-4">
                            {isCorrect ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                🟢 Correct
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                <XCircle className="w-4 h-4 mr-1" />
                                🔴 Incorrect
                              </span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Teacher Dashboard */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">🗂️ Teacher Dashboard</h2>
                  <p className="text-gray-600">Real-time monitoring</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={downloadResults}
                  className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>📄 Export</span>
                </button>
                <button
                  onClick={shareResults}
                  className="flex items-center space-x-1 px-3 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  <span>📤 Share</span>
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No test results yet</p>
                  <p className="text-sm">Start a live test to see results here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2 font-semibold text-gray-700">🕒 Time</th>
                        <th className="text-left py-2 px-2 font-semibold text-gray-700">🧑‍🎓 Student</th>
                        <th className="text-left py-2 px-2 font-semibold text-gray-700">Section</th>
                        <th className="text-left py-2 px-2 font-semibold text-gray-700">Type</th>
                        <th className="text-left py-2 px-2 font-semibold text-gray-700">Response</th>
                        <th className="text-left py-2 px-2 font-semibold text-gray-700">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result) => (
                        <tr key={result.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-2 px-2 text-xs text-gray-600">
                            {result.timestamp.toLocaleTimeString()}
                          </td>
                          <td className="py-2 px-2 font-medium text-gray-900">
                            {result.student}
                          </td>
                          <td className="py-2 px-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {result.section}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-xs text-gray-600">
                            {result.questionType === 'fill-blank' && 'Fill Blank'}
                            {result.questionType === 'mcq' && 'MCQ'}
                            {result.questionType === 'match-pairs' && 'Match'}
                            {result.questionType === 'spelling' && 'Spelling'}
                          </td>
                          <td className="py-2 px-2 text-xs text-gray-600">
                            {result.studentAnswer}
                          </td>
                          <td className="py-2 px-2">
                            {result.isCorrect ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTest;