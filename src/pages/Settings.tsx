import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Globe, Type, Moon, Sun, Monitor, RefreshCw, Download, Trash2, HelpCircle, Video, FileText, Mail, LogOut, UserX, Bell, Shield, Palette, Zap } from 'lucide-react';

const Settings: React.FC = () => {
  const [appLanguage, setAppLanguage] = useState('english-local');
  const [fontSize, setFontSize] = useState('medium');
  const [theme, setTheme] = useState('light');
  const [syncStatus, setSyncStatus] = useState('synced');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true
  });

  const languages = [
    { value: 'local-only', label: 'Local Only', flag: '🇮🇳' },
    { value: 'english-only', label: 'English Only', flag: '🇺🇸' },
    { value: 'english-local', label: 'English + Local Language', flag: '🌐' }
  ];

  const fontSizes = [
    { value: 'small', label: 'A–', size: 'Small' },
    { value: 'medium', label: 'A', size: 'Medium' },
    { value: 'large', label: 'A+', size: 'Large' }
  ];

  const themes = [
    { value: 'light', label: 'Light', icon: Sun, description: 'Clean and bright interface' },
    { value: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { value: 'system', label: 'System Default', icon: Monitor, description: 'Follows device settings' }
  ];

  const handleSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      alert('Sync completed successfully!');
    }, 2000);
  };

  const handleClearData = () => {
    if (confirm('Are you sure? This will remove all downloaded files.')) {
      alert('Offline data cleared successfully!');
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      alert('Logged out successfully!');
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to request account deletion? This action cannot be undone.')) {
      alert('Account deletion request submitted. You will receive a confirmation email.');
    }
  };

  const handleExportData = () => {
    alert('Exporting your data...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <SettingsIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            ⚙️ SETTINGS – SAHAYAK
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Customize your teaching experience with intuitive controls
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <User className="w-6 h-6 mr-3 text-blue-600" />
              👤 PROFILE SETTINGS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button className="group flex items-center justify-between p-6 border border-gray-200 rounded-2xl hover:shadow-lg hover:border-blue-300 transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold text-gray-900 block">👩‍🏫 View / Edit Profile</span>
                    <span className="text-sm text-gray-600">Manage your information</span>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-blue-600 transition-colors">→</span>
              </button>
              
              <button className="group flex items-center justify-between p-6 border border-gray-200 rounded-2xl hover:shadow-lg hover:border-blue-300 transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold text-gray-900 block">🔐 Change Password</span>
                    <span className="text-sm text-gray-600">Update security settings</span>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-green-600 transition-colors">→</span>
              </button>
            </div>
          </div>

          {/* Language & Display */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Globe className="w-6 h-6 mr-3 text-blue-600" />
              🌐 LANGUAGE & DISPLAY
            </h2>
            <div className="space-y-8">
              {/* App Language */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  🌍 App Language:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {languages.map(lang => (
                    <label key={lang.value} className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                      appLanguage === lang.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        value={lang.value}
                        checked={appLanguage === lang.value}
                        onChange={(e) => setAppLanguage(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="font-medium text-gray-900">{lang.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  🅰️ Font Size:
                </label>
                <div className="flex space-x-4">
                  {fontSizes.map(size => (
                    <button
                      key={size.value}
                      onClick={() => setFontSize(size.value)}
                      className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl border-2 transition-all duration-200 ${
                        fontSize === size.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700 scale-105'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:scale-105'
                      }`}
                    >
                      <span className="font-bold text-lg">{size.label}</span>
                      <span className="text-xs">{size.size}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Mode */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  🌓 Theme Mode:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {themes.map(themeOption => {
                    const Icon = themeOption.icon;
                    return (
                      <label key={themeOption.value} className={`flex flex-col p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                        theme === themeOption.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          value={themeOption.value}
                          checked={theme === themeOption.value}
                          onChange={(e) => setTheme(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3 mb-2">
                          <Icon className="w-6 h-6 text-gray-600" />
                          <span className="font-semibold text-gray-900">{themeOption.label}</span>
                        </div>
                        <span className="text-sm text-gray-600">{themeOption.description}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Bell className="w-6 h-6 mr-3 text-blue-600" />
              🔔 NOTIFICATIONS
            </h2>
            <div className="space-y-6">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl">
                  <div>
                    <span className="font-semibold text-gray-900 capitalize">
                      {key === 'email' && '📧 Email Notifications'}
                      {key === 'push' && '📱 Push Notifications'}
                      {key === 'updates' && '🔄 App Updates'}
                    </span>
                    <p className="text-sm text-gray-600">
                      {key === 'email' && 'Receive notifications via email'}
                      {key === 'push' && 'Get push notifications on your device'}
                      {key === 'updates' && 'Notify about app updates and new features'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Data & Sync */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <RefreshCw className="w-6 h-6 mr-3 text-blue-600" />
              📊 DATA & SYNC
            </h2>
            <div className="space-y-6">
              <div className="p-6 border border-gray-200 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-gray-900">🔘 Sync with Google Account</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    syncStatus === 'synced' ? 'bg-green-100 text-green-800' :
                    syncStatus === 'syncing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {syncStatus === 'synced' ? '✅ Synced' :
                     syncStatus === 'syncing' ? '🔄 Syncing...' :
                     '❌ Not Synced'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  ✅ Last Sync: Today, 10:15 AM
                </p>
                <button
                  onClick={handleSync}
                  disabled={syncStatus === 'syncing'}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                >
                  <RefreshCw className={`w-5 h-5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                  <span>🔄 Sync Now</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={handleExportData}
                  className="flex items-center justify-center space-x-2 p-6 border border-gray-200 rounded-2xl hover:shadow-lg hover:border-blue-300 transition-all duration-200"
                >
                  <Download className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold text-gray-900">📥 Export My Data</span>
                </button>

                <button
                  onClick={handleClearData}
                  className="flex items-center justify-center space-x-2 p-6 border border-red-200 rounded-2xl bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-6 h-6 text-red-600" />
                  <span className="font-semibold text-red-900">🗑️ Clear Offline Data</span>
                </button>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <HelpCircle className="w-6 h-6 mr-3 text-blue-600" />
              📞 HELP & SUPPORT
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <button className="group flex flex-col items-center p-6 border border-gray-200 rounded-2xl hover:shadow-lg hover:border-blue-300 transition-all duration-200">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <HelpCircle className="w-6 h-6 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-900 text-center">🆘 How to Use Sahayak?</span>
              </button>
              
              <button className="group flex flex-col items-center p-6 border border-gray-200 rounded-2xl hover:shadow-lg hover:border-red-300 transition-all duration-200">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                  <Video className="w-6 h-6 text-red-600" />
                </div>
                <span className="font-semibold text-gray-900 text-center">📹 Watch Tutorial Video</span>
              </button>
              
              <button className="group flex flex-col items-center p-6 border border-gray-200 rounded-2xl hover:shadow-lg hover:border-purple-300 transition-all duration-200">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <span className="font-semibold text-gray-900 text-center">📄 Read Teacher Guide</span>
              </button>
              
              <button className="group flex flex-col items-center p-6 border border-gray-200 rounded-2xl hover:shadow-lg hover:border-green-300 transition-all duration-200">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <span className="font-semibold text-gray-900 text-center">📧 Contact Support</span>
              </button>
            </div>
          </div>

          {/* Account Control */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <UserX className="w-6 h-6 mr-3 text-blue-600" />
              🔐 ACCOUNT CONTROL
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-3 p-6 border border-gray-200 rounded-2xl hover:shadow-lg hover:border-blue-300 transition-all duration-200"
              >
                <LogOut className="w-6 h-6 text-gray-600" />
                <span className="font-semibold text-gray-900">🔓 Logout</span>
              </button>
              
              <button
                onClick={handleDeleteAccount}
                className="flex items-center justify-center space-x-3 p-6 border border-red-200 rounded-2xl bg-red-50 hover:bg-red-100 transition-colors"
              >
                <UserX className="w-6 h-6 text-red-600" />
                <span className="font-semibold text-red-900">🗑️ Delete Account (Request)</span>
              </button>
            </div>
          </div>

          {/* App Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Zap className="w-6 h-6 mr-3 text-blue-600" />
              ℹ️ App Info
            </h2>
            <div className="space-y-4 text-gray-600 mb-8">
              <p><span className="font-semibold">📱 Version:</span> 1.0.5</p>
              <p><span className="font-semibold">📅 Last Updated:</span> January 2025</p>
              <p><span className="font-semibold">🔧 Build:</span> Production</p>
            </div>
            
            <div className="pt-8 border-t border-gray-200 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-4">
                🚀 Powered by SAHAYAK – Smart Classroom Toolkit
              </p>
              <p className="text-gray-600 mb-6">
                SAHAYAK transforms your teaching experience with AI-powered tools designed for modern classrooms
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✅</span>
                  <span>Touch-enabled Visual Drawing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✅</span>
                  <span>Voice Prompts for Language Learning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✅</span>
                  <span>Smart Save & Share System</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✅</span>
                  <span>Offline & Online Sync</span>
                </div>
              </div>
              <p className="text-gray-500 italic">
                ✨ Designed for Teachers. Built for Classrooms. Powered by AI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;