# Number Processing with Delay

This TypeScript implementation demonstrates an asynchronous number processing utility with progress tracking and abort capabilities.

## Implementation Details

The main function `processWithDelay` processes an array of numbers with the following features:
- Processes each number sequentially with a configurable delay
- Tracks and displays progress as a percentage
- Supports abort functionality via AbortSignal
- Includes input validation for array and number types
- Handles empty arrays gracefully

## How to Run

1. Make sure you have Node.js and TypeScript installed on your system.

2. Install dependencies:
```bash
npm install
```

3. Compile and run the TypeScript file:
```bash
npx ts-node index.ts
```

## Example Usage

The code includes three test cases in the `homePage` function:
1. Default processing with 1-second delay
2. Custom processing with 500ms delay
3. Processing with abort functionality (aborts after 1.5 seconds)

## Options

The `processWithDelay` function accepts the following options:
- `delayMs`: Delay in milliseconds between processing each number (default: 1000ms)
- `signal`: Optional AbortSignal for canceling the processing
