# Project Name

## Description

This is a music library application built with Next.js, TypeScript, and Supabase. It allows users to view, upload, and like songs.

## Features

- User Authentication: Implemented using Supabase Auth with cookie-based authentication.
- Music Library: Users can view their music library and liked songs.
- Song Upload: Authenticated users can upload new songs to their library.
- Song Playback: Users can play songs from their library.

## Tech Stack

- [Next.js](https://nextjs.org): A React framework for building modern web applications.
- [TypeScript](https://www.typescriptlang.org): A statically typed superset of JavaScript that adds types and other features.
- [Supabase](https://supabase.io): An open-source Firebase alternative that provides user authentication and real-time database.

## Installation

1. Clone the repository:

```sh
git clone <repository-url>
```

2. Install the dependencies:

```sh
npm install
```

3. Create a `.env.local` file in the root directory and fill it with your Supabase credentials:

```sh
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run the development server:

```sh
npm run dev
```

## Deployment

This project can be deployed using Vercel. After installing the Supabase integration, all relevant environment variables will be assigned to the project, so the deployment is fully functioning.

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.