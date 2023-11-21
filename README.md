# 👔 ChatGPT Message Queue Manager

## Overview
The ChatGPT Message Queue Manager is a specialized tool designed to augment the capabilities of ChatGPT, particularly in managing queued messages. This web-based utility enables users to queue up responses and manage the flow of messages, enhancing the interaction with ChatGPT. Implemented using pure JavaScript, HTML, and CSS, it aims to provide a seamless and efficient user experience.

## Features
- Add and delete messages from the queue.
- Manual initiation of message sending to ChatGPT.
- Elegant and user-friendly modal interface.
- (WIP) Persistent queue state across page reloads using LocalStorage.

## Installation
To set up the ChatGPT Message Queue Manager in your environment, follow these steps:

1. Clone the repository:
  ```shell
  git clone https://github.com/DrSmile444/chatgpt-queue-manager.git
  ```

2. Navigate to the project directory:
  ```shell
  cd chatgpt-queue-manager
  ```

3. Run symlink command:
  ```shell
  npm run symlink:macos
  ```
  **Note: If you have custom scripts in main.ts, it will override it!!!**

## Usage
1. **Opening the Queue Manager**: Click on the Queue Manager icon/button within the ChatGPT interface to open the modal.
2. **Adding Messages**: Enter your message in the textarea and click 'Add to Queue'.
3. **Managing the Queue**: Utilize the delete option alongside each message for queue management.
4. **Initiating Message Sending**: Press 'Start' to begin dispatching messages from the queue to ChatGPT.

## Contributing
Contributions to enhance and refine the ChatGPT Message Queue Manager are welcomed. Please refer to our [Contributing Guidelines (WIP)](LINK_TO_YOUR_CONTRIBUTING_GUIDELINES) for our code of conduct and process for submitting pull requests.

## License
This project is licensed under the [MIT License](LICENSE.md) - see the LICENSE.md file for details.

## Acknowledgments
- Heartfelt thanks to contributors, the OpenAI team, and the ChatGPT community.

## Contact
For queries or suggestions, feel free to reach out to Dmytro Vakulenko at drsmile444@gmail.com.
