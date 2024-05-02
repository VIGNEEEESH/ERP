import React from 'react';
import QRCode from 'qrcode.react';

const QRCodePopup = ({ qrCodeData, onClose }) => {
    const handleCopyUserId = () => {
        navigator.clipboard.writeText(qrCodeData.userId);
      };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-10 rounded-lg">
        <QRCode size={500} value={qrCodeData.userId} />
        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-10 rounded" onClick={onClose}>
          Close
        </button><br /><br />
        <div className="flex items-center">
          <span className="mr-2">{qrCodeData.userId}</span>
          <button onClick={handleCopyUserId} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            Copy UserId
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodePopup;
