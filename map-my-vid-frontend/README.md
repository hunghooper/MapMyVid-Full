# MapMyVid 🗺️

A minimalist web application for mapping and organizing locations from your travel videos. Upload videos, extract location data, and visualize your journey on interactive maps with drag-and-drop route planning.

## ✨ Features

### 🎬 Video Management
- Upload travel videos with automatic processing
- View completed videos in a clean, organized library
- Delete unwanted videos with confirmation

### 🗺️ Interactive Mapping
- **Google Maps Integration** - Real-time map rendering with custom markers
- **Journey Visualization** - Connected route lines with directional arrows
- **Numbered Markers** - Clear sequence indicators for your travel stops
- **Auto-fit Bounds** - Automatically adjusts map view to show all locations

### 📍 Location Management
- **Drag & Drop Reordering** - Easily rearrange your journey sequence
- **Location Details** - Rich information cards for each stop
- **Click to Focus** - Pan and zoom to specific locations
- **Route Export** - One-click export to Google Maps for navigation

### 🎨 Minimalist Design
- Clean, distraction-free interface
- Consistent typography and spacing
- Responsive design for all devices
- Professional color scheme with subtle interactions

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn (recommended package manager)
- Google Maps API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mapmyvid.git
   cd mapmyvid
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. **Start the development server**
   ```bash
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 📜 Available Scripts

This project uses Yarn as the package manager. Here are the available scripts:

```bash
# Development
yarn dev          # Start development server
yarn build        # Build for production
yarn preview      # Preview production build

# Code Quality
yarn lint         # Run ESLint
yarn lint:fix     # Fix ESLint issues
yarn prettier     # Check code formatting
yarn prettier:fix # Fix code formatting
```

## 🔧 Configuration

### Google Maps API Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one

2. **Enable Required APIs**
   - Maps JavaScript API
   - Places API  
   - Geometry API

3. **Create API Key**
   - Go to Credentials → Create Credentials → API Key
   - Restrict the key to your domain for security

4. **Add API Key to Environment**
   ```env
   VITE_GOOGLE_MAPS_API_KEY=
   ```

### Supported Video Formats

- MP4, AVI, MOV, WMV
- Maximum file size: 100MB
- Recommended resolution: 1080p or higher

## 📱 Usage

### Uploading Videos

1. Click the upload area in the sidebar
2. Select your travel video file
3. Wait for processing to complete
4. Video will appear in "Completed Videos" section

### Managing Locations

1. **Select a Video** - Click on any completed video from the sidebar
2. **View Map** - Interactive map displays all extracted locations
3. **Reorder Journey** - Drag and drop locations in the right panel
4. **Focus Location** - Click any location to pan map view
5. **Export Route** - Use "Export to Google Maps" for navigation

### Navigation

- **Zoom**: Mouse wheel or map controls
- **Pan**: Click and drag the map
- **Markers**: Click to see location details
- **Route**: Automatic path drawing between sequential locations

## 🏗️ Project Structure

```
mapmyvid/
├── src/
│   ├── components/
│   │   ├── Header/
│   │   │   └── Header.tsx          # Navigation header
│   │   ├── LanguageSwitcher/
│   │   │   └── LanguageSwitcher.tsx # Language selection component
│   │   └── MapDashboard/
│   │       └── MapDashboard.tsx    # Main map interface
│   ├── layouts/
│   │   └── MainLayout.tsx          # App layout wrapper
│   ├── i18n/
│   │   ├── index.ts               # i18n configuration
│   │   └── locales/               # Translation files
│   │       ├── en.json            # English translations
│   │       ├── vi.json            # Vietnamese translations
│   │       ├── zh.json            # Chinese translations
│   │       └── ...                # Other languages
│   ├── assets/
│   │   └── LOGO-Photoroom.png      # Application logo
│   └── App.tsx                     # Root component
├── public/
├── .env                            # Environment variables
├── package.json
├── yarn.lock                       # Yarn lockfile
└── README.md
```

## 🛠️ Technologies Used

### Frontend Framework
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **Responsive Design** - Mobile-first approach

### Maps & Location
- **Google Maps JavaScript API** - Interactive mapping
- **@react-google-maps/api** - React wrapper for Google Maps
- **Polylines & Markers** - Route visualization

### State Management
- **React Hooks** - useState, useEffect, useMemo, useRef
- **Local State** - Component-level state management

### Internationalization
- **i18next** - Internationalization framework
- **react-i18next** - React integration for i18next
- **Multi-language Support** - Vietnamese, English, Japanese, Korean, Spanish, Chinese

## 🎨 Design Philosophy

### Minimalism Principles
- **Visual Clarity** - Clean interfaces without unnecessary elements
- **Functional Focus** - Every element serves a purpose
- **Consistent Spacing** - Unified grid system and typography
- **Subtle Interactions** - Smooth, purposeful animations

### Color Palette
- **Primary**: Clean whites and subtle grays
- **Accent**: Professional dark gray (#1f2937)
- **Interactive**: Subtle hover states and focus indicators
- **Semantic**: Red for delete actions, green for success

## 🚧 Roadmap

### Planned Features
- [ ] **Video Processing** - Automatic location extraction from video metadata
- [ ] **Offline Support** - PWA capabilities for offline usage
- [ ] **Sharing** - Export and share journey maps
- [ ] **Collaboration** - Multi-user journey planning
- [ ] **Mobile App** - Native iOS and Android applications

### Improvements
- [ ] **Performance** - Map rendering optimizations
- [ ] **Accessibility** - Enhanced keyboard navigation
- [x] **Internationalization** - Multiple language support (Vietnamese, English, Japanese, Korean, Spanish, Chinese)
- [ ] **Analytics** - Usage tracking and insights

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Code Style

- **ESLint** - Consistent code formatting
- **Prettier** - Automatic code formatting
- **Conventional Commits** - Standardized commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Maps Platform** - Providing robust mapping APIs
- **React Community** - Excellent ecosystem and documentation
- **Tailwind CSS** - Beautiful utility-first styling framework
- **Lucide Icons** - Clean, consistent iconography

---

**Made with ❤️ by the MapMyVid Team**

*Turn your travel videos into interactive journey maps*