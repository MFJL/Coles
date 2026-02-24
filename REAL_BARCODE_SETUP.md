# Setting Up Real Barcode Scanning

## Quick Start Guide

Follow these steps to scan your real products and update the quest system:

### Step 1: Run the App
```bash
npm run dev
```

### Step 2: Access Learning Mode
1. Navigate to the Step Tracker page (`/tracker`)
2. Scroll down to the "Daily Quests" section
3. Click the **"Learn Barcodes"** button in the top-right

### Step 3: Scan Your Products
1. Allow camera permissions when prompted
2. Point your camera at the barcode of each product:
   - **Pauls Plus+ Protein Chocolate**
   - **Coca-Cola Zero Lime**
   - (Optional) Any third product you want to test
3. Each barcode will appear in the list when detected
4. Click the **Copy** button next to each barcode

### Step 4: Update Quest Data
Open `src/data/quests.ts` and replace the placeholder barcodes:

**Before:**
```typescript
{
  id: "quest-1",
  title: "Scan Pauls Plus+ Protein Chocolate",
  barcode: "SCAN_TO_UPDATE_1", // ← Replace this
  ...
}
```

**After:** (example)
```typescript
{
  id: "quest-1",
  title: "Scan Pauls Plus+ Protein Chocolate",
  barcode: "9300830042949", // ← Your copied barcode
  ...
}
```

Do the same for all three quests:
- Replace `SCAN_TO_UPDATE_1` with Pauls Plus+ barcode
- Replace `SCAN_TO_UPDATE_2` with Coca-Cola Zero Lime barcode
- Replace `SCAN_TO_UPDATE_3` with your third product barcode (or leave as placeholder)

### Step 5: Test Real Scanning
1. Save the `quests.ts` file
2. The app will hot-reload automatically
3. Click "Scan" on any quest
4. Point camera at the actual product
5. Quest should complete automatically! 🎉

## Troubleshooting

### Camera Not Working
- Make sure you're using HTTPS or localhost
- Check browser permissions for camera access
- Try using Chrome or Safari (best compatibility)

### Barcode Not Detecting
- Ensure good lighting
- Hold camera steady
- Try different angles
- Make sure barcode is in the frame outline
- Some products have multiple barcodes - try each one

### Quest Not Completing
- Verify the barcode in `quests.ts` matches exactly what you scanned
- Check for extra spaces or characters
- Make sure the quest isn't already completed
- Check browser console for errors

## Product Barcode Format
Australian barcodes are typically:
- **EAN-13** format (13 digits)
- Start with `93` for most Australian products
- Example: `9300830042949`

## Tips for Hackathon Demo
1. **Have backup**: Keep the manual demo buttons in the scanner
2. **Test beforehand**: Scan all products before the presentation
3. **Good lighting**: Make sure demo area is well-lit
4. **Print barcodes**: Consider printing barcode images as backup
5. **Mobile device**: Works best on mobile phones with rear camera

## Next Steps for Production
- Connect to Coles product database API
- Implement real-time product info lookup
- Add more products and dynamic quest generation
- Integrate with actual Flybuys points API
- Add quest history and analytics
