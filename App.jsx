import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Copy, Check, Image as ImageIcon, Loader2,
  Smartphone, MessageSquare,
  RefreshCw, Download, Palette, History, X,
  FileCode, Layout, Zap, Eye,
  Settings, Files, Plus, Trash2, Play, Globe,
  ChevronRight, AlertCircle, Monitor, Tablet,
  Undo2, Redo2, Maximize2, Minimize2, Search,
  Upload, Star, Layers, Wand2, Sparkles,
  Moon, Sun, Bell, Share2, FolderOpen,
  LayoutGrid, Code2, SlidersHorizontal, Cpu,
  Wifi, Battery, Signal, Clock, ChevronDown,
  Hash, TrendingUp, Users, Home, Heart,
  ShoppingCart, User, LogIn, CreditCard,
  Map, Camera, Music, Film, BookOpen,
  Shield, Headphones, Gift, Megaphone,
  Bookmark, Award, Flame, Compass, Send,
  BarChart3, PieChart, Activity, Wallet,
  QrCode, Scan, ArrowUpDown, Coins,
  Vote, Radio, Mic, Video, Phone,
  Calendar, Tag, Percent, Store,
  Navigation, Lightbulb, Rocket, Crown,
  Gem, Trophy, Target, Ticket,
  Import, Link, Type, PanelRightOpen, PanelRightClose,
  Columns, CopyPlus, RotateCw, Paintbrush, MousePointer,
  Glasses, PanelLeft, ArrowRight, CircleDot, Rows3,
} from 'lucide-react';

// ─── CONFIG ────────────────────────────────────────────────────────
const DEFAULT_MODEL = "gemini-2.5-flash-preview-09-2025";
const getApiKey = () => { try { return localStorage.getItem('v2ui_gemini_key') || ''; } catch { return ''; } };
// ───────────────────────────────────────────────────────────────────


// ─── VARIATION STYLES (applied to non-preset pages) ───
const VARIATION_STYLES = [
  { suffix: 'V1 — Clean Minimal', style: 'Use a clean, minimal layout with generous white space, simple typography, and subtle borders. Focus on clarity, readability, and simplicity. Light feel with structured spacing.' },
  { suffix: 'V2 — Card Based', style: 'Organize all content in elevated card components with rounded corners (12-16px), subtle box shadows, and clear visual sections. Use a card-grid or stacked-card layout pattern.' },
  { suffix: 'V3 — Bold & Vibrant', style: 'Use bold, large typography, vivid accent colors, strong visual hierarchy, and eye-catching UI elements. Make headings extra-large and sections visually striking with color blocks.' },
  { suffix: 'V4 — Modern Glass', style: 'Apply glassmorphism effects with frosted-glass cards (backdrop-filter blur), gradient backgrounds, translucent surfaces, and modern depth layering. Premium, futuristic feel.' },
];

// ─── TRENDUP SECURE MESSAGING PRESETS (11 screens × 3-4 variations) ───
const PRESETS = [
  // ════════ 1. LANDING ════════
  { id: 'landing-v1', emoji: '🚀', label: 'Landing V1 — Centered', cat: 'onboard', prompt: 'TrendUp secure messaging landing screen. Centered layout: large "TrendUp" logo at center, "PRIVATE BY DESIGN" tagline below in small uppercase tracking-widest text, two stacked outline buttons "New account" and "Existing account" with rounded borders. Subtle crosshatch/geometric pattern background. Clean, minimal, trust-focused. Red accent (#dc2626) for highlights. Status bar at top with 9:41 time.' },
  { id: 'landing-v2', emoji: '🚀', label: 'Landing V2 — Hero Image', cat: 'onboard', prompt: 'TrendUp landing with large hero illustration at top showing encrypted shield/lock graphic, "TrendUp" logo below, tagline "End-to-end encrypted messaging" in muted text, "Get Started" primary red button and "I have an account" text link below. Gradient from dark navy to brand bg. Status bar at top.' },
  { id: 'landing-v3', emoji: '🚀', label: 'Landing V3 — Split Screen', cat: 'onboard', prompt: 'TrendUp landing split screen: top 60% dark gradient with large shield icon animation placeholder and "TrendUp" text, bottom 40% white card with rounded top corners containing "Private by Design" heading, brief description "Your messages are encrypted and can self-destruct", two buttons side by side "Sign Up" (filled red) and "Sign In" (outline). Status bar at top.' },
  { id: 'landing-v4', emoji: '🚀', label: 'Landing V4 — Glassmorphism', cat: 'onboard', prompt: 'TrendUp landing with full-screen dark gradient background, floating glassmorphism card in center with blur backdrop, "TrendUp" logo with glow effect, "PRIVATE BY DESIGN" tagline, animated dots/particles in background, "Create Account" red gradient button and "Already have an account? Sign in" link. Premium feel.' },

  // ════════ 2. SIGN IN ════════
  { id: 'signin-v1', emoji: '🔑', label: 'Sign In V1 — Stacked Cards', cat: 'onboard', prompt: 'TrendUp sign-in screen with two stacked method cards. Card 1: "Username · password" badge, Handle input field, Password input field, "Register" outline button and "Sign in" filled red button side by side. Card 2: "Wallet" badge in teal/green, "Use browser wallet" teal gradient button and "Paste address" outline button side by side, wallet address fallback input, "Create challenge → sign" button. Logo at top, "PRIVATE BY DESIGN" tagline. Pattern background.' },
  { id: 'signin-v2', emoji: '🔑', label: 'Sign In V2 — Tab Switch', cat: 'onboard', prompt: 'TrendUp sign-in with tab switcher at top: "Password" tab and "Wallet" tab. Password tab active shows: Handle input with user icon, Password input with lock icon, "Forgot password?" link, "Sign In" red button, "New here? Register" link. Wallet tab shows: large wallet icon, "Connect Wallet" teal button, OR divider, paste address input. Logo centered above tabs. Clean minimal layout.' },
  { id: 'signin-v3', emoji: '🔑', label: 'Sign In V3 — Full Screen Dark', cat: 'onboard', prompt: 'TrendUp sign-in full dark theme. Large "TrendUp" text at top left, "Sign in to your secure vault" subtitle. Username field with @ prefix styling, Password field with show/hide toggle, "Sign In" wide red gradient button. Divider "OR CONNECT WALLET". Browser wallet button with MetaMask-style icon, Paste address option. "No account? Create one" at bottom. Dark charcoal background with subtle grid.' },
  { id: 'signin-v4', emoji: '🔑', label: 'Sign In V4 — Biometric', cat: 'onboard', prompt: 'TrendUp sign-in with biometric option. Center: large fingerprint icon with pulsing ring animation placeholder, "Unlock with Biometrics" text. Below: "Or sign in with" section, Handle + Password fields compact, Sign In button. At bottom: "Connect Wallet" alternate option as text link. Minimal, security-focused feel. Dark background.' },

  // ════════ 3. SESSION LOCKED ════════
  { id: 'locked-v1', emoji: '🔐', label: 'Locked V1 — Minimal', cat: 'onboard', prompt: 'TrendUp session locked screen. Minimal centered layout: "TrendUp" logo, "PRIVATE BY DESIGN" tagline, "Session locked" heading in bold, "Enter password to unlock Hub messages on this device." in muted text, single password input field with lock icon, "Unlock" red button. Pattern/crosshatch background. Very clean and focused.' },
  { id: 'locked-v2', emoji: '🔐', label: 'Locked V2 — Shield Lock', cat: 'onboard', prompt: 'TrendUp session locked with large shield+lock icon centered, glowing red accent ring around it, "Your session has expired" heading, "Messages are still encrypted on device" reassurance text in muted, password input field, "Unlock Vault" red gradient button, "Sign out" text link at bottom. Dark gradient background.' },
  { id: 'locked-v3', emoji: '🔐', label: 'Locked V3 — PIN Code', cat: 'onboard', prompt: 'TrendUp session locked with PIN entry style: "TrendUp" logo at top, lock icon, "Enter your PIN" heading, 6 circular PIN dots (filled/empty), numeric keypad grid (1-9, 0) with backspace, "Forgot PIN? Use password" text link, "Sign out" at bottom. Dark surface card on dark bg. Clean security feel.' },
  { id: 'locked-v4', emoji: '🔐', label: 'Locked V4 — Timer Expired', cat: 'onboard', prompt: 'TrendUp session locked showing timer context: "Session timed out" with countdown that reached 00:00, clock icon with red X, "For your security, sessions auto-lock after inactivity" explanation, password field, "Unlock" button, "Change auto-lock duration" settings link. Bottom: last active time shown. Professional security UX.' },

  // ════════ 4. SECURING DEVICE ════════
  { id: 'securing-v1', emoji: '🛡️', label: 'Securing V1 — Progress Steps', cat: 'onboard', prompt: 'TrendUp securing device screen. "TrendUp" logo at top, "PRIVATE BY DESIGN" tagline, "Securing your device" heading, "This may take a few moments." text, animated progress bar (60% filled in red), three feature rows below: 1) Shield icon + "Encryption" + "Keys generated locally", 2) Clock icon + "Ephemeral controls" + "Timers available after setup", 3) Eye icon + "Minimal metadata" + "Policy-owned retention". Each row has icon, title, subtitle. Pattern bg.' },
  { id: 'securing-v2', emoji: '🛡️', label: 'Securing V2 — Circular Progress', cat: 'onboard', prompt: 'TrendUp securing device with large circular progress ring centered (75% fill, red gradient), percentage in center "75%", "Setting up encryption..." text below ring, step indicators: checkmark "Key generation" (done), spinner "Device binding" (in progress), gray "Sync ready" (pending). "TrendUp" logo subtle at top. Dark background with glow around progress ring.' },
  { id: 'securing-v3', emoji: '🛡️', label: 'Securing V3 — Animated Steps', cat: 'onboard', prompt: 'TrendUp securing device with vertical stepper/timeline: Step 1 "Generating encryption keys" with green check, Step 2 "Binding to device" with spinning loader, Step 3 "Configuring timers" grayed out, Step 4 "Ready to message" grayed out. Each step has icon + title + subtitle description. Progress bar at bottom. "Almost there..." encouraging text. Dark card on dark bg.' },

  // ════════ 5. SECURE INBOX ════════
  { id: 'inbox-v1', emoji: '💬', label: 'Inbox V1 — Classic List', cat: 'inbox', prompt: 'TrendUp secure inbox/conversation list. Header: "Secure conversations" title with compose/edit icon button. Thread list: each row has circular avatar with initial letter (colored backgrounds), name + participant count (e.g. "Amy +3"), subtitle with preview text and timestamp, trailing chevron, optional unread count badge in red. Three threads shown: "Amy +3" (group, active/highlighted), "stevej" (1 unread badge), "Family" (Dirky: photo). Bottom tab bar: Messages (active, red), Contacts, Settings icons with labels.' },
  { id: 'inbox-v2', emoji: '💬', label: 'Inbox V2 — Hub Dark', cat: 'inbox', prompt: 'TrendUp inbox dark Hub theme. Top toolbar: "New" button (lime accent), unified search bar "Search name, @handle, or paste wallet", kebab menu "⋮". Tab strip: "Inbox" active, "Groups" tab. Thread list dark theme: avatar circles, names bold white, preview text muted gray, timestamps right-aligned, unread count badges in lime (#dff352). Charcoal canvas (#181818) with panel (#242424) surfaces. Border color #404040.' },
  { id: 'inbox-v3', emoji: '💬', label: 'Inbox V3 — Card Style', cat: 'inbox', prompt: 'TrendUp inbox with card-based thread layout instead of flat list. Each conversation is a rounded card with slight elevation/shadow, avatar left, name + preview in middle, timestamp + unread badge right, subtle timer icon if ephemeral. Search bar at top with filter chips: "All", "Unread", "Groups", "Encrypted". Floating red FAB at bottom right for new message. Light theme with clean spacing.' },
  { id: 'inbox-v4', emoji: '💬', label: 'Inbox V4 — Swipe Actions', cat: 'inbox', prompt: 'TrendUp inbox showing swipe action hints. Normal thread list but one thread partially swiped left revealing action buttons: red "Delete", amber "Mute", blue "Archive". Header with search icon and "New" button. Each thread shows avatar, name, last message preview, time, encryption lock icon, optional timer badge showing remaining time (e.g. "2d left"). Bottom navigation tabs. Light theme.' },

  // ════════ 6. CHAT LIGHT ════════
  { id: 'chat-light-v1', emoji: '💭', label: 'Chat Light V1 — Full Featured', cat: 'chat', prompt: 'TrendUp active chat screen light theme. Chat header: "‹ Inbox" back, "stevej" title centered, "i" info button. Message bubbles: incoming (left, with small avatar "S", white/light bg) and outgoing (right, gray bg #e2e8f0). Each message has burn timer countdown below in red (e.g. "*4d 23h 50m 26s"), timestamp. Toolbar: timer button showing "1d · off" with clock icon, camera, gallery, voice, attach buttons. Composer bar: sparkle/AI button, text input "Auto-removes after 1 day — type below…", Send button red. Pattern background.' },
  { id: 'chat-light-v2', emoji: '💭', label: 'Chat Light V2 — Minimal Clean', cat: 'chat', prompt: 'TrendUp chat light minimal variant. Clean white background. Bubbles: outgoing right-aligned with subtle brand tint, incoming left with avatar. Timer shown as small pill badge on each message (e.g. "🔥 4d 23h"). Simple composer: just text input and send button. Header: back arrow, username, online dot indicator, info icon. No toolbar clutter — attachments via + button that expands. Day separator "Today" between messages.' },
  { id: 'chat-light-v3', emoji: '💭', label: 'Chat Light V3 — Timer Panel Open', cat: 'chat', prompt: 'TrendUp chat with timer panel expanded/visible. Chat messages in background slightly dimmed. Foreground: timer panel overlay or bottom sheet with two sections. Section 1 "Lifetime" with scrollable button row: Off, 10s, 1m, 5m, 10m, 1h, 6h, 12h, 1d (selected/highlighted), 1w, 2w, 4w, 6mo, 1y. Section 2 "Burn after open": Off (selected), 1m, 3m, 1h, 1d. Header: "Timers · next outgoing message". Light theme with red accent on selected options.' },
  { id: 'chat-light-v4', emoji: '💭', label: 'Chat Light V4 — Conversation Info', cat: 'chat', prompt: 'TrendUp conversation info sheet (shown when tapping "i" in chat header). Card/bottom sheet showing: user avatar large, username "stevej", encryption status "E2EE active" with green badge. Info rows: "Lifetime (next send): 1 day", "Burn after open: Off", "Markdown: On · sanitized subset". Danger zone at bottom: red "Clear all messages in this thread…" button. Light theme, clean card layout.' },

  // ════════ 7. CHAT DARK ════════
  { id: 'chat-dark-v1', emoji: '🌙', label: 'Chat Dark V1 — Hub Production', cat: 'chat', prompt: 'TrendUp chat dark Hub production theme matching /hub/chats. Charcoal canvas (#181818) background, panel (#242424) surfaces. Chat header: "‹ Inbox" back, "stevej" title, info button. Lime accent (#dff352) for active elements. Message bubbles: incoming with dark panel bg, outgoing slightly lighter. Timer countdown in lime text below each message. Composer: dark input with border #404040, lime-tinted Send button. Toolbar: timer "1d", attach button. Minimal chrome.' },
  { id: 'chat-dark-v2', emoji: '🌙', label: 'Chat Dark V2 — Midnight Blue', cat: 'chat', prompt: 'TrendUp chat dark variant with midnight blue theme. Deep navy (#0A0A1A) background, indigo (#6366F1) accents. Message bubbles: outgoing indigo-tinted, incoming dark surface. Timer badges with purple glow. Composer with gradient border on focus. Header with blur backdrop effect. Modern, premium dark feel. Encryption lock icon in header.' },
  { id: 'chat-dark-v3', emoji: '🌙', label: 'Chat Dark V3 — AMOLED Black', cat: 'chat', prompt: 'TrendUp chat AMOLED pure black theme. Background pure #000000, surfaces #111111, borders #222222. Red accent (#dc2626) for primary actions. Messages: outgoing dark red-tinted bg, incoming #111 bg. Timer text in red. Send button red. Minimal UI chrome, maximum contrast. Great for OLED screens. Header transparent with subtle bottom border.' },
  { id: 'chat-dark-v4', emoji: '🌙', label: 'Chat Dark V4 — Markdown Bubbles', cat: 'chat', prompt: 'TrendUp chat dark theme showcasing markdown rendering in bubbles. Show messages with: one bubble with **bold** and *italic* formatted text, one with a code block, one with a bullet list. Each has timer countdown. Dark theme (#181818 bg). Bubble styling supports rich text with proper typography. Header shows markdown toggle indicator. Composer with markdown formatting hint.' },

  // ════════ 8. HUB INBOX CHROME ════════
  { id: 'hubchrome-v1', emoji: '🔍', label: 'Hub Chrome V1 — Search & New', cat: 'inbox', prompt: 'TrendUp Hub inbox toolbar dark theme. Top: "New" button (lime bg #dff352 with dark text), unified search bar "Search name, @handle, or paste wallet" with magnifying glass icon, kebab "⋮" menu button. Below: Tab strip "Inbox" | "Groups". Thread list with dark rows. This focuses on the chrome/toolbar area. Charcoal canvas (#181818), lime accent (#dff352). Show the full inbox with these interactive toolbar elements prominent.' },
  { id: 'hubchrome-v2', emoji: '🔍', label: 'Hub Chrome V2 — Kebab Menu Open', cat: 'inbox', prompt: 'TrendUp Hub inbox with the ⋮ overflow menu opened. Menu dropdown/popover showing options: "Mute all notifications", "Mark all as read", "Archived threads", "Clear search", "Settings". Dark theme popup with sharp borders #404040, items with hover states. Behind: dimmed inbox list. Menu has subtle shadow. Lime accent for selected/hover state.' },
  { id: 'hubchrome-v3', emoji: '🔍', label: 'Hub Chrome V3 — New DM Expanded', cat: 'inbox', prompt: 'TrendUp Hub "Start / open DM" expanded panel. After clicking "New" button, a panel/dropdown appears with: search input "Find by @handle or paste wallet", recent contacts list with avatars and names, "Paste wallet address" section with input field and QR scan option, "Start conversation" button. Dark theme with lime accents. Shows the full flow of starting a new DM.' },
  { id: 'hubchrome-v4', emoji: '🔍', label: 'Hub Chrome V4 — Thread Row Menu', cat: 'inbox', prompt: 'TrendUp Hub thread row with ⋮ context menu open. A single thread row has its kebab menu expanded showing: "Mute", "Archive", "Delete thread", "Block user", "View profile". Dark popover menu positioned near the thread row. Rest of inbox visible but slightly dimmed. Shows conversation-level actions. Red text for destructive actions (Delete, Block).' },

  // ════════ 9. GROUPS ════════
  { id: 'groups-v1', emoji: '👥', label: 'Groups V1 — Shapes Overview', cat: 'groups', prompt: 'TrendUp Groups tab screen dark theme. Tab strip: "Inbox" and "Groups" (active, lime underline). "Groups on TrendUp" heading bold. Intro text: "We mix ideas people like from modern messengers, photo-first social, and open conversation — expressed in our own layouts and names." "Pick a shape" label. Three shape cards stacked: 1) "House line" — "Broadcast-style updates with threaded replies — official voice + discussion.", 2) "Circle" — "Small trusted lists for photos and voice notes — tight groups.", 3) "Squad room" — "Fast file + voice + pin stack — topic headers and search." Three CTA buttons at bottom: "Create House line" (primary lime), "Create Circle" (outline), "Create Squad" (outline). Legal note at bottom. Dark charcoal theme.' },
  { id: 'groups-v2', emoji: '👥', label: 'Groups V2 — Card Grid', cat: 'groups', prompt: 'TrendUp Groups variant with visual card grid layout. Each group shape is a large card with icon illustration at top, shape name bold, description below, member count "0 members", "Create" button on each card. Cards arranged in a 1-column scrollable layout with generous spacing. Header with "Groups" title and search. Dark theme with each card having subtle unique accent color (lime for House, teal for Circle, amber for Squad).' },
  { id: 'groups-v3', emoji: '👥', label: 'Groups V3 — Active Groups List', cat: 'groups', prompt: 'TrendUp Groups with existing groups list. Top: "Your Groups" section showing 2-3 active groups with group avatar, name, member count, last message preview, unread badge. Below: divider, then "Create New Group" section with the 3 shape options as compact buttons with icons. Bottom: "Discover Groups" section with suggested/public groups. Dark theme, lime accents for active states.' },
  { id: 'groups-v4', emoji: '👥', label: 'Groups V4 — Create Group Flow', cat: 'groups', prompt: 'TrendUp create group flow screen. Step-by-step: "Choose group shape" with 3 options highlighted, selected shape "Circle" has check mark. Below: "Group name" input field, "Description" textarea, "Add members" section with search bar and selected member chips/tags. Privacy toggle: "Private" or "Public". "Create Group" red/lime button at bottom. Dark theme with clear visual hierarchy.' },

  // ════════ 10. ACCOUNT & DEVICE ════════
  { id: 'account-v1', emoji: '⚙️', label: 'Account V1 — Settings Panel', cat: 'settings', prompt: 'TrendUp Account & device settings panel dark theme. Collapsible section with "Account & device ▾" header. Settings rows with toggle switches: 1) "Sounds" ON — "Receive ping + send click when tab is visible", 2) "Mute chat" UNMUTED — "Receive ping only for @stevej", 3) "Secure Mode" OFF (amber warning) — "Blocks copy & context menu; locks thread if tab loses focus." Green status: "E2EE keys ready on this device." "Approve a new device" section with 8-char code input and "Approve" button. Hint text at bottom. Charcoal canvas dark theme.' },
  { id: 'account-v2', emoji: '⚙️', label: 'Account V2 — Grouped Sections', cat: 'settings', prompt: 'TrendUp Account settings with grouped card sections. Card 1 "Privacy & Security": Secure Mode toggle, E2EE status with green dot, Auto-lock timer dropdown (5m, 15m, 30m, 1h). Card 2 "Notifications": Sounds toggle, Mute toggle, Notification preview toggle. Card 3 "Devices": Current device info, "Approve new device" with code input, "Revoke all other sessions" red button. Card 4 "Account": Username display, "Change password", "Delete account" red. Dark theme, each card with surface (#242424) bg.' },
  { id: 'account-v3', emoji: '⚙️', label: 'Account V3 — Profile & Security', cat: 'settings', prompt: 'TrendUp Account with profile section at top: avatar circle with camera edit overlay, display name, @handle, "Connected wallet" showing truncated address with copy icon. Below: security settings list style with chevron navigation: "Encryption keys" → "Device management" → "Auto-lock" → "Notification preferences" → "Secure Mode" → "Blocked users" → "About TrendUp". Sign out button at bottom in red. Dark theme, clean list layout.' },
  { id: 'account-v4', emoji: '⚙️', label: 'Account V4 — Device Approval', cat: 'settings', prompt: 'TrendUp device approval focused screen. Large device icon at top, "Approve a New Device" heading, explanation: "Paste the code from another browser. Requires secure session so a stolen cookie alone cannot add devices." Large 8-character code input field with monospace font, clear button. "Approve Device" red button. Below: "Active devices" list showing device name, browser, last active time, "Revoke" button for each. Dark charcoal theme.' },

  // ════════ 11. EDGE STATES ════════
  { id: 'edge-v1', emoji: '⚠️', label: 'Edge V1 — Signed Out', cat: 'edge', prompt: 'TrendUp Hub edge state: signed out / unauthorized. Dark theme. Amber/yellow warning banner at top: "Sign in to load and send direct messages" bold, "Threads sync from the server after you authenticate. You can still explore the full UI here." description, "Sign in" button. Below: dimmed/disabled toolbar with "New" button (grayed out), search bar, kebab menu. Empty thread area. Note: "New disabled when unauthorized". Shows what users see before authentication.' },
  { id: 'edge-v2', emoji: '⚠️', label: 'Edge V2 — Empty Inbox', cat: 'edge', prompt: 'TrendUp Hub edge state: authenticated but zero threads. Dark theme. Active toolbar at top: "New" button (lime), search bar, kebab menu. Large empty state illustration in center: messaging/chat bubble icon outline, "No conversations yet" heading, "Start a new DM with the New button above, or search for a @handle or wallet address." description. Subtle animation placeholder. Clean, encouraging empty state.' },
  { id: 'edge-v3', emoji: '⚠️', label: 'Edge V3 — Connection Error', cat: 'edge', prompt: 'TrendUp connection error state. Dark theme. Red warning icon at top center, "Connection lost" heading, "Unable to reach TrendUp servers. Your messages are safe and encrypted on device." reassurance text, "Retry" red button, "Work offline" outline button. Last sync timestamp shown: "Last synced: 2 minutes ago". Subtle pulse animation on retry button. Professional error handling UX.' },
  { id: 'edge-v4', emoji: '⚠️', label: 'Edge V4 — Filter No Results', cat: 'edge', prompt: 'TrendUp inbox with search/filter active but no results. Dark theme. Search bar active with query text "@unknownuser", filter chips active. Empty area below with search icon, "No conversations found" heading, "Try a different search term or start a new conversation" text, "Clear search" button and "Start new DM" button side by side. Shows the no-results UX path clearly.' },

  // ════════ 12. CONTACTS / ADDRESS BOOK ════════
  { id: 'contacts-v1', emoji: '📇', label: 'Contacts V1 — Alphabetical List', cat: 'contacts', prompt: 'TrendUp contacts/address book screen dark theme. Header: "Contacts" title with search icon and "+" add contact button. Alphabetical section headers (A, B, C…) with sticky letters. Each contact row: circular avatar with initials, display name bold, @handle in muted text, encryption status dot (green = verified). Quick action icons on right: message icon, call icon. Bottom tab bar with Contacts tab active. Search bar at top with placeholder "Search contacts". Charcoal canvas (#181818) dark theme.' },
  { id: 'contacts-v2', emoji: '📇', label: 'Contacts V2 — Card Grid', cat: 'contacts', prompt: 'TrendUp contacts displayed as card grid (2 columns). Each card: avatar circle at top center, name below, @handle in muted, "Message" button. Cards have dark surface (#242424) with subtle border. Header with search and filter chips: "All", "Verified", "Recent", "Blocked". Floating "+" FAB at bottom right for adding new contact. Dark theme with lime (#dff352) accents for verified badges.' },
  { id: 'contacts-v3', emoji: '📇', label: 'Contacts V3 — Add Contact', cat: 'contacts', prompt: 'TrendUp add new contact screen. Dark theme. "Add Contact" title with back arrow. Input fields: "@handle or wallet address" search field at top with magnifying glass icon. Below: search results showing matching users with avatar, name, handle, "Add" button for each. Alternatively: "Paste wallet address" section with input and QR scan button. "Invite to TrendUp" section at bottom for non-users. Clean, focused add flow.' },
  { id: 'contacts-v4', emoji: '📇', label: 'Contacts V4 — Contact Requests', cat: 'contacts', prompt: 'TrendUp contact/message requests screen. Dark theme. "Requests" tab active next to "Contacts" tab. Pending requests list: each row shows avatar, name, @handle, timestamp "2h ago", two buttons "Accept" (lime) and "Decline" (outline). Section showing "People you may know" with suggested contacts based on wallet connections. Badge count on Requests tab. Clean request management UX.' },

  // ════════ 13. USER PROFILE ════════
  { id: 'profile-v1', emoji: '👤', label: 'Profile V1 — Own Profile', cat: 'profile', prompt: 'TrendUp own profile/account screen dark theme. Large avatar circle at top with camera edit icon overlay, display name "shahbaz" editable, @handle "@shahbazdev" in muted. Stats row: "12 Contacts", "5 Groups", "Verified" badge. Settings sections: "Display Name" input, "Bio" textarea, "Profile Photo" change button. Connected wallet section showing truncated address with copy icon. "Share Profile" button and "QR Code" button side by side. Dark charcoal theme.' },
  { id: 'profile-v2', emoji: '👤', label: 'Profile V2 — Peer Profile', cat: 'profile', prompt: 'TrendUp viewing another users profile. Dark theme. Large avatar with name "stevej" and @handle. "Verified" green badge with shield icon. Encryption status: "E2EE Active — Safety number verified" with green indicator. Action buttons row: "Message" (lime filled), "Voice Call" (outline), "Video Call" (outline). Info section: "Member since: Jan 2026", "Shared groups: Family, Work". Bottom: "Block user" red text, "Report" red text. Clean profile view.' },
  { id: 'profile-v3', emoji: '👤', label: 'Profile V3 — Edit Profile', cat: 'profile', prompt: 'TrendUp edit profile form screen. Dark theme. Back arrow and "Save" button in header. Avatar with edit camera overlay. Fields: "Display Name" with text input, "Username" with @ prefix (non-editable hint), "Bio" multiline textarea (max 150 chars counter), "Status" dropdown (Online, Away, Do Not Disturb, Invisible). "Connected Wallet" section with wallet address and "Disconnect" option. "Delete Account" danger button at very bottom. Dark surface cards for each section.' },
  { id: 'profile-v4', emoji: '👤', label: 'Profile V4 — QR Code Share', cat: 'profile', prompt: 'TrendUp profile QR code sharing screen. Dark theme. Large QR code in center with TrendUp logo embedded in QR. Username "@shahbazdev" below QR. "Scan to connect on TrendUp" instruction text. Two action buttons: "Share QR Image" (lime) and "Copy Link" (outline). Below: "Scan QR Code" button with camera icon to scan someone elses QR. Toggle: "Include wallet address in QR" with switch. Clean, centered layout. Dark background with white QR code card.' },

  // ════════ 14. SAFETY NUMBER / KEY VERIFICATION ════════
  { id: 'safety-v1', emoji: '🔑', label: 'Safety V1 — Number Display', cat: 'security', prompt: 'TrendUp safety number verification screen. Dark theme. Header: "Verify Safety Number" with back arrow. Shield icon with green checkmark at top. "Your safety number with stevej" heading. Large grid of 12 groups of 5-digit numbers displayed in monospace font (e.g. "37842 29163 ..."). QR code below the numbers for scanning. Two buttons: "Scan Their QR" (lime) and "Mark as Verified" (outline). Explanation text: "If you and stevej see the same safety number, your E2EE connection is verified." Dark charcoal theme with green trust indicators.' },
  { id: 'safety-v2', emoji: '🔑', label: 'Safety V2 — QR Scanner', cat: 'security', prompt: 'TrendUp safety number QR scanner active screen. Dark theme. Camera viewfinder in center with scanning frame overlay (animated corners). "Scan their safety QR" instruction at top. Below viewfinder: "Or compare numbers manually" text link. Status area: "Scanning..." with subtle loading animation. When matched: green overlay "Verified!" with checkmark. When mismatched: red overlay "Numbers don\'t match — contact may have reinstalled." Professional security verification UX.' },
  { id: 'safety-v3', emoji: '🔑', label: 'Safety V3 — Verified Status', cat: 'security', prompt: 'TrendUp safety number verified confirmation screen. Dark theme. Large green shield with checkmark animation at center. "Verified" heading in green. "Your connection with stevej is end-to-end encrypted and verified." description. Verification timestamp: "Verified on May 6, 2026 at 2:15 PM". "View Safety Number" outline button, "Done" lime button. Note at bottom: "You\'ll be notified if the safety number changes, which may indicate a new device." Trust-building confirmation screen.' },

  // ════════ 15. MEDIA GALLERY ════════
  { id: 'media-v1', emoji: '🖼️', label: 'Media V1 — Shared Media Grid', cat: 'media', prompt: 'TrendUp shared media gallery for a conversation. Dark theme. Header: "Shared Media" with back arrow and "stevej" subtitle. Tab strip: "Photos" (active), "Files", "Links", "Voice". Grid of shared photos in 3-column masonry layout with rounded corners. Each photo has subtle timer badge overlay if ephemeral (e.g. "2d left"). Total count: "23 photos shared". Load more indicator at bottom. Dark canvas background, clean grid.' },
  { id: 'media-v2', emoji: '🖼️', label: 'Media V2 — File List', cat: 'media', prompt: 'TrendUp shared files list view. Dark theme. Header: "Shared Media" with "Files" tab active. File rows: each shows file icon (PDF, DOC, ZIP, etc.), filename truncated, file size "2.4 MB", date shared "May 3, 2026", sender name. Download button on right of each row. Search bar at top for filtering files. Sort options: "Recent", "Size", "Type". Empty state for no files: document icon + "No files shared yet". Dark surface (#242424) cards.' },
  { id: 'media-v3', emoji: '🖼️', label: 'Media V3 — Full Photo Viewer', cat: 'media', prompt: 'TrendUp full-screen photo viewer. Dark/black background (#000000). Photo displayed full width with pinch-to-zoom hint. Top bar (translucent): back arrow, sender "stevej", timestamp "May 5, 2:30 PM". Bottom bar (translucent): timer countdown "Expires in 2d 14h", "Forward" button, "Save" button (if allowed by policy), "Delete" button. Swipe indicators for next/previous. Photo counter "3 of 23". Minimal chrome, immersive viewing.' },
  { id: 'media-v4', emoji: '🖼️', label: 'Media V4 — Links Preview', cat: 'media', prompt: 'TrendUp shared links list. Dark theme. "Links" tab active. Each link shows: Open Graph preview card with thumbnail, title, domain, snippet. Timestamp and sender below. "Open in browser" action button. Links grouped by date: "Today", "This Week", "Earlier". Search bar for filtering links. 5-6 link previews shown. Clean card layout with dark surface (#242424) cards and subtle borders.' },

  // ════════ 16. NOTIFICATIONS CENTER ════════
  { id: 'notif-v1', emoji: '🔔', label: 'Notifications V1 — Activity Feed', cat: 'notifications', prompt: 'TrendUp notifications center screen. Dark theme. Header: "Notifications" with gear icon for settings. Filter chips: "All", "Messages", "Groups", "Security", "System". Notification list: each item has icon (message bubble, group, shield, bell), title bold, description in muted, timestamp right-aligned. Types shown: "stevej sent a message", "Added to Family group", "Safety number changed for amy", "New device approved", "Session expired warning". Unread items have lime dot. Swipe to dismiss hint. Dark charcoal theme.' },
  { id: 'notif-v2', emoji: '🔔', label: 'Notifications V2 — Preferences', cat: 'notifications', prompt: 'TrendUp notification preferences/settings screen. Dark theme. Header: "Notification Settings" with back arrow. Toggle sections in cards: Card 1 "Messages": "New messages" ON, "Message reactions" ON, "Read receipts" OFF. Card 2 "Groups": "Group messages" ON, "Group invites" ON, "@mentions only" OFF. Card 3 "Security": "Safety number changes" ON (forced, cannot disable), "New device login" ON (forced), "Session warnings" ON. Card 4 "Sounds": "In-app sounds" ON, "Vibration" ON. Each toggle with description. Dark surface cards.' },
  { id: 'notif-v3', emoji: '🔔', label: 'Notifications V3 — Security Alerts', cat: 'notifications', prompt: 'TrendUp security-focused notifications screen. Dark theme. "Security" filter active (red tint). Alert items with priority styling: HIGH (red border): "Safety number changed for stevej — verify identity", MEDIUM (amber border): "New device logged in from Chrome on Windows", LOW (blue border): "Encryption keys rotated successfully". Each alert has timestamp, "View Details" button, and dismiss option. "Mark all as read" at top. Professional security alert feed.' },

  // ════════ 17. REGISTRATION / SIGN UP ════════
  { id: 'register-v1', emoji: '📝', label: 'Register V1 — Step 1 Identity', cat: 'onboard', prompt: 'TrendUp registration screen step 1. Light theme with pattern background. "TrendUp" logo at top, "Create your account" heading. Step indicator: "1 of 3" with progress dots. Fields: "Choose a handle" input with @ prefix and availability check (green checkmark or red X), "Display name" input, "Password" input with strength meter (weak/medium/strong bar), "Confirm password" input. Password requirements list: 8+ chars, uppercase, number, special char. "Next" red button. "Already have an account? Sign in" link. Clean registration form.' },
  { id: 'register-v2', emoji: '📝', label: 'Register V2 — Step 2 Security', cat: 'onboard', prompt: 'TrendUp registration step 2 security setup. Light theme. Step indicator "2 of 3". "Set up security" heading. Options with radio selection: "Create a recovery phrase" (recommended, green badge) — 12-word mnemonic, "Connect wallet for recovery" — wallet icon, "Skip for now" (not recommended, amber warning). If recovery phrase selected: grid of 12 numbered words displayed, "Copy to clipboard" button, warning: "Save these words securely. You cannot recover your account without them." "Back" outline and "Next" red button.' },
  { id: 'register-v3', emoji: '📝', label: 'Register V3 — Step 3 Complete', cat: 'onboard', prompt: 'TrendUp registration step 3 completion. Light theme. Step indicator "3 of 3" all green. Large green shield with checkmark animation. "You\'re all set!" heading. Checklist with green checks: "Account created", "Encryption keys generated", "Device bound". "Your messages are now end-to-end encrypted" description. "Start Messaging" red button prominent. "Invite friends" outline button below. Confetti/celebration subtle background animation placeholder. Welcome completion screen.' },

  // ════════ 18. FORGOT PASSWORD / RECOVERY ════════
  { id: 'recovery-v1', emoji: '🔓', label: 'Recovery V1 — Enter Handle', cat: 'onboard', prompt: 'TrendUp forgot password / account recovery screen. Light theme with pattern background. "TrendUp" logo at top. "Account Recovery" heading. Shield icon with question mark. "Enter your handle to begin recovery" instruction. Handle input field with @ prefix. "Continue" red button. "Or recover with wallet" text link below — connects to wallet-based recovery. "Remember your password? Sign in" link at bottom. Clean, security-focused recovery entry point.' },
  { id: 'recovery-v2', emoji: '🔓', label: 'Recovery V2 — Recovery Phrase', cat: 'onboard', prompt: 'TrendUp recovery using mnemonic phrase. Light theme. "Enter Recovery Phrase" heading. Grid of 12 numbered input fields (3 columns × 4 rows) for entering recovery words. Each field numbered 1-12. "Paste all words" button to auto-fill from clipboard. Warning banner: "Make sure no one can see your screen while entering your recovery phrase." "Recover Account" red button. "Use wallet recovery instead" text link. Progress indicator showing step 2 of recovery flow.' },
  { id: 'recovery-v3', emoji: '🔓', label: 'Recovery V3 — Reset Password', cat: 'onboard', prompt: 'TrendUp set new password after recovery verification. Light theme. "Set New Password" heading. Green checkmark: "Identity verified" confirmation. "New password" input with strength meter, "Confirm new password" input. Password requirements checklist below. "All existing sessions will be signed out" warning note. "Reset Password" red button. Professional password reset completion screen.' },

  // ════════ 19. VOICE & VIDEO CALLS ════════
  { id: 'call-v1', emoji: '📞', label: 'Call V1 — Incoming Call', cat: 'calls', prompt: 'TrendUp incoming call screen. Full screen dark gradient background with subtle blur effect. Large avatar circle at center with callers name "stevej" below and @handle. "Incoming encrypted call" text with green lock icon. "E2EE Active" badge. Two large circular buttons at bottom: green "Accept" with phone icon, red "Decline" with phone-down icon. Subtle pulsing ring animation around avatar. Call type indicator: "Voice Call" or "Video Call" icon. Premium calling UI.' },
  { id: 'call-v2', emoji: '📞', label: 'Call V2 — Active Call', cat: 'calls', prompt: 'TrendUp active voice call screen. Dark gradient background. Caller avatar large at center, name "stevej", "Encrypted call" with green lock. Call timer "02:34" prominently displayed. Action buttons row in center: Mute mic (toggle), Speaker (toggle), Video on/off (toggle), Bluetooth/audio output. Red "End Call" large button at bottom. "E2EE" green badge in corner. Signal quality indicator. Minimal, focused active call UI. Dark theme with subtle gradients.' },
  { id: 'call-v3', emoji: '📞', label: 'Call V3 — Video Call', cat: 'calls', prompt: 'TrendUp active video call screen. Full screen showing remote video feed as background. Self-view in small draggable PiP window (top right corner, rounded). Top bar (translucent): back arrow, "stevej", call timer "01:45", E2EE lock icon. Bottom bar (translucent): Mute, Camera flip, Video off, Screen share, More options. Red "End" button centered at very bottom. Minimal chrome over video feed. Professional video calling interface.' },
  { id: 'call-v4', emoji: '📞', label: 'Call V4 — Call History', cat: 'calls', prompt: 'TrendUp call history/log screen. Dark theme. Header: "Calls" with search icon. Filter tabs: "All", "Missed", "Incoming", "Outgoing". Call log list: each row shows avatar, name, call type icon (voice/video), direction arrow (in/out), timestamp "Today 2:30 PM", duration "3m 42s". Missed calls in red text. "i" info button on each row. Empty state if no calls. Floating phone FAB at bottom right for new call. Charcoal dark theme.' },

  // ════════ 20. WALLET MANAGEMENT ════════
  { id: 'wallet-v1', emoji: '💎', label: 'Wallet V1 — Connected Wallet', cat: 'security', prompt: 'TrendUp wallet management screen. Dark theme. Header: "Wallet & Identity" with back arrow. Connected wallet card: wallet icon, truncated address "0x7a3b...4f2e", "Connected" green badge, "Copy" and "View on Etherscan" action links. Wallet actions: "Disconnect Wallet" outline button, "Switch Wallet" outline button. Section "Wallet Login": "Use this wallet to sign in on new devices" toggle ON. Section "Linked Identities": showing @handle linked to wallet. "Security note: Your wallet provides an additional authentication factor." footer text. Dark surface cards.' },
  { id: 'wallet-v2', emoji: '💎', label: 'Wallet V2 — Connect Flow', cat: 'security', prompt: 'TrendUp connect wallet flow screen. Dark theme. "Connect Wallet" heading. Step 1: "Choose method" with two large cards: "Browser Wallet" (MetaMask/injected icon, "Recommended" badge) and "Paste Address" (clipboard icon). If browser wallet selected: "Requesting connection..." loading state with wallet icon animation. If paste selected: large input field for wallet address with QR scan button. "Sign challenge to verify ownership" explanation. "Connect" lime button. Security note at bottom: "TrendUp never has access to your funds." Clean connection flow.' },
  { id: 'wallet-v3', emoji: '💎', label: 'Wallet V3 — Sign Challenge', cat: 'security', prompt: 'TrendUp wallet signature challenge screen. Dark theme. "Verify Wallet" heading. Large signature icon at center. "Sign this message to prove wallet ownership" instruction. Challenge message displayed in monospace code block: "TrendUp Auth Challenge\\nTimestamp: 2026-05-06T09:41:00Z\\nNonce: a7b3c9d2". "Sign with Wallet" lime button (pulses). "This signature does not initiate any transaction or cost gas" reassurance. Loading state after click: "Waiting for signature in wallet..." with spinner. Professional crypto auth UX.' },

  // ════════ 21. SEARCH RESULTS ════════
  { id: 'search-v1', emoji: '🔍', label: 'Search V1 — Global Search', cat: 'inbox', prompt: 'TrendUp global search results screen. Dark theme. Search bar active at top with query text "project update". Results grouped by sections: "Messages" (3 results showing message preview, sender, thread name, timestamp with highlighted matching text), "Contacts" (2 results showing avatar, name, @handle), "Groups" (1 result showing group name and member count). Each section has "See all" link. Recent searches shown when search is empty: clock icon + recent queries. Clear all recent. Charcoal dark theme with lime highlights on matched text.' },
  { id: 'search-v2', emoji: '🔍', label: 'Search V2 — Message Search', cat: 'inbox', prompt: 'TrendUp in-conversation message search. Dark theme. Header: "Search in stevej" with back arrow. Search input active with query. Results as message cards: each shows message text with highlighted matches in lime, sender avatar, timestamp, "Jump to message" button. Results count "8 results found". Navigation arrows to jump between results in chat. Filters: "From me", "From them", "Has media", "Has files". Clean in-chat search experience.' },

  // ════════ 22. INVITE FRIENDS ════════
  { id: 'invite-v1', emoji: '💌', label: 'Invite V1 — Share TrendUp', cat: 'contacts', prompt: 'TrendUp invite friends screen. Dark theme. Header: "Invite Friends" with back arrow. "Grow your secure network" heading with shield + people icon. Personal invite link in copyable field: "trendup.app/invite/shahbazdev". Share buttons row: "Copy Link" (lime), "Share via SMS", "Share via Email", "QR Code". Below: "Contacts on TrendUp" section showing phone contacts already on TrendUp with "Message" button. "Not on TrendUp" section showing contacts that can be invited with "Invite" button. Clean invitation flow.' },
  { id: 'invite-v2', emoji: '💌', label: 'Invite V2 — Invite QR', cat: 'contacts', prompt: 'TrendUp invite via QR code screen. Dark theme. Large QR code centered containing invite link. "Scan to join TrendUp" instruction. Below: "Your personal invite link" with copyable URL. Stats: "3 friends joined via your link". "Share QR Image" lime button to save/share QR as image. Invitation message preview: "Join me on TrendUp — private messaging with end-to-end encryption." Custom message textarea to personalize invite. Clean, focused QR invite screen.' },

  // ════════ 23. DISAPPEARING MESSAGES SETTINGS ════════
  { id: 'disappear-v1', emoji: '⏱️', label: 'Disappearing V1 — Thread Timer', cat: 'chat', prompt: 'TrendUp per-thread disappearing message settings. Dark theme. Header: "Disappearing Messages" with back arrow and "stevej" subtitle. "Messages in this thread" heading. Current setting: "1 day" highlighted. Full timer options grid: "Off", "10s", "1m", "5m", "10m", "1h", "6h", "12h", "1d" (selected with lime border), "1w", "2w", "4w", "6mo", "1y". Burn after read section: "Off" (selected), "1m", "3m", "1h", "1d". Explanation: "New messages will disappear after the selected time." "Apply to this conversation" lime button. Clean timer settings.' },
  { id: 'disappear-v2', emoji: '⏱️', label: 'Disappearing V2 — Global Default', cat: 'settings', prompt: 'TrendUp global default timer settings. Dark theme. Header: "Default Timers" with back arrow. "Set default timers for all new conversations" heading. "Lifetime" section with same timer grid as per-thread but for defaults. "Burn after read" section with options. Current defaults shown with lime highlight. "Override per conversation" toggle ON with explanation. "Apply to existing conversations" toggle OFF with warning: "This will change timer settings for all current threads." "Save Defaults" lime button. Settings-style layout with dark surface cards.' },

  // ════════ 24. SECURE MODE LOCK ════════
  { id: 'securemode-v1', emoji: '🔒', label: 'Secure Mode V1 — Lock Overlay', cat: 'security', prompt: 'TrendUp Secure Mode active lock overlay. Full screen dark overlay (#0A0A0A with 95% opacity) over the chat. Large lock icon centered with subtle pulse animation. "Conversation Locked" heading. "Secure Mode activated — tab lost focus" description. "Enter password to unlock" instruction. Password input field. "Unlock" red button. "Sign out instead" text link at bottom. This overlay appears when Secure Mode is ON and user switches away from the tab. Professional security lock screen.' },
  { id: 'securemode-v2', emoji: '🔒', label: 'Secure Mode V2 — Enable Confirm', cat: 'security', prompt: 'TrendUp Secure Mode enable confirmation dialog. Dark theme. Modal/dialog centered: Shield icon with lock at top. "Enable Secure Mode?" heading. Feature list with icons: "Blocks copy & paste in conversations", "Blocks right-click context menu", "Auto-locks thread when tab loses focus", "Requires password to unlock". Warning: "You\'ll need to enter your password each time you return to this tab." Two buttons: "Enable Secure Mode" (red/filled) and "Cancel" (outline). Background dimmed. Professional security confirmation.' },
];

const PRESET_CATEGORIES = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'onboard', label: 'Onboarding', icon: LogIn },
  { id: 'inbox', label: 'Inbox', icon: Layers },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'groups', label: 'Groups', icon: Users },
  { id: 'contacts', label: 'Contacts', icon: User },
  { id: 'profile', label: 'Profile', icon: Users },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'media', label: 'Media', icon: Film },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'calls', label: 'Calls', icon: Phone },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'edge', label: 'Edge States', icon: AlertCircle },
];

const SUGGESTED_SETS = [
  { name: '🔐 TrendUp Full App', desc: 'All 11 core screens — secure messaging app', pages: ['Landing','Sign In','Session Locked','Securing Device','Secure Inbox','Chat Light','Chat Dark Hub','Hub Inbox Chrome','Groups','Account & Device','Edge States'] },
  { name: '🚀 TrendUp Complete App', desc: 'All 24 screens — full secure messaging experience', pages: ['Landing','Sign In','Registration','Forgot Password','Session Locked','Securing Device','Secure Inbox','Chat Light','Chat Dark Hub','Hub Inbox Chrome','Groups','Contacts','Profile','Safety Number','Media Gallery','Notifications','Voice & Video Calls','Wallet Management','Search Results','Invite Friends','Disappearing Messages','Secure Mode','Account & Device','Edge States'] },
  { name: '📱 Onboarding Flow', desc: 'Landing to first message', pages: ['Landing','Sign In','Registration','Forgot Password','Securing Device','Session Locked','Secure Inbox'] },
  { name: '💬 Chat Experience', desc: 'Inbox + chat + media in both themes', pages: ['Secure Inbox','Hub Inbox Chrome','Chat Light','Chat Dark Hub','Groups','Media Gallery','Disappearing Messages','Search Results'] },
  { name: '🛡️ Security Screens', desc: 'Auth, lock, keys, wallet & secure mode', pages: ['Sign In','Session Locked','Securing Device','Safety Number','Wallet Management','Secure Mode','Account & Device','Edge States'] },
  { name: '🌙 Dark Hub Complete', desc: 'All Hub dark theme screens', pages: ['Hub Inbox Chrome','Chat Dark Hub','Groups','Account & Device','Edge States','Contacts','Notifications','Search Results'] },
  { name: '👥 Social & Contacts', desc: 'Profile, contacts, invite & calls', pages: ['Contacts','Profile','Invite Friends','Voice & Video Calls','Safety Number','Search Results'] },
  { name: '🔒 Privacy & Encryption', desc: 'All privacy and security screens', pages: ['Safety Number','Wallet Management','Secure Mode','Disappearing Messages','Session Locked','Account & Device'] },
  { name: '🛒 E-Commerce App', desc: 'Full shopping experience with cart & checkout', pages: ['Home Feed','Product Detail','Categories','Cart','Checkout','Order Confirmation','My Orders','Wishlist','Search Results','Profile'] },
  { name: '🍔 Food Delivery App', desc: 'Restaurant ordering & delivery tracking', pages: ['Home','Restaurant List','Restaurant Detail','Menu','Cart','Checkout','Order Tracking','Delivery Status','Reviews','Profile'] },
  { name: '📚 Education / LMS App', desc: 'Course learning platform screens', pages: ['Dashboard','Course List','Course Detail','Lesson Player','Quiz','Progress','Certificates','Notes','Discussion','Profile'] },
  { name: '💪 Fitness / Health App', desc: 'Workout tracking & health dashboard', pages: ['Dashboard','Workout Plan','Exercise Detail','Timer','Progress Stats','Nutrition','Meal Log','Activity Feed','Goals','Profile'] },
  { name: '🏦 Banking / Fintech App', desc: 'Digital banking with transfers & cards', pages: ['Dashboard','Accounts','Transfer Money','Transaction History','Cards','Pay Bills','Savings Goals','Notifications','KYC Verification','Settings'] },
  { name: '🎵 Music / Podcast App', desc: 'Audio streaming experience', pages: ['Home','Search','Now Playing','Playlist','Library','Artist Page','Album Detail','Podcast Episode','Queue','Settings'] },
  { name: '✈️ Travel / Booking App', desc: 'Trip planning & hotel booking', pages: ['Home','Search Flights','Flight Results','Hotel List','Hotel Detail','Booking Summary','Payment','Boarding Pass','Trip Itinerary','Profile'] },
  { name: '📸 Social Media App', desc: 'Photo/video sharing social network', pages: ['Feed','Profile','Stories','Create Post','Explore','Notifications','Messages','Comments','Live Stream','Settings'] },
  { name: '🏥 Healthcare App', desc: 'Doctor appointments & health records', pages: ['Home','Find Doctor','Doctor Profile','Book Appointment','Appointments','Medical Records','Prescriptions','Lab Results','Telemedicine','Profile'] },
  { name: '🚗 Ride Sharing App', desc: 'Book rides & track drivers', pages: ['Home Map','Set Destination','Choose Ride','Driver Matching','Trip Active','Trip Complete','Rate Driver','Ride History','Payments','Profile'] },
  { name: '📋 Task / Project App', desc: 'Team productivity & project management', pages: ['Dashboard','Projects','Board View','Task Detail','Calendar','Team Members','Chat','Files','Activity Log','Settings'] },
  { name: '🏠 Real Estate App', desc: 'Property listings & home search', pages: ['Home','Search','Map View','Property Detail','Gallery','Schedule Tour','Saved Properties','Agent Profile','Mortgage Calculator','Messages'] },
  { name: '🎮 Gaming App', desc: 'Game launcher & social gaming', pages: ['Home','Game Store','Game Detail','Library','Achievements','Friends','Leaderboard','Live Events','Settings','Profile'] },
  { name: '📰 News / Blog App', desc: 'Content reading & discovery', pages: ['Home Feed','Article Detail','Categories','Bookmarks','Search','Trending','Author Profile','Comments','Notifications','Settings'] },
  { name: '💼 Job / Recruitment App', desc: 'Job search & application tracking', pages: ['Home','Job Search','Job Detail','Apply','My Applications','Resume Builder','Company Profile','Saved Jobs','Notifications','Profile'] },
];

const THEME_PRESETS = [
  { id: 'trendup-light', name: 'TrendUp Light', primary: '#dc2626', bg: '#FFFFFF', surface: '#F1F5F9', text: '#0F172A', font: 'Inter' },
  { id: 'trendup-dark', name: 'TrendUp Hub Dark', primary: '#dff352', bg: '#181818', surface: '#242424', text: '#F1F5F9', font: 'Inter' },
  { id: 'trendup-red', name: 'TrendUp Red Accent', primary: '#dc2626', bg: '#0F172A', surface: '#1E293B', text: '#F8FAFC', font: 'Inter' },
  { id: 'midnight', name: 'Midnight Blue', primary: '#6366F1', bg: '#0A0A1A', surface: '#12122B', text: '#E0E7FF', font: 'Inter' },
  { id: 'ocean', name: 'Ocean', primary: '#0EA5E9', bg: '#0A1628', surface: '#0F2340', text: '#E0F2FE', font: 'DM Sans' },
  { id: 'neon', name: 'Neon Green', primary: '#10B981', bg: '#020C07', surface: '#041F14', text: '#D1FAE5', font: 'Space Grotesk' },
  { id: 'light', name: 'Clean White', primary: '#6366F1', bg: '#FFFFFF', surface: '#F3F4F6', text: '#1F2937', font: 'Inter' },
  { id: 'charcoal-lime', name: 'Charcoal Lime', primary: '#dff352', bg: '#0F0F0F', surface: '#1A1A1A', text: '#E5E7EB', font: 'Inter' },
  { id: 'purple', name: 'Deep Purple', primary: '#A855F7', bg: '#0D0515', surface: '#1A0E2E', text: '#F3E8FF', font: 'Outfit' },
  { id: 'amoled', name: 'AMOLED Black', primary: '#dc2626', bg: '#000000', surface: '#111111', text: '#FFFFFF', font: 'Inter' },
];

const DEVICES = [
  { id: 'iphone15', name: 'iPhone 15 Pro', w: 393, h: 852, radius: 55, notch: 'island' },
  { id: 'iphone_se', name: 'iPhone SE', w: 375, h: 667, radius: 40, notch: 'none' },
  { id: 'android', name: 'Android', w: 412, h: 915, radius: 30, notch: 'punch' },
  { id: 'ipad', name: 'iPad Mini', w: 744, h: 1133, radius: 24, notch: 'none' },
];

const SCREEN_STATES = [
  { id: 'default', label: 'Default', icon: '📱' },
  { id: 'empty', label: 'Empty State', icon: '📭', prompt: 'Show the EMPTY STATE version: no data, no items, friendly illustration, "Nothing here yet" message with a CTA button.' },
  { id: 'loading', label: 'Loading', icon: '⏳', prompt: 'Show the LOADING/SKELETON version: shimmer/skeleton placeholders for all content areas, subtle pulse animation feel.' },
  { id: 'error', label: 'Error', icon: '❌', prompt: 'Show the ERROR STATE version: error illustration, "Something went wrong" message, Retry button, support link.' },
];

// ─── SYSTEM PROMPT ─────────────────────────────────────────────────
function buildSystemPrompt(brand, allPages, currentPageName, hasLogo, extraContext) {
  const masterPage = allPages.find(p => p.html);
  const referenceCode = masterPage?.html ? `\nMASTER REFERENCE (Follow EXACT style):\n${masterPage.html.substring(0, 2500)}` : '';
  const existingPages = allPages.map(p => p.name).join(', ');
  const defaultTabs = [
    { icon: 'fa-comment', label: 'Messages' }, { icon: 'fa-users', label: 'Groups' },
    { icon: 'fa-address-book', label: 'Contacts' }, { icon: 'fa-gear', label: 'Settings' },
  ];

  return `You are a World-Class Mobile App UI/UX Designer specializing in secure messaging apps.
Generate a COMPLETE production-ready HTML for "${currentPageName}" mobile screen for TrendUp — a private, end-to-end encrypted messaging platform with wallet integration, ephemeral timers, and secure device binding.
${extraContext || ''}
===== MANDATORY LAYOUT (EVERY SCREEN MUST FOLLOW) =====

PART 1 - FIXED TOP HEADER:
<div style="position:fixed;top:0;left:0;right:0;z-index:50;background:${brand.bg || '#0F1419'};border-bottom:1px solid rgba(255,255,255,0.06);">
  <div style="height:44px;display:flex;align-items:center;justify-content:space-between;padding:0 20px;font-size:12px;font-weight:600;color:${brand.text || '#E5E7EB'};">
    <span>9:41</span>
    <div style="display:flex;gap:5px;"><i class="fas fa-signal" style="font-size:12px"></i><i class="fas fa-wifi" style="font-size:12px"></i><i class="fas fa-battery-full" style="font-size:12px"></i></div>
  </div>
  <div style="height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;">
    <div style="display:flex;align-items:center;gap:10px;">
      ${hasLogo ? '<img src="{{APP_LOGO}}" alt="' + brand.name + '" style="height:28px;object-fit:contain;border-radius:6px" />' : ''}
      <span style="font-size:18px;font-weight:800;color:white;">${brand.name}</span>
    </div>
    <div style="display:flex;gap:12px;"><i class="fas fa-bell" style="font-size:18px;color:${brand.text || '#E5E7EB'}80"></i><i class="fas fa-search" style="font-size:18px;color:${brand.text || '#E5E7EB'}80"></i></div>
  </div>
</div>

PART 2 - CONTENT: padding-top:96px; padding-bottom:80px;

PART 3 - FIXED BOTTOM NAV:
<div style="position:fixed;bottom:0;left:0;right:0;z-index:50;background:${brand.bg || '#0F1419'};border-top:1px solid rgba(255,255,255,0.06);height:70px;display:flex;align-items:center;justify-content:space-around;padding-bottom:8px;">
  ${defaultTabs.map((t, i) => `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;"><i class="fas ${t.icon}" style="font-size:20px;color:${i === 0 ? brand.primary : (brand.text || '#E5E7EB') + '50'}"></i><span style="font-size:10px;font-weight:600;color:${i === 0 ? brand.primary : (brand.text || '#E5E7EB') + '50'}">${t.label}</span></div>`).join('\n  ')}
</div>
Highlight tab matching "${currentPageName}" as active (color: ${brand.primary}).
===== END LAYOUT =====

RULES:
- App: ${brand.name} (TrendUp Secure Messaging), Accent: ${brand.primary}, BG: ${brand.bg || '#0F1419'}, Surface: ${brand.surface || '#1A1F2E'}, Text: ${brand.text || '#E5E7EB'}, Font: ${brand.font || 'Inter'}
- Design tokens: Light lane uses red accent (#dc2626), Dark Hub lane uses charcoal (#181818) + lime (#dff352)
- Security-focused UI: E2EE badges, timer countdowns, lock icons, encryption status indicators
- Features: Wallet connect (browser wallet + paste address), ephemeral timers (lifetime + burn-after-read), markdown bubbles, device approval
- Dark theme, rounded corners, soft shadows, glassmorphism
- Pages: ${existingPages}
${hasLogo ? '- Logo via {{APP_LOGO}} placeholder in header.' : ''}
- CDNs: tailwindcss@2 CDN, FontAwesome 6.5, Google Font ${brand.font || 'Inter'}
- body: margin:0; font-family:'${brand.font || 'Inter'}',sans-serif; background:${brand.bg || '#0F1419'}; color:${brand.text || '#E5E7EB'};
- Header + bottom nav IDENTICAL on ALL screens. Only content changes.
${referenceCode}
Output ONLY raw HTML. No markdown. No code blocks.`;
}

// ─── HOOKS ─────────────────────────────────────────────────────────
let toastId = 0;
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = 'info') => {
    const id = ++toastId;
    setToasts(p => [...p, { id, message: msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);
  return { toasts, addToast: add };
}

function useHistory(initial) {
  const [past, setPast] = useState([]);
  const [present, setPresent] = useState(initial);
  const [future, setFuture] = useState([]);
  const set = useCallback((val) => { setPast(p => [...p, present]); setPresent(typeof val === 'function' ? val(present) : val); setFuture([]); }, [present]);
  const undo = useCallback(() => { if (!past.length) return; setFuture(p => [present, ...p]); setPresent(past[past.length - 1]); setPast(p => p.slice(0, -1)); }, [past, present]);
  const redo = useCallback(() => { if (!future.length) return; setPast(p => [...p, present]); setPresent(future[0]); setFuture(p => p.slice(1)); }, [future, present]);
  return { value: present, set, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 };
}

function ToastContainer({ toasts }) {
  if (!toasts.length) return null;
  return (<div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
    {toasts.map(t => (<div key={t.id} className={`px-5 py-3 rounded-2xl text-xs font-bold shadow-2xl backdrop-blur-xl border ${t.type === 'success' ? 'bg-emerald-600/90 border-emerald-500/30 text-white' : t.type === 'error' ? 'bg-red-600/90 border-red-500/30 text-white' : 'bg-slate-800/90 border-white/10 text-slate-200'}`} style={{ animation: 'slideIn 0.3s ease-out' }}>{t.message}</div>))}
  </div>);
}

// ═══════════════════════════════════════════════════════════════════
export default function App() {
  const [brand, setBrand] = useState(() => {
    try { const s = localStorage.getItem('v2ui_brand_v5'); if (s) return JSON.parse(s); } catch {}
    return { name: 'TrendUp', logo: '', primary: '#dc2626', bg: '#0F172A', surface: '#1E293B', text: '#F8FAFC', font: 'Inter' };
  });

  const pagesHistory = useHistory(() => {
    try { const s = localStorage.getItem('v2ui_pages_v5'); if (s) return JSON.parse(s); } catch {}
    return [{ id: '1', name: 'Landing', html: '' }];
  });
  const pages = typeof pagesHistory.value === 'function' ? pagesHistory.value() : pagesHistory.value;

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [inputMode, setInputMode] = useState('prompt');
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [activeTab, setActiveTab] = useState('preview');
  const [previewKey, setPreviewKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeDevice, setActiveDevice] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [presetFilter, setPresetFilter] = useState('all');
  const [showThemes, setShowThemes] = useState(false);
  const [genStats, setGenStats] = useState({ count: 0, lastTime: 0 });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAutoGen, setShowAutoGen] = useState(false);
  const [autoGenRunning, setAutoGenRunning] = useState(false);
  const [autoGenProgress, setAutoGenProgress] = useState({ current: 0, total: 0, currentName: '' });
  const autoGenAbortRef = useRef(false);
  const [logoBase64, setLogoBase64] = useState(() => { try { return localStorage.getItem('v2ui_logo_v5') || ''; } catch { return ''; } });

  // ── NEW ADVANCED STATES ──
  const [showImport, setShowImport] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importHtml, setImportHtml] = useState('');
  const [showAiChat, setShowAiChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [prototypeMode, setPrototypeMode] = useState(false);
  const [protoPageIdx, setProtoPageIdx] = useState(0);
  const [multiDeviceView, setMultiDeviceView] = useState(false);
  const [screenState, setScreenState] = useState('default');
  const [showQuickEdit, setShowQuickEdit] = useState(false);
  const [userApiKey, setUserApiKey] = useState(() => getApiKey());
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const { toasts, addToast } = useToasts();
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const chatEndRef = useRef(null);

  // Persistence
  useEffect(() => { try { localStorage.setItem('v2ui_brand_v5', JSON.stringify(brand)); } catch {} }, [brand]);
  useEffect(() => { try { localStorage.setItem('v2ui_pages_v5', JSON.stringify(pages)); } catch {} }, [pages]);
  useEffect(() => { try { localStorage.setItem('v2ui_logo_v5', logoBase64); } catch {} }, [logoBase64]);

  const currentPage = pages[activePageIndex] || pages[0];
  const device = DEVICES[activeDevice];
  const filteredPresets = useMemo(() => presetFilter === 'all' ? PRESETS : PRESETS.filter(p => p.cat === presetFilter), [presetFilter]);
  const designedCount = pages.filter(p => p.html).length;

  // Smart suggestions: find missing screens
  const smartSuggestions = useMemo(() => {
    const existingNames = new Set(pages.map(p => p.name.toLowerCase().trim()));
    const screenGroups = {};
    PRESETS.forEach(preset => {
      const match = preset.label.match(/^(.+?)\s+V\d/);
      const screenName = match ? match[1].trim() : preset.label;
      if (!screenGroups[screenName]) {
        screenGroups[screenName] = { name: screenName, emoji: preset.emoji, cat: preset.cat, presets: [] };
      }
      screenGroups[screenName].presets.push(preset);
    });
    const missing = [];
    const created = [];
    Object.values(screenGroups).forEach(group => {
      if (existingNames.has(group.name.toLowerCase())) {
        created.push(group);
      } else {
        missing.push(group);
      }
    });
    return { missing, created, total: Object.keys(screenGroups).length };
  }, [pages]);

  // ── Smart Logo Injection ──
  const injectLogo = useCallback((html) => {
    if (!logoBase64 || !html) return html;
    const logoImg = `<img src="${logoBase64}" alt="${brand.name}" style="height:28px;width:28px;object-fit:contain;border-radius:6px;" />`;
    let r = html;
    if (r.includes('{{APP_LOGO}}')) return r.replace(/\{\{APP_LOGO\}\}/g, logoBase64);
    const np = new RegExp(`(>)(\\s*)(${brand.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i');
    if (r.match(np)) return r.replace(np, `$1$2${logoImg}&nbsp;$3`);
    const hm = r.match(/(<(?:header|nav)[^>]*>)/i);
    if (hm) return r.replace(hm[0], `${hm[0]}<div style="display:inline-flex;align-items:center;padding:4px 8px;">${logoImg}</div>`);
    if (r.match(/<body[^>]*>/i)) return r.replace(/(<body[^>]*>)/i, `$1<div style="position:fixed;top:8px;left:12px;z-index:9999;background:rgba(0,0,0,0.5);border-radius:10px;padding:4px 10px;display:flex;align-items:center;gap:6px;backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.1);">${logoImg}<span style="font-size:11px;font-weight:700;color:white;">${brand.name}</span></div>`);
    return `<div style="position:fixed;top:8px;left:12px;z-index:9999;background:rgba(0,0,0,0.5);border-radius:10px;padding:4px 10px;display:flex;align-items:center;gap:6px;backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.1);">${logoImg}<span style="font-size:11px;font-weight:700;color:white;">${brand.name}</span></div>\n` + r;
  }, [logoBase64, brand.name]);

  // ── Handlers ──
  const handleFileUpload = (e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onloadend = () => { setImage(URL.createObjectURL(f)); setBase64Image(r.result.split(',')[1]); addToast('Reference image uploaded', 'success'); }; r.readAsDataURL(f); } };

  const handleLogoUpload = (e) => { const f = e.target.files?.[0]; if (f) { if (f.size > 500000) { addToast('Logo too large. Use under 500KB.', 'error'); return; } const r = new FileReader(); r.onloadend = () => { setLogoBase64(r.result); setBrand(p => ({ ...p, logo: r.result })); addToast('Logo uploaded!', 'success'); }; r.readAsDataURL(f); } };

  const handleAddPage = (e) => { e?.preventDefault(); if (newPageName.trim()) { const n = newPageName.trim().replace(/[^a-zA-Z0-9 ]/g, ''); const variationPages = VARIATION_STYLES.map((vs, j) => ({ id: (Date.now() + j).toString(), name: `${n} ${vs.suffix}`, html: '' })); pagesHistory.set([...pages, ...variationPages]); setActivePageIndex(pages.length); setNewPageName(''); setShowAddPageModal(false); addToast(`"${n}" added with ${VARIATION_STYLES.length} variations`, 'success'); } };

  const addSuggestedSet = (set) => { const expanded = []; set.pages.forEach((n, i) => { const matchingPresets = PRESETS.filter(p => { const base = p.label.replace(/\s+V\d+\s*—.*$/, ''); return base.toLowerCase() === n.toLowerCase() || p.label.toLowerCase().startsWith(n.toLowerCase() + ' v'); }); if (matchingPresets.length > 0) { matchingPresets.forEach((preset, j) => { expanded.push({ id: (Date.now() + i * 10 + j).toString(), name: preset.label, html: '' }); }); } else { VARIATION_STYLES.forEach((vs, j) => { expanded.push({ id: (Date.now() + i * 10 + j).toString(), name: `${n} ${vs.suffix}`, html: '' }); }); } }); pagesHistory.set(expanded); setActivePageIndex(0); setShowSuggestions(false); addToast(`Added ${set.pages.length} screens with ${expanded.length} total variations`, 'success'); };

  const addSuggestedPage = (screenName) => { const exists = pages.some(p => p.name.toLowerCase() === screenName.toLowerCase() || p.name.toLowerCase().startsWith(screenName.toLowerCase() + ' v')); if (exists) { addToast(`"${screenName}" already exists`, 'error'); return; } const variationPages = VARIATION_STYLES.map((vs, j) => ({ id: (Date.now() + j).toString(), name: `${screenName} ${vs.suffix}`, html: '' })); pagesHistory.set([...pages, ...variationPages]); setActivePageIndex(pages.length); addToast(`"${screenName}" added with ${VARIATION_STYLES.length} variations — generate next!`, 'success'); };

  const addAllMissingSuggestions = () => { if (smartSuggestions.missing.length === 0) { addToast('All screens already added!', 'info'); return; } const newPages = []; smartSuggestions.missing.forEach((g, i) => { VARIATION_STYLES.forEach((vs, j) => { newPages.push({ id: (Date.now() + i * 10 + j).toString(), name: `${g.name} ${vs.suffix}`, html: '' }); }); }); pagesHistory.set([...pages, ...newPages]); addToast(`Added ${smartSuggestions.missing.length} screens with ${newPages.length} total variations`, 'success'); };

  const deletePage = (i) => { if (pages.length === 1) { addToast('Cannot delete last screen', 'error'); return; } const n = pages[i].name; pagesHistory.set(pages.filter((_, j) => j !== i)); if (activePageIndex >= i && activePageIndex > 0) setActivePageIndex(p => p - 1); addToast(`"${n}" deleted`, 'info'); };

  const duplicatePage = (i) => { const orig = pages[i]; const dup = { id: Date.now().toString(), name: orig.name + ' Copy', html: orig.html }; const np = [...pages]; np.splice(i + 1, 0, dup); pagesHistory.set(np); setActivePageIndex(i + 1); addToast(`"${orig.name}" duplicated`, 'success'); };

  // ── Core AI Generate ──
  const callAI = async (parts, systemPrompt, retries = 0) => {
    const key = userApiKey || getApiKey();
    const url = key
      ? `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${key}`
      : `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent`;
    const resp = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts }], systemInstruction: { parts: [{ text: systemPrompt }] } }),
    }).catch(err => { throw new Error(`NETWORK_ERROR: ${err.message}`); });
    if (!resp.ok) {
      if (resp.status === 400 || resp.status === 403) {
        if (key) throw new Error('INVALID_KEY');
        throw new Error('AUTH_FAILED');
      }
      if (retries < 4) { const delay = Math.pow(2, retries) * 2000 + Math.random() * 1000; await new Promise(r => setTimeout(r, delay)); return callAI(parts, systemPrompt, retries + 1); }
      throw new Error(`API ${resp.status}`);
    }
    const d = await resp.json();
    return (d.candidates?.[0]?.content?.parts?.[0]?.text || '').replace(/```(html|markdown)?/g, '').replace(/```/g, '').trim();
  };

  const generatePage = async (retryCount = 0) => {
    setIsLoading(true); const t0 = Date.now();
    const stateInfo = screenState !== 'default' ? SCREEN_STATES.find(s => s.id === screenState) : null;
    const extraCtx = stateInfo ? `\nSCREEN STATE: ${stateInfo.prompt}` : '';
    const preset = PRESETS.find(p => p.label === currentPage.name);
    const variationStyle = VARIATION_STYLES.find(vs => currentPage.name.endsWith(vs.suffix));
    const gBaseName = variationStyle ? currentPage.name.replace(` ${variationStyle.suffix}`, '') : currentPage.name;
    const defaultPrompt = preset?.prompt || (variationStyle ? `Design a "${gBaseName}" screen. ${variationStyle.style}` : `Design a beautiful ${currentPage.name} screen.`);
    const parts = [{ text: `Task: Create "${currentPage.name}" screen.\nInstructions: ${prompt || defaultPrompt}${extraCtx}` }];
    if (base64Image && inputMode === 'convert') parts.push({ inlineData: { mimeType: 'image/png', data: base64Image } });
    try {
      let html = await callAI(parts, buildSystemPrompt(brand, pages, currentPage.name, !!logoBase64, extraCtx));
      html = injectLogo(html);
      const upd = [...pages]; upd[activePageIndex] = { ...upd[activePageIndex], html }; pagesHistory.set(upd);
      setPreviewKey(k => k + 1); setActiveTab('preview');
      const s = ((Date.now() - t0) / 1000).toFixed(1); setGenStats(p => ({ count: p.count + 1, lastTime: parseFloat(s) }));
      addToast(`"${currentPage.name}" generated in ${s}s`, 'success');
    } catch (err) {
      if (err.message === 'INVALID_KEY') { addToast('Invalid API key. Check your key at aistudio.google.com', 'error'); setShowApiKeyModal(true); }
      else if (err.message === 'AUTH_FAILED') { addToast('API authentication failed. Add your Gemini API key in Settings.', 'error'); setShowApiKeyModal(true); }
      else if (err.message?.startsWith('NETWORK_ERROR')) { addToast('Network error — check your connection or try refreshing Canvas.', 'error'); }
      else { if (retryCount < 3) { addToast(`Retrying (${retryCount + 1}/3)...`, 'info'); setTimeout(() => generatePage(retryCount + 1), 2000); return; } addToast('Generation failed.', 'error'); }
    }
    finally { setIsLoading(false); }
  };

  const refinePage = async () => {
    if (!currentPage.html) { addToast('Generate first, then refine.', 'error'); return; }
    setIsLoading(true);
    try {
      let html = await callAI([{ text: `Current "${currentPage.name}":\n${currentPage.html}\n\nRefine: ${prompt || 'Make more polished and premium.'}` }], buildSystemPrompt(brand, pages, currentPage.name, !!logoBase64));
      html = injectLogo(html);
      const upd = [...pages]; upd[activePageIndex] = { ...upd[activePageIndex], html }; pagesHistory.set(upd); setPreviewKey(k => k + 1);
      addToast('Refined!', 'success');
    } catch { addToast('Refinement failed.', 'error'); } finally { setIsLoading(false); }
  };

  // ── Auto Generate (with 3-4 variations per page) ──
  const autoGenerateAll = async (set) => {
    const np = [];
    set.pages.forEach((n, i) => {
      const matchingPresets = PRESETS.filter(p => {
        const base = p.label.replace(/\s+V\d+\s*—.*$/, '');
        return base.toLowerCase() === n.toLowerCase() || p.label.toLowerCase().startsWith(n.toLowerCase() + ' v');
      });
      if (matchingPresets.length > 0) {
        matchingPresets.forEach((preset, j) => {
          np.push({ id: (Date.now() + i * 10 + j).toString(), name: preset.label, html: '' });
        });
      } else {
        VARIATION_STYLES.forEach((vs, j) => {
          np.push({ id: (Date.now() + i * 10 + j).toString(), name: `${n} ${vs.suffix}`, html: '' });
        });
      }
    });
    pagesHistory.set(np); setShowAutoGen(false); setShowSuggestions(false);
    setAutoGenRunning(true); autoGenAbortRef.current = false;
    setAutoGenProgress({ current: 0, total: np.length, currentName: np[0].name });
    let up = [...np]; const bs = { ...brand }; const ls = logoBase64;
    for (let i = 0; i < up.length; i++) {
      if (autoGenAbortRef.current) { addToast('Stopped.', 'info'); break; }
      setActivePageIndex(i); setAutoGenProgress({ current: i + 1, total: up.length, currentName: up[i].name });
      let success = false;
      for (let attempt = 0; attempt < 3 && !success; attempt++) {
        try {
          if (attempt > 0) { addToast(`Retrying "${up[i].name}" (${attempt + 1}/3)...`, 'info'); await new Promise(r => setTimeout(r, 3000 * attempt)); }
          const preset = PRESETS.find(p => p.label === up[i].name);
          const variationStyle = VARIATION_STYLES.find(vs => up[i].name.endsWith(vs.suffix));
          const baseName = variationStyle ? up[i].name.replace(` ${variationStyle.suffix}`, '') : up[i].name;
          const promptText = preset?.prompt || (variationStyle ? `Design a "${baseName}" screen. ${variationStyle.style}` : `Design ${up[i].name} screen.`);
          let html = await callAI([{ text: `Task: Create "${up[i].name}" screen.\nInstructions: ${promptText}` }], buildSystemPrompt(bs, up, up[i].name, !!ls));
          html = injectLogo(html);
          up = [...up]; up[i] = { ...up[i], html }; pagesHistory.set(up); setPreviewKey(k => k + 1);
          addToast(`"${up[i].name}" done (${i + 1}/${up.length})`, 'success'); success = true;
        } catch { if (attempt === 2) addToast(`"${up[i].name}" failed after 3 attempts`, 'error'); }
      }
      if (i < up.length - 1) await new Promise(r => setTimeout(r, 3000 + Math.random() * 2000));
    }
    setAutoGenRunning(false); setActivePageIndex(0); setPreviewKey(k => k + 1);
    const done = up.filter(p => p.html).length; const failed = up.length - done;
    addToast(`Done! ${done}/${up.length} screens with variations ready.${failed > 0 ? ` ${failed} failed — use "Retry Failed" to regenerate.` : ''}`, failed > 0 ? 'info' : 'success');
  };

  // ── Generate All Screens with All Variations ──
  const generateAllWithVariations = async () => {
    const np = PRESETS.map((p, i) => ({ id: (Date.now() + i).toString(), name: p.label, html: '' }));
    pagesHistory.set(np); setShowAutoGen(false); setShowSuggestions(false);
    setAutoGenRunning(true); autoGenAbortRef.current = false;
    setAutoGenProgress({ current: 0, total: np.length, currentName: np[0].name });
    let up = [...np]; const bs = { ...brand }; const ls = logoBase64;
    for (let i = 0; i < up.length; i++) {
      if (autoGenAbortRef.current) { addToast('Stopped.', 'info'); break; }
      setActivePageIndex(i); setAutoGenProgress({ current: i + 1, total: up.length, currentName: up[i].name });
      let success = false;
      for (let attempt = 0; attempt < 3 && !success; attempt++) {
        try {
          if (attempt > 0) { addToast(`Retrying "${up[i].name}" (${attempt + 1}/3)...`, 'info'); await new Promise(r => setTimeout(r, 3000 * attempt)); }
          const preset = PRESETS.find(p => p.label === up[i].name);
          let html = await callAI([{ text: `Task: Create "${up[i].name}" screen.\nInstructions: ${preset?.prompt || `Design ${up[i].name} screen.`}` }], buildSystemPrompt(bs, up, up[i].name, !!ls));
          html = injectLogo(html);
          up = [...up]; up[i] = { ...up[i], html }; pagesHistory.set(up); setPreviewKey(k => k + 1);
          addToast(`"${up[i].name}" done (${i + 1}/${up.length})`, 'success'); success = true;
        } catch { if (attempt === 2) addToast(`"${up[i].name}" failed after 3 attempts`, 'error'); }
      }
      if (i < up.length - 1) await new Promise(r => setTimeout(r, 3000 + Math.random() * 2000));
    }
    setAutoGenRunning(false); setActivePageIndex(0); setPreviewKey(k => k + 1);
    const done = up.filter(p => p.html).length; const failed = up.length - done;
    addToast(`Done! ${done}/${up.length} screens with variations ready.${failed > 0 ? ` ${failed} failed — use "Retry Failed" to regenerate.` : ''}`, failed > 0 ? 'info' : 'success');
  };

  // ── Retry Failed (empty) Pages Only ──
  const retryFailedPages = async () => {
    const failedIndices = pages.map((p, i) => (!p.html ? i : -1)).filter(i => i !== -1);
    if (failedIndices.length === 0) { addToast('No failed screens to retry!', 'info'); return; }
    setAutoGenRunning(true); autoGenAbortRef.current = false;
    setAutoGenProgress({ current: 0, total: failedIndices.length, currentName: pages[failedIndices[0]].name });
    let up = [...pages]; const bs = { ...brand }; const ls = logoBase64; let retried = 0;
    for (let idx = 0; idx < failedIndices.length; idx++) {
      const i = failedIndices[idx];
      if (autoGenAbortRef.current) { addToast('Stopped.', 'info'); break; }
      setActivePageIndex(i); setAutoGenProgress({ current: idx + 1, total: failedIndices.length, currentName: up[i].name });
      let success = false;
      for (let attempt = 0; attempt < 3 && !success; attempt++) {
        try {
          if (attempt > 0) await new Promise(r => setTimeout(r, 4000 * attempt));
          const preset = PRESETS.find(p => p.label === up[i].name);
          const variationStyle = VARIATION_STYLES.find(vs => up[i].name.endsWith(vs.suffix));
          const rBaseName = variationStyle ? up[i].name.replace(` ${variationStyle.suffix}`, '') : up[i].name;
          const rPromptText = preset?.prompt || (variationStyle ? `Design a "${rBaseName}" screen. ${variationStyle.style}` : `Design ${up[i].name} screen.`);
          let html = await callAI([{ text: `Task: Create "${up[i].name}" screen.\nInstructions: ${rPromptText}` }], buildSystemPrompt(bs, up, up[i].name, !!ls));
          html = injectLogo(html);
          up = [...up]; up[i] = { ...up[i], html }; pagesHistory.set(up); setPreviewKey(k => k + 1);
          addToast(`"${up[i].name}" recovered! (${idx + 1}/${failedIndices.length})`, 'success'); success = true; retried++;
        } catch { if (attempt === 2) addToast(`"${up[i].name}" still failing`, 'error'); }
      }
      if (idx < failedIndices.length - 1) await new Promise(r => setTimeout(r, 4000 + Math.random() * 2000));
    }
    setAutoGenRunning(false); setActivePageIndex(0); setPreviewKey(k => k + 1);
    addToast(`Retry done! ${retried}/${failedIndices.length} recovered.`, retried > 0 ? 'success' : 'error');
  };

  // ── Regenerate Single Page ──
  const regenerateSinglePage = async (pageIndex) => {
    const page = pages[pageIndex];
    if (!page) return;
    setActivePageIndex(pageIndex); setIsLoading(true);
    try {
      const preset = PRESETS.find(p => p.label === page.name);
      const variationStyle = VARIATION_STYLES.find(vs => page.name.endsWith(vs.suffix));
      const baseName = variationStyle ? page.name.replace(` ${variationStyle.suffix}`, '') : page.name;
      const promptText = preset?.prompt || (variationStyle ? `Design a "${baseName}" screen. ${variationStyle.style}` : `Design ${page.name} screen.`);
      let html = await callAI([{ text: `Task: Create "${page.name}" screen.\nInstructions: ${promptText}` }], buildSystemPrompt(brand, pages, page.name, !!logoBase64));
      html = injectLogo(html);
      const upd = [...pages]; upd[pageIndex] = { ...upd[pageIndex], html }; pagesHistory.set(upd); setPreviewKey(k => k + 1);
      addToast(`"${page.name}" regenerated!`, 'success');
    } catch { addToast(`"${page.name}" regeneration failed.`, 'error'); }
    finally { setIsLoading(false); }
  };

  // ── Batch Regenerate All ──
  const batchRegenerate = async () => {
    setAutoGenRunning(true); autoGenAbortRef.current = false;
    let up = [...pages]; const bs = { ...brand };
    for (let i = 0; i < up.length; i++) {
      if (autoGenAbortRef.current) break;
      setActivePageIndex(i); setAutoGenProgress({ current: i + 1, total: up.length, currentName: up[i].name });
      let success = false;
      for (let attempt = 0; attempt < 3 && !success; attempt++) {
        try {
          if (attempt > 0) await new Promise(r => setTimeout(r, 3000 * attempt));
          const preset = PRESETS.find(p => p.label === up[i].name);
          const bVariationStyle = VARIATION_STYLES.find(vs => up[i].name.endsWith(vs.suffix));
          const bBaseName = bVariationStyle ? up[i].name.replace(` ${bVariationStyle.suffix}`, '') : up[i].name;
          const bPromptText = preset?.prompt || (bVariationStyle ? `Design a "${bBaseName}" screen. ${bVariationStyle.style}` : `Design ${up[i].name} screen.`);
          let html = await callAI([{ text: `Task: Create "${up[i].name}" screen.\nInstructions: ${bPromptText}` }], buildSystemPrompt(bs, up, up[i].name, !!logoBase64));
          html = injectLogo(html);
          up = [...up]; up[i] = { ...up[i], html }; pagesHistory.set(up); setPreviewKey(k => k + 1); success = true;
        } catch {}
      }
      if (i < up.length - 1) await new Promise(r => setTimeout(r, 3000 + Math.random() * 2000));
    }
    setAutoGenRunning(false); addToast('Batch regenerate complete!', 'success');
  };

  // ── AI Chat Refine ──
  const sendChatMessage = async () => {
    if (!chatInput.trim() || !currentPage.html) return;
    const userMsg = chatInput; setChatInput(''); setChatLoading(true);
    setChatMessages(p => [...p, { role: 'user', text: userMsg }]);
    try {
      let html = await callAI([{ text: `Current "${currentPage.name}" HTML:\n${currentPage.html}\n\nUser request: ${userMsg}\n\nApply the requested change and output the COMPLETE updated HTML.` }], buildSystemPrompt(brand, pages, currentPage.name, !!logoBase64));
      html = injectLogo(html);
      const upd = [...pages]; upd[activePageIndex] = { ...upd[activePageIndex], html }; pagesHistory.set(upd); setPreviewKey(k => k + 1);
      setChatMessages(p => [...p, { role: 'ai', text: `Done! Applied: "${userMsg}"` }]);
    } catch { setChatMessages(p => [...p, { role: 'ai', text: 'Failed to apply change. Try again.' }]); }
    finally { setChatLoading(false); }
  };

  // ── Import Features ──
  const importFromUrl = async () => {
    if (!importUrl.trim()) return; setIsLoading(true);
    try {
      let html = await callAI([{ text: `I want to match the design style of this website: ${importUrl}\n\nCreate a "${currentPage.name}" screen that matches that website's visual style, colors, typography, and layout patterns.` }], buildSystemPrompt(brand, pages, currentPage.name, !!logoBase64, `\nSTYLE REFERENCE: Match the design of ${importUrl}`));
      html = injectLogo(html);
      const upd = [...pages]; upd[activePageIndex] = { ...upd[activePageIndex], html }; pagesHistory.set(upd); setPreviewKey(k => k + 1);
      addToast(`Style imported from ${importUrl}`, 'success'); setShowImport(false); setImportUrl('');
    } catch { addToast('Import failed.', 'error'); } finally { setIsLoading(false); }
  };

  const importHtmlCode = () => {
    if (!importHtml.trim()) return;
    const upd = [...pages]; upd[activePageIndex] = { ...upd[activePageIndex], html: injectLogo(importHtml) }; pagesHistory.set(upd);
    setPreviewKey(k => k + 1); setShowImport(false); setImportHtml(''); addToast('HTML imported!', 'success');
  };

  const importPrototypeFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const html = reader.result;
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const iframes = doc.querySelectorAll('iframe[srcdoc]');
        const labels = doc.querySelectorAll('.l');
        if (iframes.length > 0) {
          const imported = [];
          iframes.forEach((iframe, i) => {
            const name = labels[i]?.textContent?.trim() || `Screen ${i + 1}`;
            const srcdoc = iframe.getAttribute('srcdoc') || '';
            imported.push({ id: (Date.now() + i).toString(), name, html: srcdoc });
          });
          pagesHistory.set(imported); setActivePageIndex(0); setPreviewKey(k => k + 1);
          setShowImport(false); addToast(`Imported ${imported.length} screens from prototype!`, 'success');
        } else {
          const upd = [...pages]; upd[activePageIndex] = { ...upd[activePageIndex], html: injectLogo(html) }; pagesHistory.set(upd);
          setPreviewKey(k => k + 1); setShowImport(false); addToast('HTML imported to current screen!', 'success');
        }
      } catch { addToast('Could not parse file.', 'error'); }
    };
    reader.readAsText(f);
  };

  const importColorPalette = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader(); r.onloadend = async () => {
      setIsLoading(true);
      try {
        const result = await callAI([{ text: 'Extract the dominant color palette from this image. Return ONLY a JSON object: {"primary":"#hex","bg":"#hex","surface":"#hex","text":"#hex"}' }, { inlineData: { mimeType: f.type, data: r.result.split(',')[1] } }], 'You are a color extraction expert. Output ONLY valid JSON.');
        const match = result.match(/\{[^}]+\}/);
        if (match) { const c = JSON.parse(match[0]); setBrand(p => ({ ...p, ...c })); addToast('Palette extracted!', 'success'); }
      } catch { addToast('Could not extract palette.', 'error'); } finally { setIsLoading(false); }
    }; r.readAsDataURL(f);
  };

  // ── Quick Edit (live color/font change) ──
  const applyQuickEdit = (key, val) => {
    setBrand(p => ({ ...p, [key]: val }));
    // Re-inject updated brand colors into existing page HTML via CSS variable override
    if (currentPage?.html) {
      const styleOverride = `<style>:root{--brand-primary:${brand.primary};--brand-bg:${brand.bg};--brand-surface:${brand.surface};}</style>`;
      if (!currentPage.html.includes('--brand-primary')) {
        const upd = [...pages]; upd[activePageIndex] = { ...upd[activePageIndex], html: currentPage.html.replace('</head>', styleOverride + '</head>') }; pagesHistory.set(upd);
      }
    }
  };

  // ── Export ──
  const downloadSingle = () => { if (!currentPage.html) return; const b = new Blob([currentPage.html], { type: 'text/html' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = `${currentPage.name.replace(/\s+/g, '_')}.html`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(u); addToast('Downloaded!', 'success'); };

  const downloadAll = () => {
    const h = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${brand.name} Prototype</title><meta name="viewport" content="width=device-width,initial-scale=1"><link href="https://fonts.googleapis.com/css2?family=${(brand.font||'Inter').replace(/\s+/g,'+')}&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'${brand.font||'Inter'}',sans-serif;background:#050507;color:#fff}.h{padding:50px 20px;text-align:center;border-bottom:1px solid #1a1a1e}.g{display:flex;flex-wrap:wrap;gap:50px;padding:50px;justify-content:center}.d{display:flex;flex-direction:column;align-items:center;gap:16px}.l{font-size:11px;font-weight:800;text-transform:uppercase;color:${brand.primary};letter-spacing:3px}.m{width:393px;height:852px;background:#fff;border:10px solid #1a1a1e;border-radius:55px;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,0.6);position:relative}.n{position:absolute;top:10px;left:50%;transform:translateX(-50%);width:126px;height:37px;background:#1a1a1e;border-radius:20px;z-index:10}iframe{width:100%;height:100%;border:none}</style></head><body><div class="h">${logoBase64?`<img src="${logoBase64}" style="height:50px;margin-bottom:16px;object-fit:contain"/>`:''}<h1 style="font-size:36px;font-weight:900">${brand.name}</h1><p style="color:#666;margin-top:8px">${pages.length} Screens Prototype</p></div><div class="g">${pages.filter(p=>p.html).map(p=>`<div class="d"><div class="l">${p.name}</div><div class="m"><div class="n"></div><iframe srcdoc="${p.html.replace(/"/g,'&quot;')}" loading="lazy"></iframe></div></div>`).join('')}</div></body></html>`;
    const b = new Blob([h], { type: 'text/html' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = `${brand.name.replace(/\s+/g,'_')}_Prototype.html`; document.body.appendChild(a); a.click(); document.body.removeChild(a); addToast('Prototype downloaded!', 'success');
  };

  const exportReact = () => {
    const compName = currentPage.name.replace(/\s+/g, '');
    const escaped = (currentPage.html || '').replace(/`/g, String.fromCharCode(92) + '`').replace(/\$/g, String.fromCharCode(92) + '$');
    const code = '// ' + currentPage.name + ' Screen - React Component\nimport React from "react";\n\nexport default function ' + compName + 'Screen() {\n  return (\n    <div dangerouslySetInnerHTML={{ __html: `' + escaped + '` }} />\n  );\n}';
    navigator.clipboard.writeText(code).then(() => addToast('React component copied!', 'success'));
  };

  const copyCode = () => { if (!currentPage?.html) return; navigator.clipboard.writeText(currentPage.html).then(() => { setCopied(true); addToast('Copied!', 'success'); setTimeout(() => setCopied(false), 2000); }); };
  const applyTheme = (t) => { setBrand(p => ({ ...p, primary: t.primary, bg: t.bg, surface: t.surface, text: t.text, font: t.font })); setShowThemes(false); addToast(`"${t.name}" applied`, 'success'); };

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey||e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); pagesHistory.undo(); }
      if ((e.ctrlKey||e.metaKey) && e.key === 'z' && e.shiftKey) { e.preventDefault(); pagesHistory.redo(); }
      if ((e.ctrlKey||e.metaKey) && e.key === 'Enter') { e.preventDefault(); generatePage(); }
      if (e.key === 'Escape') { setIsFullscreen(false); setShowSettings(false); setShowAddPageModal(false); setShowThemes(false); setShowExport(false); setShowSuggestions(false); setShowAutoGen(false); setShowImport(false); setPrototypeMode(false); }
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [pagesHistory]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  // ═════════════════════════════════════════════════════════════════
  // PROTOTYPE MODE
  // ═════════════════════════════════════════════════════════════════
  if (prototypeMode) {
    const pg = pages[protoPageIdx];
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
        <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
          {pages.filter(p => p.html).map((p, i) => (
            <button key={p.id} onClick={() => setProtoPageIdx(pages.indexOf(p))} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${pages.indexOf(p) === protoPageIdx ? 'bg-white/20 text-white border border-white/20' : 'text-white/40 hover:text-white/60'}`}>{p.name}</button>
          ))}
        </div>
        <button onClick={() => setPrototypeMode(false)} className="absolute top-4 right-4 z-50 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold hover:bg-red-500/30">Exit Prototype</button>
        <div style={{ width: 393, height: 852, borderRadius: 55, border: '10px solid #1a1a1e', overflow: 'hidden', boxShadow: '0 60px 120px rgba(0,0,0,0.8)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 126, height: 37, background: '#1a1a1e', borderRadius: 20, zIndex: 10 }} />
          {pg?.html ? <iframe key={protoPageIdx} srcDoc={pg.html} style={{ width: '100%', height: '100%', border: 'none' }} title="Prototype" /> : <div className="w-full h-full bg-black flex items-center justify-center text-slate-500 text-sm">No design</div>}
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          <button disabled={protoPageIdx <= 0} onClick={() => setProtoPageIdx(p => p - 1)} className="px-4 py-2 bg-white/10 rounded-xl text-white text-xs font-bold disabled:opacity-20 hover:bg-white/20">← Previous</button>
          <span className="px-4 py-2 text-white/50 text-xs font-bold">{protoPageIdx + 1} / {pages.length}</span>
          <button disabled={protoPageIdx >= pages.length - 1} onClick={() => setProtoPageIdx(p => p + 1)} className="px-4 py-2 bg-white/10 rounded-xl text-white text-xs font-bold disabled:opacity-20 hover:bg-white/20">Next →</button>
        </div>
        <ToastContainer toasts={toasts} />
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  // FULLSCREEN
  // ═════════════════════════════════════════════════════════════════
  if (isFullscreen && currentPage?.html) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
        <button onClick={() => setIsFullscreen(false)} className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white border border-white/10"><Minimize2 size={20} /></button>
        <div className="absolute top-4 left-4 z-50 flex items-center gap-3">
          {DEVICES.map((d, i) => (<button key={d.id} onClick={() => setActiveDevice(i)} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase ${activeDevice === i ? 'bg-white/20 text-white border border-white/20' : 'text-white/40'}`}>{d.name}</button>))}
        </div>
        <div style={{ width: device.w, height: device.h, borderRadius: device.radius, border: '10px solid #1a1a1e', overflow: 'hidden', boxShadow: '0 60px 120px rgba(0,0,0,0.8)', position: 'relative' }}>
          {device.notch === 'island' && <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 126, height: 37, background: '#1a1a1e', borderRadius: 20, zIndex: 10 }} />}
          <iframe key={previewKey} srcDoc={currentPage.html} style={{ width: '100%', height: '100%', border: 'none' }} title="Fullscreen" />
        </div>
        <ToastContainer toasts={toasts} />
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  // MULTI-DEVICE VIEW
  // ═════════════════════════════════════════════════════════════════
  if (multiDeviceView && currentPage?.html) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#050507] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h2 className="text-white font-bold text-sm flex items-center gap-2"><Columns size={16} style={{ color: brand.primary }} /> Multi-Device: {currentPage.name}</h2>
          <button onClick={() => setMultiDeviceView(false)} className="px-4 py-1.5 bg-white/5 rounded-lg text-xs text-slate-400 font-bold hover:text-white"><X size={14} /></button>
        </div>
        <div className="flex items-start justify-center gap-8 p-8 overflow-x-auto">
          {DEVICES.map(d => (
            <div key={d.id} className="flex flex-col items-center gap-3 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: brand.primary }}>{d.name}</span>
              <div style={{ width: Math.min(d.w * 0.6, 280), height: Math.min(d.h * 0.6, 520), borderRadius: d.radius * 0.6, border: '6px solid #1a1a1e', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', position: 'relative' }}>
                {d.notch === 'island' && <div style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', width: 76, height: 22, background: '#1a1a1e', borderRadius: 12, zIndex: 10 }} />}
                <iframe srcDoc={currentPage.html} style={{ width: d.w, height: d.h, border: 'none', transform: `scale(${Math.min(280/d.w, 520/d.h)})`, transformOrigin: 'top left' }} title={d.name} />
              </div>
            </div>
          ))}
        </div>
        <ToastContainer toasts={toasts} />
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#050507] text-slate-300 flex flex-col font-sans overflow-hidden" style={{ fontFamily: "'Inter',system-ui,sans-serif" }}>
      <ToastContainer toasts={toasts} />

      {/* HEADER */}
      <header className="h-12 border-b border-white/[0.04] bg-black/60 backdrop-blur-2xl flex items-center justify-between px-4 z-40 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg overflow-hidden" style={{ background: `linear-gradient(135deg, ${brand.primary}, ${brand.primary}99)` }}>
            {logoBase64 ? <img src={logoBase64} alt="" className="w-5 h-5 object-contain" /> : <Smartphone size={16} className="text-white" />}
          </div>
          <div>
            <span className="text-white font-black tracking-tight text-sm">TrendUp <span style={{ color: brand.primary }}>Designer</span></span>
            <span className="ml-2 px-1.5 py-0.5 rounded text-[7px] font-black border uppercase tracking-widest" style={{ color: brand.primary, borderColor: brand.primary + '30', background: brand.primary + '10' }}>Pro</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => pagesHistory.undo()} disabled={!pagesHistory.canUndo} className="p-1.5 rounded hover:bg-white/5 text-slate-500 disabled:opacity-20" title="Undo"><Undo2 size={14} /></button>
          <button onClick={() => pagesHistory.redo()} disabled={!pagesHistory.canRedo} className="p-1.5 rounded hover:bg-white/5 text-slate-500 disabled:opacity-20" title="Redo"><Redo2 size={14} /></button>
          <div className="w-px h-4 bg-white/5 mx-0.5" />
          <button onClick={() => setShowImport(true)} className="p-1.5 rounded hover:bg-white/5 text-slate-500" title="Import"><Import size={14} /></button>
          <button onClick={() => setShowSuggestions(true)} className="p-1.5 rounded hover:bg-white/5 text-slate-500" title="Suggestions"><Lightbulb size={14} /></button>
          <button onClick={() => setShowAutoGen(true)} className="p-1.5 rounded hover:bg-white/5 transition-all" style={{ color: autoGenRunning ? brand.primary : undefined }} title="Auto Generate"><Rocket size={14} className={autoGenRunning ? 'animate-pulse' : ''} /></button>
          <button onClick={() => setShowThemes(true)} className="p-1.5 rounded hover:bg-white/5 text-slate-500" title="Themes"><Palette size={14} /></button>
          <button onClick={() => setPrototypeMode(true)} className="p-1.5 rounded hover:bg-white/5 text-slate-500" title="Prototype Mode"><MousePointer size={14} /></button>
          <button onClick={() => setMultiDeviceView(true)} className="p-1.5 rounded hover:bg-white/5 text-slate-500" title="Multi-Device"><Columns size={14} /></button>
          <button onClick={() => setShowQuickEdit(!showQuickEdit)} className="p-1.5 rounded hover:bg-white/5 text-slate-500" title="Quick Edit"><Paintbrush size={14} /></button>
          <button onClick={() => setShowExport(true)} className="p-1.5 rounded hover:bg-white/5 text-slate-500" title="Export"><Download size={14} /></button>
          <button onClick={copyCode} className={`px-3 py-1 rounded text-[9px] font-bold flex items-center gap-1 ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-400'}`}>
            {copied ? <Check size={10} /> : <Copy size={10} />} {copied ? 'Copied!' : 'Copy'}
          </button>
          {!userApiKey && <button onClick={() => setShowApiKeyModal(true)} className="px-2 py-1 rounded text-[9px] font-bold bg-white/5 text-slate-400 border border-white/5 flex items-center gap-1 hover:bg-white/10" title="Optional: Add API key for non-Canvas environments"><Cpu size={10} /> API Key</button>}
          <button onClick={() => setShowSettings(true)} className="p-1.5 rounded hover:bg-white/5 text-slate-500"><Settings size={14} /></button>
        </div>
      </header>

      {/* Quick Edit Bar */}
      {showQuickEdit && (
        <div className="h-10 bg-black/40 border-b border-white/5 flex items-center gap-4 px-4 shrink-0">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Quick Edit:</span>
          <div className="flex items-center gap-1.5"><span className="text-[9px] text-slate-600">Primary</span><input type="color" value={brand.primary} onChange={e => setBrand(p=>({...p,primary:e.target.value}))} className="w-6 h-6 rounded cursor-pointer border-0" /></div>
          <div className="flex items-center gap-1.5"><span className="text-[9px] text-slate-600">BG</span><input type="color" value={brand.bg||'#0F1419'} onChange={e => setBrand(p=>({...p,bg:e.target.value}))} className="w-6 h-6 rounded cursor-pointer border-0" /></div>
          <div className="flex items-center gap-1.5"><span className="text-[9px] text-slate-600">Surface</span><input type="color" value={brand.surface||'#1A1F2E'} onChange={e => setBrand(p=>({...p,surface:e.target.value}))} className="w-6 h-6 rounded cursor-pointer border-0" /></div>
          <div className="flex items-center gap-1.5"><span className="text-[9px] text-slate-600">Font</span>
            <select value={brand.font||'Inter'} onChange={e => setBrand(p=>({...p,font:e.target.value}))} className="bg-white/5 border border-white/5 rounded px-2 py-0.5 text-[9px] text-white outline-none">
              {['Inter','Plus Jakarta Sans','Outfit','Montserrat','DM Sans','Space Grotesk','Poppins'].map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          {pages.some(p => !p.html) && <button onClick={retryFailedPages} disabled={autoGenRunning} className="ml-auto px-3 py-1 rounded text-[9px] font-bold flex items-center gap-1 disabled:opacity-30 text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20"><RefreshCw size={10} /> Retry Failed ({pages.filter(p => !p.html).length})</button>}
          <button onClick={batchRegenerate} disabled={autoGenRunning || designedCount === 0} className="ml-auto px-3 py-1 rounded text-[9px] font-bold flex items-center gap-1 disabled:opacity-30 text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20"><RotateCw size={10} /> Batch Regen All</button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className={`${sidebarCollapsed ? 'w-14' : 'w-56'} bg-[#0a0a0c] border-r border-white/5 flex flex-col shrink-0 transition-all duration-200`}>
          <div className="p-2.5 border-b border-white/5 flex items-center justify-between">
            {!sidebarCollapsed && <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest flex items-center gap-1"><Files size={9} /> {pages.length} Screens</span>}
            <div className="flex gap-0.5">
              {!sidebarCollapsed && <button onClick={() => setShowAddPageModal(true)} className="w-6 h-6 flex items-center justify-center rounded text-white text-xs" style={{ background: brand.primary }}><Plus size={12} /></button>}
              <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 text-slate-600"><ChevronRight size={12} className={`transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-1.5 flex flex-col gap-px" style={{ scrollbarWidth: 'thin' }}>
            {pages.map((p, i) => (
              <div key={p.id} className="group relative">
                <button onClick={() => { setActivePageIndex(i); setPreviewKey(k => k + 1); }}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-1' : 'justify-between px-2.5'} py-2 rounded text-[10px] font-semibold transition-all text-left
                    ${activePageIndex === i ? 'text-white' : 'text-slate-500 hover:bg-white/5'}`}
                  style={activePageIndex === i ? { background: brand.primary + '15', border: `1px solid ${brand.primary}30` } : { border: '1px solid transparent' }} title={p.name}>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${p.html ? '' : 'bg-slate-700'}`} style={p.html ? { background: brand.primary, boxShadow: `0 0 6px ${brand.primary}60` } : {}} />
                    {!sidebarCollapsed && <span className="truncate">{p.name}</span>}
                  </div>
                </button>
                {!sidebarCollapsed && (
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex items-center gap-px">
                    <button onClick={(e) => { e.stopPropagation(); regenerateSinglePage(i); }} className="p-0.5 text-slate-600 hover:text-amber-400" title="Regenerate this variation"><RefreshCw size={9} /></button>
                    <button onClick={() => duplicatePage(i)} className="p-0.5 text-slate-600 hover:text-blue-400" title="Duplicate"><CopyPlus size={9} /></button>
                    {pages.length > 1 && <button onClick={() => deletePage(i)} className="p-0.5 text-slate-600 hover:text-red-400" title="Delete"><Trash2 size={9} /></button>}
                  </div>
                )}
              </div>
            ))}
          </div>
          {!sidebarCollapsed && (
            <div className="p-2.5 bg-black/40 border-t border-white/5">
              <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1.5"><Upload size={8} className="inline mr-1" />Logo</div>
              <button onClick={() => logoInputRef.current?.click()} className="w-full flex items-center gap-2 p-1.5 rounded bg-white/5 hover:bg-white/8 border border-white/5 transition-all">
                <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                {logoBase64 ? (<><img src={logoBase64} alt="" className="w-7 h-7 object-contain rounded bg-white/10 p-0.5" /><div className="min-w-0"><p className="text-[9px] font-bold text-slate-300">Logo ready</p><p className="text-[7px] text-slate-600">On all screens</p></div></>) :
                (<><div className="w-7 h-7 rounded bg-white/5 flex items-center justify-center text-slate-600"><ImageIcon size={12} /></div><p className="text-[9px] text-slate-500">Upload logo</p></>)}
              </button>
            </div>
          )}
        </aside>

        {/* MAIN WORKSPACE */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Toolbar */}
          <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 bg-black/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex bg-white/5 p-0.5 rounded border border-white/5">
                <button onClick={() => setActiveTab('preview')} className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase flex items-center gap-1 ${activeTab === 'preview' ? 'bg-white/10 text-white' : 'text-slate-500'}`}><Eye size={10} /> Preview</button>
                <button onClick={() => setActiveTab('code')} className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase flex items-center gap-1 ${activeTab === 'code' ? 'bg-white/10 text-white' : 'text-slate-500'}`}><Code2 size={10} /> Code</button>
              </div>
              <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1"><Smartphone size={11} style={{ color: brand.primary }} /> {currentPage?.name}</span>
              {/* Screen State Selector */}
              <select value={screenState} onChange={e => setScreenState(e.target.value)} className="bg-white/5 border border-white/5 rounded px-2 py-0.5 text-[9px] text-slate-400 outline-none">
                {SCREEN_STATES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex bg-white/5 p-0.5 rounded border border-white/5">
                {DEVICES.map((d, i) => (<button key={d.id} onClick={() => setActiveDevice(i)} className={`p-1 rounded ${activeDevice === i ? 'bg-white/10 text-white' : 'text-slate-600'}`} title={d.name}>
                  {d.id === 'ipad' ? <Tablet size={10} /> : d.id === 'android' ? <Monitor size={10} /> : <Smartphone size={10} />}
                </button>))}
              </div>
              {currentPage?.html && (
                <>
                  <button onClick={() => regenerateSinglePage(activePageIndex)} disabled={isLoading} className="px-2 py-0.5 rounded hover:bg-amber-500/10 text-amber-400/70 hover:text-amber-400 text-[9px] font-bold flex items-center gap-1 disabled:opacity-30"><RefreshCw size={10} /> Regen</button>
                  <button onClick={() => setIsFullscreen(true)} className="p-1 rounded hover:bg-white/5 text-slate-500"><Maximize2 size={12} /></button>
                </>
              )}
              <button onClick={() => setShowAiChat(!showAiChat)} className={`p-1 rounded hover:bg-white/5 transition-all ${showAiChat ? 'text-white' : 'text-slate-500'}`} style={showAiChat ? { color: brand.primary } : {}} title="AI Chat"><MessageSquare size={12} /></button>
              {genStats.count > 0 && <span className="text-[8px] text-slate-600 font-bold">{genStats.count}gen</span>}
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Preview/Code */}
            <div className="flex-1 relative flex items-center justify-center p-5 bg-[#08080a] overflow-hidden">
              {isLoading && (
                <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center backdrop-blur-md">
                  <div className="relative"><div className="w-14 h-14 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: brand.primary }} /><Wand2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size={18} style={{ color: brand.primary }} /></div>
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white mt-4 animate-pulse">Generating...</span>
                </div>
              )}
              {activeTab === 'code' ? (
                <div className="w-full h-full bg-[#0a0a0c] rounded-xl overflow-auto border border-white/5">
                  <div className="sticky top-0 bg-[#0a0a0c] border-b border-white/5 px-3 py-1.5 flex items-center justify-between z-10">
                    <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1"><FileCode size={10} /> {currentPage?.name}.html</span>
                    <span className="text-[8px] text-slate-700">{currentPage?.html ? `${currentPage.html.length.toLocaleString()} chars` : 'Empty'}</span>
                  </div>
                  <pre className="p-4 font-mono text-[10px] leading-relaxed whitespace-pre-wrap" style={{ color: brand.primary + 'cc' }}>
                    {currentPage?.html ? currentPage.html.split('\n').map((l, i) => (<div key={i} className="flex"><span className="inline-block w-8 text-right pr-3 text-slate-700 select-none shrink-0 text-[9px]">{i+1}</span><span className="flex-1">{l||' '}</span></div>)) : <span className="text-slate-700 italic">Generate a design first.</span>}
                  </pre>
                </div>
              ) : (
                <div className="transition-all duration-500 relative overflow-hidden bg-white" style={{ width: Math.min(device.w, 420), height: Math.min(device.h, 620), borderRadius: device.radius, border: '8px solid #1a1a1e', boxShadow: `0 30px 60px rgba(0,0,0,0.7)` }}>
                  {device.notch === 'island' && <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[90px] h-[24px] bg-[#1a1a1e] rounded-[12px] z-50" />}
                  {device.notch === 'punch' && <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#1a1a1e] rounded-full z-50" />}
                  {currentPage?.html ? (
                    <iframe key={`${previewKey}-${activePageIndex}-${activeDevice}`} srcDoc={currentPage.html} className="w-full h-full border-none" title="Preview" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8" style={{ background: brand.bg }}>
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: brand.primary + '15' }}>
                        {logoBase64 ? <img src={logoBase64} alt="" className="w-8 h-8 object-contain" /> : <Smartphone size={24} style={{ color: brand.primary + '60' }} />}
                      </div>
                      <h3 className="text-sm font-black text-white">Empty Canvas</h3>
                      <p className="text-[9px] mt-1.5 max-w-[180px]" style={{ color: brand.text + '60' }}>Describe "{currentPage?.name}" or pick a preset</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AI Chat Panel */}
            {showAiChat && (
              <div className="w-72 border-l border-white/5 bg-[#0a0a0c] flex flex-col shrink-0">
                <div className="p-3 border-b border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5"><MessageSquare size={12} style={{ color: brand.primary }} /> AI Chat</span>
                  <button onClick={() => setShowAiChat(false)} className="text-slate-600 hover:text-white"><X size={14} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ scrollbarWidth: 'thin' }}>
                  {chatMessages.length === 0 && <p className="text-[10px] text-slate-600 text-center mt-8">Chat with AI to refine your design.<br/><br/>Try: "Make the header bigger", "Change buttons to rounded", "Add more spacing"</p>}
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`px-3 py-2 rounded-xl text-[10px] ${m.role === 'user' ? 'ml-4 text-white' : 'mr-4 text-slate-300'}`}
                      style={m.role === 'user' ? { background: brand.primary + '20', border: `1px solid ${brand.primary}30` } : { background: 'rgba(255,255,255,0.05)' }}>
                      {m.text}
                    </div>
                  ))}
                  {chatLoading && <div className="flex items-center gap-2 px-3 py-2"><Loader2 size={12} className="animate-spin" style={{ color: brand.primary }} /><span className="text-[10px] text-slate-500">Applying...</span></div>}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-2.5 border-t border-white/5">
                  <div className="flex gap-1.5">
                    <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                      placeholder={currentPage?.html ? "e.g. Make header green..." : "Generate a design first"}
                      disabled={!currentPage?.html || chatLoading}
                      className="flex-1 bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] text-white outline-none placeholder:text-slate-700 disabled:opacity-30" />
                    <button onClick={sendChatMessage} disabled={!currentPage?.html || chatLoading || !chatInput.trim()} className="p-1.5 rounded-lg disabled:opacity-30" style={{ background: brand.primary, color: 'white' }}><Send size={12} /></button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BUILDER CONTROLS */}
          <div className="p-3 bg-black/40 border-t border-white/5 shrink-0">
            <div className="max-w-4xl mx-auto flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5">
                <div className="flex p-0.5 bg-white/5 rounded border border-white/5 shrink-0">
                  <button onClick={() => setInputMode('prompt')} className={`px-2.5 py-0.5 rounded text-[8px] font-bold uppercase ${inputMode === 'prompt' ? 'text-white' : 'text-slate-500'}`} style={inputMode === 'prompt' ? { background: brand.primary } : {}}>Prompt</button>
                  <button onClick={() => setInputMode('convert')} className={`px-2.5 py-0.5 rounded text-[8px] font-bold uppercase ${inputMode === 'convert' ? 'text-white' : 'text-slate-500'}`} style={inputMode === 'convert' ? { background: brand.primary } : {}}>Vision</button>
                </div>
                <div className="h-3 w-px bg-white/5" />
                <div className="flex gap-0.5 shrink-0">
                  {PRESET_CATEGORIES.map(c => { const I = c.icon; return (<button key={c.id} onClick={() => setPresetFilter(c.id)} className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase flex items-center gap-0.5 ${presetFilter === c.id ? 'text-white bg-white/10' : 'text-slate-600'}`}><I size={9} /> {c.label}</button>); })}
                </div>
                <div className="h-3 w-px bg-white/5" />
                <div className="flex gap-1 overflow-x-auto flex-1" style={{ scrollbarWidth: 'none' }}>
                  {filteredPresets.map(p => (<button key={p.id} onClick={() => setPrompt(p.prompt)} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[8px] font-bold text-slate-500 hover:text-white transition-all whitespace-nowrap shrink-0">{p.emoji} {p.label}</button>))}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                {inputMode === 'convert' && (
                  <button onClick={() => fileInputRef.current?.click()} className={`w-10 h-10 shrink-0 rounded-lg border-2 border-dashed flex items-center justify-center ${image ? 'border-emerald-500/50' : 'border-white/10'}`}>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                    {image ? <img src={image} className="w-7 h-7 object-contain rounded" alt="" /> : <ImageIcon size={16} className="text-slate-600" />}
                  </button>
                )}
                <div className="flex-1 relative">
                  <input value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); generatePage(); } }}
                    className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-4 pr-[180px] text-xs text-white outline-none placeholder:text-slate-700"
                    placeholder={`Describe "${currentPage?.name}" screen...`} />
                  <div className="absolute right-1 top-1 flex gap-1">
                    {currentPage?.html && <button onClick={refinePage} disabled={isLoading} className="h-8 px-3 rounded text-[9px] font-bold flex items-center gap-1 bg-white/5 text-slate-400 hover:text-white disabled:opacity-30 border border-white/5"><Sparkles size={10} /> Refine</button>}
                    <button onClick={() => generatePage()} disabled={isLoading} className="h-8 px-4 rounded text-[9px] font-bold text-white flex items-center gap-1 disabled:opacity-40 shadow-lg" style={{ background: `linear-gradient(135deg, ${brand.primary}, ${brand.primary}cc)` }}>
                      {isLoading ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} fill="white" />} Generate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ MODALS ══════ */}

      {/* Add Screen */}
      {showAddPageModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 backdrop-blur-xl"><div className="absolute inset-0 bg-black/70" onClick={() => setShowAddPageModal(false)} />
          <form onSubmit={handleAddPage} className="w-[400px] bg-[#0d0d12] border border-white/10 rounded-2xl p-6 relative z-10">
            <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2"><Plus size={18} style={{ color: brand.primary }} /> New Screen</h2>
            <input autoFocus type="text" value={newPageName} onChange={e => setNewPageName(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-lg p-3 text-white text-sm outline-none mb-3" placeholder="Screen name..." />
            <div className="flex flex-wrap gap-1 mb-4">
              {['Landing','Sign In','Session Locked','Securing Device','Secure Inbox','Chat Light','Chat Dark Hub','Hub Inbox Chrome','Groups','Account & Device','Edge States'].map(n => (
                <button key={n} type="button" onClick={() => setNewPageName(n)} className="px-2 py-0.5 bg-white/5 rounded text-[8px] font-bold text-slate-500 hover:text-white">{n}</button>))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowAddPageModal(false)} className="flex-1 py-2.5 bg-white/5 rounded-lg text-slate-400 font-bold text-xs">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 rounded-lg text-white font-bold text-xs" style={{ background: brand.primary }}>Add</button>
            </div>
          </form>
        </div>
      )}

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 backdrop-blur-xl"><div className="absolute inset-0 bg-black/80" onClick={() => setShowImport(false)} />
          <div className="w-[500px] bg-[#0d0d12] border border-white/10 rounded-2xl p-6 relative z-10 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-black text-white flex items-center gap-2"><Import size={18} style={{ color: brand.primary }} /> Import</h2><button onClick={() => setShowImport(false)} className="text-slate-500 hover:text-white"><X size={16} /></button></div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-amber-500/20">
                <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5"><Upload size={12} style={{ color: brand.primary }} /> Import Prototype File</h3>
                <p className="text-[9px] text-slate-500 mb-2">Upload a previously exported prototype HTML — all screens will be restored</p>
                <label className="px-4 py-2 rounded-lg text-xs font-bold text-white cursor-pointer inline-flex items-center gap-2" style={{ background: brand.primary }}>
                  <input type="file" className="hidden" accept=".html,.htm" onChange={importPrototypeFile} /> <FolderOpen size={12} /> Choose HTML File
                </label>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5"><Code2 size={12} style={{ color: brand.primary }} /> Import HTML Code</h3>
                <p className="text-[9px] text-slate-500 mb-2">Paste HTML code directly into the current screen</p>
                <textarea value={importHtml} onChange={e => setImportHtml(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-white outline-none h-24 font-mono resize-none" placeholder="<html>..." />
                <button onClick={importHtmlCode} disabled={!importHtml.trim()} className="mt-2 px-4 py-2 rounded-lg text-xs font-bold text-white disabled:opacity-30" style={{ background: brand.primary }}>Import HTML</button>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5"><Link size={12} style={{ color: brand.primary }} /> Import Style from URL</h3>
                <p className="text-[9px] text-slate-500 mb-2">Paste any website URL - AI will match its design style</p>
                <div className="flex gap-2">
                  <input value={importUrl} onChange={e => setImportUrl(e.target.value)} className="flex-1 bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-white outline-none" placeholder="https://example.com" />
                  <button onClick={importFromUrl} disabled={isLoading || !importUrl.trim()} className="px-4 py-2 rounded-lg text-xs font-bold text-white disabled:opacity-30" style={{ background: brand.primary }}>Import</button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5"><Palette size={12} style={{ color: brand.primary }} /> Extract Color Palette from Image</h3>
                <p className="text-[9px] text-slate-500 mb-2">Upload any image - AI will extract its color palette</p>
                <label className="px-4 py-2 rounded-lg text-xs font-bold text-white cursor-pointer inline-block" style={{ background: brand.primary }}>
                  <input type="file" className="hidden" accept="image/*" onChange={importColorPalette} /> Choose Image
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {showSuggestions && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 backdrop-blur-xl"><div className="absolute inset-0 bg-black/80" onClick={() => setShowSuggestions(false)} />
          <div className="w-[560px] bg-[#0d0d12] border border-white/10 rounded-2xl p-6 relative z-10 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-black text-white flex items-center gap-2"><Lightbulb size={18} style={{ color: brand.primary }} /> Suggestions</h2><button onClick={() => setShowSuggestions(false)} className="text-slate-500 hover:text-white"><X size={16} /></button></div>

            {/* Smart Next Suggestions */}
            <div className="mb-5 p-4 rounded-xl border-2 border-dashed" style={{ borderColor: brand.primary + '40', background: brand.primary + '08' }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-black text-white flex items-center gap-2"><Sparkles size={14} style={{ color: brand.primary }} /> Next Pages to Create</h3>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ color: brand.primary, background: brand.primary + '15' }}>{smartSuggestions.created.length}/{smartSuggestions.total} done</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 mb-3 overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${(smartSuggestions.created.length/smartSuggestions.total)*100}%`, background: brand.primary }} /></div>
              {smartSuggestions.missing.length > 0 ? (
                <>
                  <p className="text-[9px] text-slate-400 mb-2.5">{smartSuggestions.missing.length} screens not yet in your project — click to add:</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {smartSuggestions.missing.map(g => (
                      <button key={g.name} onClick={() => addSuggestedPage(g.name)} className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-white/20 text-left transition-all hover:bg-white/10 group flex items-center gap-1.5">
                        <span className="text-xs">{g.emoji}</span>
                        <span className="text-[10px] font-bold text-slate-300 group-hover:text-white">{g.name}</span>
                        <span className="text-[8px] text-slate-600">{g.presets.length}v</span>
                        <Plus size={10} className="text-slate-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                  <button onClick={addAllMissingSuggestions} className="w-full py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all hover:opacity-90" style={{ background: brand.primary, color: brand.bg || '#000' }}>
                    <CopyPlus size={12} /> Add All {smartSuggestions.missing.length} Missing Screens
                  </button>
                </>
              ) : (
                <div className="text-center py-2">
                  <p className="text-[10px] font-bold text-emerald-400 flex items-center justify-center gap-1.5"><Check size={12} /> All {smartSuggestions.total} screens added!</p>
                  <p className="text-[8px] text-slate-500 mt-1">Use Auto Generate to create designs with 3-4 variations per screen</p>
                </div>
              )}
            </div>

            {/* Already Created */}
            {smartSuggestions.created.length > 0 && (
              <div className="mb-5">
                <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mb-2">Already in your project ({smartSuggestions.created.length})</p>
                <div className="flex flex-wrap gap-1">{smartSuggestions.created.map(g => (
                  <span key={g.name} className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 flex items-center gap-1"><Check size={8} /> {g.emoji} {g.name}</span>
                ))}</div>
              </div>
            )}

            {/* App Templates */}
            <div className="border-t border-white/5 pt-4">
              <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mb-2">App Templates ({SUGGESTED_SETS.length})</p>
              <p className="text-[9px] text-slate-500 mb-3">Click to load a full template — replaces current screens</p>
              <div className="space-y-2.5">{SUGGESTED_SETS.map((s, i) => (
                <button key={i} onClick={() => addSuggestedSet(s)} className="w-full p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 text-left transition-colors">
                  <div className="flex items-center justify-between mb-1"><h3 className="text-sm font-bold text-white">{s.name}</h3><span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ color: brand.primary, background: brand.primary + '15' }}>{s.pages.length} screens</span></div>
                  <p className="text-[9px] text-slate-500 mb-1.5">{s.desc}</p>
                  <div className="flex flex-wrap gap-1">{s.pages.slice(0,8).map(p => <span key={p} className="px-1.5 py-0.5 bg-white/5 rounded text-[7px] text-slate-400 font-bold">{p}</span>)}{s.pages.length > 8 && <span className="px-1.5 py-0.5 bg-white/5 rounded text-[7px] text-slate-500">+{s.pages.length-8}</span>}</div>
                </button>))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auto Generate */}
      {showAutoGen && !autoGenRunning && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 backdrop-blur-xl"><div className="absolute inset-0 bg-black/80" onClick={() => setShowAutoGen(false)} />
          <div className="w-[520px] bg-[#0d0d12] border border-white/10 rounded-2xl p-6 relative z-10 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-black text-white flex items-center gap-2"><Rocket size={18} style={{ color: brand.primary }} /> Auto Generate</h2><button onClick={() => setShowAutoGen(false)} className="text-slate-500 hover:text-white"><X size={16} /></button></div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 mb-4">
              <button onClick={() => logoInputRef.current?.click()} className="w-12 h-12 shrink-0 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden" style={{ borderColor: logoBase64 ? brand.primary + '50' : 'rgba(255,255,255,0.1)' }}>
                {logoBase64 ? <img src={logoBase64} alt="" className="w-8 h-8 object-contain" /> : <Upload size={18} className="text-slate-600" />}
              </button>
              <div><p className="text-xs font-bold text-white">{logoBase64 ? 'Logo ready' : 'Upload logo'}</p><p className="text-[9px] text-slate-500">{logoBase64 ? 'On every screen' : 'Recommended'}</p></div>
            </div>
            <button onClick={generateAllWithVariations} className="w-full p-4 rounded-xl border-2 border-dashed hover:border-solid text-left group mb-4 transition-all" style={{ borderColor: brand.primary + '50', background: brand.primary + '08' }}>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-sm font-black text-white flex items-center gap-2"><Zap size={14} style={{ color: brand.primary }} /> Generate All Screens + Variations</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ color: brand.primary, background: brand.primary + '15' }}>{PRESETS.length} screens</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded text-white opacity-0 group-hover:opacity-100" style={{ background: brand.primary }}><Play size={8} className="inline mr-0.5" />Start All</span>
                </div>
              </div>
              <p className="text-[9px] text-slate-400">All 11 screens with 3-4 variations each — {PRESETS.length} total pages generated automatically. Client picks the best variation for each screen.</p>
            </button>
            <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mb-2">Or pick a template set:</p>
            <div className="space-y-2">{SUGGESTED_SETS.map((s, i) => (
              <button key={i} onClick={() => autoGenerateAll(s)} className="w-full p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 text-left group">
                <div className="flex items-center justify-between mb-1"><h3 className="text-sm font-bold text-white">{s.name}</h3>
                  <div className="flex items-center gap-2"><span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ color: brand.primary, background: brand.primary + '15' }}>{s.pages.length}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded text-white opacity-0 group-hover:opacity-100" style={{ background: brand.primary }}><Play size={8} className="inline mr-0.5" />Start</span></div></div>
                <p className="text-[9px] text-slate-500">{s.desc} — {s.pages.length * VARIATION_STYLES.length} variations</p>
              </button>))}
            </div>
          </div>
        </div>
      )}

      {/* Auto Gen Progress */}
      {autoGenRunning && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[999] w-[380px] bg-[#0d0d12] border border-white/10 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" style={{ color: brand.primary }} /><span className="text-xs font-bold text-white">Auto-Generating...</span></div>
            <div className="flex items-center gap-2"><span className="text-[10px] font-bold" style={{ color: brand.primary }}>{autoGenProgress.current}/{autoGenProgress.total}</span>
              <button onClick={() => { autoGenAbortRef.current = true; }} className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-[9px] font-bold text-red-400">Stop</button></div>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 mb-1.5 overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${(autoGenProgress.current/autoGenProgress.total)*100}%`, background: brand.primary }} /></div>
          <p className="text-[9px] text-slate-500 truncate">Generating: <b className="text-white">{autoGenProgress.currentName}</b></p>
        </div>
      )}

      {/* Settings */}
      {showSettings && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 backdrop-blur-xl"><div className="absolute inset-0 bg-black/80" onClick={() => setShowSettings(false)} />
          <div className="w-[450px] bg-[#0d0d12] border border-white/10 rounded-2xl p-6 relative z-10 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-black text-white flex items-center gap-2"><Settings size={18} style={{ color: brand.primary }} /> Settings</h2><button onClick={() => setShowSettings(false)} className="text-slate-500 hover:text-white"><X size={16} /></button></div>
            <div className="space-y-4">
              <div><label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">App Name</label><input type="text" value={brand.name} onChange={e => setBrand({...brand,name:e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-lg p-3 text-white text-sm outline-none" /></div>
              <div><label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Logo</label>
                <button onClick={() => logoInputRef.current?.click()} className="w-full flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-lg hover:bg-white/8">
                  {logoBase64 ? (<><img src={logoBase64} alt="" className="w-10 h-10 object-contain rounded bg-white/10 p-1" /><div><p className="text-xs font-bold text-white">Logo uploaded</p><p className="text-[9px] text-slate-500">Click to change</p></div></>) :
                  (<><div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-slate-600"><Upload size={16} /></div><p className="text-xs text-slate-400">Upload logo</p></>)}
                </button>
                {logoBase64 && <button onClick={() => { setLogoBase64(''); setBrand(p=>({...p,logo:''})); }} className="mt-1.5 text-[9px] text-red-400 font-bold">Remove</button>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Primary</label><div className="flex items-center gap-2"><input type="color" value={brand.primary} onChange={e=>setBrand({...brand,primary:e.target.value})} className="w-8 h-8 rounded cursor-pointer border-0" /><input type="text" value={brand.primary} onChange={e=>setBrand({...brand,primary:e.target.value})} className="flex-1 bg-white/5 border border-white/5 rounded px-2 py-1.5 text-[10px] text-white font-mono" /></div></div>
                <div><label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Font</label><select value={brand.font} onChange={e=>setBrand({...brand,font:e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-lg p-2.5 text-xs text-white outline-none">{['Inter','Plus Jakarta Sans','Outfit','Montserrat','DM Sans','Space Grotesk','Poppins','Nunito'].map(f=><option key={f} value={f}>{f}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Background</label><div className="flex items-center gap-2"><input type="color" value={brand.bg||'#0F1419'} onChange={e=>setBrand({...brand,bg:e.target.value})} className="w-8 h-8 rounded cursor-pointer border-0" /><input type="text" value={brand.bg||'#0F1419'} onChange={e=>setBrand({...brand,bg:e.target.value})} className="flex-1 bg-white/5 border border-white/5 rounded px-2 py-1.5 text-[10px] text-white font-mono" /></div></div>
                <div><label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Surface</label><div className="flex items-center gap-2"><input type="color" value={brand.surface||'#1A1F2E'} onChange={e=>setBrand({...brand,surface:e.target.value})} className="w-8 h-8 rounded cursor-pointer border-0" /><input type="text" value={brand.surface||'#1A1F2E'} onChange={e=>setBrand({...brand,surface:e.target.value})} className="flex-1 bg-white/5 border border-white/5 rounded px-2 py-1.5 text-[10px] text-white font-mono" /></div></div>
              </div>
              <div><label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Gemini API Key</label>
                <input type="password" value={userApiKey} onChange={e => setUserApiKey(e.target.value)} placeholder="Enter your Gemini API key" className="w-full bg-white/5 border border-white/5 rounded-lg p-3 text-white text-sm outline-none font-mono" />
                <p className="text-[9px] text-slate-500 mt-1">Get free key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" className="text-blue-400 underline">aistudio.google.com/apikey</a></p>
              </div>
            </div>
            <button onClick={() => { try { localStorage.setItem('v2ui_gemini_key', userApiKey); } catch {} setShowSettings(false); addToast('Saved!', 'success'); }} className="w-full mt-5 py-2.5 rounded-lg text-white font-bold text-xs" style={{ background: brand.primary }}>Save</button>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-8 backdrop-blur-xl"><div className="absolute inset-0 bg-black/80" onClick={() => setShowApiKeyModal(false)} />
          <div className="w-[420px] bg-[#0d0d12] border border-white/10 rounded-2xl p-6 relative z-10">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-black text-white flex items-center gap-2"><Cpu size={18} className="text-blue-400" /> Gemini API Key</h2><button onClick={() => setShowApiKeyModal(false)} className="text-slate-500 hover:text-white"><X size={16} /></button></div>
            <p className="text-xs text-slate-400 mb-2">In <strong className="text-white">Gemini Canvas</strong>, this is optional — Canvas uses its own API access.</p>
            <p className="text-xs text-slate-400 mb-4">For <strong className="text-white">CodeSandbox / StackBlitz / local</strong>, get a free key:</p>
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" className="block w-full text-center py-2 mb-4 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold hover:bg-blue-600/30">Open Google AI Studio &rarr;</a>
            <input type="password" value={userApiKey} onChange={e => setUserApiKey(e.target.value)} placeholder="Paste your API key here (optional in Canvas)..." className="w-full bg-white/5 border border-white/5 rounded-lg p-3 text-white text-sm outline-none font-mono mb-3" />
            <div className="flex gap-2">
              <button onClick={() => setShowApiKeyModal(false)} className="flex-1 py-2.5 rounded-lg text-slate-400 font-bold text-xs bg-white/5 border border-white/5">Skip (Canvas)</button>
              <button onClick={() => { if (!userApiKey.trim()) { addToast('Please enter a key', 'error'); return; } try { localStorage.setItem('v2ui_gemini_key', userApiKey); } catch {} setShowApiKeyModal(false); addToast('API key saved!', 'success'); }} className="flex-1 py-2.5 rounded-lg text-white font-bold text-xs" style={{ background: brand.primary }}>Save Key</button>
            </div>
          </div>
        </div>
      )}

      {/* Themes */}
      {showThemes && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 backdrop-blur-xl"><div className="absolute inset-0 bg-black/80" onClick={() => setShowThemes(false)} />
          <div className="w-[480px] bg-[#0d0d12] border border-white/10 rounded-2xl p-6 relative z-10">
            <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-black text-white flex items-center gap-2"><Palette size={18} style={{ color: brand.primary }} /> Themes</h2><button onClick={() => setShowThemes(false)} className="text-slate-500 hover:text-white"><X size={16} /></button></div>
            <div className="grid grid-cols-2 gap-2.5">{THEME_PRESETS.map(t => (
              <button key={t.id} onClick={() => applyTheme(t)} className="p-3 rounded-xl border border-white/5 hover:border-white/15 text-left" style={{ background: t.bg }}>
                <div className="flex items-center gap-2 mb-1.5"><div className="w-4 h-4 rounded-full" style={{ background: t.primary }} /><span className="text-xs font-bold" style={{ color: t.text }}>{t.name}</span></div>
                <div className="flex gap-1"><div className="w-6 h-3 rounded" style={{ background: t.surface }} /><div className="flex-1 h-3 rounded" style={{ background: t.primary + '30' }} /></div>
              </button>))}
            </div>
          </div>
        </div>
      )}

      {/* Export */}
      {showExport && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 backdrop-blur-xl"><div className="absolute inset-0 bg-black/80" onClick={() => setShowExport(false)} />
          <div className="w-[400px] bg-[#0d0d12] border border-white/10 rounded-2xl p-6 relative z-10">
            <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-black text-white flex items-center gap-2"><Download size={18} style={{ color: brand.primary }} /> Export</h2><button onClick={() => setShowExport(false)} className="text-slate-500 hover:text-white"><X size={16} /></button></div>
            <div className="space-y-2">
              <button onClick={() => { downloadSingle(); setShowExport(false); }} disabled={!currentPage?.html} className="w-full p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 text-left disabled:opacity-30 flex items-center gap-3">
                <FileCode size={18} style={{ color: brand.primary }} /><div><p className="text-xs font-bold text-white">Current Screen HTML</p><p className="text-[9px] text-slate-500">{currentPage?.name}.html</p></div></button>
              <button onClick={() => { downloadAll(); setShowExport(false); }} disabled={designedCount === 0} className="w-full p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 text-left disabled:opacity-30 flex items-center gap-3">
                <Layers size={18} style={{ color: brand.primary }} /><div><p className="text-xs font-bold text-white">Full Prototype</p><p className="text-[9px] text-slate-500">{designedCount} screens in mockups</p></div></button>
              <button onClick={() => { exportReact(); setShowExport(false); }} disabled={!currentPage?.html} className="w-full p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 text-left disabled:opacity-30 flex items-center gap-3">
                <Code2 size={18} style={{ color: brand.primary }} /><div><p className="text-xs font-bold text-white">React Component</p><p className="text-[9px] text-slate-500">Copy as React component</p></div></button>
              <button onClick={() => { copyCode(); setShowExport(false); }} disabled={!currentPage?.html} className="w-full p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 text-left disabled:opacity-30 flex items-center gap-3">
                <Copy size={18} style={{ color: brand.primary }} /><div><p className="text-xs font-bold text-white">Copy HTML</p><p className="text-[9px] text-slate-500">Clipboard</p></div></button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.05);border-radius:99px}
        input:focus,select:focus,textarea:focus{border-color:${brand.primary}50 !important}
        @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
      `}</style>
    </div>
  );
}
