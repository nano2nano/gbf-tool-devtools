import browser from 'webextension-polyfill';

// check to exists devtool.
browser.runtime.onConnect.addListener((port) => {
  console.log('open devtools');
  browser.storage.local.set({ existsDevtools: true });
  port.onDisconnect.addListener(() => {
    console.log('close devtools');
    browser.storage.local.set({ existsDevtools: false });
  });
});

browser.runtime.onMessage.addListener(baackgroundMessageHandler);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function baackgroundMessageHandler(message: any) {
  console.log(message);
  if (message.tab_id !== undefined) {
    browser.tabs.sendMessage(message.tab_id, message);
  }
}


// function messageHandler(message: any) {
//   console.log(message);
//   if (message.tab_id !== undefined) {
//     // redirect to content.js
//     const tab_id = message.tab_id;
//     // browser.tabs.sendMessage(tab_id, message);
//   } else {
//     // process in background.js
//   }
//   return false;
// }

// function setReloadAlarm(tabId: number | undefined, delayInMinutes: number | undefined) {
//   const listener = (name: Alarms.Alarm) => {
//     switch (name.name) {
//       case 'reload_page':
//         browser.tabs.reload(tabId);
//         browser.alarms.onAlarm.removeListener(listener);
//         browser.alarms.clear('reload_page');
//         break;
//       default:
//         break;
//     }
//   };
//   browser.alarms.create('reload_page', { delayInMinutes: delayInMinutes });
//   browser.alarms.onAlarm.addListener(listener);
// }
