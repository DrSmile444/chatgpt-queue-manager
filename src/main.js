// *** ChatGPT User Script ***
// @github: https://github.com/lencx/ChatGPT
// @path: $HOME/.chatgpt/scripts/main.js

console.log('Hello, ChatGPT!');

const QUEUE_STATE_KEY = 'queueState';

let queueItems = JSON.parse(localStorage.getItem(QUEUE_STATE_KEY) || 'null') || [
  'Hi ChatGPT! What is the most recent date of the information you have access to?',
  'Simply answer 1',
  'Simply answer 2',
  'Simply answer 3',
];
let queueList = null;
let queueStartButton = null;
let queueTotal = null;
let queueShow = null;
let queueStartNumber = 0;

const queueShowTemplate = `
<template data-queue-show-template>
  <button data-queue-show-button class="queue-show btn-neutral" title="Show queue manager">
    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zm-7-1h2v-4h4V9h-4V5h-2v4H9v2h4z"/></svg>
  </button>
</template>
`;

const queueShowStyle = `
<style>
.queue-show {
  position: fixed;
  top: 10px;
  right: 8px;
  padding: 7px;
  border-radius: 8px;
}

/* Selector for share button */
.btn.relative.h-9.w-9 {
  margin-right: 34px;
}
</style>
`;

const queueTemplate = `
<template data-queue-template>
  <div class="queue" data-queue>
    <h3 class="queue-header">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zm-7-1h2v-4h4V9h-4V5h-2v4H9v2h4z"/></svg>
      Queue manager
    </h3>
    <button data-queue-close class="queue-close-button" title="Close queue">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
    </button>
    <p class="queue-description">Add and organize your responses to send them in a sequential manner</p>
    <input type="file" accept="application/json" data-upload-input style="display: none;" />
    <div class="queue-buttons">
      <div class="queue-buttons-left">
        <button class="queue-button" data-upload-button title="Upload queue">
          <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24"/></g><g><path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M7,9l1.41,1.41L11,7.83V16h2V7.83l2.59,2.58L17,9l-5-5L7,9z"/></g></svg>
        </button>
        <button class="queue-button" data-download-button title="Download queue">
          <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24"/></g><g><path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z"/></g></svg>
        </button>
      </div>
      <div class="queue-buttons-right">
        <button class="queue-button" data-clear-button title="Clear queue">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
        </button>
      </div>
    </div>
    <p data-queue-total class="queue-description"></p>
    <ul class="queue-list" data-queue-list></ul>
    <textarea class="queue-input" placeholder="Add message here" rows="4" data-queue-input></textarea>
    <button class="queue-button queue-button-primary queue-button-icon" data-queue-start-button>
      <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><g><path d="M6,13c0-1.65,0.67-3.15,1.76-4.24L6.34,7.34C4.9,8.79,4,10.79,4,13c0,4.08,3.05,7.44,7,7.93v-2.02 C8.17,18.43,6,15.97,6,13z M20,13c0-4.42-3.58-8-8-8c-0.06,0-0.12,0.01-0.18,0.01l1.09-1.09L11.5,2.5L8,6l3.5,3.5l1.41-1.41 l-1.08-1.08C11.89,7.01,11.95,7,12,7c3.31,0,6,2.69,6,6c0,2.97-2.17,5.43-5,5.91v2.02C16.95,20.44,20,17.08,20,13z"/></g></g></svg>
      Start
    </button>
  </div>
</template>
`;

const queueStyle = `
<style>
.hide {
  display: none !important;
}

.gizmo {
  --queue-primary: #0e1f60;
}

.gizmo.dark {
  --queue-primary: #63b9e3;
}

.queue {
  position: fixed;
  top: 8px;
  right: 8px;
  background: var(--surface-primary);
  color: var(--text-primary);
  padding: 12px;
  border-radius: 8px;
  width: 300px;
  display: flex;
  gap: 12px;
  flex-direction: column;
  border: 1px solid var(--surface-tertiary);
  font-size: 14px;
}

.queue-close-button {
  position: absolute;
  top: 14px;
  right: 14px;
}

.queue-input {
  border-radius: 6px;
  background: var(--surface-primary);
  border: 1px solid var(--surface-tertiary);
  transition: all 0.1s;
  resize: none;
}

.queue-header {
  display: flex;
  gap: 8px;
  align-items: center;
}

.queue-description {
  font-weight: bold;
}

.queue-list {
  max-height: 400px;
  overflow: auto;
  display: flex;
  gap: 8px;
  flex-direction: column;
  background: var(--surface-secondary);
  padding: 12px;
  border-radius: 6px;
}

.queue-button {
  background: var(--surface-primary);
  color: var(--queue-primary);
  font-weight: bold;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  gap: 8px;
  justify-content: center;
  font-size: 16px;
  border: 1px solid var(--queue-primary);
}

.queue-button-primary {
  background: var(--queue-primary);
  color: var(--surface-primary); 
  border: none;
}

.queue-button-icon {
  padding-right: 28px;
}

.queue-buttons {
  display: flex;
  gap: 8px;
  justify-content: space-between;
}

.queue-buttons-left,
.queue-buttons-right {
  display: flex;
  gap: 8px;
}
</style>
`;

const queueItemTemplate = `
<template data-queue-item-template>
  <div class="queue-item-wrapper" data-queue-wrapper>
    <button class="queue-item-delete" data-delete-queue-item>
      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
    </button>
    <li data-queue-item data-index="-1"></li>
  </div>
</template>
`;

const queueItemStyle = `
<style>
.queue-item-wrapper {
  display: flex;
  gap: 8px;
  background: var(--surface-tertiary);
  padding: 6px 8px;
  border-radius: 4px;
}

.queue-item-delete {
  font-size: 14px;
  color: var(--queue-primary);
  font-weight: bold;
  min-width: 20px;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
}
</style>
`;

const queueEmptyTemplate = `
<template data-queue-empty-template>
  <div class="queue-empty" data-queue-wrapper>
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>
    <p class="queue-description">No messages in the queue. Add new messages to start managing your queue.</p>
  </div>
</template>
`;

const queueEmptyStyle = `
<style>
.queue-empty {
  display: flex;
  gap: 8px;
  color: var(--text-tertiary);
}
</style>
`;

/**
 * @returns {HTMLButtonElement | null}
 * */
function getSendButton() {
  return document.querySelector('[data-testid="send-button"]');
}

/**
 * @returns {HTMLTextAreaElement}
 * */
function getTextareaInput() {
  return document.querySelector('#prompt-textarea');
}

function addTemplate(selector, templateString) {
  if (!document.querySelector(selector)) {
    const div = document.createElement('div');
    div.innerHTML = templateString;

    document.body.appendChild(div);
    console.log('added template ' + selector);
  }
}

function addStyle(selector, templateString) {
  if (!document.querySelector(selector)) {
    const div = document.createElement('div');
    div.setAttribute(selector.slice(1, -1), true);
    div.innerHTML = templateString;

    document.body.appendChild(div);
    console.log('added style ' + selector);
  }
}

function queueInit() {
  console.log('queue ready');
  addTemplate('[data-queue-template]', queueTemplate);
  addTemplate('[data-queue-item-template]', queueItemTemplate);
  addTemplate('[data-queue-empty-template]', queueEmptyTemplate);
  addTemplate('[data-queue-show-template]', queueShowTemplate);
  addStyle('[data-queue-style]', queueStyle);
  addStyle('[data-queue-item-style]', queueItemStyle);
  addStyle('[data-queue-empty-style]', queueEmptyStyle);
  addStyle('[data-queue-show-style]', queueShowStyle);
  addQueue();
}

function sendFirstQueueMessage() {
  console.log('set message');
  getTextareaInput().value = queueItems[0];
  const event = new Event('input', {
    bubbles: true,
    cancelable: true,
  });

  console.log('dispatch event');
  getTextareaInput().dispatchEvent(event);
  console.log('set message');
  getTextareaInput().value = queueItems[0];
  console.log('dispatch event');
  getTextareaInput().dispatchEvent(event);

  setTimeout(() => {
    console.log('send click event', getSendButton());
    getSendButton()?.click();
  }, 1000);

  removeQueueItem();
}

function trySendAllQueue() {
  console.log('trySendAllQueue', queueItems);
  if (queueItems.length) {
    console.log('create getSendButton() interval', queueItems);
    const interval = setInterval(() => {
      if (getSendButton()?.disabled === true) {
        console.log('clear getSendButton() interval', queueItems);
        setTimeout(() => {
          console.log('sendFirstQueueMessage');
          sendFirstQueueMessage();
          setTimeout(() => {
            trySendAllQueue();
          }, 1000);
        }, 1000);
        clearInterval(interval);
      }
    }, 1000);
  } else {
    queueStartButton.innerText = 'Finished!';
    setTimeout(() => {
      queueStartButton.innerText = 'Start';
    }, 3000);
  }
}

function addQueue() {
  /**
   * @type {HTMLButtonElement}
   * */
  const queueShowTemplate = document.querySelector('[data-queue-show-template]').content.cloneNode(true);
  queueShow = queueShowTemplate.querySelector('[data-queue-show-button]');
  document.body.appendChild(queueShowTemplate);

  queueShow.addEventListener('click', () => {
    queueShow.classList.add('hide');
    queue.classList.remove('hide');
  });

  /**
   * @type {HTMLDivElement}
   * */
  const queueTemplate = document.querySelector('[data-queue-template]').content.cloneNode(true);
  const queue = queueTemplate.querySelector('[data-queue]');
  const queueInput = queueTemplate.querySelector('[data-queue-input]');
  const queueClose = queueTemplate.querySelector('[data-queue-close]');
  /**
   * @type {HTMLInputElement}
   * */
  const queueUploadInput = queueTemplate.querySelector('[data-upload-input]');
  const queueUploadButton = queueTemplate.querySelector('[data-upload-button]');
  const queueDownloadButton = queueTemplate.querySelector('[data-download-button]');
  const queueClearButton = queueTemplate.querySelector('[data-clear-button]');

  queueStartButton = queueTemplate.querySelector('[data-queue-start-button]');
  queueList = queueTemplate.querySelector('[data-queue-list]');
  queueTotal = queueTemplate.querySelector('[data-queue-total]');

  queueClose.addEventListener('click', () => {
    queueShow.classList.remove('hide');
    queue.classList.add('hide');
  });

  queueUploadButton.addEventListener('click', () => {
    queueUploadInput.click();
  });

  queueUploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    parseJsonFile(file).then((result) => {
      queueItems = result;
      queueStartNumber = queueItems.length;
      updateQueueList();
    });
  });

  queueDownloadButton.addEventListener('click', () => {
    downloadFile(queueItems, 'queue-manager-' + Date.now());
  });

  queueClearButton.addEventListener('click', () => {
    queueItems = [];
    updateQueueList();
  });

  queueInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.value) {
      queueStartNumber += 1;
      queueItems.push(event.target.value.trim());
      updateQueueList();

      setTimeout(() => {
        event.target.value = '';
      }, 0);
    }
  });

  queueStartButton.addEventListener('click', () => {
    trySendAllQueue();
    queueStartButton.innerText = 'Pending...';
  });

  document.body.appendChild(queueTemplate);
  queueStartNumber = queueItems.length;
  updateQueueList();
  console.log('added queue');

  if (queueItems.length) {
    queueShow.classList.add('hide');
  } else {
    queue.classList.add('hide');
  }
}

function updateQueueList() {
  const elements = queueItems.map(createQueueItem);
  console.log(queueItems, elements);
  queueList.innerHTML = '';
  queueList.append(...elements);

  localStorage.setItem(QUEUE_STATE_KEY, JSON.stringify(queueItems));

  if (queueItems.length === 0) {
    queueStartNumber = 0;
    queueTotal.innerText = 'Empty queue (0/0)';
    const emptyQueue = document.querySelector('[data-queue-empty-template]').content.cloneNode(true);
    queueList.append(emptyQueue);
  } else {
    queueTotal.innerText = `Messages queue (${elements.length}/${queueStartNumber})`;
  }
}

function removeQueueItem(index) {
  if (index || index === 0) {
    queueStartNumber -= 1;
  }

  const normalizedIndex = index || 0;

  console.log('removeQueueItem', index);
  queueItems.splice(normalizedIndex, 1);
  updateQueueList();
  console.log('new queueItems', queueItems);
}

function createQueueItem(text, index) {
  const queueItemTemplate = document.querySelector('[data-queue-item-template]').content.cloneNode(true);
  /**
   * @type {HTMLLIElement}
   * */
  const queueItem = queueItemTemplate.querySelector('[data-queue-item]');
  const deleteQueueItem = queueItemTemplate.querySelector('[data-delete-queue-item]');
  queueItem.setAttribute('data-index', index);
  queueItem.innerText = text;

  deleteQueueItem.addEventListener('click', () => {
    removeQueueItem(index);
  });

  return queueItemTemplate;
}

function downloadFile(object, name = 'data') {
  const blob = new Blob([JSON.stringify(object)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const aElement = document.createElement('a');
  aElement.href = url;
  aElement.download = name + '.json'; // The filename for download
  document.body.appendChild(aElement); // We append the anchor to the body for Firefox support
  aElement.click(); // Simulate click to trigger download
  document.body.removeChild(aElement); // Clean up
  URL.revokeObjectURL(url); // Free up memory
}

/**
 * @param {File | undefined} file
 * */
function parseJsonFile(file) {
  return new Promise((resolve, reject) => {
    // Check if file is provided
    if (!file) {
      reject("No file provided.");
      return;
    }

    // Check if file type is JSON
    if (!file.type === "application/json") {
      reject("File is not a JSON.");
      return;
    }

    const reader = new FileReader();

    // On successful read
    reader.onload = (event) => {
      try {
        // Parse the file content as JSON
        const jsonObj = JSON.parse(event.target.result);
        resolve(jsonObj);
      } catch (error) {
        // If an error occurs while parsing
        reject(error);
      }
    };

    // On read error
    reader.onerror = (event) => {
      reject(event.target.error);
    };

    // Read the file as text
    reader.readAsText(file);
  });
}


if (document.readyState === 'complete' || document.readyState === 'interactive') {
  queueInit();
} else {
  document.addEventListener('DOMContentLoaded', queueInit);
}
