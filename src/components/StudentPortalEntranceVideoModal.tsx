import React from 'react';

interface StudentPortalEntranceVideoModalProps {
  isOpen: boolean;
  onEnterPortal: () => void;
}

export const StudentPortalEntranceVideoModal: React.FC<StudentPortalEntranceVideoModalProps> = ({
  isOpen,
  onEnterPortal
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
      <video
        src="https://videotourl.com/videos/1790744137219-38b6628d-0f5d-44a6-b084-71e2470e31d9.mp4"
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        onEnded={onEnterPortal}
      />
    </div>
  );
};
