console.log("Content script loaded.");

function injectScript(file) {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(file);
  (document.head || document.documentElement).appendChild(script);
}

injectScript('inject.js');

async function checkForMetaMask() {
  return new Promise((resolve) => {
    window.postMessage({ type: 'METAMASK_CHECK' }, '*');
    
    window.addEventListener('message', function listener(event) {
      if (event.data.type === 'METAMASK_RESULT') {
        window.removeEventListener('message', listener);
        resolve(event.data.detected);
      }
    });
  });
}

async function connectToMetaMask() {
  if (await checkForMetaMask()) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Connected account:', accounts[0]);
      chrome.runtime.sendMessage({ type: 'METAMASK_CONNECTED', account: accounts[0] });
      return true;
    } catch (error) {
      console.error('User denied account access', error);
      return false;
    }
  } else {
    console.error('MetaMask not detected');
    chrome.runtime.sendMessage({ type: 'METAMASK_NOT_DETECTED' });
    return false;
  }
}

// Run when the DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', connectToMetaMask);
} else {
  connectToMetaMask();
}
