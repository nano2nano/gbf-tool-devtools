import browser from 'webextension-polyfill';
import { DevtoolsNetwork } from 'webextension-polyfill/namespaces/devtools_network';
import { getJson } from "./utils";

console.log("loaded devtools.html");
browser.devtools.network.onRequestFinished.addListener(requestHandler);
browser.runtime.connect();

async function requestHandler(request: DevtoolsNetwork.Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const url = (request as any).request.url;
  const res = await getJson(request);
  if (!res) return;
  const tabId = browser.devtools.inspectedWindow.tabId;
  switch (true) {
    case isResultRequest(url):
      if (res.appearance !== null) {
        // browser.tabs.update(tabId, { url: 'https://game.granbluefantasy.jp/#event/treasureraid124' });
        const message = {
          tag: 'appear_hell',
          tab_id: tabId,
        };
        await browser.runtime.sendMessage(message);
      } else {
        // browser.tabs.update(tabId, { url: 'https://game.granbluefantasy.jp/#quest/supporter/793071/1/0/10448' });
      }
      break;
    case isQuestResultRequest(url): {
      const winScenario = getScenarioByCmd('win', res.scenario);
      if (winScenario !== undefined) {
        console.log('win battle');
        if (winScenario.is_last_raid) {
          console.log('is last battle');
          browser.tabs.goBack(tabId);
        }
        // browser.tabs.sendMessage(tabId, message);
      } else if (existsCommand('lose', res.scenario)) {
        console.log('lose battle');
        const message = {
          tag: 'game_result',
          is_win: false,
        };
        browser.tabs.sendMessage(tabId, message);
      } else if (isNormalAttackRequest(url)) {
        const message = {
          tag: 'normal_attack',
        };
        browser.tabs.sendMessage(tabId, message);
      }
      break;
    }
    default:
      console.log(res);
      break;
  }
}

// function router(request: chrome.devtools.network.Request): void {
//   const url = request.request.url;
//   getJson(request).then((res) => {
//     if (!res) return;
//     const tabId = browser.devtools.inspectedWindow.tabId;
//     switch (true) {
//       case isResultRequest(url): {
//         if (res.appearance !== null) {
//           const message = {
//             tag: 'appear_hell',
//             tab_id: tabId,
//           };
//           chrome.runtime.sendMessage(message);
//         }
//         break;
//       }
//       default:
//         break;
//     }
//   });
// const res = await getJson(request);
// if (!res) return;
// const tabId = browser.devtools.inspectedWindow.tabId;
// switch (true) {
//   case isResultRequest(url): {
//     if (res.appearance !== null) {
//       const message = {
//         tag: 'appear_hell',
//         tab_id: tabId,
//       };
//       browser.runtime.sendMessage(message);
//     }
//     break;
//   }
// case isQuestStartRequest(url): {
//   console.log('start quest');
//   const items = await browser.storage.local.get(['trial_battle_quest_id', 'quest_page']);
//   const trialBattleQuestID = items.trial_battle_quest_id;
//   if (trialBattleQuestID === undefined) {
//     console.error('uninitialized trial_battle_quest_id');
//   } else if (res.quest_id === trialBattleQuestID) {
//     console.log('quest type: trial');
//     await browser.tabs.update(tabId, { url: items.quest_page });
//     setReloadAlarm(tabId, 0.005);
//   }
//   break;
// }
// case isQuestResultRequest(url): {
//   const winScenario = getScenarioByCmd('win', res.scenario);
//   if (winScenario !== undefined) {
//     console.log('win battle');
//     if (winScenario.is_last_raid) {
//       console.log('is last battle');
//       browser.tabs.goBack(tabId);
//     }
//   } else if (existsCommand('lose', res.scenario)) {
//     console.log('lose battle');
//     const message = {
//       tag: 'game_result',
//       is_win: false,
//     };
//     browser.tabs.sendMessage(tabId, message);
//   } else if (isNormalAttackRequest(url)) {
//     const message = {
//       tag: 'normal_attack',
//     };
//     browser.tabs.sendMessage(tabId, message);
//   }
//   break;
// }
// default:
// break;
// }
// }

function isResultRequest(url: string): boolean {
  return url.match('result(multi|)/data') !== null;
}

function isQuestStartRequest(url: string): boolean {
  return url.match('start.json') !== null;
}

function isQuestResultRequest(url: string): boolean {
  return url.match('result.json') !== null;
}

function isNormalAttackRequest(url: string) {
  return url.match('normal_attack_result.json') !== null;
}

function getScenarioByCmd(target_cmd: string, scenario: { cmd: string; is_last_raid: boolean }[]) {
  if (scenario) {
    return scenario.find(({ cmd }) => cmd === target_cmd);
  } else {
    return undefined;
  }
}

function existsCommand(target_cmd: string, scenario: { cmd: string; is_last_raid: boolean }[]) {
  if (scenario) {
    const idx = scenario.findIndex(({ cmd }) => cmd === target_cmd);
    return idx === -1 ? false : true;
  } else {
    return false;
  }
}
