# Project Context: Football Tournament Score Tracking Web App

## Overview

You are building a web application for personal use to track the progress of football tournaments among you and your friends. The application aims to simulate professional tournament settings, including qualifiers, group stages, and team rankings based on match outcomes.

---

## Objectives

- **Track Match Results**: Record wins, losses, draws, and scores for each team.
- **Calculate and Display Rankings**: Automatically update team standings based on match results using a point system.
- **Manage Group Stages**: Organize teams into groups (e.g., Group A, Group B) and handle group-specific rankings.
- **User-Friendly Interface**: Provide an intuitive and responsive UI for entering match data and viewing standings.

---

## Technology Stack

- **Frontend Framework**: Next.js 14 App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn UI library
- **Additional Libraries**: As specified in your `package.json` file.

---

## Functional Requirements

### 1. Home Page

- **Tournament Overview**: Display a summary of the tournament, including total teams, groups, and upcoming matches.
- **Navigation Links**: Access to different sections like Groups, Fixtures, Standings, and Match Input.
- **Recent Results**: Display the latest match results.
- **Upcoming Matches**: List of scheduled upcoming matches.

### 2. Group Pages

- **Group Standings**: Display a table for each group showing team rankings.
- **Standings Details**:
  - **Team Name**
  - **Matches Played (MP)**
  - **Wins (W)**
  - **Draws (D)**
  - **Losses (L)**
  - **Goals For (GF)**
  - **Goals Against (GA)**
  - **Goal Difference (GD)**
  - **Points (Pts)**
- **Navigation Between Groups**: Easy access to switch between different group standings.

### 3. Match Input Form

- **Match Details Entry**:
  - Select **Home Team** and **Away Team**.
  - Input **Scores** for both teams.
  - Select **Match Date** and **Time**.
- **Validation**:
  - Ensure teams are not the same.
  - Scores are valid numbers.
  - All fields are filled out.
- **Submission**:
  - Upon submission, update the standings and fixtures accordingly.
  - Provide confirmation of successful entry.

### 4. Fixtures & Results

- **Fixtures List**:
  - Display all scheduled matches.
  - Include details like date, time, and participating teams.
- **Results List**:
  - Show completed matches with final scores.
- **Filtering**:
  - Option to filter by group, team, or date.
- **Match Details Page (Optional)**:
  - Detailed view for each match, including any notes or highlights.

### 5. Team Profiles (Optional)

- **Team Information**:
  - Team name, logo/emblem.
  - List of players (if applicable).
- **Team Performance**:
  - Summary of team's statistics in the tournament.
  - Recent match results involving the team.

### 6. Responsive Design

- Ensure the application is fully responsive across devices:
  - **Desktop**
  - **Tablet**
  - **Mobile**

---

## Layout and Design Guidelines

### General

- **Color Scheme**: Use a color palette that's visually appealing and accessible.
- **Typography**: Select clear and legible fonts for different text elements.
- **Icons and Graphics**: Utilize icons from `@tabler/icons-react` or `lucide-react` for visual enhancement.
- **Animations**: Implement subtle animations using `framer-motion` for interactive elements.

### Navigation

- **Header Navigation**:
  - Include the app logo and main navigation links.
  - Use a responsive navigation menu that adapts to screen size.
- **Footer**:
  - Provide secondary links or information.
  - Keep consistent across all pages.

### Home Page

- **Hero Section**:
  - Brief welcome message or tournament summary.
  - Call-to-action buttons linking to key sections.
- **Sections**:
  - **Upcoming Matches**: Horizontally scrollable list on mobile.
  - **Recent Results**: Highlight recent match outcomes.
  - **Tournament Stats**: Quick stats like total matches played, goals scored.

### Group Standings Page

- **Standings Table**:
  - Use a responsive table component from shadcn UI.
  - Highlight the teams qualifying for the next stage.
- **Group Navigation**:
  - Tabs or dropdown menu to switch between groups.
- **Visual Indicators**:
  - Use colors or icons to represent wins, losses, and draws.

### Match Input Form

- **Form Layout**:
  - Two columns for home and away team inputs.
  - Date and time picker components.
- **User Feedback**:
  - Inline validation messages.
  - Confirmation message or toast notification upon successful submission using `sonner`.
- **Accessibility**:
  - Ensure form is accessible with proper labels and focus indicators.

### Fixtures & Results Page

- **List Items**:
  - Display match fixtures with team names, logos, and scheduled time.
  - Completed matches show the final score.
- **Filters and Search**:
  - Allow users to filter matches by date, team, or group.
  - Implement a search bar with debounced input handling.

### Team Profile Page (Optional)

- **Header**:
  - Team banner with logo and name.
- **Content Sections**:
  - **Team Stats**: Overall performance metrics.
  - **Player List**: If tracking player data.
  - **Match History**: Recent matches involving the team.

### Responsiveness and Interactivity

- **Mobile First Design**: Start designing for mobile screens before scaling up.
- **Interactive Elements**:
  - Use `react-intersection-observer` to animate elements on scroll.
  - Implement interactive components like dropdowns and modals using `@radix-ui` components.

---

## Component Breakdown

### Shared Components

- **Header**: Navigation bar at the top of the page.
- **Footer**: Consistent footer across all pages.
- **Button**: Standardized button component with variants.
- **Card**: For displaying match fixtures and results.
- **Table**: For standings and data display.

### Specific Components

- **GroupStandingsTable**: Displays the standings for a specific group.
- **MatchForm**: Form component for entering match details.
- **MatchCard**: Displays individual match information in fixtures and results.
- **TeamCard**: Summarizes team information (used in standings or team list).
- **Filters**: Components for filtering fixtures and results.

---

## State Management and Data Handling

- **State Management**:
  - Use React's `useState` and `useEffect` hooks for local state.
  - Consider context or a state management library if the app scales.
- **Data Fetching**:
  - Use Next.js data fetching methods (`getStaticProps`, `getServerSideProps`, or `app` directory features).
  - For client-side data fetching, consider using `react-firebase-hooks` with Firebase or `SWR` for data fetching and caching.
- **Form Handling**:
  - Utilize `react-hook-form` for form state management and validation.
  - Leverage `@hookform/resolvers` and `zod` for schema-based validation.

---



## Styling Guidelines

- **Tailwind CSS**:
  - Use utility classes for rapid styling.
  - Apply responsive design principles with Tailwind's responsive modifiers.
- **Custom Components**:
  - Use `class-variance-authority` and `clsx` for conditional classes.
  - Extend and customize shadcn UI components to match the desired design.
- **Animations**:
  - Implement animations with `tailwindcss-animate` and `framer-motion` for enhanced user experience.

---

## Accessibility Considerations

- **Semantic HTML**: Use appropriate HTML elements for content (e.g., `<header>`, `<main>`, `<table>`).
- **Keyboard Navigation**: Ensure all interactive elements are accessible via keyboard.
- **Aria Labels**: Use ARIA attributes as needed for screen readers.
- **Focus States**: Clearly indicate focused elements, especially for form inputs and links.
- **Contrast Ratios**: Adhere to WCAG guidelines for text and background color contrast.

---

## Additional Features to Consider

### Match Highlights or Comments

- Allow users to add notes or highlights to each match.
- Display these highlights on the match details page.

### Customizable Points System

- Provide settings to adjust points awarded for wins, draws, and losses.
- Update standings calculations based on these settings.

### Notifications

- Implement in-app notifications for upcoming matches or when new results are entered.
- Use a toast notification library like `sonner` for alerts.

### Dark Mode Support

- Implement a dark mode theme toggle.
- Use Tailwind CSS's dark mode variant for styling.

### Data Export

- Provide an option to export standings and match results as CSV or PDF.
- Use client-side libraries to generate and download files.

---

## Project Structure Suggestions

### Pages (app directory in Next.js 14)

- **`app/`**:
  - **`layout.js`**: Common layout component.
  - **`page.js`**: Home page.
  - **`groups/`**:
    - **`page.js`**: Group listings.
    - **`[groupId]/page.js`**: Individual group standings.
  - **`matches/`**:
    - **`page.js`**: Fixtures and results.
    - **`new/page.js`**: Match input form.
    - **`[matchId]/page.js`**: Match details page (optional).
  - **`teams/`**:
    - **`page.js`**: Teams overview.
    - **`[teamId]/page.js`**: Team profiles (optional).

### Components

- **`components/`**:
  - **`Header.js`**
  - **`Footer.js`**
  - **`GroupStandingsTable.js`**
  - **`MatchForm.js`**
  - **`MatchCard.js`**
  - **`TeamCard.js`**
  - **`Filters.js`**

### Styles

- **Global Styles**: Defined in `globals.css`.
- **Tailwind Configuration**: Customizations in `tailwind.config.js`.

---

## Development Workflow

1. **Setup Project Structure**: Initialize the Next.js app with the specified directories and pages.
2. **Implement Shared Components**: Build the Header, Footer, and other reusable components.
3. **Design the Home Page**: Create the layout and add sections for upcoming matches and recent results.
4. **Build Group Standings Page**: Develop the standings table and group navigation.
5. **Create Match Input Form**: Implement the form with validation and submission handling.
6. **Develop Fixtures & Results Page**: Display the list of matches with filtering capabilities.
7. **Enhance UX/UI**: Add animations, responsive design tweaks, and interactive elements.
8. **Test Accessibility**: Use tools and manual testing to ensure the app is accessible.
9. **Optimize Performance**: Implement code-splitting and optimize images/assets.

---

## Data and State Considerations

- **Data Models**:
  - **Team**: `id`, `name`, `logo`, `groupId`
  - **Match**: `id`, `homeTeamId`, `awayTeamId`, `homeScore`, `awayScore`, `dateTime`, `groupId`
  - **Group**: `id`, `name`, `teamIds`
- **Calculations**:
  - Standings should be recalculated whenever a match result is entered or updated.
  - Implement tie-breaker logic based on goal difference, goals scored, or head-to-head results.

---

## Future Enhancements

- **Authentication**:
  - Integrate Firebase Authentication if restricting access becomes necessary.
- **Player Statistics**:
  - Extend data models to include player data and match participation.
- **Archiving Tournaments**:
  - Implement features to archive past tournaments and view historical data.
- **Internationalization**:
  - Use Next.js i18n routing for multiple language support.

---

## Conclusion

With this detailed context and design guidelines, you can proceed to build your football tournament tracking web app using Next.js 14, Tailwind CSS, and shadcn UI. This structure will help you collaborate with AI tools effectively to generate code and components aligned with your project's objectives.

---

# License

This document is provided for personal use to assist in the development of your web application.