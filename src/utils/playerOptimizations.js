// Performance optimizations for player components
import { useEffect, useCallback } from 'react';

// Custom hook to optimize player performance
export const usePlayerOptimizations = () => {
  useEffect(() => {
    // Disable smooth scrolling during video playback to improve performance
    const body = document.body;
    const originalOverflow = body.style.overflow;
    
    // Add performance hints to the document
    const style = document.createElement('style');
    style.textContent = `
      .player-active {
        contain: layout style paint;
        will-change: auto;
      }
      .player-active iframe {
        transform: translateZ(0);
        backface-visibility: hidden;
      }
    `;
    document.head.appendChild(style);

    // Add class to body for player-specific optimizations
    body.classList.add('player-active');

    return () => {
      // Cleanup
      body.classList.remove('player-active');
      body.style.overflow = originalOverflow;
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // Optimized iframe load handler
  const handleIframeLoad = useCallback(() => {
    // Force repaint optimization
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.style.transform = 'translateZ(0)';
    }
  }, []);

  return { handleIframeLoad };
};

// Throttle function to improve performance
export const throttle = (func, delay) => {
  let timeoutId;
  let lastExecTime = 0;
  return function (...args) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};
