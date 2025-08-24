const fs = require('fs');
const path = require('path');
const glob = require('glob').glob;

const SCRIPT_CONTENT = `
(function() {
  if (window.self === window.top) return;

  const logs = [];
  const MAX_LOGS = 500;

  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug
  };

  function captureLog(level, args) {
    const timestamp = new Date().toISOString();
    const message = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg, (key, value) => {
            if (typeof value === 'function') return '[Function]';
            if (value instanceof Error) return value.toString();
            return value;
          }, 2);
        } catch (e) {
          return '[Object]';
        }
      }
      return String(arg);
    }).join(' ');

    const logEntry = {
      timestamp,
      level,
      message,
      url: window.location.href
    };

    logs.push(logEntry);
    if (logs.length > MAX_LOGS) {
      logs.shift();
    }

    try {
      window.parent.postMessage({
        type: 'console-log',
        log: logEntry
      }, '*');
    } catch (e) {}
  }

  ['log', 'warn', 'error', 'info', 'debug'].forEach(level => {
    console[level] = function(...args) {
      originalConsole[level].apply(console, args);
      captureLog(level, args);
    };
  });

  window.addEventListener('error', (event) => {
    captureLog('error', [event.error || event.message]);
  });

  window.addEventListener('unhandledrejection', (event) => {
    captureLog('error', ['Unhandled Promise Rejection:', event.reason]);
  });

  function sendReady() {
    try {
      window.parent.postMessage({
        type: 'console-capture-ready',
        url: window.location.href,
        timestamp: new Date().toISOString()
      }, '*');
    } catch (e) {}
  }

  function sendRouteChange() {
    try {
      window.parent.postMessage({
        type: 'route-change',
        route: {
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash,
          href: window.location.href
        },
        timestamp: new Date().toISOString()
      }, '*');
    } catch (e) {}
  }

  // Send ready message
  if (document.readyState === 'complete') {
    sendReady();
    sendRouteChange();
  } else {
    window.addEventListener('load', () => {
      sendReady();
      sendRouteChange();
    });
  }

  // Monitor route changes
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    setTimeout(sendRouteChange, 0);
  };

  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    setTimeout(sendRouteChange, 0);
  };

  window.addEventListener('popstate', sendRouteChange);
  window.addEventListener('hashchange', sendRouteChange);
})();
`;

function injectConsoleCapture() {
  const targetDir = path.join(process.cwd(), '.next/static');
  
  console.log('📁 Found Next.js build directory');
  
  glob(`${targetDir}/**/*.html`, (err, files) => {
    if (err) {
      console.error('Error finding HTML files:', err);
      return;
    }

    if (files.length === 0) {
      console.log('⚠️  No HTML files found in build directory');
      return;
    }

    files.forEach(file => {
      try {
        let content = fs.readFileSync(file, 'utf8');
        
        // Check if script is already injected
        if (content.includes('console-capture-ready')) {
          return;
        }
        
        // Inject script before closing head tag
        const scriptTag = `<script>${SCRIPT_CONTENT}</script>`;
        
        if (content.includes('</head>')) {
          content = content.replace('</head>', `${scriptTag}</head>`);
        } else if (content.includes('<head>')) {
          content = content.replace('<head>', `<head>${scriptTag}`);
        } else {
          // Fallback: inject at beginning of body
          content = content.replace('<body>', `<body>${scriptTag}`);
        }
        
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✅ Injected console capture into: ${path.relative(process.cwd(), file)}`);
      } catch (error) {
        console.error(`❌ Failed to process ${file}:`, error.message);
      }
    });
    
    console.log(`🎉 Console capture injection complete! Processed ${files.length} files.`);
  });
}

// Run injection
injectConsoleCapture();