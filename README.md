# TrendUp App Designer

AI-powered mobile UI screen generator for **TrendUp Secure Messaging** — built for use in Gemini Canvas.

## Features

- **43 screen presets** across 11 screens with 3-4 variations each
- **7 categories**: Onboarding, Inbox, Chat, Groups, Settings, Edge States
- **Gemini AI** generates production-ready HTML screens
- **10 theme presets** including TrendUp Light, Hub Dark, AMOLED Black
- **4 device previews**: iPhone 15 Pro, iPhone SE, Android, iPad Mini
- **AI Chat** for refining designs in real-time
- **Auto-generate** full app templates in one click
- **Export** as HTML, full prototype, or React component

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

## Usage

Single-file React app (`App.jsx`) — paste into Gemini Canvas or any React environment.

## API

Uses Gemini API: `generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent`

## Reference

`reference-wireframes.html` contains the original TrendUp Secure Messaging UI specification wireframes.
