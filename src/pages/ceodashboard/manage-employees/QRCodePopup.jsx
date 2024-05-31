import React from 'react';
import QRCode from 'qrcode.react';
import { XIcon } from '@heroicons/react/solid';

const QRCodePopup = ({ qrCodeData, onClose }) => {
  const handleCopyUserId = () => {
    navigator.clipboard.writeText(qrCodeData.userId).then(() => {
      alert("User ID copied to clipboard");
    }).catch((err) => {
      alert("Failed to copy User ID: ", err);
    });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg relative">
        <QRCode size={300} value={qrCodeData.userId} />
        <button 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" 
          onClick={onClose}
        >
          <XIcon className="h-6 w-6" />
        </button>
        <div className="mt-6 flex items-center justify-between">
          <span className="text-gray-700">{qrCodeData.userId}</span>
          <button 
            onClick={handleCopyUserId} 
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Copy UID
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodePopup;
