# 🌙 Darkify - Universal Dark Mode Extension

**Darkify** is a powerful, lightweight browser extension that instantly transforms any website into a visually pleasing dark mode. Whether you're browsing late at night or just prefer a darker aesthetic, Darkify has you covered.

Built with modern web technologies including **React**, **TypeScript**, **TailwindCSS**, and **Vite**.

---

## ✨ Features

- **Global Dark Mode**: Toggle dark mode on/off for all websites with a single click.
- **Smart Color Inversion**: Uses advanced CSS filters (`invert` + `hue-rotate`) to darken backgrounds while preserving image and video colors.
- **Customizable Settings**: Fine-tune your experience with adjustable sliders:
  - 🔆 **Brightness**: Control the intensity of the dark theme.
  - 🌗 **Contrast**: Sharpen or soften the visual elements.
  - ⚪ **Grayscale**: Reduce color saturation for a more muted look.
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

## 💻 Development

To start the development server (useful for popup UI development):

```bash
npm run dev
```

*Note: Since this is a browser extension, `npm run dev` in Vite typically serves the popup as a web page. To test content scripts and permission logic, you must rebuild and reload the extension in Chrome.*

## 📂 Project Structure

```text
/src
  ├── content.ts       # Content script: handles logic injected into web pages
  ├── popup.tsx        # React component for the extension popup UI
  ├── main.tsx         # Entry point for the React app
  ├── manifest.json    # Extension configuration (permissions, scripts, icons)
  └── icons/           # App icons
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

[MIT](LICENSE)