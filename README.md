# High School MP3 Player

This is a simple MP3 player project built using Node.js, Express, and HTML/CSS/JavaScript. It allows users to upload MP3 files, organize them into albums, and play them through a web interface.

## Features

- Upload MP3 files
- Organize songs into albums
- Play songs through a web interface
- Display album covers
- Control playback (play, pause, forward, backward)

## Requirements

- Node.js installed on your machine

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your_username/highschool-mp3-player.git
   
2. Navigate to the project directory:
   ```bash
      cd mp3-player-main

3. Install dependencies:
      ```bash
      jnpm install

## Usage

1. Start the server:

   ```bash
   node server.js

2. Open your web browser and go to `http://localhost:3000` to access the MP3 player interface.
3. Click on the "UPLOAD" button to upload your MP3 files.
4. Click on an album to view its songs and play them.

## Project Structure

- `server.js`: The main server file responsible for handling HTTP requests and serving static files.
- `static/`: Directory containing static assets such as HTML, CSS, and client-side JavaScript.
- `static/mp3/`: Directory where uploaded MP3 files are stored.
- `static/img/`: Directory for storing album covers and other images.
- `styles/`: Directory containing CSS stylesheets.
- `playbar.js`: Client-side JavaScript file for controlling the playback bar.
- `ui.js`: Client-side JavaScript file for handling user interface interactions.
- `main.js`: Client-side JavaScript file for initializing the MP3 player interface.

## License
This repository is licensed under the [MIT License](LICENSE).
