# Hyperlocal News App — React Native Mobile Module

An enterprise-grade, high-performance Hyperlocal News feature module for React Native, engineered with **Clean Feature-Driven Architecture** and premium **Light/Dark theme support**.

This codebase is a showcase of advanced architectural design patterns, offline-first data structures, and buttery-smooth 60fps lists optimized for millions of active users.

---

## 🚀 Key Features

* 🗂 **Horizontal Category Snapping Slider**: Premium container-presenter slider utilizing layout scrolling index centers and custom animated spring underlines.
* ⚡ **Dynamic Recycler Feed (60 FPS)**: Powered by Shopify’s high-frequency recycler list (`@shopify/flash-list`) which drastically reduces memory consumption on long lists.
* 🏭 **Feed Card Factory**: Resolves cards dynamically via a compile-safe static factory mapping news headlines, warm sponsored advertisements, and local community events.
* 📦 **Decoupled Repositories**: Data layers abstracting local mockup generators (with simulated delay) and production REST APIs behind standard interfaces.
* 🛡 **Strategy-Pattern Error Recovery**: Multi-layered resilient pipelines combining **Exponential Backoff Retries**, **Storage Caching fallback**, and **Visual UI translate handlers**.
* 💬 **Optimistic Comments Submissions**: A standalone comment thread supporting lazy paging and instant UI optimistic rendering with automatic rollback on network failure.
* 🌓 **Premium Dynamic Colors**: Type-safe themes containing responsive typographic scales, dynamic shadows, and system light/dark scheme bindings.
* 🧪 **Robust Automated Test Foundation**: Complete Jest unit test coverage covering repositories, state slices, factories, and retry backoffs.
* 📱 **Expo Go Ready**: Clean, optimized configurations to scan, bundle, and preview the interface instantly.

---

## 🎨 Architectural Design Patterns

This module implements key production-grade software design patterns:

| Design Pattern | Application Target | Operational Responsibility |
| :--- | :--- | :--- |
| **Container-Presenter** | Category Slider | Separates active Redux listener hook states (`CategoryContainer`) from layout-snapping UI styles (`CategorySlider`). |
| **Factory Pattern** | Feed Card Generator | Uses `CardFactory` to map JSON arrays to modular cards (`NewsCard`, `AdCard`, `EventCard`) without nested switch statement clutter. |
| **Repository Pattern** | Data Access Layer | Decouples data retrieval (`INewsRepository`) so you can swap Mock and production Axios modules via central configuration toggles. |
| **Strategy Pattern** | Resilient Error Recovery | Automatically routes failure paths through `RetryStrategy` (backoff loops), `CacheFallbackStrategy` (AsyncStorage), and `ErrorUIStrategy`. |
| **Observer Pattern** | Redux Store | Subscribes widgets to precise slice updates using memoized selectors (`createSelector`) to prevent redundant re-renders. |

---

## 📁 Folder Structure

```
src/
├── core/
│   ├── navigation/        # AppNavigator (Stack), types (Type-safe parameters)
│   ├── theme/             # Light/Dark dynamic design palettes, dynamic scales
│   ├── constants/         # USE_MOCK_DATA flags, retry counts, storage keys
│   ├── utils/             # Relative time formatting helper libraries
│   ├── types/             # Domain entities (NewsArticle, Comment, FeedItem)
│   └── mocks/             # High-fidelity mock updates and community logs
└── features/
    └── news/
        ├── components/    # CategorySlider, cards, skeletons, and offline banners
        ├── containers/    # CategoryContainer
        ├── screens/       # NewsFeedScreen, ArticleDetailScreen
        ├── repository/    # INewsRepository, Mock/API endpoints, singleton provider
        ├── factory/       # CardFactory dynamic resolver
        ├── strategies/    # ErrorStrategy base, Retry, CacheFallback, ErrorUI strategy
        ├── hooks/         # useNewsFeed and useComments hooks
        ├── store/         # RTK configurations and newsSlice
        └── __tests__/     #jest unit test collections
```

---

## ⚡ Quick Start & Run Instructions

### 1. Prerequisites
Ensure you have Node.js installed, then clone the repository:
```bash
git clone <YOUR_REPOSITORY_URL>
cd "Hyperlocal News app"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Automated Testing Suite
Validate our design patterns and store reducers instantly:
```bash
npm test
```

### 4. Boot the App in Expo Go
Start the Metro bundler and generate the QR code:
```bash
npm start
```
1. Download the **Expo Go** app on your phone.
2. Scan the terminal's QR code.
3. The app will bundle and render live in seconds!

---

## ♿ Accessibility First

The module satisfies WCAG AA guidelines:
* **Minimum Touch targets** of 44x44 points.
* **Typographic scale** optimized for Dynamic Font Scaling screen reader support.
* **Explicit screen reader tags** (`accessibilityRole`, `accessibilityLabel`, `accessibilityState`).
