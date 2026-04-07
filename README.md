# Learning-management-system: Frontend

⚠️ Early development version
This project is currently in the early stages of development and may contain bugs or incomplete features.

This two-person project is about eventually setting up an LMS like Moodle that could be used by educational
organizations. The main goal is learning and web development practice while encountering various concepts
of a real-world application that can be useful to people

## Architecture

This repository contains:

- Angular frontend
- Dummy FastAPI backend used for small testing purposes

The real backend is developed in a separate repository.

## Project Structure

```markdown
learning-management-system-frontend/
│
├── frontend/
│   └── .angular
│   └── src
│   └── ...
│
├── dummy-backend/
│   └── main.py      (entry point for FastAPI)
│   └── requirements.txt      (fastapi + uvicorn)
│
├── docs/
│
├── scripts/
│   └── .devSetup.sh
│
├── .gitignore
└── README.md
```

## Requirements

- Node.js
- Python 3.8+
- Python modules from requirements.txt
- Angular CLI

## Setup

### Easiest Way
If you have a UNIX-style bash console on your system you can navigate to the root folder ***learning-management-system-frontend***
and within it run the following:
```bash
bash scripts/devSetup.sh
```
This will check your system for the necessary dependencies and start up both servers in the background, leaving you able
to work in the same console.

### Alternative way

To start the backend server: Open one shell, navigate to ***dummy-backend*** and run
```bash
python -m uvicorn main:app --reload
```

To start the frontend server: Open another shell, navigate to ***frontend*** and run
```bash
ng serve
```

## Current Functionality
When frontend and dummy backend are running the webpage should be able to display "status:healthy", indicating
that a basic Angular UI component can interact successfully with a basic Angular Service component which in turn
can interact successfully with a basic FastAPI of another web origin.

## Development Notes

The dummy backend exists purely for minor testing of the frontend while the real backend is being developed separately.