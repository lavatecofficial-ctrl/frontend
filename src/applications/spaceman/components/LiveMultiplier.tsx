'use client';

interface LiveMultiplierProps {
  roundData: {
    current_multiplier: number;
  };
  isConnected?: boolean;
}

export default function LiveMultiplier({ roundData }: LiveMultiplierProps) {
  const formatMultiplier = (multiplier: number) => {
    if (multiplier === 0) return '0.00x';
    return `${multiplier.toFixed(2)}x`;
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-[#1A0B1A] to-[#2A0B2A] border border-[#4C1D95] text-gray-200 flex flex-col items-center justify-center p-4 relative overflow-hidden live-multiplier" style={{ borderRadius: '20px', height: '100%' }}>
      <div className="text-center h-full flex flex-col justify-center">
        <div className="text-sm text-purple-300 mb-2">MULTIPLICADOR ACTUAL</div>
        <div className="text-4xl font-bold text-white">
          {formatMultiplier(roundData.current_multiplier)}
        </div>
      </div>
    </div>
  );
}
