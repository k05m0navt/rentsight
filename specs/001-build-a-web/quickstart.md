# Quickstart: Rentsight Analytics Application

**Feature Branch**: `001-build-a-web`  
**Date**: 2025-10-09

## Overview

This guide provides instructions to quickly set up and run the Rentsight Analytics web application locally. It covers environment setup, installation, running the development server, and basic usage.

## Prerequisites

Before you begin, ensure you have the following installed:

-   **Node.js**: v18.x or later
-   **npm** or **Yarn**: npm v8.x / Yarn v1.x or later
-   **Docker** and **Docker Compose**: For running a local Supabase instance (optional, but recommended for local development)
-   **Git**: For cloning the repository
-   **Supabase Account**: A Supabase project is required for authentication and database services.

## Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-repo/rentsight.git
    cd rentsight
    git checkout 001-build-a-web
    ```

2.  **Install Dependencies**:
    Navigate to the `apps/web` directory and install project dependencies.
    ```bash
    cd apps/web
    npm install # or yarn install
    ```

3.  **Supabase Setup**:

    ### Option A: Local Supabase (Recommended for Development)

    If you have Docker installed, you can run a local Supabase instance:
    ```bash
    cd ../.. # Go back to repository root if you are in apps/web
    supabase start
    ```
    This will output local URLs and keys. You will need these for your environment variables.

    ### Option B: Remote Supabase Project

    If you are using a remote Supabase project:
    -   Create a new project on the [Supabase website](https://app.supabase.com/).
    -   Retrieve your Project URL and `anon` key from your project settings (`API Settings` section).
    -   Make sure to get your `service_role` key as well for backend operations.

4.  **Environment Variables**:
    Create a `.env.local` file in `apps/web` based on `.env.example`.
    ```
    # Supabase Project URL
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    # Supabase Anon Key (Public)
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    # Supabase Service Role Key (Secret - used on server-side)
    SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
    # Prisma Database URL (for development, usually uses Supabase connection string)
    DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@localhost:54322/postgres?schema=public" # Update with your local or remote DB connection string
    ```
    Replace the placeholders with your actual Supabase project URL, keys, and database connection string.

5.  **Database Migration (Prisma)**:
    Apply the Prisma migrations to your Supabase database.
    ```bash
    cd apps/web
    npx prisma migrate dev --name init # or the name of your first migration
    npx prisma db push
    ```

## Running the Application

1.  **Start Development Server**:
    From the `apps/web` directory:
    ```bash
    npm run dev # or yarn dev
    ```

2.  **Access the Application**:
    Open your web browser and navigate to `http://localhost:3000`.

## Key Features

Once the application is running, you can:

-   **Register/Login**: Create a new renter account or log in with existing credentials.
-   **Add Rent Entries**: Input details about your rental income, booked days, and platforms.
-   **Add Expense Entries**: Record your expenses with categories and descriptions.
-   **Manage Tags**: Create custom tags and associate them with rent and expense entries.
-   **View Analytics Dashboard**: See aggregated data on income, booked days, and expenses.
-   **Filter Data**: Use tags to filter and analyze specific subsets of your data.
-   **Export Data**: Export your filtered analytics data in PDF, CSV, or Excel formats.

## Troubleshooting

-   If you encounter issues, check the console for errors and verify your environment variables.
-   Ensure your Supabase services (Auth, Database) are running correctly if using local setup.
-   For Prisma-related issues, refer to the [Prisma documentation](https://www.prisma.io/docs/).
