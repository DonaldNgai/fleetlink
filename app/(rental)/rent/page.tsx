'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Check } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@chakra-ui/react';
import { CardRoot as Card } from '@chakra-ui/react';
import { cn } from '@DonaldNgai/next-utils';

// Equipment types with background images - matching the confirm-rental page equipmentMap
const equipmentTypes = [
  {
    id: 'triaxle',
    name: 'Tri Axle Dump Truck',
    image: 'https://images.unsplash.com/photo-1686945127938-0296f10937ed?w=800&h=600&fit=crop',
  },
  {
    id: 'sweeper',
    name: 'Sweeper Truck',
    image: 'https://www.elginsweeper.com/hs-fs/hubfs/IMG_1583.jpeg?width=1200&height=800&name=IMG_1583.jpeg',
  },
  {
    id: 'water',
    name: 'Water Truck',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop',
  },
  {
    id: 'hydrovac',
    name: 'Hydrovac Truck',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
  },
  {
    id: 'excavator',
    name: 'Excavator',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop',
  },
  {
    id: 'loader',
    name: 'Loader',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
  },
  {
    id: 'bulldozer',
    name: 'Bulldozer',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop',
  },
  {
    id: 'crane',
    name: 'Crane',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
  },
];

export default function RentPage() {
  const router = useRouter();
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  
  // Set default dates: today and 1 week from today
  const today = new Date();
  const oneWeekFromToday = new Date();
  oneWeekFromToday.setDate(today.getDate() + 7);
  
  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(oneWeekFromToday);
  const [startTime, setStartTime] = useState('08:00'); // 8am
  const [endTime, setEndTime] = useState('16:00'); // 4pm

  const toggleEquipment = (id: string) => {
    setSelectedEquipment(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selectedEquipment.length === 0) {
      alert('Please select at least one equipment type');
      return;
    }
    if (!startDate || !endDate) {
      alert('Please select a date range');
      return;
    }
    if (!startTime || !endTime) {
      alert('Please select start and end times');
      return;
    }

    // Pass data to confirmation page via URL params
    const params = new URLSearchParams({
      equipment: selectedEquipment.join(','),
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      startTime,
      endTime,
    });

    router.push(`/confirm-rental?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Select Equipment</h1>
          <p className="text-lg text-gray-600">Choose the equipment you need for your project</p>
        </div>

        {/* Date and Time Selection */}
        <div className="mb-10 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="h-4 w-4" />
                Date Range
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="date"
                  value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
                <span className="text-gray-400 font-medium">to</span>
                <input
                  type="date"
                  value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                  min={startDate ? format(startDate, 'yyyy-MM-dd') : undefined}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            {/* Time Range */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Clock className="h-4 w-4" />
                Time Range
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
                <span className="text-gray-400 font-medium">to</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Grid - Airbnb Style */}
        <div className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {equipmentTypes.map((equipment) => {
              const isSelected = selectedEquipment.includes(equipment.id);
              return (
                <Card
                  key={equipment.id}
                  className={cn(
                    'relative aspect-square cursor-pointer transition-all duration-300 overflow-hidden group rounded-xl',
                    'hover:shadow-xl hover:scale-[1.02]',
                    isSelected && 'ring-4 ring-orange-500 ring-offset-2 shadow-xl scale-[1.02]'
                  )}
                  onClick={() => toggleEquipment(equipment.id)}
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${equipment.image})` }}
                  >
                    {/* Overlay */}
                    <div
                      className={cn(
                        'absolute inset-0 transition-colors duration-300',
                        isSelected
                          ? 'bg-orange-500/70'
                          : 'bg-black/30 group-hover:bg-black/40'
                      )}
                    />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-4 text-white">
                    <div className="flex-1 flex items-center justify-center">
                      {isSelected && (
                        <div className="bg-white rounded-full p-3 shadow-lg animate-in zoom-in duration-200">
                          <Check className="h-6 w-6 text-orange-500" />
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-base sm:text-lg drop-shadow-lg">{equipment.name}</h3>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            size="lg"
            className="px-12 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedEquipment.length === 0 || !startDate || !endDate || !startTime || !endTime}
          >
            Continue ({selectedEquipment.length} selected)
          </Button>
        </div>
      </div>
    </div>
  );
}
