
import React from 'react';

export const JobStats = () => {
  return (
    <div className="flex space-x-8 border-b border-gray-200 pb-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">4</div>
        <div className="text-sm text-gray-600">Total Jobs</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">2</div>
        <div className="text-sm text-gray-600">New Today</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-600">1</div>
        <div className="text-sm text-gray-600">Saved</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-600">0</div>
        <div className="text-sm text-gray-600">Applied</div>
      </div>
    </div>
  );
};
