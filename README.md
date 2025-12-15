# 🌙 Darkify - Universal Dark Mode Extension

**Darkify** is a powerful, lightweight browser extension that instantly transforms any website into a visually pleasing dark mode. Whether you're browsing late at night or just prefer a darker aesthetic, Darkify has you covered. Built with modern web technologies including **React**, **TypeScript**, **TailwindCSS**, and **Vite**.

---

## ✨ Features

- **Global Dark Mode**: Toggle dark mode on/off for all websites with a single click.

<img src="src/images/Screenshot%202025-12-15%20at%2015.48.16.png" alt="Website without dark mode">

- **Smart Color Inversion**: Uses advanced CSS filters (`invert` + `hue-rotate`) to darken backgrounds while preserving image and video colors.

<img src="src/images/Screenshot%202025-12-15%20at%2015.48.22.png" alt="Same website with Darklify enabled">

- **Customizable Settings**: Fine-tune your experience with adjustable sliders:
  - 🔆 **Brightness**: Control the intensity of the dark theme.
  - 🌗 **Contrast**: Sharpen or soften the visual elements.
  - ⚪ **Grayscale**: Reduce color saturation for a more muted look.

<img src="src/images/Screenshot%202025-12-15%20at%2015.49.59.png" alt="Darkify settings demonstration">

- **Domain Exceptions**: Easily add or remove specific websites from the "Exceptions" list to keep them in their original mode.
- **Real-time Updates**: Adjust settings in the popup and see changes reflect instantly on the page without reloading.

## 🛠️ Tech Stack

- **[Vite](https://vitejs.dev/)**: Fast frontend tooling and build system.
- **[React](https://react.dev/)**: UI library for building the extension popup.
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe code for better maintainability.
- **[TailwindCSS](https://tailwindcss.com/)**: Utility-first CSS framework for styling the popup.
- **[Chrome Extensions API (Manifest V3)](https://developer.chrome.com/docs/extensions/mv3/)**: The core platform for browser extension capabilities.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn or pnpm

### Installation

Install Darklify.crx directly from repository or follow the steps below to build and load it manually.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/darkify.git
    cd darkify
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Build the extension:**
    ```bash
    npm run build
    ```
    This will compile the assets into the `dist/` directory.

### Loading into Chrome (Developer Mode)

1.  Open Chrome and navigate to `chrome://extensions/`.
2.  Enable **"Developer mode"** using the toggle in the top-right corner.
3.  Click **"Load unpacked"**.
4.  Select the `dist` folder generated in the previous step.
5.  Darkify should now appear in your extensions toolbar!

## 📂 Project Structure

```text
/src
  ├── content.ts       # Content script: handles logic injected into web pages
  ├── popup.tsx        # React component for the extension popup UI
  ├── main.tsx         # Entry point for the React app
  ├── manifest.json    # Extension configuration (permissions, scripts, icons)
  └── icons/           # App icons
```

#### Happy Browsing with Darkify 🌙
