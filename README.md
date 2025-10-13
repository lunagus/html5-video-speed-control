# HTML5 Video Speed Controls

A lightweight **userscript** that adds keyboard shortcuts for playback speed and frame stepping on any HTML5 video — works on every site.

---

## 🧩 Features

- 🎚️ **Speed control**
  - Press **`X`** → Slow down by 0.1×  
  - Press **`C`** → Speed up by 0.1×  
  - Press **`Z`** → Reset to 1.0×

- 🎞️ **Frame-by-frame control**
  - Press **`Q`** → Previous frame (auto-pauses)
  - Press **`E`** → Next frame (auto-pauses)

- 🧠 **Smart video detection**
  - Automatically finds the *active* video (playing, visible, or largest)
  - Detects dynamically added videos on single-page sites
  - Tooltip overlay shows current speed or action

---

## 📦 Installation

1. Install a userscript manager:
   - [Tampermonkey (Chrome, Edge)](https://tampermonkey.net/)
   - [Violentmonkey (Firefox, Chromium)](https://violentmonkey.github.io/)

2. Click below to install or update the script:

   👉 [**Install Script**](https://github.com/lunagus/html5-video-speed-control/raw/refs/heads/main/videospeedcontrols.user.js)

---

## 💻 Usage

Once installed, open any page with an HTML5 `<video>` element (YouTube, Twitter, Reddit, etc.) and use the keyboard shortcuts:

| Key | Action | Description |
|-----|---------|-------------|
| **X** | Speed – 0.1× | Slower playback |
| **C** | Speed + 0.1× | Faster playback |
| **Z** | Reset | Restore 1.0× speed |
| **Q** | Prev Frame | Step backward one frame (pauses video) |
| **E** | Next Frame | Step forward one frame (pauses video) |

A floating tooltip at the top of the screen will briefly show the current speed or frame action.

---

### 💬 Feedback

Open an issue or pull request here:
[https://github.com/lunagus/html5-video-speed-control/issues](https://github.com/lunagus/html5-video-speed-control/issues)
