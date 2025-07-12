import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Browser compatibility check and polyfills
const initializeApp = () => {
  // Check for basic browser support
  const isSupported = () => {
    try {
      // Check for essential features
      return (
        typeof Promise !== 'undefined' &&
        typeof fetch !== 'undefined' &&
        typeof Object.assign !== 'undefined' &&
        typeof Array.from !== 'undefined'
      );
    } catch (e) {
      return false;
    }
  };

  // Add polyfills for older browsers
  const addPolyfills = () => {
    // Object.assign polyfill for IE
    if (typeof Object.assign !== 'function') {
      Object.assign = function(target: any, ...sources: any[]) {
        if (target == null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }
        const to = Object(target);
        for (let index = 0; index < sources.length; index++) {
          const nextSource = sources[index];
          if (nextSource != null) {
            for (const nextKey in nextSource) {
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      };
    }

    // Array.from polyfill for IE
    if (!Array.from) {
      Array.from = function(arrayLike: any, mapFn?: any, thisArg?: any) {
        const C = this;
        const items = Object(arrayLike);
        if (arrayLike == null) {
          throw new TypeError('Array.from requires an array-like object - not null or undefined');
        }
        const mapFunction = mapFn === undefined ? undefined : mapFn;
        if (typeof mapFunction !== 'undefined' && typeof mapFunction !== 'function') {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }
        const len = parseInt(items.length) || 0;
        const A = typeof C === 'function' ? Object(new C(len)) : new Array(len);
        let k = 0;
        while (k < len) {
          const kValue = items[k];
          if (mapFunction) {
            A[k] = typeof thisArg === 'undefined' ? mapFunction(kValue, k) : mapFunction.call(thisArg, kValue, k);
          } else {
            A[k] = kValue;
          }
          k += 1;
        }
        A.length = len;
        return A;
      };
    }
  };

  // Initialize the app
  const startApp = () => {
    try {
      const rootElement = document.getElementById('root');
      if (!rootElement) {
        throw new Error('Root element not found');
      }

      // Hide loading fallback
      const loadingFallback = document.querySelector('.loading-fallback') as HTMLElement;
      if (loadingFallback) {
        loadingFallback.style.display = 'none';
      }

      const root = createRoot(rootElement);
      root.render(
        <StrictMode>
          <App />
        </StrictMode>
      );
    } catch (error) {
      console.error('Failed to initialize SAHAYAK:', error);
      
      // Show fallback UI
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.innerHTML = `
          <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
            <h1>SAHAYAK Teacher Dashboard</h1>
            <p style="color: #dc2626;">Unable to load the application. Please try refreshing the page.</p>
            <p>If the problem persists, please check your browser compatibility:</p>
            <ul style="list-style: none; padding: 0; color: #6b7280;">
              <li>• Chrome 61+ ✓</li>
              <li>• Firefox 60+ ✓</li>
              <li>• Safari 12+ ✓</li>
              <li>• Edge 79+ ✓</li>
            </ul>
            <button onclick="window.location.reload()" style="
              background: #3b82f6; 
              color: white; 
              border: none; 
              padding: 12px 24px; 
              border-radius: 8px; 
              cursor: pointer; 
              font-size: 16px;
              margin-top: 20px;
            ">
              Refresh Page
            </button>
          </div>
        `;
      }
    }
  };

  // Check browser support and add polyfills if needed
  if (!isSupported()) {
    addPolyfills();
  }

  // Start the app
  startApp();
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
