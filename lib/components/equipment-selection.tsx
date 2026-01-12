'use client';

import { Check } from 'lucide-react';
import { CardRoot as Card } from '@chakra-ui/react';
import { cn } from '@DonaldNgai/chakra-ui/utils';
import { equipmentTypes, type EquipmentType } from '@/lib/equipment-types';

interface EquipmentSelectionProps {
  selectedEquipment: string[];
  onToggleEquipment: (id: string) => void;
  maxColumns?: number;
  showAll?: boolean;
  limit?: number;
}

export function EquipmentSelection({
  selectedEquipment,
  onToggleEquipment,
  maxColumns = 4,
  showAll = true,
  limit,
}: EquipmentSelectionProps) {
  const displayEquipment = showAll
    ? equipmentTypes
    : equipmentTypes.slice(0, limit || 8);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
      {displayEquipment.map((equipment) => {
        const isSelected = selectedEquipment.includes(equipment.id);
        return (
          <Card
            key={equipment.id}
            className={cn(
              'relative aspect-square cursor-pointer transition-all duration-300 overflow-hidden group rounded-xl',
              'hover:shadow-xl hover:scale-[1.02]',
              isSelected && 'ring-4 ring-orange-500 ring-offset-2 shadow-xl scale-[1.02]'
            )}
            onClick={() => onToggleEquipment(equipment.id)}
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
                <h3 className="font-semibold text-base sm:text-lg drop-shadow-lg">
                  {equipment.name}
                </h3>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
