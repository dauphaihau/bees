# User Management Table Component

This project implements two versions of a user management table component using Vue 3 and TypeScript, demonstrating different data handling approaches.

## Components Overview

### 1. UserMockData.vue
A table implementation using static/mock data with client-side operations:
- Client-side searching across multiple fields (name, email, balance, registration date)
- Client-side sorting for all columns
- Row selection with checkboxes
- Dual display modes: Regular pagination and Virtual scrolling
- Currency and date formatting
- Action buttons (edit/delete) for each row
- Customizable page sizes (10/20/50 rows)

### 2. UserFetchAPI.vue
A table implementation using remote API data (dummyjson.com):
- Server-side data fetching with pagination
- Server-side search functionality
- Server-side sorting
- Loading states and error handling
- Infinite scrolling support in virtual mode
- Flexible page size options (15/30/50 for virtual, 10/25/50 for normal mode)

## Common Features
- Base Table component reuse
- Virtual/Normal pagination mode switching
- Row selection functionality
- Modern UI components (SearchBar, Pagination, Checkbox)
- Heroicons integration
- Tailwind CSS styling

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Vue.js 3.x
- TypeScript

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

## Project Structure
```
src/
├── components/
│   ├── UserMockData.vue      # Static data implementation
│   ├── UserFetchAPI.vue      # API-based implementation
│   ├── ui/                   # Reusable UI components
│   │   ├── table/           # Table component and types
│   │   ├── Pagination.vue
│   │   ├── Badge.vue
│   │   └── Checkbox.vue
│   └── SearchBar.vue
├── types/
│   └── user.ts              # TypeScript interfaces
└── utils/                   # Utility functions
```

## Dependencies
- Vue 3
- TypeScript
- Tailwind CSS
- date-fns
- @heroicons/vue
- Other dependencies as specified in package.json

## Development Notes
- The mock data version is suitable for smaller datasets and offline-first applications
- The API version is optimized for large datasets and real-time data
- Both versions support dark mode through Tailwind CSS classes
- Virtual mode is recommended for large datasets to improve performance

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- CSS Grid and Flexbox support required
