🍴 IndiaEatz – Food Delivery App (React Native + Expo)

IndiaEatz is a sleek and beginner-friendly food delivery UI built using React Native and Expo Router. It features a minimal homepage with mock data, quick action buttons, a search bar, categories, and popular food items — ready to scale into a full-fledged food ordering app.

📸 Screenshots

(Add screenshots or GIFs here for visual appeal — can be from your simulator or phone recording.)

✨ Features

🔍 Minimal search bar UI

🛒 Quick action buttons (Checkout, My Orders)

🌟 Featured food items (mocked)

📂 Categories grid with food types

⚡ Built with Expo Router for smooth navigation

🌈 Responsive and emoji-rich UI

🛠️ Tech Stack

React Native

Expo

Expo Router

React Navigation

🚀 Getting Started

Follow these instructions to run the project locally on your system or phone.

1. 📦 Clone the repo

git clone https://github.com/your-username/IndiaEatz.git
cd IndiaEatz

2. 🧩 Install dependencies

npm install

Or if you use Yarn:

yarn install

3. ▶️ Start the Expo server

npx expo start

This will open the Metro bundler in your browser.

4. 📱 Run on your device/simulator

Physical Device:Scan the QR code from the Metro bundler using the Expo Go app.

Emulator/Simulator:Press i (iOS) or a (Android) in the terminal to launch the app on your simulator.

🗂️ Folder Structure

.
├── app/                # Expo Router pages
│   ├── index.js        # Home page (this UI)
│   ├── checkout.js     # Checkout page (navigated via button)
│   └── status/[id].js  # Order status page with dynamic route
├── assets/             # Images, icons, fonts (optional)
├── README.md
├── package.json
└── ...other config files

📌 Notes

All data (food items, categories) are mocked with emojis.

Routing is handled via expo-router, making pages like /checkout and /status/:id super intuitive.

This is a UI MVP — backend integration (like Firebase, Supabase, or a custom server) can be added later.

🧠 To-Do / Future Enhancements



🤝 Contributing

Open to ideas, improvements, and pull requests! Feel free to fork this repo and submit a PR.
