import '@/styles/circular-loader.css';

interface CircularLoaderProps {
  message?: string;
}

export default function CircularLoader({ message }: CircularLoaderProps) {
  return (
    <div className="loader">
      <span className="element"></span>
      <span className="element"></span>
      <span className="element"></span>
    </div>
  );
}
