# Pushbullet Firefox Extension (Enhanced Fork)

This is a **modified fork** of the [official Pushbullet Firefox Addon](https://addons.mozilla.org/en-US/firefox/addon/pushbullet) with custom enhancements and fixes specifically for Firefox.

> **⚠️ Quick Start**: This is an unsigned extension. You need **Firefox Developer Edition**, **Firefox Nightly**, or **Zen Browser** to install it permanently. See [Installation](#installation) for details.

## About This Fork

This fork maintains the core Pushbullet functionality while adding several improvements and fixes for a better Firefox experience.

### Original Extension
- **Official Pushbullet**: https://www.pushbullet.com
- **Original Repository**: Pushbullet browser extension
- **License**: Proprietary (Pushbullet)

### Custom Enhancements

#### 🎨 Dark Mode
- **System theme detection**: Automatically follows your macOS/system dark mode preference
- **Manual toggle**: Override system preference in extension options
- **No Pro required**: Dark mode works for all users (not just Pro subscribers)

#### 🔐 OTP Detection & Auto-Copy
- **Smart OTP detection**: Automatically detects verification codes in SMS notifications
- **Visual highlighting**: OTP codes are displayed prominently in notification titles with 🔐 icon
- **Click-to-copy**: Click any OTP notification to automatically copy the code to clipboard
- **Pattern recognition**: Supports 4-8 digit codes with common keywords (OTP, code, verification, etc.)

#### 🔧 Bug Fixes
- Fixed Manifest V3 compatibility issues
- Fixed context menu errors in Firefox
- Fixed SMS history display issues
- Fixed undefined variable errors in push/SMS chat
- Fixed cookie-based authentication (now uses manual API key entry)
- Fixed notification duration (increased to 15 seconds)
- Improved error handling throughout

#### ⌨️ Keyboard Shortcuts
- `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac): Toggle extension popup
- `Ctrl+Shift+K` (or `Cmd+Shift+K` on Mac): Dismiss most recent notification
- `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac): Instant push current tab
- `Ctrl+Shift+E` (or `Cmd+Shift+E` on Mac): Pop out panel

## Installation

### ⚠️ Important: Unsigned Extension

This is an **unsigned extension** and requires special installation steps. Regular Firefox won't allow unsigned extensions for security reasons.

### Compatible Browsers

✅ **Firefox Developer Edition** - Recommended  
✅ **Firefox Nightly** - Works  
✅ **Zen Browser** - Works (based on Firefox)  
❌ **Firefox Release** - Won't work (requires signed extensions)

### Installation Methods

#### Method 1: Firefox Developer Edition / Nightly (Permanent)

1. **Download Firefox Developer Edition**:
   - Get it from: https://www.mozilla.org/firefox/developer/
   - Or Firefox Nightly: https://www.mozilla.org/firefox/nightly/

2. **Configure Firefox to allow unsigned extensions**:
   - Open Firefox Developer/Nightly
   - Type `about:config` in the address bar
   - Search for `xpinstall.signatures.required`
   - Set it to `false` (double-click to toggle)

3. **Install the extension**:
   - Go to the [Releases page](../../releases)
   - Download the latest `pushbullet-enhanced-vX.X.X.xpi` file
   - Drag and drop the XPI file into Firefox
   - Click "Add" when prompted
   - The extension will remain installed permanently

#### Method 2: Zen Browser (Permanent)

Zen Browser is based on Firefox and supports unsigned extensions:

1. **Download Zen Browser**:
   - Get it from: https://zen-browser.app/

2. **Enable unsigned extensions**:
   - Open Zen Browser
   - Type `about:config` in the address bar
   - Search for `xpinstall.signatures.required`
   - Set it to `false`

3. **Install the XPI**:
   - Download from [Releases page](../../releases)
   - Drag the XPI file into Zen Browser
   - Click "Add" when prompted

#### Method 3: Any Firefox (Temporary - For Testing)

This method works on any Firefox version but the extension is removed when you close the browser:

1. **Open Firefox** (any version)
2. **Navigate to** `about:debugging`
3. **Click** "This Firefox" → "Load Temporary Add-on"
4. **Select** the downloaded XPI file or the `manifest.json` from source
5. **Note**: Extension will be removed when Firefox closes

#### Method 4: From Source (Development)

For developers who want to modify the code:

1. **Clone this repository**:
   ```bash
   git clone <repository-url>
   cd pushbullet-enhanced
   ```

2. **Load in Firefox**:
   - Open Firefox Developer Edition or Nightly
   - Navigate to `about:debugging`
   - Click "This Firefox" → "Load Temporary Add-on"
   - **Important**: Navigate to the `src/` folder and select `manifest.json` from there
   - (Not from the repository root!)

3. **Or use web-ext for development**:
   ```bash
   pnpm run dev
   # or
   npm run dev
   ```

4. **For permanent installation from source**:
   ```bash
   pnpm run xpi
   # Creates pushbullet-enhanced.xpi in dist/ folder
   ```
   - Install the XPI using Method 1 or 2 above

### First-Time Setup
1. Click the Pushbullet icon in your toolbar
2. Click "Sign In"
3. Sign in to your Pushbullet account on the website
4. Go to Settings → Account → Access Tokens
5. Create an Access Token and copy it
6. Paste the token in the extension prompt
7. Done! The extension is now connected to your account

## Features

### Core Pushbullet Features
- Send/receive SMS from your computer
- Mirror Android notifications to your desktop
- Share links, files, and notes between devices
- Universal copy & paste across devices
- End-to-end encryption support

### Enhanced Features (This Fork)
- System-aware dark mode
- OTP auto-detection and copy
- Improved notification persistence
- Better Firefox compatibility
- Manual API key authentication (more reliable than cookies)

## Configuration

### Dark Mode
1. Open extension options (right-click icon → Options)
2. Toggle "Dark Mode" checkbox
3. Or let it automatically follow your system theme

### Notification Duration
Notifications now stay visible for 15 seconds by default (increased from 8 seconds).

### API Key Management
Your API key is stored locally in the extension. To change accounts:
1. Open extension options
2. Click "Sign Out"
3. Sign in with a new account and enter the new API key

## Known Limitations

### Firefox-Specific
- **Cookie access blocked**: Firefox's privacy protections prevent cookie-based auth, so manual API key entry is required
- **Notification buttons**: macOS doesn't support custom notification buttons, so OTP copy works via click instead
- **Context menu**: Some advanced context menu features may be limited

### General
- Requires active Pushbullet account
- SMS features require Android device with Pushbullet app
- Some features require Pushbullet Pro subscription (not dark mode though!)

## Troubleshooting

### Installation Issues

#### "This add-on could not be installed because it has not been verified"
- **Solution**: You're using regular Firefox. Use Firefox Developer Edition, Nightly, or Zen Browser instead
- **Alternative**: Load as temporary add-on via `about:debugging` (removed on browser restart)

#### Extension disappears after restarting browser
- **Cause**: You loaded it as a temporary add-on
- **Solution**: Use Firefox Developer/Nightly with `xpinstall.signatures.required` set to `false`

#### Can't find `xpinstall.signatures.required` in about:config
- **Cause**: You're using regular Firefox Release
- **Solution**: This setting only works in Developer Edition, Nightly, or Zen Browser

#### Extension installed but not working
1. Check that you've entered a valid API key
2. Open browser console (F12) and check for errors
3. Try reloading the extension from `about:addons`

### Extension won't sign in
1. Make sure you're using the correct Access Token from Pushbullet settings
2. Check that the token hasn't expired
3. Try signing out and signing in again
4. Verify you have internet connectivity

### SMS not showing
1. Ensure your Android device is connected to Pushbullet
2. Check that SMS mirroring is enabled in the Pushbullet Android app
3. Verify your device has an active internet connection
4. Check that the Pushbullet Android app is up to date

### Dark mode not working
1. Check extension options to see if dark mode is enabled
2. Try toggling it off and on again
3. Reload the extension from `about:addons`
4. Check your system theme settings

### OTP not copying
1. Click the notification when it appears
2. The OTP should be copied to your clipboard automatically
3. Try pasting with Cmd+V (Mac) or Ctrl+V
4. Check browser console for clipboard permission errors

## Releases

New versions are automatically built and released via GitHub Actions when the version in `manifest.json` is updated.

### Version History
See [CHANGELOG.md](CHANGELOG.md) for detailed version history and changes.

### Semantic Versioning
This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR.MINOR.PATCH** (e.g., 367.0.0)
- Starting from version 367.0.0 to differentiate from official extension (v366)

## Development

### Project Structure
```
src/                    # Extension source files (load this in Firefox!)
├── manifest.json       # Extension manifest
├── assets/            # Images, sounds, fonts
│   ├── images/        # Icons and UI images
│   ├── sounds/        # Alert sounds
│   └── fonts/         # Custom fonts
├── css/               # Stylesheets
├── html/              # HTML pages (popup, options, etc.)
├── js/                # JavaScript code
│   ├── background/    # Background scripts
│   ├── content/       # Content scripts
│   ├── core/          # Core functionality
│   ├── lib/           # Third-party libraries
│   └── ui/            # UI-related scripts
└── _locales/          # Internationalization files
```

### Building

**Development:**
```bash
# Run with auto-reload
pnpm run dev

# Or manually load src/ folder in about:debugging
```

**Production:**
```bash
# Build XPI package
pnpm run xpi

# Output: dist/pushbullet-enhanced-*.xpi
```

XPI packages are also automatically created by GitHub Actions on each release.

### Testing
1. Load the `src/` folder in Firefox as a temporary add-on (not the repository root!)
2. Check the browser console for any errors
3. Test with your Pushbullet account

### Contributing
Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Development setup
- Commit message conventions
- Release process
- Testing checklist

## Credits

- **Original Extension**: Pushbullet Team (https://www.pushbullet.com)
- **Fork Maintainer**: Custom modifications for personal use
- **Enhancements**: Dark mode, OTP detection, Firefox compatibility fixes

## Disclaimer

This is an **unofficial fork** and is not affiliated with or endorsed by Pushbullet. Use at your own risk. For the official extension, visit https://www.pushbullet.com.

## License

This fork maintains the original Pushbullet extension's proprietary license. Modifications are provided as-is for personal use.

---

**Note**: This fork is maintained for personal use and may not receive regular updates. For the official, supported version, please use the extension from the Firefox Add-ons store or Pushbullet's official website.
