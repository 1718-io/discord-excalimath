# Contributing to Excali Math Backend

First off, thank you for taking the time to contribute! 🎉 Whether it's bug fixes, new features, or documentation improvements, your help is greatly appreciated.

Please follow these guidelines to ensure a smooth development and review process.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
* **Node.js**: $\ge 22$ (as defined in `package.json`)
* **pnpm**: $\ge 12.10.1$ (this project uses `pnpm` exclusively)

### Local Development Setup
1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/your-username/excali-math-backend.git
   cd excali-math-backend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Run the development server:**
   ```bash
   pnpm dev
   ```
   *This starts the server using `tsx watch` for automatic hot-reloading on file changes.*

---

## 🌿 Branching Strategy & Workflow

We follow a structured branching model:
* **`develop`**: The primary branch where all integration happens. **All Pull Requests must target `develop`.**
* **`feature/*`** or **`bugfix/*`**: Branch names for your work (e.g., `feature/room-reconnection` or `bugfix/fix-websocket-timeout`).

### Step-by-Step Workflow:
1. Create a new branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and write tests.
3. Commit using clear and descriptive commit messages.
4. Push your branch and open a Pull Request targeting **`develop`**.

---

## 🧪 Testing & Quality Checks

Before submitting your Pull Request, ensure your code passes all static checks and unit tests locally.

* **Run Type-Checking:**
  ```bash
  pnpm typecheck
  ```
* **Run Test Suite:**
  ```bash
  pnpm test
  ```

> ⚠️ **Note:** Our GitHub Actions CI/CD pipeline automatically runs type-checking and unit tests on every pull request. PRs cannot be merged into `develop` unless all status checks pass and code reviews are approved.

---

## 📝 Pull Request Guidelines
* **Keep PRs focused:** Try to solve one problem or introduce one feature per pull request.
* **Update Tests:** If you add new functionality or fix a bug, include a corresponding unit or integration test in the `tests/` directory.
* **Pass CI Checks:** Ensure your branch has green status checks for type-checking and tests before requesting a review.