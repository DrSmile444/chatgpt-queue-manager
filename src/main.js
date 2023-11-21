// *** ChatGPT User Script ***
// @github: https://github.com/lencx/ChatGPT
// @path: $HOME/.chatgpt/scripts/main.js

console.log('Hello, ChatGPT!');

const queueItems = ['Hi ChatGPT! Which last date you know information?', 'Simply answer 1', 'Simply answer 2', 'Simply answer 3'];
let queueList = null;
let queueStartButton = null;

const queueTemplate = `
<template data-queue-template>
  <div class="queue" data-queue>
    <h3>Queue manager</h3>
    <p>Message to be added:</p>
    <ul class="queue-list" data-queue-list></ul>
    <textarea class="queue-input" placeholder="Add message here" rows="4" data-queue-input></textarea>
    <button class="queue-start-button" data-queue-start-button>
      <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><g><path d="M6,13c0-1.65,0.67-3.15,1.76-4.24L6.34,7.34C4.9,8.79,4,10.79,4,13c0,4.08,3.05,7.44,7,7.93v-2.02 C8.17,18.43,6,15.97,6,13z M20,13c0-4.42-3.58-8-8-8c-0.06,0-0.12,0.01-0.18,0.01l1.09-1.09L11.5,2.5L8,6l3.5,3.5l1.41-1.41 l-1.08-1.08C11.89,7.01,11.95,7,12,7c3.31,0,6,2.69,6,6c0,2.97-2.17,5.43-5,5.91v2.02C16.95,20.44,20,17.08,20,13z"/></g></g></svg>
      Start
    </button>
  </div>
</template>
`;

const queueStyle = `
<style>
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
}

.queue-input {
  border-radius: 6px;
  background: var(--surface-primary);
  border: 1px solid var(--surface-tertiary);
  transition: all 0.1s;
  resize: none;
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

.queue-start-button {
  background: var(--queue-primary);
  color: var(--surface-primary);
  font-weight: bold;
  padding: 4px;
  padding-right: 28px;
  border-radius: 6px;
  display: flex;
  gap: 8px;
  justify-content: center;
}
</style>
`;

const queueItemTemplate = `
<template data-queue-item-template>
  <div class="queue-item-wrapper" data-queue-wrapper>
    <button class="queue-item-delete" data-delete-queue-item>
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
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
  border-radius: 4px;
  display: flex;
  justify-content: center;
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
  addStyle('[data-queue-style]', queueStyle);
  addStyle('[data-queue-item-style]', queueItemStyle);
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

  removeQueueItem(0);
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
   * @type {HTMLDivElement}
   * */
  const queue = document.querySelector('[data-queue-template]').content.cloneNode(true);
  const queueInput = queue.querySelector('[data-queue-input]');
  queueStartButton = queue.querySelector('[data-queue-start-button]');
  queueList = queue.querySelector('[data-queue-list]');

  queueInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.value) {
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

  document.body.appendChild(queue);
  updateQueueList();
  console.log('added queue');
}

function updateQueueList() {
  const elements = queueItems.map(createQueueItem);
  console.log(queueItems, elements);
  queueList.innerHTML = '';
  queueList.append(...elements);
}

function removeQueueItem(index) {
  console.log('removeQueueItem', index);
  queueItems.splice(index, 1);
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

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  queueInit();
} else {
  document.addEventListener('DOMContentLoaded', queueInit);
}
