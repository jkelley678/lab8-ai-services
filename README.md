# Lab 8: AI Services

## Overview
This project demonstrates the integration of AI services into a web application. It features a chatbot interface and supports interaction with different large language models (LLMs), such as OpenAI and Gemini, using a modular JavaScript architecture.

## Features
- Chatbot interface inspired by ELIZA
- Modular MVC (Model-View-Controller) structure
- Support for multiple LLM backends
- Playwright tests for automated testing

## Project Structure
```
lab8-ai-services/
├── LICENSE
├── package.json
├── playwright.config.js
├── README.md
├── playwright-report/
├── r-n-d/
├── src/
│   ├── index.html
│   ├── styles.css
│   └── js/
│       ├── app.js
│       ├── controller.js
│       ├── eliza.js
│       ├── llm.js
│       ├── model.js
│       └── view.js
├── test-results/
└── tests/
	 ├── example.spec.js
	 └── llm.spec.js
```

## Getting Started


### Running the Application
Open `src/index.html` in your browser to use the chatbot interface.

### Running Tests
Run Playwright tests with:
```bash
npm test
```
Test results and reports will be available in the `test-results/` and `playwright-report/` directories.

## File Descriptions
- `src/js/llm.js`: Handles communication with LLM APIs.
- `src/js/eliza.js`: Implements the ELIZA chatbot logic.
- `src/js/controller.js`, `model.js`, `view.js`, `app.js`: MVC structure for the app.
- `tests/`: Contains Playwright test scripts.

## License
This project is licensed under the MIT License - see LICENSE.md for details.

## Author
Jackson Kelley