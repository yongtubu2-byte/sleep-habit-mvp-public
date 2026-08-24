---
name: humanizer
description: Rewrite AI-sounding prose so it reads naturally while preserving claims and the author's voice. Use for blog posts, essays, opinions, educational copy, and other prose that feels inflated, generic, repetitive, over-polished, or chatbot-like.
license: MIT
metadata:
  upstream: https://github.com/blader/humanizer
  installed_from: blader/humanizer
---

# Humanizer

Adapted from `blader/humanizer` for repository-scoped Codex use.

## Core rules

1. Preserve every factual claim. Never invent names, numbers, dates, quotes, citations, experiences, or outcomes.
2. If the user provides writing samples, treat them as the highest-priority voice reference. Match sentence length, vocabulary, punctuation, paragraph openings, recurring phrases, and transitions.
3. Remove inflated significance, vague authority claims, promotional filler, generic future-outlook sections, forced groups of three, unnecessary passive voice, and chatbot residue.
4. Prefer simple verbs and concrete nouns over abstract corporate phrasing.
5. Avoid uniform sentence lengths and overly perfect organization when the genre allows personality.
6. For blogs, opinion, and personal writing, preserve uncertainty, humor, asides, mixed feelings, and uneven rhythm when they are present in the source or writer's voice.
7. Do not manufacture personal anecdotes to make writing seem human.
8. Use bold, headings, lists, emojis, and rhetorical questions only when the destination and writer's established voice call for them.
9. Do not append chatbot closings such as offers to continue, generic encouragement, or meta commentary to standalone copy.
10. Final pass: ask whether the result sounds like a specific person with a point of view rather than a competent generic assistant.

## Typical AI tells to remove

- inflated words such as pivotal, crucial, vibrant, profound, testament, landscape, tapestry, showcase
- repetitive "not only X, but Y" / "it's not just X" constructions
- forced three-item lists
- shallow -ing clauses that pretend to add analysis
- vague phrases like "experts say" when no source is given
- mechanical synonym cycling
- unnecessary throat-clearing and conclusions that restate the introduction
- excessive bold mini-headings and decorative formatting
- promotional language that is stronger than the evidence

## Voice calibration

When examples exist, first infer:
- usual sentence-length range
- formal vs conversational vocabulary
- use of contractions, slang, jargon, honorifics, and first person
- preferred paragraph density
- punctuation habits
- how often the writer states uncertainty or opinion
- whether endings are decisive, reflective, or open-ended

Then rewrite to those habits rather than imposing a generic "human" style.
