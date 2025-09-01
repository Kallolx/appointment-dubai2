import { Info } from 'lucide-react';
import React from 'react';

const Tabby: React.FC = () => {
  return (
    <div className="sticky top-12 md:top-14 z-30 bg-gray-50">
      <div className="container mx-auto px-4 2xl:max-w-[1600px]">
        <div className="flex items-center justify-center py-4">
          <div className="text-sm text-gray-600 flex items-center gap-2 whitespace-nowrap">
           <img src="/icons/tabby.svg" alt="Tabby" className="h-5" />
            <span className="truncate">Available on selected services</span>
            <Info className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabby;
