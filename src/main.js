// *** ChatGPT User Script ***
// @github: https://github.com/lencx/ChatGPT
// @path: $HOME/.chatgpt/scripts/main.js

console.log('Hello, ChatGPT!');

const queueItems = [
  'Hi ChatGPT! What is the most recent date of the information you have access to?',
  'Simply answer 1',
  'Simply answer 2',
  'Simply answer 3',
];
let queueList = null;
let queueStartButton = null;
let queueTotal = null;
let queueStartNumber = 0;

const queueTemplate = `
<template data-queue-template>
  <div class="queue" data-queue>
    <h3 class="queue-header">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zm-7-1h2v-4h4V9h-4V5h-2v4H9v2h4z"/></svg>
      Queue manager
    </h3>
    <p class="queue-description">Add and organize your responses to send them in a sequential manner</p>
    <p data-queue-total class="queue-description">Empty queue (0/0)</p>
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
  font-size: 14px;
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
  font-size: 16px;
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
  addStyle('[data-queue-style]', queueStyle);
  addStyle('[data-queue-item-style]', queueItemStyle);
  addStyle('[data-queue-empty-style]', queueEmptyStyle);
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
   * @type {HTMLDivElement}
   * */
  const queue = document.querySelector('[data-queue-template]').content.cloneNode(true);
  const queueInput = queue.querySelector('[data-queue-input]');
  queueStartButton = queue.querySelector('[data-queue-start-button]');
  queueList = queue.querySelector('[data-queue-list]');
  queueTotal = queue.querySelector('[data-queue-total]');

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

  document.body.appendChild(queue);
  queueStartNumber = queueItems.length;
  updateQueueList();
  console.log('added queue');
}

function updateQueueList() {
  const elements = queueItems.map(createQueueItem);
  console.log(queueItems, elements);
  queueList.innerHTML = '';
  queueList.append(...elements);

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

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  queueInit();
} else {
  document.addEventListener('DOMContentLoaded', queueInit);
}
