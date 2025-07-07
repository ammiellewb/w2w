# Waterloo 2 World (W2W)

Waterloo 2 World (W2W) is a modern web platform designed to help University of Waterloo students explore, compare, and share real experiences about international exchange programs. W2W brings together live program data, student reviews, and helpful resources to make your exchange journey easier and more informed.

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

## 📝 Usage Guide

- **Search or browse** for a program using the map or search bar.
- **Click a program** to see details, reviews, and how to apply.
- **Read what other students have shared.**
- **Leave your own review and rating** after your exchange.
- **Check out comments, resources, and links** to help you prepare.

For more information, speak with your [Faculty Exchange Representative](https://uwaterloo.ca/student-success/students/study-abroad-and-exchanges/go-abroad/application-steps#reps) or email the Global Learning Coordinators at [studyabroad@uwaterloo.ca](mailto:studyabroad@uwaterloo.ca).

**Wellness Resources:** [Wellness Resources for Exchange Students (PDF)](https://uwaterloo-horizons.symplicity.com/outgoing/_dlcache_f59cc7302b4dbcbef1634e3d3eb0f29c_WellnessResourcesforExhcangeStudents.pdf?i=895fb6759e8f0b9a73cf6bb088b854de)

---

## 🤝 Contributing

We welcome contributions from students and developers! To contribute:
1. Fork this repo and create your feature branch (`git checkout -b feature/your-feature`)
2. Commit your changes (`git commit -am 'Add new feature'`)
3. Push to the branch (`git push origin feature/your-feature`)
4. Open a Pull Request

For major changes, please open an issue first to discuss what you’d like to change.

---

## 📅 Feature Roadmap & Updates

Stay up to date with new features and planned improvements:  
👉 [W2W Feature Roadmap & Updates (Notion)](https://ammiellewb.notion.site/W2W-21eaa4f8c84480af91beeaa2fd88726c?source=copy_link)

---

## License

MIT
