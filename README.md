# Gurukul Vidyalay & Jr. College (GVSJC) Portal

![Gurukul Vidyalay Hero](public/middle_school_building.jpg)

A modern, responsive, and SEO-optimized school portal and administrative dashboard built for **Gurukul Vidyalay & Jr. College, Chokak, Kolhapur**. Built using the latest modern web development stack, the platform supports multilingual content, dynamic notice boards, online admissions forms, contact forms, and a secure admin dashboard.

---

## 🚀 Tech Stack

- **Frontend Framework:** React 18 with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Component Library:** Component library built with Tailwind (inspired by Shadcn UI)
- **Routing:** React Router v6
- **State & Data Fetching:** TanStack React Query v5
- **Backend & Database:** Supabase
- **SEO Elements:** React Helmet Async, JSON-LD Schema.org, Open Graph, Twitter Cards
- **Icons:** Lucide React

---

## ✨ Key Features

- **Public Features:**
  - 🌐 Complete informational portal (Home, About, Academics, Admissions, Contact, etc.).
  - 📱 Fully responsive, mobile-first design with complex smooth scroll-reveal animations.
  - 🌍 Multi-language support structure via a custom Language Context.
  - 📑 Live, dynamic Notice Board displaying the latest announcements.
  - 📈 Exceptional SEO setup with per-page `react-helmet-async` tags and `sitemap.xml`.
  - 📝 Online Contact and Admission forms connected directly to Supabase databases.

- **Admin Dashboard (`/admin`):**
  - 🔒 Protected routes guarding the dashboard interface.
  - 📬 View live submissions for Site Queries (Contact form) and Admissions.
  - 📊 Notice Manager tool (for managing alerts/notices).
  - 🔄 Fast caching and background refetching via TanStack Query.

---

## 🛠️ Project Structure

```text
├── public/                 # Static assets (images, robots.txt, sitemap.xml)
├── src/
│   ├── assets/             # Bundled static assets
│   ├── components/         # Reusable UI components (Layout, SEOHead, UI elements)
│   ├── contexts/           # React Contexts (Language, Auth)
│   ├── hooks/              # Custom React Hooks (Supabase queries, UX hooks)
│   ├── lib/                # Library configurations (Supabase client, utils)
│   ├── pages/              # Main route views
│   │   └── admin/          # Admin dashboard and protected pages
│   ├── App.tsx             # Main App component & Router setup
│   ├── index.css           # Global Tailwind & Custom CSS
│   └── main.tsx            # React Entry point
├── index.html              # Main HTML entry with global SEO, Analytics, and Manifest
├── supabase/               # Optional: Supabase edge functions or schema definitions
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

---

## ⚙️ Getting Started

### 1. Prerequisites
Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (Version 18+ recommended)
- `npm` or `yarn`

### 2. Required Environment Variables
Create a `.env` or `.env.local` file in the root directory. You will need your Supabase project credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/GVSJC.git
cd GVSJC
npm install
```

### 4. Running the Development Server

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:8080/` (or the port specified by Vite).

### 5. Building for Production

To create an optimized production build:

```bash
npm run build
```

This will run TypeScript checks, bundle the app into the `dist/` directory, and apply minification.
You can preview the built app using:

```bash
npm run preview
```

---

## 🗄️ Database Schema 

The application utilizes the following primary Supabase tables:

- **`contacts`**: Stores visitor queries submitted through the Contact Us page.
- **`admission`**: Stores student applications submitted through the Admissions page.
- *(Note: Ensure the Supabase RLS (Row Level Security) policies are properly set so the public can `INSERT` but only authenticated admin users can `SELECT`.)*

---

## 🔍 SEO Strategy

This app achieves a very high modern SEO footprint by utilizing:
- Structured **JSON-LD** (School Schema) in `index.html`.
- Strict **Canonical URLs** and complete Open Graph meta tags.
- Programmatic `<head>` updates on route change using **`react-helmet-async`**.
- Generated `robots.txt` and `sitemap.xml`.

---

## 👨‍💻 Maintainers

Developed & Designed for **Gurukul Vidyalay & Jr. College**.
