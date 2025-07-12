import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Clock, Star, Globe, BookOpen } from 'lucide-react';

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isHoliday: boolean;
  holidayName?: string;
}

interface DateInfo {
  dayName: string;
  weekNumber: number;
  monthName: string;
  year: number;
  isLeapYear: boolean;
  isHoliday: boolean;
  holidayName?: string;
  seasonInfo: string;
  moonPhase: string;
  funFact: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateInfo, setDateInfo] = useState<DateInfo | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Sample holidays data
  const holidays: { [key: string]: string } = {
    '2025-01-01': 'New Year\'s Day',
    '2025-01-26': 'Republic Day',
    '2025-03-14': 'Holi',
    '2025-08-15': 'Independence Day',
    '2025-10-02': 'Gandhi Jayanti',
    '2025-10-24': 'Dussehra',
    '2025-11-12': 'Diwali',
    '2025-12-25': 'Christmas Day'
  };

  const seasons = [
    { months: [11, 0, 1], name: 'Winter', emoji: '❄️', description: 'Cold season with shorter days' },
    { months: [2, 3, 4], name: 'Spring', emoji: '🌸', description: 'Season of new growth and blooming' },
    { months: [5, 6, 7], name: 'Summer', emoji: '☀️', description: 'Hot season with longer days' },
    { months: [8, 9, 10], name: 'Autumn', emoji: '🍂', description: 'Season of harvest and falling leaves' }
  ];

  const moonPhases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];

  const funFacts = [
    "Did you know? A year has 365.25 days, which is why we have leap years!",
    "The calendar we use today is called the Gregorian calendar.",
    "Ancient civilizations used the moon to track months.",
    "The word 'calendar' comes from the Latin word 'calendae'.",
    "Some cultures celebrate New Year at different times of the year.",
    "The longest day of the year is called the summer solstice.",
    "February is the shortest month with only 28 or 29 days.",
    "A week has 7 days, named after ancient gods and celestial bodies."
  ];

  useEffect(() => {
    generateCalendar();
  }, [currentDate]);

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dateString = currentDay.toISOString().split('T')[0];
      const isHoliday = holidays.hasOwnProperty(dateString);
      
      days.push({
        date: currentDay.getDate(),
        isCurrentMonth: currentDay.getMonth() === month,
        isToday: currentDay.toDateString() === today.toDateString(),
        isSelected: selectedDate ? currentDay.toDateString() === selectedDate.toDateString() : false,
        isHoliday,
        holidayName: isHoliday ? holidays[dateString] : undefined
      });
      
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    setCalendarDays(days);
  };

  const handleDateClick = (dayIndex: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const clickedDate = new Date(startDate);
    clickedDate.setDate(clickedDate.getDate() + dayIndex);
    
    setSelectedDate(clickedDate);
    generateDateInfo(clickedDate);
  };

  const generateDateInfo = (date: Date) => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const year = date.getFullYear();
    const month = date.getMonth();
    const dayOfWeek = date.getDay();
    
    // Calculate week number
    const startOfYear = new Date(year, 0, 1);
    const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
    
    // Check if leap year
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    
    // Get season
    const currentSeason = seasons.find(season => season.months.includes(month));
    
    // Get holiday info
    const dateString = date.toISOString().split('T')[0];
    const isHoliday = holidays.hasOwnProperty(dateString);
    
    // Get moon phase (simplified)
    const moonPhaseIndex = Math.floor((date.getDate() - 1) / 4) % 8;
    
    // Get random fun fact
    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    
    setDateInfo({
      dayName: dayNames[dayOfWeek],
      weekNumber,
      monthName: monthNames[month],
      year,
      isLeapYear,
      isHoliday,
      holidayName: isHoliday ? holidays[dateString] : undefined,
      seasonInfo: currentSeason ? `${currentSeason.emoji} ${currentSeason.name} - ${currentSeason.description}` : '',
      moonPhase: moonPhases[moonPhaseIndex],
      funFact: randomFact
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    generateDateInfo(today);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <CalendarIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Interactive Learning Calendar
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore dates, learn about time, and discover interesting facts about our calendar system
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="xl:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <button
                    onClick={goToToday}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Today
                  </button>
                </div>
                
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map((day) => (
                  <div key={day} className="text-center py-3 font-semibold text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => handleDateClick(index)}
                    className={`
                      relative p-3 rounded-xl transition-all duration-200 hover:scale-105
                      ${day.isCurrentMonth 
                        ? 'text-gray-900' 
                        : 'text-gray-400'
                      }
                      ${day.isToday 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : day.isSelected
                        ? 'bg-blue-100 text-blue-900 border-2 border-blue-500'
                        : day.isHoliday
                        ? 'bg-red-100 text-red-900'
                        : 'bg-gray-50 hover:bg-gray-100'
                      }
                    `}
                  >
                    <span className="font-medium">{day.date}</span>
                    {day.isHoliday && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Google Calendar Embed */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-blue-600" />
                  Google Calendar Integration
                </h3>
                <div className="bg-gray-100 rounded-xl p-6 text-center">
                  <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">📅 Current Date & Time</h3>
                    <div className="space-y-4">
                      <div className="text-4xl font-bold text-blue-600">
                        {new Date().toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-2xl text-gray-700">
                        {new Date().toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true
                        })}
                      </div>
                      <p className="text-gray-600 mt-4">
                        Click on any date in the calendar above to learn more about it!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Date Information Panel */}
          <div className="space-y-6">
            {selectedDate && dateInfo ? (
              <>
                {/* Selected Date Info */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <CalendarIcon className="w-6 h-6 mr-2 text-blue-600" />
                    Selected Date
                  </h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900">
                        {selectedDate.getDate()}
                      </p>
                      <p className="text-lg text-gray-600">
                        {dateInfo.monthName} {dateInfo.year}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Day:</span>
                        <span className="font-medium text-gray-900">{dateInfo.dayName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Week:</span>
                        <span className="font-medium text-gray-900">Week {dateInfo.weekNumber}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Month:</span>
                        <span className="font-medium text-gray-900">{dateInfo.monthName} (Month {selectedDate.getMonth() + 1})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Year:</span>
                        <span className="font-medium text-gray-900">
                          {dateInfo.year} {dateInfo.isLeapYear ? '(Leap Year)' : '(Regular Year)'}
                        </span>
                      </div>
                    </div>

                    {dateInfo.isHoliday && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Star className="w-5 h-5 text-red-600" />
                          <span className="font-medium text-red-900">Holiday</span>
                        </div>
                        <p className="text-red-800 mt-1">{dateInfo.holidayName}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Learning Information */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="w-6 h-6 mr-2 text-purple-600" />
                    Learning Corner
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Season Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Season</h4>
                      <p className="text-blue-800">{dateInfo.seasonInfo}</p>
                    </div>

                    {/* Moon Phase */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-900 mb-2">Moon Phase</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{dateInfo.moonPhase}</span>
                        <span className="text-purple-800">Approximate moon phase</span>
                      </div>
                    </div>

                    {/* Fun Fact */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-900 mb-2">Did You Know?</h4>
                      <p className="text-yellow-800">{dateInfo.funFact}</p>
                    </div>
                  </div>
                </div>

                {/* Time Concepts */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Clock className="w-6 h-6 mr-2 text-green-600" />
                    Time Concepts
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Days in this month:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(dateInfo.year, selectedDate.getMonth() + 1, 0).getDate()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Days in this year:</span>
                      <span className="font-medium text-gray-900">
                        {dateInfo.isLeapYear ? '366' : '365'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Quarter:</span>
                      <span className="font-medium text-gray-900">
                        Q{Math.ceil((selectedDate.getMonth() + 1) / 3)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Day of year:</span>
                      <span className="font-medium text-gray-900">
                        {Math.ceil((selectedDate.getTime() - new Date(dateInfo.year, 0, 1).getTime()) / 86400000) + 1}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="text-center text-gray-500">
                  <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Click on a date</p>
                  <p className="text-sm">Select any date to learn more about it</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;