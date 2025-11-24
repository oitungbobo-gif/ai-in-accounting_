# AI Accounting Training Platform

An interactive training platform for accounting professionals to learn about AI integration in finance workflows.

## 🚀 Features

- **11 Interactive Training Modules**: Comprehensive curriculum covering AI fundamentals to advanced applications
- **AI-Powered Chatbot**: Context-aware training companion using Google Gemini API
- **Interactive Simulations**: Hands-on challenges for AR, AP, GL, and Audit scenarios
- **Modern UI/UX**: Built with React, Tailwind CSS, and Lucide icons
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Gemini API Key** (Get one from [Google AI Studio](https://makersuite.google.com/app/apikey))

---

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd "Accountant ai"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

4. **Add your API key to `.env.local`:**
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

---

## 💻 Development

### Start Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to view the application.

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production-ready application |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run test` | Run tests in watch mode |
| `npm run test:ui` | Run tests with UI interface |
| `npm run test:coverage` | Generate test coverage report |
| `npm run test:run` | Run all tests once (CI mode) |

---

## 🧪 Testing

This project uses **Vitest** and **React Testing Library** for testing.

### Run Tests

```bash
# Watch mode (interactive)
npm run test

# Run once (for CI/CD)
npm run test:run

# With UI interface
npm run test:ui

# With coverage report
npm run test:coverage
```

### Test Coverage

After running `npm run test:coverage`, open `coverage/index.html` to view detailed coverage reports.

**Coverage Goals:**
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### Writing Tests

Tests are located in `src/test/` directory. Example:

```javascript
// src/test/App.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('renders the intro slide', () => {
    render(<App />);
    expect(screen.getByText(/AI in Accounting/i)).toBeInTheDocument();
  });
});
```

---

## 🚀 Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Quick Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Production Build

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

The production build will be in the `dist/` directory.

---

## 📁 Project Structure

```
Accountant ai/
├── public/              # Static assets
│   └── Video_prompt__202511232221.mp4
├── src/
│   ├── test/           # Test files
│   │   ├── setup.js    # Test configuration
│   │   ├── App.test.jsx
│   │   └── Chatbot.test.jsx
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global styles
├── .env.example        # Example environment variables
├── .env.local          # Local environment (gitignored)
├── .env.production     # Production environment (gitignored)
├── .gitignore          # Git ignore rules
├── DEPLOYMENT.md       # Deployment guide
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
├── vitest.config.js    # Vitest configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── postcss.config.js   # PostCSS configuration
└── README.md           # This file
```

---

## 🔐 Environment Variables

All environment variables must be prefixed with `VITE_` to be exposed to the client.

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key for chatbot | Yes |
| `VITE_APP_NAME` | Application name | No |
| `VITE_APP_VERSION` | Application version | No |
| `VITE_ENV` | Environment (development/production) | No |
| `VITE_ENABLE_CHATBOT` | Enable/disable chatbot feature | No |
| `VITE_ENABLE_ANALYTICS` | Enable/disable analytics | No |

**Security Note:** Never commit `.env.local` or `.env.production` files with real API keys!

---

## 🏗️ Built With

- **[React 19](https://react.dev/)** - UI library
- **[Vite 7](https://vitejs.dev/)** - Build tool
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Styling
- **[Lucide React](https://lucide.dev/)** - Icons
- **[Vitest](https://vitest.dev/)** - Testing framework
- **[React Testing Library](https://testing-library.com/react)** - Component testing
- **[Google Gemini API](https://ai.google.dev/)** - AI chatbot

---

## 🎯 Training Modules

1. **Introduction** - Overview of AI in accounting
2. **Why AI Matters** - Benefits and strategic value
3. **Core Modules** - Framework overview
4. **Mindset Game** - Interactive human vs. AI task sorting
5. **Prompting Techniques** - How to communicate with AI effectively
6. **Smarter Workflows** - Process optimization strategies
7. **Responsible AI** - Security, privacy, and compliance
8. **Practical Applications** - Real-world tools and use cases
9. **Advanced Simulations** - Hands-on AR, AP, GL, and Audit challenges
10. **Learning Resources** - Additional training materials
11. **Conclusion** - Summary and next steps

---

## 🐛 Troubleshooting

### Development Server Won't Start
- Check Node.js version: `node --version` (should be 18+)
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Chatbot Not Working
- Verify `VITE_GEMINI_API_KEY` is set in `.env.local`
- Check API key validity at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Restart development server after changing environment variables

### Build Fails
- Run `npm run lint` to check for errors
- Clear cache: `rm -rf dist`
- Check for missing dependencies: `npm install`

### Tests Failing
- Ensure all dependencies are installed: `npm install`
- Clear test cache: `npx vitest run --clearCache`

---

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Quality Standards

- Write tests for new features
- Maintain test coverage above 80%
- Follow ESLint rules: `npm run lint`
- Use meaningful commit messages
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Training content based on modern AI accounting practices
- UI/UX inspired by contemporary web design trends
- Icons provided by [Lucide](https://lucide.dev/)

---

## 📞 Support

For questions or issues:
- Open an issue in the repository
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Review existing tests in `src/test/` for examples

---

**Version:** 1.0.0
**Last Updated:** November 23, 2025
