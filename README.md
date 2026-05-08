# TrendUp App Designer

AI-powered mobile UI screen generator for **TrendUp Secure Messaging** — built for use in React environments with Gemini API.

## Features

- **82 screen presets** across 24 screens with 2-4 variations each
- **13 categories**: Onboarding, Inbox, Chat, Groups, Contacts, Profile, Security, Media, Notifications, Calls, Settings, Edge States
- **Gemini AI** generates production-ready HTML screens
- **10 theme presets** including TrendUp Light, Hub Dark, AMOLED Black
- **4 device previews**: iPhone 15 Pro, iPhone SE, Android, iPad Mini
- **AI Chat** for refining designs in real-time
- **Auto-generate** full app templates in one click
- **Export** as HTML, full prototype, or React component

## Setup

### 1. Get a Gemini API Key (Free)
1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Click "Create API Key"
3. Copy the key

### 2. Run the App
Paste `App.jsx` into any React environment:
- **CodeSandbox** (recommended)
- **StackBlitz**
- **Local React project** (`npx create-react-app` or Vite)

### 3. Enter Your API Key
- Click the **"API Key"** warning button in the toolbar, OR
- Go to **Settings** → paste your key in the "Gemini API Key" field
- Key is saved in localStorage for future sessions

## Important: Gemini Canvas Limitation

> **Gemini Canvas on gemini.google.com CANNOT make external API calls.**
> The Canvas sandbox blocks `fetch()` requests to external services.
> Use CodeSandbox, StackBlitz, or a local dev server instead.

## Screens

| # | Screen | Variations | Category |
|---|--------|-----------|----------|
| 1 | Landing | 4 (Centered, Hero, Split, Glass) | Onboarding |
| 2 | Sign In | 4 (Cards, Tabs, Dark, Biometric) | Onboarding |
| 3 | Session Locked | 4 (Minimal, Shield, PIN, Timer) | Onboarding |
| 4 | Securing Device | 3 (Steps, Circular, Timeline) | Onboarding |
| 5 | Secure Inbox | 4 (Classic, Hub Dark, Cards, Swipe) | Inbox |
| 6 | Chat Light | 4 (Full, Minimal, Timer Panel, Info) | Chat |
| 7 | Chat Dark | 4 (Hub, Midnight, AMOLED, Markdown) | Chat |
| 8 | Hub Inbox Chrome | 4 (Search, Kebab, New DM, Row Menu) | Inbox |
| 9 | Groups | 4 (Shapes, Cards, List, Create Flow) | Groups |
| 10 | Account & Device | 4 (Panel, Sections, Profile, Device) | Settings |
| 11 | Edge States | 4 (Signed Out, Empty, Error, No Results) | Edge States |
| 12 | Contacts | 4 (Alphabetical, Card Grid, Add Contact, Requests) | Contacts |
| 13 | User Profile | 4 (Own Profile, Peer Profile, Edit, QR Share) | Profile |
| 14 | Safety Number | 3 (Number Display, QR Scanner, Verified) | Security |
| 15 | Media Gallery | 4 (Photo Grid, File List, Photo Viewer, Links) | Media |
| 16 | Notifications | 3 (Activity Feed, Preferences, Security Alerts) | Notifications |
| 17 | Registration | 3 (Identity, Security Setup, Complete) | Onboarding |
| 18 | Forgot Password | 3 (Enter Handle, Recovery Phrase, Reset) | Onboarding |
| 19 | Voice & Video Calls | 4 (Incoming, Active Call, Video Call, History) | Calls |
| 20 | Wallet Management | 3 (Connected, Connect Flow, Sign Challenge) | Security |
| 21 | Search Results | 2 (Global Search, Message Search) | Inbox |
| 22 | Invite Friends | 2 (Share TrendUp, Invite QR) | Contacts |
| 23 | Disappearing Messages | 2 (Thread Timer, Global Default) | Chat / Settings |
| 24 | Secure Mode | 2 (Lock Overlay, Enable Confirm) | Security |

## API

Uses Gemini API: `generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent`

## Reference

`reference-wireframes.html` contains the original TrendUp Secure Messaging UI specification wireframes.
