# Waterloo 2 World (W2W)

Waterloo 2 World (W2W) is an interactive platform that helps UWaterloo students explore exchange and co-op opportunities worldwide. It features a map-based interface, enriched filters, and student-driven insights to make finding global programs easier, more visual, and more personalized than the current Waterloo Passport site.

---

## 🌍 What does W2W offer?

- **Interactive Map:** Browse and discover exchange programs around the world.
- **Live Data:** All program info is pulled directly from [Waterloo Passport](https://uwaterloo-horizons.symplicity.com/), ensuring up-to-date details.
- **Program Details:** See university, location, requirements, competitiveness, and more.
- **Student Reviews & Ratings:** Read and contribute honest reviews and ratings for each program.
- **Sort & Filter:** Find programs by date, popularity, competitiveness, and more.
- **Application Links:** Go straight to the official application portal for each program.
- **Verified Comments:** Know which reviews are from real students.
- **Helpful Resources:** Access student insights, key links, guides, and wellness 
resources for your journey.

---

## 📝 Usage Guide

- **Search or browse** for a program using the map or search bar.
- **Click a program** to see details, reviews, and how to apply.
- **Read what other students have shared.**
- **Leave your own review and rating** after your exchange.
- **Check out comments, resources, and links** to help you prepare.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Supabase project and API keys: for the database (programs, comments, ratings)
- MapTiler API key: for the interactive map tiles and geospatial features

### Setup
1. Clone this repository:
   ```bash
   git clone <your-repo-url>
   cd w2w
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Set up your environment variables:
   - Copy `.env.example` to `.env.local` and fill in your Supabase and MapTiler keys.
4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---


## 🤝 Contributing

I welcome contributions from students (UW or other) and developers!
For major changes, please open an issue first to discuss what you’d like to change.

---

## 📅 Feature Roadmap & Updates

Stay up to date with new features and planned improvements:  
👉 [W2W Feature Roadmap & Updates (Notion)](https://ammiellewb.notion.site/W2W-21eaa4f8c84480af91beeaa2fd88726c?source=copy_link)

---

## License

MIT
