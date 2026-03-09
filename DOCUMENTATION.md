# Simple Money - Technical Documentation

This document serves as an architectural and technical overview of the "Simple Money" platform, detailing the database schema, core workflows, and directory structure.

## 🗂️ Project Structure

```text
src/
├── app/
│   ├── (auth)/             # Public routes (login, signup)
│   ├── (user)/             # Protected routes requiring authentication
│   │   ├── home/           # Main Dashboard
│   │   ├── task/           # Task execution and tracking
│   │   ├── levels/         # VIP tiers overview
│   │   ├── profile/        # User settings, security, and wallet binding
│   │   ├── deposit/        # Fund addition with network selection
│   │   ├── withdraw/       # Payout requests
│   │   ├── record/         # History (Transactions, Withdrawals, Deposits)
│   │   ├── invite/         # Affiliate and referral metrics
│   │   ├── faq/            # Frequently Asked Questions
│   │   └── rules/          # Platform policies and system protocols
│   ├── globals.css         # Global Tailwind classes and custom theme variables
│   └── layout.tsx          # Root layout and context providers
├── components/
│   ├── Sidebar.tsx         # Desktop navigation
│   ├── Header.tsx          # Top navigation bar
│   ├── BottomNav.tsx       # Mobile navigation
│   ├── AuthProvider.tsx    # Context wrapper for Supabase Auth
│   ├── Providers.tsx       # Combined context providers
│   └── LoadingScreen.tsx   # Global loading states
├── context/
│   ├── AuthContext.tsx     # Manages user session and profile data
│   ├── CurrencyContext.tsx # Manages global currency formatting
│   ├── LanguageContext.tsx # Simple i18n implementation hook
│   └── NotificationContext.tsx # Centralized notification state
└── lib/
    ├── supabase.ts         # Supabase client instantiation
    └── utils.ts            # Helper functions (e.g., Tailwind class merging)
```

## 🗄️ Database Schema (Supabase PostgreSQL)

The application relies on a relational database structure housed in Supabase.

### 1. `profiles`
Extended user data tied to the Supabase `auth.users` table.
- `id` (uuid, primary key, references auth.users)
- `username` (text)
- `email` (text)
- `wallet_balance` (numeric, default 0)
- `profit` (numeric, default 0) - Today's profit tracking
- `level_id` (integer, references levels)
- `wallet_address` (text) - Bound USDT/ETH address for withdrawal
- `completed_count` (integer, default 0) - Number of tasks finished today
- `created_at` (timestamp)

### 2. `levels` (VIP System)
Static configurations for different account tiers.
- `id` (integer, primary key)
- `name` (text)
- `price` (numeric) - Unlock cost
- `commission_rate` (numeric) - E.g., 0.005 for 0.5%
- `tasks_per_set` (integer) - Default 40
- `sets_per_day` (integer) - Default 3
- `badge_color` (text) - Hex code for UI rendering
- `min_withdrawal` (numeric)

### 3. `transactions`
Financial ledger for all movements.
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `type` (text: 'deposit', 'withdrawal', 'commission', 'upgrade')
- `amount` (numeric)
- `status` (text: 'pending', 'completed', 'rejected')
- `proof_url` (text) - S3 bucket URL for deposit receipts
- `wallet_address` (text) - For withdrawals
- `description` (text) - Human-readable context
- `created_at` (timestamp)

### 4. `user_tasks`
Records of task operations.
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `status` (text: 'pending', 'completed')
- `commission_earned` (numeric)
- `created_at` (timestamp)
- `completed_at` (timestamp, nullable)

## 🔄 Core Workflows

### 1. Task Execution Flow (`/task`)
1. User enters the Task Portal. The system fetches their current `level_id` and the `levels` rules (tasks per set, commission rate).
2. The user initiates a set. The frontend performs simulated "Neural Network Optimization" with UI delays and spinning animations.
3. Upon completion of a task, the platform calculates: `Commission = (Base Balance) * commission_rate`.
4. A database RPC (Remote Procedure Call) or direct update increments the user's `wallet_balance`, `profit`, and logs a `commission` transaction.

### 2. Deposit Flow (`/deposit`)
1. User selects a network (TRX, BEP20, ERC20) and an amount.
2. User uploads a screenshot of the payment receipt.
3. The image is uploaded to the Supabase Storage bucket (`deposit_proofs`).
4. A new record is created in the `transactions` table with `type='deposit'`, `status='pending'`, and the `proof_url`.
5. An administrator reviews the transaction in the Supabase Dashboard and marks it `completed`, manually adjusting the user's `wallet_balance`.

### 3. Withdrawal Flow (`/withdraw`)
1. User attempts a withdrawal. The UI validates minimum withdrawal limits based on their VIP Level.
2. The user confirms their target wallet address.
3. The requested amount is immediately deducted from their `wallet_balance` to prevent double-spending.
4. A new `transactions` record is created with `type='withdrawal'` and `status='pending'`.
5. An administrator manually processes the payout out-of-band and marks the transaction `completed` in Supabase.

## 🎨 Theming System
The platform utilizes Tailwind CSS alongside custom classes defined in `globals.css` to achieve complex UI states efficiently.
- Uses `text-text-primary dark:text-white` to enable seamless transitions between light and dark modes.
- Shared wrapper classes: `.glass-card`, `.glass-card-glow`, and `.glass-card-strong` provide uniform blur effects and border radii across all pages.
