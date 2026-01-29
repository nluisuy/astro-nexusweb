# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based static site using Tailwind CSS v4. The project uses pnpm as the package manager and combines Biome for linting with Prettier for formatting.

## Development Commands

```bash
# Install dependencies
pnpm install

# Start dev server (runs at localhost:4321)
pnpm dev

# Build for production
pnpm build

# Preview production build locally
pnpm preview

# Linting and formatting
pnpm lint           # Check code with Biome
pnpm lint:fix       # Fix Biome issues automatically
pnpm format         # Format code with Prettier
pnpm format:check   # Check formatting without changes

# Type checking
pnpm type-check     # Run Astro type checking

# Validation (runs before build)
pnpm validate       # Runs lint:fix, format, and type-check

# Clean build artifacts
pnpm clean          # Remove dist/ and .astro/ directories
```

## Architecture

### Project Structure

- **src/pages/**: Astro pages with file-based routing
- **src/components/**: Reusable Astro components
- **src/layouts/**: Page layout templates
- **src/assets/**: Static assets processed by Astro
- **src/styles/**: Global CSS files
- **public/**: Static files served as-is (favicons, etc.)

### Key Technologies

- **Astro 5.x**: Static site generator with Islands architecture
- **Tailwind CSS 4.x**: Utility-first CSS framework integrated via Vite plugin
- **TypeScript**: Strict mode enabled via Astro's strict tsconfig
- **Biome**: Fast linter for code quality
- **Prettier**: Code formatter with Astro plugin support

### Build Pipeline

The project uses a validation pipeline that runs automatically before builds:
1. Biome linting with auto-fix
2. Prettier formatting
3. Astro type checking

### Styling Approach

Tailwind CSS v4 is integrated through the Vite plugin system (not via PostCSS). This is configured in `astro.config.mjs`.

### TypeScript Configuration

The project uses Astro's strict TypeScript configuration, which provides strong type safety for Astro components and TypeScript files.