/**
 * Console Manager Utility
 * Aggressively filters and clears console spam from streaming services
 * while preserving legitimate application logs
 */

export const initializeConsoleFilter = () => {
  // Store references to original console methods
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  // List of third-party services and common iframe errors to filter out
  const spamKeywords = [
    'yandex',
    'cloudflare', 
    'clarity',
    'usrpubtrk',
    'adcash',
    'googlesyndication',
    'doubleclick',
    'googletagmanager',
    'google-analytics',
    'facebook.net',
    'scorecardresearch',
    'quantserve',
    'outbrain',
    'taboola',
    'adsystem',
    'amazon-adsystem',
    'pubmatic',
    'rubiconproject',
    'casalemedia',
    'openx',
    'adsystem.com',
    'advertising.com',
    'adsrv.eacdn.com',
    'script error',
    'third-party',
    'cross-origin',
    'iframe',
    'embed',
    'player',
    'vidlink',
    'vidsrc',
    'multiembed',
    'cdn',
    'analytics',
    'tracker',
    'ads',
    'popup',
    'blocked',
    'denied',
    'cors',
    'mixed content',
    'insecure',
    'ssl',
    'certificate',
    'net::',
    'failed to load',
    'network error',
    'timeout',
    'xhr',
    'fetch'
  ];

  // Helper function to check if message contains spam keywords
  const isSpamMessage = (message) => {
    const messageStr = message.toLowerCase();
    return spamKeywords.some(keyword => messageStr.includes(keyword));
  };

  // More aggressive filtering - block almost everything except our app logs
  const isOurAppMessage = (message) => {
    const messageStr = message.toLowerCase();
    // Allow only messages that are clearly from our React app
    return messageStr.includes('react') || 
           messageStr.includes('webpack') || 
           messageStr.includes('hmr') ||
           messageStr.includes('app.jsx') ||
           messageStr.includes('component') ||
           (!messageStr.includes('http') && !messageStr.includes('www') && !messageStr.includes('.com'));
  };

  // Override console.log to filter spam
  console.log = function(...args) {
    const message = args.join(' ');
    if (isOurAppMessage(message) && !isSpamMessage(message)) {
      originalLog.apply(console, args);
    }
  };

  // Override console.warn to filter spam
  console.warn = function(...args) {
    const message = args.join(' ');
    if (isOurAppMessage(message) && !isSpamMessage(message)) {
      originalWarn.apply(console, args);
    }
  };

  // Override console.error to filter spam
  console.error = function(...args) {
    const message = args.join(' ');
    if (isOurAppMessage(message) && !isSpamMessage(message)) {
      originalError.apply(console, args);
    }
  };

  // Set up periodic console clearing for movie/TV player pages
  const clearInterval = setInterval(() => {
    // Check if we're on a player page
    const isPlayerPage = window.location.pathname.includes('/player/') || 
                        window.location.pathname.includes('/tv/');
    
    if (isPlayerPage) {
      // Clear console silently every 3 seconds on player pages
      try {
        const consoleElement = document.querySelector('[class*="console"]');
        if (consoleElement) {
          consoleElement.innerHTML = '';
        } else {
          // Fallback: use native clear but suppress the message
          setTimeout(() => {
            originalLog.clear ? originalLog.clear() : console.clear();
          }, 0);
        }
      } catch (e) {
        // Silent fallback
      }
    }
  }, 500);

  // Return cleanup function to restore original console methods
  return () => {
    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
    clearInterval(clearInterval);
  };
};

export default { initializeConsoleFilter };
