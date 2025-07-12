import React, { useState } from 'react';
import { Upload, File, Trash2, Download, Eye, Plus, CheckCircle, AlertCircle, FolderOpen, BookOpen } from 'lucide-react';

interface UploadedFile {
  id: string;
  grade: string;
  subject: string;
  filename: string;
  notes: string;
  uploadDate: Date;
  fileType: string;
  size: string;
}

const SyllabusUpload: React.FC = () => {
  const [formData, setFormData] = useState({
    grade: '',
    subject: '',
    notes: '',
    file: null as File | null
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: '1',
      grade: 'Grade 3',
      subject: 'EVS',
      filename: 'EVS_Term1_Textbook.pdf',
      notes: 'Term 1 - Chapter 1-5 textbook',
      uploadDate: new Date('2024-01-15'),
      fileType: 'PDF',
      size: '2.3 MB'
    },
    {
      id: '2',
      grade: 'Grade 4',
      subject: 'Kannada',
      filename: 'Kannada_Grammar.pdf',
      notes: 'Grammar reference book',
      uploadDate: new Date('2024-01-20'),
      fileType: 'PDF',
      size: '1.8 MB'
    }
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
  const subjects = ['English', 'EVS', 'Life Skills', 'Computer', 'Math', 'Social Science', 'Kannada', 'Science'];

  const handleFileChange = (file: File) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.type)) {
      setFormData(prev => ({ ...prev, file }));
      setUploadError('');
    } else {
      setUploadError('❌ Unsupported file format! Please select a valid file type (PDF, JPG, PNG, DOC, DOCX)');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.grade || !formData.subject || !formData.file) {
      setUploadError('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    
    // Simulate upload process
    setTimeout(() => {
      const newFile: UploadedFile = {
        id: Date.now().toString(),
        grade: formData.grade,
        subject: formData.subject,
        filename: formData.file!.name,
        notes: formData.notes,
        uploadDate: new Date(),
        fileType: formData.file!.type.includes('pdf') ? 'PDF' : 'Image',
        size: (formData.file!.size / (1024 * 1024)).toFixed(1) + ' MB'
      };
      
      setUploadedFiles(prev => [newFile, ...prev]);
      setFormData({ grade: '', subject: '', notes: '', file: null });
      setIsUploading(false);
      setUploadSuccess(true);
      
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      setUploadedFiles(prev => prev.filter(file => file.id !== id));
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'PDF': return '📄';
      case 'Image': return '🖼️';
      default: return '📁';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Upload className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📚 Upload Syllabus / Textbook
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload and organize your curriculum materials for easy access
          </p>
        </div>

        {/* Success Message */}
        {uploadSuccess && (
          <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl flex items-center space-x-3 shadow-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-green-800 font-medium">✅ File uploaded successfully!</span>
          </div>
        )}

        {/* Error Message */}
        {uploadError && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl flex items-center space-x-3 shadow-lg">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <span className="text-red-800 font-medium">{uploadError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Upload Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <FolderOpen className="w-6 h-6 mr-3 text-blue-600" />
              📤 Upload New Document
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Grade and Subject */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📘 Select Grade *
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  >
                    <option value="">Select Grade 1–10 ▼</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📚 Subject *
                  </label>
                  <input
                    type="text"
                    list="subjects"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Type or select subject"
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                  <datalist id="subjects">
                    {subjects.map(subject => (
                      <option key={subject} value={subject} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  📁 Upload File *
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    
                    {formData.file ? (
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-900">{formData.file.name}</p>
                        <p className="text-sm text-gray-600">
                          {(formData.file.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-700">
                          Drag & drop your file here, or click to browse
                        </p>
                        <p className="text-sm text-gray-500">
                          Supported formats: PDF, JPG, PNG, DOC, DOCX
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  📝 Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="e.g., Term 1 - Chapter 2 textbook (updated)"
                  rows={4}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isUploading}
                className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg text-lg font-semibold"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    <span>✔️ Upload Document</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Uploaded Documents */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-purple-600" />
              📄 Uploaded Documents
            </h2>
            
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <File className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <p className="text-xl font-medium mb-2">No documents uploaded yet</p>
                <p className="text-gray-400">Upload your first document to get started</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="group bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                          {getFileIcon(file.fileType)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              📘 {file.grade}
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              📚 {file.subject}
                            </span>
                          </div>
                          
                          <h3 className="font-semibold text-gray-900 mb-1 truncate">{file.filename}</h3>
                          
                          {file.notes && (
                            <p className="text-sm text-gray-600 mb-2">{file.notes}</p>
                          )}
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>🕓 {file.uploadDate.toLocaleDateString()}</span>
                            <span>📦 {file.size}</span>
                            <span>📄 {file.fileType}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {/* View logic */}}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {/* Download logic */}}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

export default SyllabusUpload;