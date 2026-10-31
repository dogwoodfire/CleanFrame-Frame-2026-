# CleanFrame Setup Session Record

**Session Date:** 2026-10-31  
**Status:** Stage 1 Complete - Moving to browser Copilot for continuation

## TV and Network Details (Verified)

| Item | Value | Status |
| --- | --- | --- |
| **TV Model** | Samsung 50-inch The Frame, `QE50LS03DAUXXU` (LS03D) | ✓ Confirmed |
| **Firmware** | `T-PTMDDEUC-0090-2130.0` | ✓ Confirmed |
| **Build/Variant** | `F13C2070, BT - S` | ✓ Confirmed |
| **Tizen Version** | Tizen 8.x (older than reference Tizen 9.0) | ℹ️ Note |
| **TV Local IP** | `192.168.0.144` | ✓ Confirmed |
| **TV Port (SDB)** | `26101` (standard) | — |

## Development Setup

| Item | Status | Details |
| --- | --- | --- |
| **Primary Device** | macOS computer on same network | — Needed for SDK tools |
| **Guidance Method** | iPad-based (this session) | You'll relay instructions |
| **Browser Access** | Will use browser Copilot to continue | — |

## Compatibility Notes

⚠️ **Your TV's firmware is Tizen 8.x, one generation older than the reference TV (Tizen 9.0).**
- Developer Mode, SDB connection, signing and app installation should work
- Watch for compatibility quirks during setup
- Will verify actual capabilities once SDB connects

## Next Stages (Prepared)

### Stage 0 (Current): Local Preview
- [ ] Clone CleanFrame repo on macOS
- [ ] Run `npm ci` and `npm run dev:public`
- [ ] Test browser preview at `localhost:4795/home/`

### Stage 1: Inspect Samsung SDK
- [ ] Check installed Samsung tools
- [ ] Verify Node.js and Python versions
- [ ] Prepare SDB and Certificate Manager tools

### Stage 2: TV Developer Mode
- [ ] Enable Developer Mode on TV (Settings → Apps → App Settings → 12345)
- [ ] Enter computer's local IP in Developer Mode popup
- [ ] Verify Developer Mode is enabled

### Stage 3: Establish SDB Connection
- [ ] Install/verify Samsung SDK tools
- [ ] Connect SDB to `192.168.0.144:26101`
- [ ] Retrieve TV capabilities and installed-app list

### Stage 4: Create Signing Certificates
- [ ] Samsung account sign-in
- [ ] Create signing profile in Certificate Manager
- [ ] Obtain TV's DUID and create distributor certificate

### Stage 5: Build and Install
- [ ] Create TV web app project
- [ ] Configure app identity (package ID, app ID)
- [ ] Map installed apps to launch IDs
- [ ] Package, sign and install `.wgt` file

### Stage 6: Test Launcher
- [ ] Verify app runs on TV
- [ ] Test all shortcuts and navigation
- [ ] Confirm Samsung Home access (before native changes)

### Stage 7-8: Optional Native Home
- [ ] Review native helper compatibility (Tizen 8.x check)
- [ ] Prepare helper, apply commands and rollback
- [ ] **Only proceed with explicit authorization**

## Important Agreements

✓ One stage at a time  
✓ Ask before first device connection  
✓ Announce installs, launches and restarts  
✓ Confirm visible results with you  
✓ Stop before native Home/startup changes  
✓ Keep credentials and device details private (`.local/` ignored)  
✓ Maintain setup/recovery record

## Private Configuration (Not in this file)

When created:
- `.local/signing.json` — SDK paths, certificate profile, app identity
- `.local/device-credentials.json` — PC IP, TV DUID, authentication tokens
- `.local/original.json` — Native Home baseline (if proceeding to Stage 7)
- Photos and diagnostics of TV menus

---

**To continue in browser Copilot:**

1. Copy the **setup prompt** from `docs/for-agents.md` (lines 17–32)
2. Paste it into a new browser Copilot session
3. Add: `**Previous setup record:** Refer to `.local/setup-session-record.md` for TV/network details already confirmed.`
4. Start with Stage 0: Local preview

