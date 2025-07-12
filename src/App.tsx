import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import SyllabusUpload from './pages/SyllabusUpload';
import LessonPlanner from './pages/LessonPlanner';
import WorksheetGenerator from './pages/WorksheetGenerator';
import Smartboard from './pages/Smartboard';
import LiveTest from './pages/LiveTest';
import StoryGenerator from './pages/StoryGenerator';
import VisualDesigner from './pages/VisualDesigner';
import MediaSearch from './pages/MediaSearch';
import DigitalBoard from './pages/DigitalBoard';
import SavedContent from './pages/SavedContent';
import Settings from './pages/Settings';
import SmartDictionary from './pages/SmartDictionary';
import Calendar from './pages/Calendar';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/syllabus-upload" element={<SyllabusUpload />} />
          <Route path="/class-planner" element={<LessonPlanner />} />
          <Route path="/worksheet-generator" element={<WorksheetGenerator />} />
          <Route path="/smartboard" element={<Smartboard />} />
          <Route path="/story-generator" element={<StoryGenerator />} />
          <Route path="/visual-designer" element={<VisualDesigner />} />
          <Route path="/live-test" element={<LiveTest />} />
          <Route path="/media-search" element={<MediaSearch />} />
          <Route path="/digital-board" element={<DigitalBoard />} />
          <Route path="/saved-content" element={<SavedContent />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/smart-dictionary" element={<SmartDictionary />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;