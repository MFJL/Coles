# Quest System with Barcode Scanner

## Overview
The quest system gamifies the step tracking experience by allowing users to complete quests by scanning product barcodes in-store. This demo implementation includes three pre-configured quests.

## Features

### 1. **Three Pre-defined Quests**
Located in `src/data/quests.ts`:
- **Arnott's Tim Tam** (Barcode: `9300675024907`) - $1.30 OFF + 5 Flybuys points
- **Coca-Cola 1.25L** (Barcode: `9300675028615`) - $0.50 OFF + 5 Flybuys points
- **Cadbury Dairy Milk** (Barcode: `9300617002482`) - $1.00 OFF + 5 Flybuys points

### 2. **Barcode Scanner**
- Real-time barcode scanning using device camera
- Trained to recognize only the three specific products
- Visual feedback when barcode is detected
- Manual input option for demo/testing purposes

### 3. **Quest Tracking**
- Visual progress indicator showing completed/total quests
- Individual quest cards with status
- Flybuys points accumulation
- Success notifications when quests are completed

## How It Works

### For Demo/Testing:
1. Navigate to the Step Tracker page (`/tracker`)
2. Scroll down to the "Daily Quests" section
3. Click the "Scan" button on any quest
4. In the scanner modal, expand "Demo: Manual barcode input"
5. Click any product button to simulate scanning

### For Real Scanning:
1. Click the "Scan" button on a quest
2. Allow camera permissions when prompted
3. Point camera at product barcode
4. Scanner automatically detects matching barcodes
5. Quest completes and rewards are granted

## Technical Implementation

### Components
- **`BarcodeScanner.tsx`** - Camera-based barcode scanner with ZXing library
- **`QuestCard.tsx`** - Individual quest display component
- **`quests.ts`** - Quest data structure and definitions

### Libraries Used
- `react-webcam` - Access device camera
- `@zxing/library` - Barcode detection and decoding

### Key Features
- Only scans for pre-defined barcodes (demo mode)
- Real-time scanning with 500ms intervals
- Success animations and toast notifications
- Persistent quest completion state
- Responsive design for mobile devices

## Customization

### Adding New Quests
Edit `src/data/quests.ts`:

```typescript
{
  id: "quest-4",
  title: "Scan New Product",
  description: "Find and scan this product!",
  barcode: "1234567890123", // Product barcode
  productName: "Product Name",
  discount: "$2.00 OFF",
  flybuysPoints: 60,
  completed: false,
}
```

### Training on Different Products
Simply update the `barcode` field in the quest data to match the barcode of the product you want to recognize.

## Future Enhancements
- AI-generated quests based on user preferences
- Dynamic quest rotation (daily/weekly)
- Integration with Coles product database
- Location-based quests
- Quest difficulty levels
- Leaderboards and social features
