import React from 'react';

interface DozenPercentagesCardProps {
  stats?: {
    zero: number;
    first: number;
    second: number;
    third: number;
  };
  roundData?: {
    number: number;
    color: string;
  };
}

const DozenPercentagesCard: React.FC<DozenPercentagesCardProps> = ({ stats, roundData }) => {
  const percentages = stats || { zero: 0, first: 0, second: 0, third: 0 };

  const fixedPercentages = [
    { key: 'first', value: parseFloat(percentages.first.toString()), label: '1ª Docena' },
    { key: 'second', value: parseFloat(percentages.second.toString()), label: '2ª Docena' },
    { key: 'third', value: parseFloat(percentages.third.toString()), label: '3ª Docena' },
    { key: 'zero', value: parseFloat(percentages.zero.toString()), label: 'Zero' },
  ];

  const getBarClass = (key: string) => {
    const sortedValues = fixedPercentages.map(item => item.value).sort((a, b) => b - a);
    const index = sortedValues.indexOf(fixedPercentages.find(item => item.key === key)?.value || 0);
    switch (index) {
      case 0:
        return 'bg-green-500';
      case 1:
        return 'bg-green-400';
      case 2:
        return 'bg-green-300';
      case 3:
        return 'bg-green-200';
      default:
        return 'bg-green-200';
    }
  };

  return (
    <div className="bg-gray-900/20 backdrop-blur-xl rounded-xl p-2 flex-1 flex flex-col">
      <div className="flex flex-col h-full">
        <h3 className="text-xs font-semibold text-white mb-2 text-center">
          Docenas (Número {roundData?.number ?? 'N/A'})
        </h3>
        <div className="flex flex-col gap-2 flex-1">
          {fixedPercentages.map(({ key, label, value }) => (
            <div key={key} className="flex flex-col">
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>{label}</span>
                <span>{value}%</span>
              </div>
              <div className="w-full bg-gray-800/50 rounded-full h-2">
                <div
                  className={`h-full rounded-full ${getBarClass(key)}`}
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DozenPercentagesCard;
