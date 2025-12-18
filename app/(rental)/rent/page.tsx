'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Button } from '@chakra-ui/react';
import { CardRoot as Card } from '@chakra-ui/react';
import { cn } from '@utils';

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
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

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

    // Pass data to location selection page via URL params
    const params = new URLSearchParams({
      equipment: selectedEquipment.join(','),
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      startTime,
      endTime,
    });

    router.push(`/select-location?${params.toString()}`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20">
        {/* Header - Centered and Prominent */}
        <div className="mb-12 sm:mb-16 lg:mb-20 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            Select Equipment
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            Choose the equipment you need for your project
          </p>
        </div>

        {/* Date and Time Selection - Enhanced Card */}
        <div className="mb-16 max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-3xl shadow-lg p-8 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Date Range */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-base font-semibold text-gray-800">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <span>Date Range</span>
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="date"
                    value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                    className="flex-1 px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900 font-medium hover:border-gray-300"
                  />
                  <span className="text-gray-500 font-semibold text-lg">to</span>
                  <input
                    type="date"
                    value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                    min={startDate ? format(startDate, 'yyyy-MM-dd') : undefined}
                    className="flex-1 px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900 font-medium hover:border-gray-300"
                  />
                </div>
              </div>

              {/* Time Range */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-base font-semibold text-gray-800">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <span>Time Range</span>
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="flex-1 px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900 font-medium hover:border-gray-300"
                  />
                  <span className="text-gray-500 font-semibold text-lg">to</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="flex-1 px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900 font-medium hover:border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Grid - Perfectly Centered */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 max-w-6xl mx-auto">
            {equipmentTypes.map((equipment) => {
              const isSelected = selectedEquipment.includes(equipment.id);
              return (
                <Card
                  key={equipment.id}
                  className={cn(
                    'relative aspect-square cursor-pointer transition-all duration-300 overflow-hidden group rounded-2xl',
                    'hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1',
                    isSelected && 'ring-4 ring-orange-500 ring-offset-4 shadow-2xl scale-[1.03] -translate-y-1'
                  )}
                  onClick={() => toggleEquipment(equipment.id)}
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${equipment.image})` }}
                  >
                    {/* Overlay */}
                    <div
                      className={cn(
                        'absolute inset-0 transition-colors duration-300',
                        isSelected
                          ? 'bg-orange-500/75'
                          : 'bg-black/35 group-hover:bg-black/45'
                      )}
                    />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-5 sm:p-6 text-white">
                    <div className="flex-1 flex items-center justify-center">
                      {isSelected && (
                        <div className="bg-white rounded-full p-4 shadow-2xl animate-in zoom-in duration-300 scale-110">
                          <Check className="h-7 w-7 text-orange-500" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-base sm:text-lg lg:text-xl drop-shadow-2xl leading-tight">
                        {equipment.name}
                      </h3>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 max-w-5xl mx-auto">
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="lg"
            className={cn(
              'px-8 py-6 border-2 border-gray-300 hover:border-gray-400',
              'text-gray-700 font-semibold text-lg rounded-2xl',
              'transition-all duration-300 hover:bg-gray-50',
              'min-w-[200px] sm:min-w-[240px] flex items-center gap-2'
            )}
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>

          <Button
            onClick={handleContinue}
            size="lg"
            className={cn(
              'px-8 sm:px-16 py-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
              'text-white font-bold text-lg sm:text-xl rounded-2xl shadow-2xl hover:shadow-orange-500/50',
              'transition-all duration-300 transform hover:scale-105 active:scale-100',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
              'min-w-[200px] sm:min-w-[280px] flex items-center gap-2'
            )}
            disabled={selectedEquipment.length === 0 || !startDate || !endDate || !startTime || !endTime}
          >
            Continue {selectedEquipment.length > 0 && `(${selectedEquipment.length} selected)`}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
