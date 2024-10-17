(function() {
    window.addEventListener('message', (event) => {
      if (event.data.type === 'METAMASK_CHECK') {
        if (typeof window.ethereum !== 'undefined') {
          window.postMessage({ type: 'METAMASK_RESULT', detected: true }, '*');
        } else {
          window.postMessage({ type: 'METAMASK_RESULT', detected: false }, '*');
        }
      }
    });
  })();
  