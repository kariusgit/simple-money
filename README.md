# Simple Money - Investment & Task Platform

A premium, full-stack web application designed for task-based investments and portfolio management. Built with modern web technologies and a focus on high-fidelity user experiences.

## ✨ Features

- **Authentication System**: Secure login, registration, and session management using Supabase Auth.
- **Premium User Interface**: Modern glassmorphism design, dark/light mode support, smooth animations, and responsive layouts tailored for all devices.
- **Dashboard & Analytics**: Real-time overview of wallet balance, today's profit, completed tasks, and quick access to major platform features.
- **Task & Level System**: 
  - Hierarchical VIP levels with dynamic daily sets, task limits, and commission rates.
  - Interactive task processing and rewards settlement.
- **Financial Hub**: 
  - **Deposit**: Multi-network support (TRX, BEP-20, ERC-20) with proof-of-payment upload.
  - **Withdraw**: Secure escrow settlement and address management.
  - **Transaction History**: Comprehensive ledger for deposits, withdrawals, and task commissions.
- **User Profile Management**: Information, security settings, wallet address binding, and application preferences.
- **Admin Capabilities**: Supabase integration allows administrators to track user tasks, approve/reject deposits, and manage level configurations.

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication & Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (for deposit proofs)

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Supabase account and project

### 2. Clone and Install
```bash
git clone <your-repo-url>
cd simple-money-main
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials. These can be found in your Supabase project settings under API.

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📦 Vercel Deployment

1. Push your code to a GitHub/GitLab/Bitbucket repository.
2. Sign in to [Vercel](https://vercel.com/) and create a "New Project".
3. Import your repository.
4. **Important**: Add your environment variables in the Vercel deployment settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**. Vercel will automatically detect the Next.js framework and configure the build settings.

## 🎨 UI/UX Highlights

- **Theme Switching**: Fully supports user-preferred color schemes (Light Mode / Dark Mode) dynamically adjusting text contrasts and subtle glow effects.
- **Glassmorphism**: Advanced backdrop blurs and semi-transparent gradients (`glass-card`, `glass-card-glow`) for a modern "fintech" aesthetic.
- **Responsive Navigation**: Context-aware Sidebar for desktop and a Bottom Tab Bar / Header menu for mobile devices.

---
*Built with modern web standards to provide a seamless financial management experience.*
