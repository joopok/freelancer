import React from 'react';

interface JobKoreaLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const JobKoreaLogo: React.FC<JobKoreaLogoProps> = ({ 
  width = 200, 
  height = 50, 
  className = '' 
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background */}
      <rect width="200" height="50" rx="8" fill="#0052CC"/>
      
      {/* Text: Job */}
      <text
        x="20"
        y="35"
        fill="white"
        fontSize="28"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        Job
      </text>
      
      {/* Text: Korea */}
      <text
        x="75"
        y="35"
        fill="#FFC107"
        fontSize="28"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        Korea
      </text>
      
      {/* Small accent */}
      <circle cx="180" cy="25" r="3" fill="#FFC107"/>
    </svg>
  );
};

export default JobKoreaLogo;