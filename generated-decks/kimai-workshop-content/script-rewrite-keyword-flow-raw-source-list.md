# Raw Source List: Kimai Workshop Script Rewrite Keyword Flow

Checked date: 2026-06-02

## Web Sources

| id | source | url | why used |
|---|---|---|---|
| S1 | Toastmasters International, How to Outline Your Presentation | https://www.toastmasters.org/magazine/magazine-issues/2024/nov/outlining-presentations | Supports using both a detailed outline and a keyword speaking outline rather than full-sentence prompts for delivery. |
| S2 | CDC, Plain Language Materials & Resources | https://www.cdc.gov/health-literacy/php/develop-materials/plain-language.html | Supports general-audience wording: know the audience, put the most important message first, chunk information, use familiar words. |
| S3 | Microsoft Support, Use a screen reader to read or add speaker notes and comments in PowerPoint | https://support.microsoft.com/en-US/Accessibility/powerpoint/use-a-screen-reader-to-read-or-add-speaker-notes-and-comments-in-powerpoint | Supports speaker notes as reminders/talking points and as a place to tell the story beyond slide content. |
| S4 | Grand Valley State University Speech Lab, Speaker's Notes | https://www.gvsu.edu/speechlab/speakers-notes-56.htm | Supports speaker notes as private delivery aids, with readable formatting, emphasis markers, and revision during rehearsal. |
| S5 | Lumen Learning, Preparation, Practice, and Delivery | https://courses.lumenlearning.com/suny-publicspeakingprinciples/chapter/chapter-12-preparation-practice-and-delivery/ | Supports cue sheets with enough ordered information to deliver without missing details, but not word-for-word reading. |

## Local Sources

| id | source | path | why used |
|---|---|---|---|
| L1 | Existing script research pack | generated-decks/kimai-workshop-content/presentation-script-context-research-pack.md | Prior research and implementation contract for generated presentation scripts. |
| L2 | Current generated script | generated-decks/kimai-workshop-content/presentation-script.json | Shows the current script is formulaic slide explanation, not a true presenter script. |
| L3 | Current markdown script | generated-decks/kimai-workshop-content/presentation-script.md | Human-readable output to rewrite with script and keyword flow sections. |
| L4 | Slide source of truth | generated-decks/kimai-workshop-content/slide-spec.json | 76-slide source for title, message, speaker note, cues, screen anchors, section flow. |
| L5 | Script generator | deck-harness/scripts/generate-presentation-script.js | Current generator creates repetitive template prose; should be rewritten first for reproducibility. |
| L6 | Script verifier | deck-harness/scripts/verify-presentation-script.js | Current verifier checks basic length/prompts; should be extended for keyword-flow contract. |
| L7 | Runtime speaker console | scripts/serve-lecture-cuts-review.js | Speaker console currently displays script, interaction, transition; can be extended to keyword cues. |
