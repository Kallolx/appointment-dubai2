import { Info } from 'lucide-react';
import React from 'react';

const Tabby: React.FC = () => {
  return (
    <div className="sticky top-14 z-30 bg-gray-50">
      <div className="container mx-auto px-4 2xl:max-w-[1600px]">
        <div className="flex items-center justify-center py-4">
          <div className="text-sm text-gray-600 flex items-center gap-2 whitespace-nowrap">
            <span className="inline-block px-2 py-0 rounded-sm bg-gradient-to-r from-emerald-200 to-emerald-400 font-bold text-black">Tabby</span>
            <span className="truncate">available on selected services</span>
            <Info className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabby;
