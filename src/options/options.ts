/* eslint-disable @typescript-eslint/no-non-null-assertion */
import browser from 'webextension-polyfill';

function save_options() {
  const hellPage = (document.getElementById('hell_page') as HTMLInputElement).value;
  const nextQuestPage = (document.getElementById('next_quest_page') as HTMLInputElement).value;
  browser.storage.sync.set({
    hell_page: hellPage,
    next_quest_page: nextQuestPage
  }).then(() => {
    const status = document.getElementById('status');
    status!.textContent = 'Options saved.';
    setTimeout(function () {
      status!.textContent = '';
    }, 750);
  });
}

function restore_options() {
  browser.storage.sync.get({
    hell_page: '',
    next_quest_page: ''
  }).then((items) => {
    (document.getElementById('hell_page') as HTMLInputElement).value = items.hell_page;
    (document.getElementById('next_quest_page') as HTMLInputElement).value = items.next_quest_page;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
const saveButton = document.getElementById('save')!;
saveButton.addEventListener('click', save_options);
