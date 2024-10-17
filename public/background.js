// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'METAMASK_CONNECTED') {
    console.log('MetaMask connected with account:', message.account);
    // Handle successful connection
  } else if (message.type === 'METAMASK_NOT_DETECTED') {
    console.log('MetaMask not detected');
    // Handle MetaMask absence
  }
});