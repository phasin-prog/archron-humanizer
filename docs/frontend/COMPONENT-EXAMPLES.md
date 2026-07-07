
---

## Implementation Examples

### AcademicSeal Component

```tsx
// components/seals/AcademicSeal.tsx
import React from 'react';

interface AcademicSealProps {
  sealId: string;
  isEarned: boolean;
  size?: 'sm' | 'md' | 'lg';
  color: 'slate' | 'blue' | 'silver' | 'gold';
  onClick?: () => void;
}

const sizeMap = {
  sm: 48,
  md: 64,
  lg: 96,
};

const colorMap = {
  slate: '#465264',
  blue: '#5F8DCE',
  silver: '#C7D0DB',
  gold: '#B89A63',
};

export const AcademicSeal: React.FC<AcademicSealProps> = ({
  sealId,
  isEarned,
  size = 'md',
  color,
  onClick,
}) => {
  const dimension = sizeMap[size];
  const fillColor = colorMap[color];
  
  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 100 100"
      onClick={onClick}
      className={`
        cursor-pointer transition-all duration-300
        ${isEarned ? 'opacity-100' : 'opacity-40'}
        hover:scale-105
      `}
      role="img"
      aria-label={`Academic seal: ${sealId}`}
    >
      {/* Octagon shape */}
      <path
        d="M30,10 L70,10 L90,30 L90,70 L70,90 L30,90 L10,70 L10,30 Z"
        fill={isEarned ? fillColor : 'none'}
        stroke={fillColor}
        strokeWidth="2"
      />
      
      {/* Center symbol (varies by seal) */}
      <circle
        cx="50"
        cy="50"
        r="8"
        fill={isEarned ? 'white' : fillColor}
      />
    </svg>
  );
};
```

---

### ThinkerCard Component

```tsx
// components/constellation/ThinkerCard.tsx
import React from 'react';
import Image from 'next/image';

interface ThinkerCardProps {
  id: string;
  name: string;
  era: string;
  domain: string;
  tradition?: string;
  imageUrl?: string;
  onClick?: () => void;
}

export const ThinkerCard: React.FC<ThinkerCardProps> = ({
  name,
  era,
  domain,
  tradition,
  imageUrl,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="
        rounded-xl border border-border bg-card p-6
        transition-all duration-300
        hover:shadow-md hover:border-primary/40
        cursor-pointer group
      "
    >
      {/* Image/Avatar */}
      {imageUrl && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt={name}
            width={200}
            height={200}
            className="transition-transform group-hover:scale-105"
          />
        </div>
      )}
      
      {/* Name */}
      <h3 className="text-lg font-medium text-primary mb-1">
        {name}
      </h3>
      
      {/* Era */}
      <p className="text-sm text-text-secondary mb-2">
        {era}
      </p>
      
      {/* Tradition badge */}
      {tradition && (
        <span className="inline-block px-3 py-1 text-xs rounded-full bg-primary/10 text-primary">
          {tradition}
        </span>
      )}
    </div>
  );
};
```

---

### SealNotification Component

```tsx
// components/seals/SealNotification.tsx
import React, { useEffect, useState } from 'react';
import { AcademicSeal } from './AcademicSeal';

interface SealNotificationProps {
  seal: {
    id: string;
    name: string;
    tier: 'slate' | 'blue' | 'silver' | 'gold';
    description: string;
  };
  onDismiss: () => void;
  duration?: number;
}

export const SealNotification: React.FC<SealNotificationProps> = ({
  seal,
  onDismiss,
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Slide in
    setTimeout(() => setIsVisible(true), 100);
    
    // Auto dismiss
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);
  
  return (
    <div
      className={`
        fixed top-20 right-4 z-50
        bg-card border border-border rounded-xl shadow-lg
        p-4 w-80
        transition-all duration-300
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-4">
        <AcademicSeal
          sealId={seal.id}
          isEarned={true}
          size="md"
          color={seal.tier}
        />
        
        <div className="flex-1">
          <h4 className="font-medium text-primary mb-1">
            🔖 {seal.name}
          </h4>
          <p className="text-sm text-text-secondary">
            {seal.description}
          </p>
        </div>
        
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onDismiss, 300);
          }}
          className="text-text-disabled hover:text-text-primary"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
};
```

---

End of Component Examples
