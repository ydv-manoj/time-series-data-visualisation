# Time Series Data Visualization Application

## Overview

This application is built using Tauri and Next.js, providing a powerful desktop application for visualizing time series data. Users can upload CSV files containing time series data, which the application then visualizes. A key feature is an interactive slider that allows users to adjust the time position and view corresponding data points in real-time.

## Features

- CSV file upload for time series data
- Interactive time slider for data exploration
- Real-time data visualization
- Cross-platform desktop application (Windows, macOS, Linux)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Rust](https://www.rust-lang.org/tools/install) (for Tauri)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/setup/next-js)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/ydv-manoj/time-series-data-visualisation.git
    ```

2. Navigate to the project directory:

    ```bash
    cd time-series-data-visualization
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

## Development

To run the application in development mode:

```bash
npm run tauri dev
```

This command will start both the Next.js development server and the Tauri application.

## Building for Production

To create a production build:

```bash
npm run tauri build
```

This will create executable files for your operating system in the `src-tauri/target/release` directory.

## Usage Guide

1. Launch the application.
2. Click the "Browse CSV" button to select your time series data file.
3. Once a valid CSV file is loaded, a slider will appear below the button.
4. Use the slider to adjust the time position. The current position will be displayed below the slider.
5. The data plot will update in real-time as you move the slider, showing the corresponding data points.

## CSV File Format

Your CSV file should be structured as follows:

- The column should contain amplitude or data values


Example:

```
Amplitude
1.5
2.3
3.1
...
```

## Troubleshooting

- If you encounter issues with file loading, ensure your CSV file follows the correct format.
- If the Browse CSV button doesn't work make sure you give appropriate permissions.
- For visualization problems, check that your data is within expected ranges.
- If the application fails to start, ensure all dependencies are correctly installed.



