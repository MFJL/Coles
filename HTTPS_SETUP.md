# HTTPS Setup for Camera Access on Phone

The app now runs with HTTPS enabled, which allows camera access on mobile devices!

## How to Use

### 1. Start the HTTPS Server

```bash
npm run dev
```

The server will now run on **HTTPS** at `https://[your-ip]:8080`

### 2. Access on Your Phone

1. Make sure your phone and computer are on the **same WiFi network**
2. Find your computer's IP address (shown in terminal when you run `npm run dev`)
3. On your iPhone, open Safari
4. Go to: `https://YOUR_IP:8080` (e.g., `https://192.168.1.5:8080`)

### 3. Trust the Certificate (One Time Only)

Since this is a self-signed certificate, you'll see a security warning:

**On Safari (iPhone):**
1. You'll see "This Connection Is Not Private"
2. Tap **"Show Details"**
3. Tap **"visit this website"**
4. Tap **"Visit Website"** again to confirm
5. The app should now load!

**On Chrome (Desktop):**
1. You'll see "Your connection is not private"
2. Click **"Advanced"**
3. Click **"Proceed to [your-ip] (unsafe)"**

### 4. Allow Camera Access

When you click "Scan" on a quest:
1. Safari will ask "Allow camera access?"
2. Tap **"Allow"**
3. The camera should now work! 🎉

## Troubleshooting

### Certificate Error Won't Go Away
- Try using **Safari** on iPhone (works best)
- Make sure you're using `https://` not `http://`
- Clear browser cache and try again

### Camera Still Not Working
- Make sure you clicked "Allow" for camera permissions
- Check Settings > Safari > Camera = Allow
- Try closing and reopening Safari

### Can't Connect to Server
- Make sure both devices are on same WiFi
- Check firewall settings on your computer
- Try restarting the dev server

## For Hackathon Demo

If you're having issues during the presentation, you always have the **manual demo buttons**:
1. Click "Scan" on any quest
2. Expand "Demo: Manual barcode input"
3. Click the product button

This is actually more reliable for presentations!

## Technical Details

- Self-signed SSL certificate in `.cert/` folder
- Valid for 365 days
- Certificate is in `.gitignore` (won't be committed)
- Uses OpenSSL for certificate generation
