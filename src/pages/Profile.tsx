import React, { useState } from 'react';
import { 
  User, 
  School, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  Globe, 
  Mail, 
  Phone, 
  Lock, 
  RefreshCw, 
  FileText, 
  BarChart3,
  Camera,
  Edit2,
  Save,
  X
} from 'lucide-react';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Mrs. Anjali Verma',
    school: 'Shishu Niketan Govt School',
    district: 'Gadag',
    block: 'Shirahatti',
    grades: ['Grade 3', 'Grade 4', 'Grade 5'],
    subjects: ['EVS', 'Kannada', 'English'],
    language: 'Kannada',
    email: 'anjali@school.edu',
    phone: '+91 98765 43210'
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  const profileFields = [
    { icon: User, label: 'Full Name', value: profileData.name, key: 'name', type: 'text' },
    { icon: School, label: 'School Name', value: profileData.school, key: 'school', type: 'text' },
    { icon: MapPin, label: 'District', value: profileData.district, key: 'district', type: 'text' },
    { icon: MapPin, label: 'Block', value: profileData.block, key: 'block', type: 'text' },
    { icon: GraduationCap, label: 'Grades Taught', value: profileData.grades.join(', '), key: 'grades', type: 'text' },
    { icon: BookOpen, label: 'Subjects Taught', value: profileData.subjects.join(', '), key: 'subjects', type: 'text' },
    { icon: Globe, label: 'Preferred Language', value: profileData.language, key: 'language', type: 'select' },
    { icon: Mail, label: 'Contact Email', value: profileData.email, key: 'email', type: 'email' },
    { icon: Phone, label: 'Phone Number', value: profileData.phone, key: 'phone', type: 'tel' },
  ];

  const actionButtons = [
    { icon: Lock, label: 'Change Password', action: () => {}, color: 'bg-blue-500' },
    { icon: RefreshCw, label: 'Sync with Google Account', action: () => {}, color: 'bg-green-500' },
    { icon: FileText, label: 'View Activity Logs', action: () => {}, color: 'bg-purple-500' },
    { icon: BarChart3, label: 'View Test Results', action: () => {}, color: 'bg-orange-500' },
  ];

  const languages = ['English', 'Kannada', 'Hindi', 'Telugu', 'Tamil', 'Marathi'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            👩‍🏫 TEACHER PROFILE
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your professional information and account settings
          </p>
        </div>

        {/* Profile Picture Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img
                  src="https://images.pexels.com/photos/3771539/pexels-photo-3771539.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-3 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg group-hover:scale-110">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{profileData.name}</h2>
              <p className="text-xl text-gray-600 mb-1">{profileData.school}</p>
              <p className="text-lg text-gray-500 mb-4">{profileData.district}, {profileData.block}</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4">
                {profileData.subjects.map((subject, index) => (
                  <span key={index} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors shadow-lg"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                  <Edit2 className="w-5 h-5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <FileText className="w-6 h-6 mr-3 text-blue-600" />
            📋 Profile Information
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {profileFields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.key} className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {field.label}
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Icon className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    {isEditing ? (
                      field.type === 'select' ? (
                        <select
                          value={field.value}
                          onChange={(e) => {
                            setProfileData(prev => ({
                              ...prev,
                              [field.key]: e.target.value
                            }));
                          }}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                          {languages.map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={field.value}
                          onChange={(e) => {
                            setProfileData(prev => ({
                              ...prev,
                              [field.key]: e.target.value
                            }));
                          }}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      )
                    ) : (
                      <div className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium">
                        {field.value}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {actionButtons.map((button) => {
            const Icon = button.icon;
            return (
              <button
                key={button.label}
                onClick={button.action}
                className={`group flex flex-col items-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300`}
              >
                <div className={`w-16 h-16 ${button.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <span className="font-semibold text-gray-900 text-center leading-tight">{button.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;