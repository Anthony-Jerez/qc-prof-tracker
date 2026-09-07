# QC Prof Tracker

QC Prof Tracker is a web application built for Queens College students to make data-driven decisions about their class schedules. It allows students to search for professors, view historical grade distributions, track average GPA and withdrawal trends, and read verified Queens College student reviews. Data currently covers Fall 2021 - Fall 2025.

## Video Demo

[![Watch the demo video](https://img.youtube.com/vi/NCn0ZpeKUWQ/maxresdefault.jpg)](https://www.youtube.com/watch?v=NCn0ZpeKUWQ)

## Features

* **Search & Navigation (`/`):** A search bar where users can enter a professor’s properly formatted name (e.g., "WAXMAN, J") to instantly access their data.
* **Professor Profile (`/prof/:name`):** A professor profile page displaying the professor's overall average GPA, student rating, withdrawal rate, and total students taught (Fall 2021 - Fall 2025), alongside a grid of every unique course they teach.
* **Course Dashboard (`/prof/:name/:course`):** A course dashboard page showcasing a detailed breakdown matching the selected course and professor.
  * **Historical Trends:** Features line charts for historical GPA and withdrawal trends across all semesters.
  * **Semester Drill-down:** Dynamic Recharts bar charts mapping exact grade distribution counts and quick stats (Total Withdrawals, Incompletes, and Enrollment) for a specifically selected term.
  * **Authenticated Student Reviews:** A secure, paginated review feed where authenticated Queens College students can read and submit specific feedback for a professor's course.

## Tech Stack

* **Frontend:** React.js (via Vite), JavaScript, HTML, Tailwind CSS
* **Backend & Database:** Supabase (PostgreSQL, Views, RPCs), Supabase Auth
* **Data Visualization:** Recharts
* **State Management & Routing:** React Query, React Router (`react-router-dom`)

## Setup

To run this project locally, you will need Node.js installed and a Supabase project set up with the required database schema.

1. Clone the repository to your local machine.
2. Run `npm install` to install all required dependencies.
3. Create a `.env.local` file in the root directory.
4. Add your Supabase credentials to the environment file:
   `VITE_SUPABASE_URL=your_supabase_project_url`
   `VITE_SUPABASE_ANON_KEY=your_supabase_anon_key`
5. Set up your database by executing the SQL scripts located in the supabase/sql/ directory (run them sequentially from 001 to 005) inside your Supabase SQL editor.
6. Populate your database by simply importing the pre-cleaned data/master_grade_distribution.csv file directly into your Supabase database.
7. Run `npm run dev` to start the local development server.

## Contributing

Contributions are welcome! If you want to add new features or fix a bug, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/MyFeature`).
3. Commit your changes (`git commit -m 'Add MyFeature'`).
4. Push to the branch (`git push origin feature/MyFeature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.