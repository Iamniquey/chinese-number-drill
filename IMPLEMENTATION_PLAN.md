# Chinese Number Drill Game - Implementation Plan

## Project Overview
A speed-based Chinese number recognition game that presents number phrases (e.g., "2020年", "6岁") and tests the user's ability to quickly identify and enter the numeric portion.

## Technology Stack
- **Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 7.2.4
- **Styling**: CSS (with pastel, feminine design)
- **Text-to-Speech**: Web Speech API (browser native)

## Project Structure

```
src/
├── App.tsx                 # Main app component with game state management
├── App.css                 # Main app styles (pastel, feminine theme)
├── components/
│   ├── StartScreen.tsx     # Initial screen with "Start Game" button
│   ├── GameScreen.tsx      # Active game screen with prompt and input
│   ├── ReportScreen.tsx    # Results screen with statistics
│   └── NumberPrompt.tsx    # Component displaying the number phrase
├── utils/
│   ├── numberGenerator.ts  # Logic for generating number phrases
│   ├── numberCategories.ts # Category definitions and ranges
│   └── tts.ts              # Text-to-speech wrapper
├── types/
│   └── game.ts             # TypeScript type definitions
└── index.css               # Global styles
```

## Data Structures

### Number Categories
Each category will have:
- **name**: Category identifier (e.g., "year", "age")
- **suffix**: Chinese suffix (e.g., "年", "岁")
- **min**: Minimum number value
- **max**: Maximum number value
- **format**: How to format the number for TTS (e.g., "year" format vs "regular")

### Category Definitions (Realistic Chinese Community Ranges)

1. **Years (年)**
   - Range: 1900-2026
   - Format: Year format (e.g., "二零二零" for 2020, "一九九零" for 1990)
   - TTS: Read as year format

2. **Ages (岁)**
   - Range: 1-120
   - Format: Regular number format
   - TTS: Read as regular number + "岁"

3. **Ticket Numbers (号)**
   - Range: 0000-9999 (4 digits, zero-padded)
   - Format: Each digit read individually (e.g., "一二三四" for 1234)
   - TTS: Read digit by digit

4. **Phone Numbers (号)**
   - Range: 13000000000-19999999999 (11 digits, mobile format)
   - Format: Read digit by digit
   - TTS: Read digit by digit

5. **Prices (元)**
   - Range: 1-9999 (whole numbers only for prototype)
   - Format: Regular number format
   - TTS: Read as regular number + "元"

6. **Room Numbers (号)**
   - Range: 101-9999 (realistic hotel/office room numbers)
   - Format: Read digit by digit or as number depending on length
   - TTS: Read digit by digit for 3-4 digits

7. **Floor Numbers (层)**
   - Range: 1-100
   - Format: Regular number format
   - TTS: Read as regular number + "层"

8. **Bus/Route Numbers (路)**
   - Range: 1-999
   - Format: Regular number format
   - TTS: Read as regular number + "路"

### Game State

```typescript
type GameState = 'start' | 'playing' | 'feedback' | 'finished';

type Prompt = {
  id: string;
  category: string;
  number: number;
  phrase: string; // e.g., "2020年"
  answer: number; // The numeric answer
  startTime: number;
  endTime?: number;
  userAnswer?: number;
  isCorrect?: boolean;
};

type GameStats = {
  prompts: Prompt[];
  averageTime: number;
  longestTime: number;
  shortestTime: number;
  totalTime: number;
  correctCount: number;
  totalCount: number;
};
```

## Component Breakdown

### 1. App.tsx (Main Container)
- Manages overall game state
- Tracks current prompt index
- Handles game flow transitions
- Stores game statistics
- Configurable game length (default: 10, stored in state for future UI control)

### 2. StartScreen Component
- Displays welcome message
- "Start Game" button
- Pastel, feminine styling

### 3. GameScreen Component
- Displays current number phrase (no Chinese text, just the phrase)
- Input field for numeric answer
- Timer tracking per prompt
- Handles answer submission
- Triggers TTS on prompt display

### 4. NumberPrompt Component
- Renders the number phrase
- Handles TTS playback
- Clean, centered display

### 5. ReportScreen Component
- Displays statistics:
  - Average time per prompt
  - Longest prompt time
  - Shortest prompt time (excludes incorrect answered prompts)
  - Total time
  - Individual prompt times (optional list)
- "Play Again" button
- Pastel, feminine styling

## Key Features Implementation

### Number Generation
- Randomly select a category
- Generate random number within category range
- Format number with appropriate suffix
- Return phrase object with answer

### Text-to-Speech (Web Speech API)
- Use `speechSynthesis` API
- Set language to 'zh-CN' (Simplified Chinese)
- Format number appropriately for TTS:
  - Years: Convert to Chinese year format (二零二零)
  - Regular numbers: Convert to Chinese number words
  - Digit-by-digit: Convert each digit to Chinese
- Play automatically when prompt appears
- Handle browser compatibility

### Answer Validation
- Compare user input (parsed as number) with correct answer
- Show immediate feedback:
  - Green background/flash for correct (1 second)
  - Red background/flash for incorrect (1 second)
- Pause timer during feedback
- Auto-advance after 1 second

### Timer Tracking
- Start timer when prompt appears
- Pause during feedback period
- Stop timer when answer is submitted
- Calculate per-prompt time
- Track all times for statistics

### Statistics Calculation
- Calculate average: sum of all times / count
- Find longest: Math.max of all times
- Find shortest: Math.min of all times
- Calculate total: sum of all times

## Styling Guidelines

### Color Palette (Pastel, Feminine)
- Primary background: Soft lavender/pink (#F5E6F8 or #FFF0F5)
- Secondary: Light mint (#E8F5E9)
- Accent: Soft rose (#FFE4E1)
- Text: Dark gray (#4A4A4A)
- Success (correct): Soft green (#C8E6C9)
- Error (incorrect): Soft red (#FFCDD2)

### Design Elements
- Rounded corners: `border-radius: 20px` for cards, `12px` for buttons
- Soft shadows: `box-shadow: 0 4px 6px rgba(0,0,0,0.1)`
- Smooth transitions: `transition: all 0.3s ease`
- Clean typography: Sans-serif, readable font sizes
- Generous padding and spacing
- Centered layouts

## Implementation Steps

### Phase 1: Core Setup
1. ✅ Project already initialized with Vite + React + TypeScript
2. Create folder structure (components, utils, types)
3. Set up type definitions
4. Create base CSS with pastel theme

### Phase 2: Number Generation System
1. Create `numberCategories.ts` with all category definitions
2. Create `numberGenerator.ts` with random generation logic
3. Implement number-to-Chinese conversion utilities
4. Test number generation with various categories

### Phase 3: TTS Integration
1. Create `tts.ts` utility wrapper
2. Implement Chinese number formatting for TTS
3. Test TTS with different number formats
4. Handle browser compatibility checks

### Phase 4: Game Components
1. Build `StartScreen` component
2. Build `NumberPrompt` component with TTS
3. Build `GameScreen` component with input and timer
4. Implement answer validation and feedback
5. Build `ReportScreen` component

### Phase 5: Game Logic Integration
1. Implement game state management in `App.tsx`
2. Connect timer tracking
3. Implement prompt progression
4. Calculate and display statistics

### Phase 6: Styling & Polish
1. Apply pastel, feminine styling throughout
2. Add smooth transitions and animations
3. Ensure responsive design
4. Test feedback colors and timing

### Phase 7: Testing & Refinement
1. Test all number categories
2. Verify TTS pronunciation accuracy
3. Test timer accuracy
4. Verify statistics calculations
5. Test game flow and edge cases

## Future Enhancements (Not in First Prototype)
- UI control for game length (slider or input)
- Difficulty levels
- Category selection
- Sound effects
- Progress indicators
- High score tracking
- Local storage for settings

## Technical Considerations

### Chinese Number Conversion
- Need utility functions to convert:
  - Regular numbers to Chinese (一, 二, 三...)
  - Years to Chinese year format

### Web Speech API Limitations
- Browser support varies
- Implement in a way to be able to upgrade to a more universal text to speech utility
- Rate limiting considerations
- Voice quality depends on browser

### Timer Precision
- Use `performance.now()` for accurate timing
- Account for feedback pause duration
- Handle edge cases (very fast answers, browser tab switching)

### Input Validation
- Parse user input as integer
- Handle empty input (treat as incorrect)
- Strip whitespace
- Handle non-numeric input gracefully

## Configuration Variables

```typescript
const GAME_CONFIG = {
  DEFAULT_GAME_LENGTH: 10,  // Number of prompts per game
  FEEDBACK_DURATION: 1000,   // Milliseconds to show feedback
  CATEGORIES: [...],         // All available categories
};
```

This variable can be moved to a config file or made adjustable via UI in the future.

