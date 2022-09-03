import browser from 'webextension-polyfill';

console.info('load content.js (gbf tool)');

router();
window.addEventListener('hashchange', router);

async function router() {
  console.log('load gbf extension');
}

browser.runtime.onMessage.addListener(contentMessageHandler);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function contentMessageHandler(message: any) {
  console.log(message);
  switch (message.tag) {
    case 'appear_hell':
      console.log('appear hell');
      alert('appear hell');
      break;
    case 'devtools_loaded':
      alert('devtools loaded');
      break;
    default:
      break;
  }
}

browser.runtime.onMessage.addListener((request) => {
  console.log("Message from the background script:");
  console.log(request.greeting);
  return Promise.resolve({ response: "Hi from content script" });
});
