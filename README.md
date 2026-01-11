# Financial Calculator Suite

A comprehensive web application featuring 8+ financial calculators built with Next.js 15, TypeScript, and modern React patterns. This project demonstrates proficiency in building complex financial applications with clean architecture, excellent UX, and production-ready code.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?style=flat&logo=tailwind-css)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-black?style=flat&logo=shadcnui)

## 🎯 Project Overview

This application provides a suite of professional-grade financial calculators designed to help users make informed investment and loan decisions. Each calculator features:

- **Real-time calculations** with instant feedback
- **Interactive visualizations** including charts and progress indicators
- **Detailed breakdowns** with year-by-year analysis
- **Mobile-responsive design** with dark mode support
- **Accessibility-first** approach following WCAG guidelines

## 🚀 Key Features

### Investment Calculators
- **SIP Calculator** - Calculate returns on systematic investment plans with compounding
- **Step-Up SIP Calculator** - SIP with annual contribution increases
- **Lumpsum Calculator** - One-time investment growth projections
- **SWP Calculator** - Systematic withdrawal planning with fund depletion tracking
- **SWP Step-Up Calculator** - Withdrawal planning with annual increases

### Loan Calculators
- **EMI Calculator** - Calculate equated monthly installments for loans
- **EMI Step-Up Calculator** - Advanced EMI with annual payment increases using iterative convergence algorithms

### Tax Calculator
- **Income Tax Calculator** - Tax liability calculation based on New Tax Regime (FY 2025-26) with slab-wise breakdown

## 💼 Technical Highlights

### Architecture & Code Quality
- **Component-driven architecture** - Modular, reusable components with clear separation of concerns
- **Type safety** - Comprehensive TypeScript implementation with strict type checking
- **Clean code practices** - Extensive JSDoc documentation and inline comments
- **Performance optimization** - Client-side rendering with efficient state management

### Advanced Implementations
- **Iterative algorithms** - Complex EMI step-up calculations using convergence methods
- **Progressive taxation** - Multi-slab tax calculations with cess computation
- **Compound interest** - Accurate financial formulas for investment projections
- **Data visualization** - Interactive charts and tables with custom formatting

### UI/UX Excellence
- **shadcn/ui components** - Modern, accessible component library
- **Radix UI primitives** - Unstyled, accessible UI components
- **Tailwind CSS** - Utility-first styling with custom design system
- **Responsive design** - Mobile-first approach with breakpoint optimization
- **Dark mode support** - Theme provider with system preference detection

## 🛠️ Tech Stack

**Framework:** Next.js 15 (App Router)  
**Language:** TypeScript 5.0  
**UI Library:** React 19  
**Styling:** Tailwind CSS 3.0  
**Components:** shadcn/ui, Radix UI  
**Charts:** Recharts  
**State Management:** React Hooks (useState)  
**Code Quality:** ESLint, TypeScript Strict Mode  

## 📁 Project Structure

```
financial-calculator/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout with theme provider
│   └── page.tsx                 # Home page
├── components/
│   ├── common/                  # Shared components
│   │   ├── input-field.tsx     # Reusable input with slider
│   │   ├── progress-bar.tsx    # Visual progress indicator
│   │   ├── table-dialog.tsx    # Data table modal
│   │   └── chart-dialog.tsx    # Chart visualization modal
│   ├── layout/                  # Layout components
│   │   └── header.tsx          # Navigation header
│   └── [calculator-name]/       # Individual calculators
│       ├── index.tsx           # Main calculator logic
│       ├── inputs-card.tsx     # Input form component
│       └── results-card.tsx    # Results display component
└── lib/
    └── utils.ts                 # Utility functions
```

## 🎨 Key Technical Achievements

### Complex Financial Calculations
- Implemented **iterative convergence algorithms** for EMI step-up calculations
- Developed **progressive tax calculation engine** with multi-slab support
- Created **compound interest projections** with year-by-year breakdown

### Code Architecture
- **Modular design** - Each calculator split into focused, testable components
- **DRY principles** - Shared components for inputs, charts, and tables
- **Type safety** - Exported interfaces for inter-component communication
- **Documentation** - Comprehensive comments explaining complex algorithms

### User Experience
- **Real-time validation** - Input constraints with visual feedback
- **Interactive visualizations** - Charts and tables for data exploration
- **Responsive layout** - Grid-based design adapting to all screen sizes
- **Accessibility** - Semantic HTML, ARIA labels, keyboard navigation

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd financial-calculator

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 📊 Calculator Features Breakdown

### SIP Calculator
- Monthly investment tracking
- Compound interest calculation
- Future value projection
- Return ratio analysis (percentage vs multiplier display)

### EMI Step-Up Calculator
- Iterative algorithm to find optimal starting EMI
- Annual payment increase simulation
- Loan completion in exact tenure
- Month-by-month principal and interest breakdown

### Income Tax Calculator
- New Tax Regime slab implementation
- Progressive taxation across 7 slabs
- 4% Health and Education Cess
- Effective tax rate computation
- Section 80C, 80D, and other deductions

## 🎓 Skills Demonstrated

**Frontend Development**
- Advanced React patterns (hooks, composition, component architecture)
- TypeScript for type-safe development
- Modern CSS with Tailwind utility classes
- Responsive design implementation

**Financial Domain Knowledge**
- Investment calculations and compound interest
- Loan amortization and EMI formulas
- Tax computation and progressive taxation
- Financial planning concepts

**Software Engineering**
- Clean code principles and documentation
- Component-driven architecture
- Performance optimization
- User experience design

**Tools & Technologies**
- Git version control
- Next.js App Router
- Modern build tools (Turbopack)
- npm package management

## 📝 Code Quality

- **100% TypeScript** - Full type coverage with strict mode enabled
- **Comprehensive documentation** - JSDoc comments for all components and complex functions
- **Inline explanations** - Comments explaining financial formulas and algorithms
- **Consistent formatting** - ESLint configuration for code standards
- **Modular architecture** - Single responsibility principle throughout

## 🔗 Live Demo

[Add deployment link here - Vercel/Netlify recommended]

## 👨‍💻 Developer

Built with attention to detail, clean code practices, and modern web development standards.

**Portfolio:** [Your portfolio URL]  
**LinkedIn:** [Your LinkedIn URL]  
**GitHub:** [Your GitHub URL]  
**Email:** [Your email]

---

*This project showcases skills in React, TypeScript, Next.js, financial calculations, UI/UX design, and production-ready code development.*
