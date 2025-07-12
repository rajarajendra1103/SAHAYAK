import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  Monitor, 
  Mic, 
  FileEdit, 
  Palette, 
  PlayCircle,
  Search,
  CalendarDays
} from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Syllabus / Textbook',
      description: 'Upload and manage curriculum materials',
      path: '/syllabus-upload',
      color: 'bg-blue-500'
    },
    {
      icon: Calendar,
      title: 'Class Planner',
      description: 'Plan and organize your lessons',
      path: '/class-planner',
      color: 'bg-green-500'
    },
    {
      icon: FileText,
      title: 'Worksheet Generator',
      description: 'Create custom worksheets for students',
      path: '/worksheet-generator',
      color: 'bg-purple-500'
    },
    {
      icon: Monitor,
      title: 'Smartboard',
      description: 'Interactive teaching tools',
      path: '/smartboard',
      color: 'bg-orange-500'
    },
    {
      icon: FileEdit,
      title: 'Story Generator',
      description: 'Create engaging stories for students',
      path: '/story-generator',
      color: 'bg-pink-500'
    },
    {
      icon: Palette,
      title: 'Visual Designer',
      description: 'Design visual learning materials',
      path: '/visual-designer',
      color: 'bg-indigo-500'
    },
    {
      icon: PlayCircle,
      title: 'Live Test',
      description: 'Conduct real-time assessments',
      path: '/live-test',
      color: 'bg-teal-500'
    },
    {
      icon: Search,
      title: 'Smart Dictionary',
      description: 'Intelligent word lookup with pronunciation',
      path: '/smart-dictionary',
      color: 'bg-cyan-500'
    },
    {
      icon: CalendarDays,
      title: 'Learning Calendar',
      description: 'Interactive calendar with educational content',
      path: '/calendar',
      color: 'bg-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
          <span className="text-3xl font-bold text-white">S</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Welcome to SAHAYAK
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your comprehensive AI-powered teaching companion for modern classrooms
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.title}
              to={feature.path}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Classes</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Students</p>
              <p className="text-2xl font-bold text-gray-900">150</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Monitor className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Materials</p>
              <p className="text-2xl font-bold text-gray-900">68</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Home;