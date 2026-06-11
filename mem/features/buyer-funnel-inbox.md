---
name: Buyer Funnel — Triage Inbox
description: Buyer Funnel is a single-card Triage Inbox (queue + focus card), not kanban or drag-and-drop
type: feature
---
Buyer Funnel (/pipeline) is a Triage Inbox: a left queue sorted by stuck-days, and a single focus card on the right with one primary "Next Step" CTA plus Snooze / Mark Live / Void / Reassign / Step Back. Keyboard: →/Enter advance, S snooze, L live, V void, ↑/↓ navigate queue, O open full profile. Three queue tabs: Needs Action, Stuck (≥5 days), All Active. Required filters preserved (member, vertical, stage, date range).

**Why:** User rejected both kanban (drag is slow) and a dense command-bar list. Inbox-style focus optimizes for clearing the queue fastest.

**Constraint:** Do NOT reintroduce kanban columns, drag-and-drop, or a multi-row dense table for the Buyer Funnel. Other views (e.g. All Buyers) may still be tabular.