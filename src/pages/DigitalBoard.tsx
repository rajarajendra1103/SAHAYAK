import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PenTool, Square, Circle, Triangle, Ruler, RotateCcw, Download, Printer, Grid3X3, Palette, Eraser, Search, Zap, Shapes, Calculator, Type, Move } from 'lucide-react';

interface DrawingState {
  isDrawing: boolean;
  tool: string;
  color: string;
  size: number;
  startX: number;
  startY: number;
}

interface ShapeData {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label?: string;
}

const DigitalBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    tool: 'pen',
    color: '#000000',
    size: 3,
    startX: 0,
    startY: 0
  });
  
  const [showGrid, setShowGrid] = useState(false);
  const [canvasPages, setCanvasPages] = useState(1);
  const [aiShapePrompt, setAiShapePrompt] = useState('');
  const [isGeneratingShape, setIsGeneratingShape] = useState(false);
  const [shapes, setShapes] = useState<ShapeData[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [canvasHistory, setCanvasHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Drawing tools configuration
  const drawingTools = [
    { id: 'pen', icon: PenTool, label: 'Pen', color: 'bg-blue-500' },
    { id: 'eraser', icon: Eraser, label: 'Eraser', color: 'bg-gray-500' },
    { id: 'line', icon: Ruler, label: 'Line', color: 'bg-green-500' },
    { id: 'text', icon: Type, label: 'Text', color: 'bg-purple-500' }
  ];

  const mathShapes = [
    { id: 'rectangle', icon: Square, label: 'Rectangle', symbol: '🔲' },
    { id: 'triangle', icon: Triangle, label: 'Triangle', symbol: '🔺' },
    { id: 'circle', icon: Circle, label: 'Circle', symbol: '⚪' },
    { id: 'rhombus', icon: Shapes, label: 'Rhombus', symbol: '🔷' },
    { id: 'polygon', icon: Shapes, label: 'Polygon', symbol: '🧩' }
  ];

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
    '#800080', '#008000', '#800000', '#000080',
    '#FFB6C1', '#98FB98', '#87CEEB', '#DDA0DD'
  ];

  const mathSymbols = [
    { symbol: '+', label: 'Plus' },
    { symbol: '−', label: 'Minus' },
    { symbol: '×', label: 'Multiply' },
    { symbol: '÷', label: 'Divide' },
    { symbol: '=', label: 'Equals' },
    { symbol: 'π', label: 'Pi' },
    { symbol: '√', label: 'Square Root' },
    { symbol: '≥', label: 'Greater Equal' },
    { symbol: '≤', label: 'Less Equal' },
    { symbol: 'cm²', label: 'Square CM' },
    { symbol: '∠', label: 'Angle' },
    { symbol: '°', label: 'Degree' }
  ];

  const languages = [
    { value: 'english', label: 'English', flag: '🇺🇸' },
    { value: 'hindi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { value: 'kannada', label: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
    { value: 'telugu', label: 'తెలుగు (Telugu)', flag: '🇮🇳' },
    { value: 'tamil', label: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { value: 'marathi', label: 'मराठी (Marathi)', flag: '🇮🇳' },
    { value: 'gujarati', label: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
    { value: 'bengali', label: 'বাংলা (Bengali)', flag: '🇮🇳' },
    { value: 'punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
    { value: 'malayalam', label: 'മലയാളം (Malayalam)', flag: '🇮🇳' }
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const container = canvas.parentElement;
    if (container) {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = 500;
    } else {
      canvas.width = 800;
      canvas.height = 500;
    }

    const context = canvas.getContext('2d');
    if (!context) return;

    // Configure context
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.imageSmoothingEnabled = true;
    
    // Set white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    contextRef.current = context;
    
    // Save initial state
    saveToHistory();
    
    // Draw grid if enabled
    if (showGrid) {
      drawGrid(context, canvas.width, canvas.height);
    }
  }, [showGrid]);

  // Save canvas state to history
  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = canvasHistory.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    
    // Limit history to 20 states
    if (newHistory.length > 20) {
      newHistory.shift();
    } else {
      setHistoryIndex(prev => prev + 1);
    }
    
    setCanvasHistory(newHistory);
  }, [canvasHistory, historyIndex]);

  // Draw grid
  const drawGrid = (context: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 20;
    context.save();
    context.strokeStyle = '#e5e7eb';
    context.lineWidth = 1;
    context.setLineDash([2, 2]);

    for (let x = 0; x <= width; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }

    for (let y = 0; y <= height; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
    
    context.restore();
  };

  // Get mouse/touch position
  const getEventPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        return { x: 0, y: 0 };
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  // Start drawing
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getEventPos(e);
    const context = contextRef.current;
    if (!context) return;

    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      startX: pos.x,
      startY: pos.y
    }));

    if (drawingState.tool === 'pen' || drawingState.tool === 'eraser') {
      context.beginPath();
      context.moveTo(pos.x, pos.y);
    }
  };

  // Draw
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!drawingState.isDrawing) return;

    const pos = getEventPos(e);
    const context = contextRef.current;
    if (!context) return;

    if (drawingState.tool === 'pen') {
      context.globalCompositeOperation = 'source-over';
      context.strokeStyle = drawingState.color;
      context.lineWidth = drawingState.size;
      context.lineTo(pos.x, pos.y);
      context.stroke();
    } else if (drawingState.tool === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
      context.lineWidth = drawingState.size * 2;
      context.lineTo(pos.x, pos.y);
      context.stroke();
    }
  };

  // Stop drawing
  const stopDrawing = () => {
    if (!drawingState.isDrawing) return;

    const context = contextRef.current;
    if (!context) return;

    if (drawingState.tool === 'line') {
      // Draw line from start to current position
      const canvas = canvasRef.current;
      if (canvas) {
        context.globalCompositeOperation = 'source-over';
        context.strokeStyle = drawingState.color;
        context.lineWidth = drawingState.size;
        context.beginPath();
        context.moveTo(drawingState.startX, drawingState.startY);
        context.lineTo(drawingState.startX, drawingState.startY); // Will be updated by mouse move
        context.stroke();
      }
    }

    setDrawingState(prev => ({ ...prev, isDrawing: false }));
    saveToHistory();
  };

  // Draw shape
  const drawShape = (type: string, x: number, y: number, width: number = 100, height: number = 100) => {
    const context = contextRef.current;
    if (!context) return;

    context.save();
    context.strokeStyle = drawingState.color;
    context.lineWidth = 2;
    context.fillStyle = 'transparent';

    switch (type) {
      case 'rectangle':
        context.strokeRect(x - width/2, y - height/2, width, height);
        break;
      case 'circle':
        context.beginPath();
        context.arc(x, y, Math.min(width, height)/2, 0, 2 * Math.PI);
        context.stroke();
        break;
      case 'triangle':
        context.beginPath();
        context.moveTo(x, y - height/2);
        context.lineTo(x - width/2, y + height/2);
        context.lineTo(x + width/2, y + height/2);
        context.closePath();
        context.stroke();
        break;
      case 'rhombus':
        context.beginPath();
        context.moveTo(x, y - height/2);
        context.lineTo(x + width/2, y);
        context.lineTo(x, y + height/2);
        context.lineTo(x - width/2, y);
        context.closePath();
        context.stroke();
        break;
    }
    
    context.restore();
    saveToHistory();
  };

  // Handle canvas click for shapes
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (mathShapes.some(shape => shape.id === drawingState.tool)) {
      const pos = getEventPos(e);
      drawShape(drawingState.tool, pos.x, pos.y);
      
      // Add to shapes array
      const newShape: ShapeData = {
        id: Date.now().toString(),
        type: drawingState.tool,
        x: pos.x,
        y: pos.y,
        width: 100,
        height: 100,
        color: drawingState.color
      };
      setShapes(prev => [...prev, newShape]);
    }
  };

  // AI Shape Generation with Vertex AI (Gemini Vision)
  const handleAiGenerate = async () => {
    if (!aiShapePrompt.trim()) {
      alert('Please enter a shape description');
      return;
    }

    setIsGeneratingShape(true);
    
    try {
      // Use Vertex AI (Gemini) for advanced shape generation
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAlmmlE_eqkHmUhL7FQiDfHWQwrcrW0qzM`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are an AI assistant for a digital math board. Analyze this shape request: "${aiShapePrompt}"

Please provide a JSON response with the following structure:
{
  "shapeType": "rectangle|triangle|circle|rhombus|polygon",
  "dimensions": {
    "width": number,
    "height": number,
    "radius": number
  },
  "measurements": "extracted measurements with units",
  "coordinates": {
    "x": number,
    "y": number
  },
  "labels": [
    {
      "text": "label text",
      "position": {"x": number, "y": number},
      "language": "${selectedLanguage}"
    }
  ],
  "instructions": "step-by-step drawing instructions",
  "localizedLabels": {
    "hindi": "हिंदी labels",
    "kannada": "ಕನ್ನಡ labels",
    "telugu": "తెలుగు labels",
    "tamil": "தமிழ் labels",
    "marathi": "मराठी labels",
    "gujarati": "ગુજરાતી labels",
    "bengali": "বাংলা labels",
    "punjabi": "ਪੰਜਾਬੀ labels",
    "malayalam": "മലയാളം labels"
  }
}

Extract any measurements mentioned (convert cm to pixels: 1cm = 10px).
Provide coordinates for an 800x500 canvas, centered around (400, 250).
Include appropriate labels for sides, angles, and measurements in multiple Indian languages.
Recognize mathematical terms and provide accurate geometric constructions.`
              }]
            }],
            generationConfig: {
              temperature: 0.3,
              topK: 40,
              topP: 0.8,
              maxOutputTokens: 1024,
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        try {
          // Try to parse JSON response
          const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const shapeData = JSON.parse(jsonMatch[0]);
            
            // Draw the AI-generated shape
            const canvas = canvasRef.current;
            const context = contextRef.current;
            if (canvas && context) {
              const x = shapeData.coordinates?.x || 400;
              const y = shapeData.coordinates?.y || 250;
              const width = shapeData.dimensions?.width || 100;
              const height = shapeData.dimensions?.height || 100;
              
              drawShape(shapeData.shapeType, x, y, width, height);
              
              // Add labels in selected language
              if (shapeData.labels) {
                context.save();
                context.font = '14px Inter';
                context.fillStyle = drawingState.color;
                
                shapeData.labels.forEach((label: any) => {
                  let labelText = label.text;
                  
                  // Use localized labels if available
                  if (shapeData.localizedLabels && selectedLanguage !== 'english') {
                    labelText = shapeData.localizedLabels[selectedLanguage] || label.text;
                  }
                  
                  context.fillText(
                    labelText,
                    label.position?.x || x,
                    label.position?.y || y + height/2 + 30
                  );
                });
                
                context.restore();
              }
              
              // Add instruction text
              if (shapeData.instructions) {
                context.save();
                context.font = '12px Inter';
                context.fillStyle = '#666';
                context.fillText(
                  `AI Generated: ${shapeData.instructions.substring(0, 50)}...`,
                  x - width/2,
                  y + height/2 + 50
                );
                context.restore();
              }
              
              saveToHistory();
            }
            
            alert(`✅ AI generated ${shapeData.shapeType} with measurements: ${shapeData.measurements || 'default size'}`);
          } else {
            throw new Error('Invalid JSON response');
          }
        } catch (parseError) {
          // Fallback to simple parsing
          console.log('Using fallback parsing for:', aiResponse);
          generateShapeFallback();
        }
      } else {
        throw new Error('AI service unavailable');
      }
      
    } catch (error) {
      console.error('AI shape generation error:', error);
      generateShapeFallback();
    } finally {
      setIsGeneratingShape(false);
      setAiShapePrompt('');
    }
  };

  // Fallback shape generation
  const generateShapeFallback = () => {
    const prompt = aiShapePrompt.toLowerCase();
    let shapeType = 'rectangle';
    let size = 100;
    
    if (prompt.includes('triangle')) shapeType = 'triangle';
    else if (prompt.includes('circle')) shapeType = 'circle';
    else if (prompt.includes('rhombus') || prompt.includes('diamond')) shapeType = 'rhombus';
    
    // Extract measurements
    const sizeMatch = prompt.match(/(\d+)\s*(cm|px|units?)/);
    if (sizeMatch) {
      size = parseInt(sizeMatch[1]) * (sizeMatch[2] === 'cm' ? 10 : 1);
    }
    
    // Draw shape in center
    const canvas = canvasRef.current;
    if (canvas) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      drawShape(shapeType, centerX, centerY, size, size);
      
      // Add simple label
      const context = contextRef.current;
      if (context) {
        context.save();
        context.font = '14px Inter';
        context.fillStyle = drawingState.color;
        context.fillText(
          `Generated: ${shapeType} (${size}px)`,
          centerX - 50,
          centerY + size/2 + 20
        );
        context.restore();
        saveToHistory();
      }
    }
    
    alert(`Generated ${shapeType} with size ${size}px (offline mode)`);
  };

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    if (showGrid) {
      drawGrid(context, canvas.width, canvas.height);
    }
    
    setShapes([]);
    saveToHistory();
  };

  // Undo
  const undo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      if (!canvas || !context) return;

      const previousState = canvasHistory[historyIndex - 1];
      context.putImageData(previousState, 0, 0);
      setHistoryIndex(prev => prev - 1);
    }
  };

  // Add math symbol
  const addMathSymbol = (symbol: string) => {
    const context = contextRef.current;
    if (!context) return;

    context.save();
    context.font = '24px Inter';
    context.fillStyle = drawingState.color;
    context.fillText(symbol, 100 + Math.random() * 200, 100 + Math.random() * 200);
    context.restore();
    saveToHistory();
  };

  // Save canvas
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const link = document.createElement('a');
      link.download = `digital-board-page-${canvasPages}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save canvas. Please try again.');
    }
  };

  // Print canvas
  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Digital Board - Page ${canvasPages}</title>
            <style>
              body { margin: 0; padding: 20px; text-align: center; }
              img { max-width: 100%; height: auto; }
              h1 { font-family: Arial, sans-serif; color: #333; }
            </style>
          </head>
          <body>
            <h1>Digital Board - Page ${canvasPages}</h1>
            <img src="${canvas.toDataURL()}" alt="Digital Board Content" />
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <PenTool className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            📐 DIGITAL BOARD
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-blue-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Interactive math board with AI-powered shape generation using Vertex AI (Gemini Vision)
          </p>
        </div>

        {/* Enhanced Toolbar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          {/* Drawing Tools Row */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <PenTool className="w-5 h-5 mr-2 text-blue-600" />
              ✏️ Drawing & Writing Tools
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              {drawingTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setDrawingState(prev => ({ ...prev, tool: tool.id }))}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 shadow-sm ${
                      drawingState.tool === tool.id
                        ? `${tool.color} text-white shadow-lg scale-105`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tool.label}</span>
                  </button>
                );
              })}
              
              {/* Brush Size */}
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-sm font-medium text-gray-700">Size:</span>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={drawingState.size}
                  onChange={(e) => setDrawingState(prev => ({ ...prev, size: Number(e.target.value) }))}
                  className="w-20"
                />
                <span className="text-sm text-gray-600">{drawingState.size}px</span>
              </div>
              
              {/* Color Palette */}
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-sm font-medium text-gray-700">🎨 Colors:</span>
                <div className="flex flex-wrap gap-1">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setDrawingState(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        drawingState.color === color ? 'border-gray-800 scale-110 shadow-lg' : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Math Shapes Row */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Shapes className="w-5 h-5 mr-2 text-purple-600" />
              📐 Math Shape Toolkit
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {mathShapes.map((shape) => {
                const Icon = shape.icon;
                return (
                  <button
                    key={shape.id}
                    onClick={() => setDrawingState(prev => ({ ...prev, tool: shape.id }))}
                    className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
                      drawingState.tool === shape.id
                        ? 'bg-purple-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-2xl mb-1">{shape.symbol}</span>
                    <span className="text-xs font-medium text-center">{shape.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Math Symbols Row */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Calculator className="w-5 h-5 mr-2 text-orange-600" />
              🎓 Math Toolbar
            </h3>
            <div className="flex flex-wrap gap-2">
              {mathSymbols.map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => addMathSymbol(item.symbol)}
                  className="px-4 py-2 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-colors font-bold text-lg border border-orange-200"
                  title={item.label}
                >
                  {item.symbol}
                </button>
              ))}
            </div>
          </div>

          {/* Measurement Tools Row */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Ruler className="w-5 h-5 mr-2 text-green-600" />
              📏 Measurement & Grid Tools
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  showGrid
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
                <span className="font-medium">📊 Grid (1cm² units)</span>
              </button>
              
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl hover:bg-yellow-200 transition-colors disabled:opacity-50"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="font-medium">↶ Undo</span>
              </button>
            </div>
          </div>

          {/* AI Shape Generator */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-600" />
              🤖 AI Shape Generator (Vertex AI - Gemini Vision)
            </h3>
            
            {/* Language Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🌐 Label Language:
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={aiShapePrompt}
                  onChange={(e) => setAiShapePrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAiGenerate()}
                  placeholder="Type: 'Draw triangle with base 5 cm and height 8 cm' or 'Create square with 10cm sides'"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <button
                onClick={handleAiGenerate}
                disabled={isGeneratingShape}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg disabled:opacity-50"
              >
                {isGeneratingShape ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                <span className="font-semibold">
                  {isGeneratingShape ? 'Generating...' : '🎯 Generate'}
                </span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              🧠 AI recognizes shape names, measurements, and generates labels in {languages.find(l => l.value === selectedLanguage)?.label}
            </p>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Grid3X3 className="w-6 h-6 mr-3 text-blue-600" />
              🖼️ Canvas - Page {canvasPages}
            </h2>
            <div className="flex space-x-3">
              <button
                onClick={clearCanvas}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>🗑️ Clear</span>
              </button>
              <button
                onClick={() => setCanvasPages(prev => prev + 1)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
              >
                <span>📄 New Page</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>💾 Save</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors shadow-lg"
              >
                <Printer className="w-4 h-4" />
                <span>🖨️ Print</span>
              </button>
            </div>
          </div>

          {/* Drawing Canvas */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="w-full h-[500px] border-2 border-dashed border-gray-300 rounded-2xl bg-white cursor-crosshair transition-all duration-300 touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              onClick={handleCanvasClick}
              style={{
                touchAction: 'none',
                backgroundImage: showGrid ? 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)' : 'none',
                backgroundSize: showGrid ? '20px 20px' : 'auto'
              }}
            />
            
            {/* Tool indicator */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl text-sm font-medium text-gray-700 shadow-lg border border-gray-200">
              Current: {drawingTools.find(t => t.id === drawingState.tool)?.label || mathShapes.find(s => s.id === drawingState.tool)?.label || 'Tool'}
            </div>

            {/* Grid info */}
            {showGrid && (
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl text-xs text-gray-600 shadow-lg border border-gray-200">
                📊 Grid: 1cm² units (20px)
              </div>
            )}
          </div>

          {/* Canvas Features */}
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">🎨 Enhanced Canvas Features:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm">
                <span className="text-2xl">✏️</span>
                <div>
                  <p className="font-medium text-gray-900">HTML5 Canvas</p>
                  <p className="text-xs text-gray-600">Native drawing support</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm">
                <span className="text-2xl">🤖</span>
                <div>
                  <p className="font-medium text-gray-900">Vertex AI (Gemini)</p>
                  <p className="text-xs text-gray-600">Advanced shape generation</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm">
                <span className="text-2xl">🌐</span>
                <div>
                  <p className="font-medium text-gray-900">Multi-language</p>
                  <p className="text-xs text-gray-600">10 Indian languages</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm">
                <span className="text-2xl">📱</span>
                <div>
                  <p className="font-medium text-gray-900">Touch Ready</p>
                  <p className="text-xs text-gray-600">Mobile & tablet support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalBoard;