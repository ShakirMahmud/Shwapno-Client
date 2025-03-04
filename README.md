# 📦 Barcode-Driven Inventory System with Kanban Board  

🚀 **Live Demo**: [Shwapno Inventory System](https://shwapno.vercel.app/dashboard/analytics)  
📂 **GitHub Repo**: [Shwapno Client](https://github.com/ShakirMahmud/Shwapno-Client)  

## 📖 Table of Contents  

- [Features](#-features)  
- [Tech Stack](#-tech-stack)  
- [Installation](#-installation)  
- [Why These Packages?](#-why-these-packages)  
- [Contributors](#-contributors)  

---

## ✨ Features  

✅ **Barcode Scanning** - Scan product barcodes and fetch details from an external API.  
✅ **Kanban Board** - Drag and drop products between categories dynamically.  
✅ **Authentication** - Firebase-based authentication for secure access.  
✅ **Analytics Dashboard** - View product statistics with interactive charts.  
✅ **Search Functionality** - Filter products by name or category.  
✅ **Fully Responsive** - Optimized UI for both mobile and desktop users.  

---

## 🛠 Tech Stack  

- **Frontend:** React (Vite), Tailwind CSS, Firebase  
- **Libraries:**  
  - **@hello-pangea/dnd** - Drag-and-drop functionality  
  - **@zxing/browser** - Barcode scanning  
  - **Firebase** - Authentication and storage  
  - **Recharts** - Analytics visualization  
  - **SweetAlert2** - User-friendly alerts  

---

## 🔧 Installation  

### Prerequisites  
Ensure you have the following installed:  
- **Node.js** (v16 or later)  

### Steps  

1️⃣ **Clone the repository**  
```sh
git clone https://github.com/ShakirMahmud/Shwapno-Client.git
cd Shwapno-Client
```

2️⃣ **Install dependencies**  
```sh
npm install
```

3️⃣ **Set up environment variables**  

Create a `.env` file in the root folder and add the following:  
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4️⃣ **Start the application**  
```sh
npm run dev
```

---

## 📦 Why These Packages?  

| Package | Purpose |
|---------|---------|
| **@hello-pangea/dnd** | Provides smooth drag-and-drop functionality for the Kanban board. Other libraries didn’t offer the same UX. |
| **@zxing/browser** | Used for barcode scanning, as it supports scanning GIFs (provided barcodes were in GIF format). |
| **Firebase** | Handles authentication simply and securely. |
| **Lucide-react & React-icons** | Used for lightweight and modern icons. |
| **Recharts** | Displays product statistics in an interactive way. |
| **SweetAlert2** | Enhances UX by showing clear success/error messages. |

---

## 👨‍💻 Contributors  

👤 **Md. Shakir Mahmud** – MERN Developer  
🔗 [LinkedIn](https://www.linkedin.com/in/shakirmahmud9/)  
🌍 [Portfolio](https://shakir-portfolio.vercel.app/)  
