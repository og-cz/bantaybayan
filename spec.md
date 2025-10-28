# Bantay Bayan

## Overview
A modern web application for tracking municipal projects and budget transparency in Quezon City, featuring a social-media-style interface that allows citizens to view project status and completion while enabling officials to manage project data. Bantay Bayan serves as a public transparency tool focused on exposing "ghost projects" in the Philippines and promoting government accountability. The application includes advanced features for user engagement, data visualization, and comprehensive reporting.

## Core Features

### Home Page
- Hero section with prominent title "Bantay Bayan" and description emphasizing its mission as a Philippine public transparency platform for exposing ghost projects and promoting government accountability
- Large centered search bar for finding projects across all municipalities with advanced filters
- Main feed displaying the 15 most recent projects as cards in a responsive grid layout
- Each project card shows:
  - Project title and category
  - Location (district/municipality)
  - Progress bar with completion percentage
  - Budget information
  - Project thumbnail image
  - Priority indicator
  - Bookmark/favorite button for logged-in users
  - "View Details" button
- Municipality Explorer section below the feed displaying all municipalities as cards
- Each municipality card shows:
  - Municipality name
  - Total project count
  - Budget summary
  - "View District Page" button

### About Page
- Dedicated About page accessible from main navigation and footer
- Mission statement section explaining Bantay Bayan's purpose in promoting public transparency in the Philippines
- Clear explanation of the platform's role in exposing ghost projects and empowering citizens
- Brief history section detailing the project's origins and development
- Goals and objectives section outlining the platform's aims for government accountability
- User participation section explaining how citizens can:
  - Track government projects
  - Report issues or concerns
  - Engage with the platform
  - Contribute to transparency efforts
- Visual elements including Bantay Bayan logo and hero banner
- Contact information or reporting mechanisms for users
- Design consistent with the rest of the application using card-based layout
- Responsive design for mobile and desktop viewing

### District/Municipality Page
- Profile-style layout with cover banner image
- District name and Bantay Bayan logo display
- Overview section with district information including all barangays and landmark notes
- Budget summary with visual indicators and interactive charts
- Project history timeline showing key milestones
- Export functionality for district data (CSV, PDF)
- Tabbed interface for:
  - Active projects
  - Completed projects
  - Bookmarked projects (for logged-in users)
- Projects displayed as cards within each tab
- Advanced filtering options by year, category, status, priority
- Complete barangay listing for each district with landmark information
- Proper data integration between districts and their associated projects - clicking on any district must always display the correct list of projects with no empty states
- Project history and timeline must be visible and accurate for each district, showing all relevant projects and their progress

### Project Page
- Detailed project information including:
  - Project name and description
  - Start and end dates
  - Progress percentage and completion status
  - Priority level indicator
  - Timeline with milestones and updates
  - Project phases and key deliverables
  - Official in charge
  - Attached documents (if any)
  - Budget information with breakdown
  - Interactive progress charts and visualizations
- Bookmark/favorite functionality for logged-in users
- Public comment section with threaded discussions
- Comment moderation tools for admins (report/delete)
- Export project details (PDF, summary report)
- Card-based layout for project details

### Project Progress Page
- Interactive visual charts showing project completion over time
- Category breakdown charts and completion rate visualizations
- Filter options by district, category, year, status, and priority
- Project breakdown by categories and phases
- Comparative progress analysis across districts
- Export analytics data (CSV, PDF)
- Card-based display for analytics

### User Authentication & Profiles
- User registration and login system
- User profiles with bookmarked projects section
- Notification preferences management
- Admin login system with reliable username/password authentication that properly validates credentials
- Default admin account (username: "admin", password: "1234") must reliably grant access to Admin Dashboard
- Frontend must correctly send admin credentials to backend for validation
- Backend must properly recognize and authenticate admin credentials
- After successful admin login, session must be properly saved and user redirected to Admin Dashboard
- Role-based access for data management

### Bookmarking & Favorites
- "My Bookmarked Projects" page for logged-in users
- Bookmark/unbookmark functionality on project cards and detail pages
- Bookmark counter and management interface
- Integration with notification system for bookmarked project updates

### Notification System
- Real-time notifications for project updates on bookmarked projects
- Email notifications for commented projects
- Notification preferences in user profile
- Admin notifications for new comments requiring moderation
- Notification history and management

### Public Comments
- Comment threads on each project page
- User authentication required for commenting
- Reply functionality for threaded discussions
- Comment timestamps and user attribution
- Admin moderation tools (report, delete, hide comments)
- Comment notification system for project followers

### Advanced Search & Filtering
- Global search across all projects and municipalities
- Advanced filter panel with options for:
  - Year range selection
  - Category multi-select
  - District/municipality selection
  - Status filtering (active, completed, planned)
  - Priority level filtering
  - Progress percentage ranges
- Keyword search with autocomplete suggestions
- Filter combinations and saved search preferences
- Real-time search results updating

### Export & Reporting
- Project data export in multiple formats (CSV, PDF)
- District summary reports with charts and statistics
- Custom report generation with date ranges and filters
- Bulk export functionality for multiple projects
- Summary reports with visualizations
- Downloadable analytics dashboards

### Admin Dashboard
- Secure username/password login that reliably authenticates admin users
- Default admin account with username "admin" and password "1234" must provide consistent access
- Proper session management after successful login with automatic redirect to dashboard
- Full administrative access to add, edit, and delete projects
- Complete district and municipality data management including:
  - District information and barangay listings
  - Landmark notes and location details
  - Project assignments to specific districts and barangays
- Add new projects with complete details including priority levels
- Edit existing project information across all fields
- Update project progress and milestone completion
- Upload and manage document attachments
- Publish project announcements and updates
- Comment moderation interface
- User management and notification controls
- Export and reporting tools
- Modern card-based interface for admin functions
- District management interface showing all 6 Quezon City congressional districts
- Barangay management with landmark information for each district

### Reports Page
- Generate downloadable project progress summaries
- Export project reports in multiple formats (CSV, PDF, summary reports)
- Access project documentation
- Filter reports by date range, district, category, status, or priority
- Interactive report builder with custom parameters
- Scheduled report generation and delivery

## Data Management

### Frontend Data Source
The frontend must import and use provided JSON data as the primary data source for all project, district, and municipality information. All React Query hooks and page components must fetch and display data directly from the imported JSON data, ensuring real project information is displayed throughout the application.

### Quezon City District Structure
The application must support all 6 congressional districts of Quezon City with complete barangay listings and landmark information:
- 1st District with all constituent barangays and landmark notes
- 2nd District with all constituent barangays and landmark notes
- 3rd District with all constituent barangays and landmark notes
- 4th District with all constituent barangays and landmark notes
- 5th District with all constituent barangays and landmark notes
- 6th District with all constituent barangays and landmark notes

### Data Loading Requirements
- Implement robust error handling for all data-fetching components
- Provide clear loading states with skeleton screens and progress indicators
- Display meaningful error messages when data is missing or fails to load
- Ensure all pages render real data from the JSON source including:
  - Home feed with actual project cards
  - District explorer with real municipality data and complete barangay listings
  - Project detail pages with complete information
  - Municipality profile pages with actual statistics and barangay information
  - Progress bars with real completion percentages
  - Officials information and contact details
  - Document attachments and timelines
  - Budget breakdowns and financial data
- Ensure proper data integration so district/municipality pages always show correct associated projects
- Project history and timeline must be accurately populated for each district

### Backend Storage
The backend must store:
- Admin authentication credentials with reliable validation for default admin account (username: "admin", password: "1234")
- Proper session management for admin authentication with secure token handling
- Complete Quezon City district structure with all 6 congressional districts
- Barangay listings for each district with landmark information
- Project records with complete details (name, description, dates, progress, status, priority)
- Proper project-to-district associations to ensure correct data display on district pages
- District/municipality information with cover images and logos
- User accounts for public users and admin access
- User bookmarks and favorites data
- Comment threads and moderation records
- Notification preferences and delivery logs
- Document attachments and metadata
- Project announcements and updates
- Milestone tracking and completion records
- Budget information with detailed breakdowns
- Project thumbnail images and metadata
- Municipality profile data
- Export history and generated reports
- User activity logs and engagement metrics

### Project Data Structure
Each project record includes:
- Municipality and district information with specific barangay assignment
- Project details (name, description, category)
- Progress information (percentage, status, milestones)
- Priority level (high, medium, low)
- Timeline with phases and key dates
- Official in charge details
- Attached documents and files
- Status tracking (planned, active, completed)
- Budget information with detailed breakdown
- Thumbnail image reference
- Creation and update timestamps for feed ordering
- Bookmark count and user engagement metrics
- Comment thread references
- Proper district association fields to ensure correct project-district relationships

### District Data Structure
Each district record includes:
- District name and congressional district number
- Complete barangay listings
- Landmark notes and location information
- Cover banner image and logo
- Budget summary and project statistics
- Administrative boundaries and geographic data
- Proper project association references to ensure district pages show correct projects

### User Data Structure
Each user record includes:
- User authentication credentials
- Profile information
- Bookmarked projects list
- Notification preferences
- Comment history and moderation status
- Activity timestamps and engagement data

### Admin Data Structure
Admin authentication includes:
- Username/password credentials with reliable validation logic
- Default admin account (username: "admin", password: "1234") with proper authentication flow
- Session management with secure token generation and validation
- Administrative privileges and access levels
- Proper redirect handling after successful authentication

### Comment Data Structure
Each comment record includes:
- Project reference
- User information
- Comment content and timestamps
- Reply thread structure
- Moderation status and flags
- Notification triggers

### Notification Data Structure
Each notification record includes:
- User recipient information
- Notification type and content
- Related project or comment references
- Delivery status and timestamps
- Read/unread status

## User Interface Requirements

### Design System
- Modern, card-based layout inspired by social media platforms
- Airbnb-like clean and accessible design
- Consistent use of cards for all content display
- Clear iconography throughout the interface including bookmark, notification, and filter icons
- Readable typography with proper hierarchy
- Smooth animations and transitions
- Interactive chart components with hover states
- Modal dialogs for export options and advanced filters
- Bantay Bayan branding throughout the interface

### Color Scheme
- Primary color palette featuring red and blue tones inspired by the Philippine flag
- Red accents for primary buttons, highlights, and important elements
- Blue accents for secondary buttons, links, and navigation elements
- Consistent application of red and blue colors across all major UI components:
  - Header and navigation elements
  - Hero section backgrounds and highlights
  - Button styles (primary red, secondary blue)
  - Card borders and accent elements
  - Chart colors and data visualizations
  - Progress bars and status indicators
  - Interactive elements and hover states
- Maintain accessibility standards with proper contrast ratios
- Use neutral colors (whites, grays) for backgrounds and text to ensure readability
- Apply the Philippine flag-inspired color scheme cohesively throughout the entire application for strong national identity

### Responsive Design
- Mobile-first approach with responsive grid layouts
- Desktop and mobile-friendly card arrangements
- Touch-friendly interface elements including bookmark buttons
- Adaptive navigation for different screen sizes
- Responsive chart and visualization components
- Mobile-optimized comment interfaces

### Visual Components
- Hero section with prominent Bantay Bayan branding and mission statement about Philippine public transparency and anti-ghost project advocacy
- Card-based project and municipality displays with bookmark indicators
- Interactive charts for project progress visualization and category breakdowns
- Progress bars and completion indicators
- Timeline displays for project milestones
- Tabbed interfaces for content organization
- Large centered search functionality with advanced filter panel
- Profile-style municipality pages with cover banners and complete barangay listings
- Comment thread interfaces with reply functionality
- Notification badges and dropdown menus
- Export dialog boxes and progress indicators
- Bookmark management interfaces
- Admin dashboard with district and barangay management interfaces
- Proper loading states and error handling for district/municipality pages
- Reliable admin login form with proper credential submission
- Bantay Bayan logo display in header, favicon, and all relevant locations
- About page with mission-focused content and visual elements

### Data Loading and Pagination
- Dynamic project loading for the main feed
- Pagination support for large project lists and comment threads
- Infinite scroll capability for mobile experience
- Real-time data updates for notifications and comments
- Optimized loading states and skeleton screens
- Progressive loading for charts and visualizations
- Proper error handling when district-project associations fail to load

### Filtering and Search
- Global search across all projects and municipalities
- Advanced filter panel with multiple criteria selection
- Filter by year, category, district, status, priority
- Progress-based filtering (completion percentage ranges)
- Real-time search suggestions and autocomplete
- Saved filter preferences for logged-in users
- Filter result counters and clear options

### Interactive Features
- Bookmark/unbookmark with visual feedback
- Comment submission and real-time updates
- Notification dropdown with mark-as-read functionality
- Export progress indicators and download links
- Chart interactions with drill-down capabilities
- Filter combinations with instant results
- Reliable admin login with proper session handling and dashboard redirect

## Navigation
- Main navigation includes link to About page
- Footer includes link to About page
- About page accessible from multiple entry points throughout the application

## Authentication
- Public user registration and login system
- Admin login system with reliable username/password authentication that properly validates credentials
- Default admin account (username: "admin", password: "1234") must consistently provide access to Admin Dashboard
- Frontend must correctly send admin credentials to backend and handle authentication responses
- Backend must properly recognize admin credentials and create valid sessions
- After successful admin login, session must be saved and user automatically redirected to Admin Dashboard
- Role-based access for data management and moderation
- Public access for viewing project information
- Session management for bookmarks and notifications

## Language
- All content and interface in English

## Branding and Mission
- Application name: "Bantay Bayan"
- Mission: Philippine public transparency platform focused on exposing ghost projects and promoting government accountability
- Meta tags and descriptions emphasize focus on Philippine public transparency and anti-ghost project advocacy
- About section highlights the platform's role in government transparency and citizen oversight
- All branding elements reflect the Bantay Bayan identity and mission
