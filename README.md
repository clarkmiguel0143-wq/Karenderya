# Kusina Express - Online Eatery & Kitchen Display System (KDS)

A complete web application for Filipino carinderias and local eateries featuring a mobile-first customer ordering menu, live availability toggles, GCash/Cash checkout, and an Admin Kitchen Display System (KDS) with sound chimes and daily sales reports.

---

## 🚀 How to Run in Visual Studio Code (VS Code)

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- [Visual Studio Code](https://code.visualstudio.com/)

---

### Step-by-Step Setup

1. **Extract the ZIP file**:
   Extract `kusina-express-codebase.zip` to your preferred folder on your computer.

2. **Open the project in VS Code**:
   - Open Visual Studio Code.
   - Go to **File** > **Open Folder...** (or press `Ctrl+K Ctrl+O` on Windows / `Cmd+O` on Mac).
   - Select the extracted folder.

3. **Open the Terminal**:
   - In VS Code, go to the top menu: **Terminal** > **New Terminal** (or press `Ctrl + ~` / `Cmd + ~`).

4. **Install Dependencies**:
   In the VS Code terminal, run:
   ```bash
   npm install
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```

6. **View the Application**:
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
   *(or the URL shown in your VS Code terminal)*

---

## 🛠️ Features Included

- **Customer View**:
  - Daily menu with Filipino homestyle dishes, high-resolution food imagery, and category filters.
  - Real-time **SOLD OUT** badges and availability updates.
  - Cart & Checkout drawer with **Pickup** vs. **Delivery** (+₱35 fee).
  - Cash on Delivery/Pickup (with change selector) and GCash/Maya with simulated QR code and reference number verification.
  - Free Hot Soup toggle (complimentary broth packaged separately).
  - Live 4-step **Order Tracker**.

- **Admin Kitchen Display System (KDS)**:
  - Live order cards categorized by *New / Pending*, *Preparing*, *Ready*, and *Completed*.
  - Web Audio API brass bell chime when new orders arrive (no external audio files needed).
  - One-click availability toggle between **Available** and **SOLD OUT**.
  - Servings remaining counter and inline price editor.
  - New dish creator with presets (Kaldereta, Dinuguan, Pinakbet, Lumpiang Shanghai, etc.).
  - Daily Sales & Revenue report with cash vs. e-wallet breakdown and CSV export.
  - 80mm printable kitchen slip & customer receipt.

---

## 📦 Tech Stack
- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Lucide Icons**
- **Web Audio API**
