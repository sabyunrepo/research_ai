# Asset Generation Prompts

## Source

Deck: `generated-decks/kimai-workshop-content`
Design source: `디자인.md`

## Design Rules Applied

- white background #ffffff
- minimal black hand-drawn linework
- one blue accent #2563eb only
- simple doodle-like lecture illustration
- no gradients
- no glow, glass, blur, or glossy effects
- no photorealistic, 3D, or complex icon set
- large readable visual anchors for projector use
- consistent Kimai character: same round face, small antenna headset, simple desk-work posture, black linework, blue accent only
- no visible cell numbers, circled numbers, sheet labels, crop marks, borders, or panel numbering inside final artwork
- strictly follow 디자인.md: gradients and decorative effects are forbidden
- strictly follow 디자인.md: use black/white plus at most one blue accent

## Prompt Queue

Promptable planned assets: 20

### 1. kimai-failure-scene

Kind: `single-image`
Target: `assets/visuals/kimai-failure-scene.png`

```text
Use case: scientific-educational
Asset type: Korean beginner workshop lecture image
Asset id: kimai-failure-scene
Teaching role: 대충 시킨 업무에서 김아이가 빈칸을 추측해 잘못된 결과를 내는 첫 실패 장면을 보여 준다.
Primary request: Hand-drawn minimal scene: a manager says '이거 알아서 잘 만들어줘' to Kimai, and Kimai looks at empty blanks labeled goal, source material, done criteria. The output paper is visibly mismatched. Black linework, one blue accent, white background.
Explanation anchors: 목표 없음; 자료 없음; 완료 기준 없음
Design constraints: white background #ffffff; minimal black hand-drawn linework; one blue accent #2563eb only; simple doodle-like lecture illustration; no gradients; no glow, glass, blur, or glossy effects; no photorealistic, 3D, or complex icon set; large readable visual anchors for projector use; consistent Kimai character: same round face, small antenna headset, simple desk-work posture, black linework, blue accent only; no visible cell numbers, circled numbers, sheet labels, crop marks, borders, or panel numbering inside final artwork; strictly follow 디자인.md: gradients and decorative effects are forbidden; strictly follow 디자인.md: use black/white plus at most one blue accent.
Composition: keep one clear teaching point, enough whitespace, and visible workplace/requester/context relationships when relevant. Keep Kimai visually consistent across all generated assets.
Avoid: decorative backgrounds, dense text, tiny labels, generic office icon clusters, gradients, shadows used as decoration, glass effects, glow, 3D, photorealism, visible cell numbers, circled numbers, grid labels, crop marks, or sprite-sheet borders.
```

### 2. act1-report-blank-taxonomy

Kind: `single-image`
Target: `assets/visuals/act1-report-blank-taxonomy.png`

```text
Use case: scientific-educational
Asset type: Korean beginner workshop lecture image
Asset id: act1-report-blank-taxonomy
Teaching role: 제품 리뷰자료 보고서에서 김아이가 추측하는 빈칸을 제품, 사용처, 기간, 비교 기준, 형식/기한으로 이름 붙여 설명한다.
Primary request: Hand-drawn minimal Korean lecture illustration on a white background. A blank product review report draft sits in front of Kimai. Five large readable Korean labels point to missing fields: 제품, 사용처, 기간, 비교 기준, 형식/기한. The five labels are visually grouped into three simple clusters: 대상, 기준, 제출 조건. Use black linework and one blue accent only. No practice UI, no checkboxes, no score panel, no gradients.
Explanation anchors: 제품; 사용처; 기간; 비교 기준; 형식/기한; 대상/기준/제출 조건
Design constraints: white background #ffffff; minimal black hand-drawn linework; one blue accent #2563eb only; simple doodle-like lecture illustration; no gradients; no glow, glass, blur, or glossy effects; no photorealistic, 3D, or complex icon set; large readable visual anchors for projector use; consistent Kimai character: same round face, small antenna headset, simple desk-work posture, black linework, blue accent only; no visible cell numbers, circled numbers, sheet labels, crop marks, borders, or panel numbering inside final artwork; strictly follow 디자인.md: gradients and decorative effects are forbidden; strictly follow 디자인.md: use black/white plus at most one blue accent.
Composition: keep one clear teaching point, enough whitespace, and visible workplace/requester/context relationships when relevant. Keep Kimai visually consistent across all generated assets.
Avoid: decorative backgrounds, dense text, tiny labels, generic office icon clusters, gradients, shadows used as decoration, glass effects, glow, 3D, photorealism, visible cell numbers, circled numbers, grid labels, crop marks, or sprite-sheet borders.
```

### 3. act1-desk-curation

Kind: `single-image`
Target: `assets/visuals/act1-desk-curation.png`

```text
Use case: scientific-educational
Asset type: Korean beginner workshop lecture image
Asset id: act1-desk-curation
Teaching role: Context Curation을 김아이의 데스크 위에 올릴 자료, 잠시 둘 자료, 치울 자료를 정리하는 일로 설명한다.
Primary request: Hand-drawn minimal Korean lecture illustration on a white background. Kimai's desk is being organized into three zones with large labels: 올릴 자료, 잠시 둘 자료, 치울 자료. The scene should feel like preparing a new employee's desk before work. Add a small secondary label Context Curation, but Korean labels must be dominant. Use black linework and one blue accent only. No gradients, no glossy treatment, no practice UI.
Explanation anchors: 김아이 데스크; 올릴 자료; 잠시 둘 자료; 치울 자료; Context Curation
Design constraints: white background #ffffff; minimal black hand-drawn linework; one blue accent #2563eb only; simple doodle-like lecture illustration; no gradients; no glow, glass, blur, or glossy effects; no photorealistic, 3D, or complex icon set; large readable visual anchors for projector use; consistent Kimai character: same round face, small antenna headset, simple desk-work posture, black linework, blue accent only; no visible cell numbers, circled numbers, sheet labels, crop marks, borders, or panel numbering inside final artwork; strictly follow 디자인.md: gradients and decorative effects are forbidden; strictly follow 디자인.md: use black/white plus at most one blue accent.
Composition: keep one clear teaching point, enough whitespace, and visible workplace/requester/context relationships when relevant. Keep Kimai visually consistent across all generated assets.
Avoid: decorative backgrounds, dense text, tiny labels, generic office icon clusters, gradients, shadows used as decoration, glass effects, glow, 3D, photorealism, visible cell numbers, circled numbers, grid labels, crop marks, or sprite-sheet borders.
```

### 4. act4-repeat-procedure

Kind: `single-image`
Target: `assets/visuals/act4-repeat-procedure.png`

```text
Use case: scientific-educational
Asset type: Korean beginner workshop lecture image
Asset id: act4-repeat-procedure
Teaching role: 반복되는 질문 순서, 승인 기준, 출력 형식을 매번 말하면 흔들린다는 문제를 설명한다.
Primary request: Hand-drawn minimal Korean lecture illustration. Repeated sticky notes around Kimai labeled 질문 순서, 승인 기준, 출력 형식, with an arrow to 업무 매뉴얼. White background, black linework, one blue accent.
Explanation anchors: 질문 순서; 승인 기준; 출력 형식
Design constraints: white background #ffffff; minimal black hand-drawn linework; one blue accent #2563eb only; simple doodle-like lecture illustration; no gradients; no glow, glass, blur, or glossy effects; no photorealistic, 3D, or complex icon set; large readable visual anchors for projector use; consistent Kimai character: same round face, small antenna headset, simple desk-work posture, black linework, blue accent only; no visible cell numbers, circled numbers, sheet labels, crop marks, borders, or panel numbering inside final artwork; strictly follow 디자인.md: gradients and decorative effects are forbidden; strictly follow 디자인.md: use black/white plus at most one blue accent.
Composition: keep one clear teaching point, enough whitespace, and visible workplace/requester/context relationships when relevant. Keep Kimai visually consistent across all generated assets.
Avoid: decorative backgrounds, dense text, tiny labels, generic office icon clusters, gradients, shadows used as decoration, glass effects, glow, 3D, photorealism, visible cell numbers, circled numbers, grid labels, crop marks, or sprite-sheet borders.
```

### 5. act4-rushing-kimai

Kind: `single-image`
Target: `assets/visuals/act4-rushing-kimai.png`

```text
Use case: scientific-educational
Asset type: Korean beginner workshop lecture image
Asset id: act4-rushing-kimai
Teaching role: 모호한 요청을 받으면 김아이가 목표와 범위를 확인하지 않고 바로 실행해 버릴 수 있음을 설명한다.
Primary request: Hand-drawn minimal Korean lecture illustration. Speech bubble: 강의 실습 좀 재밌게 바꿔줘. Kimai rushes toward implementation while blanks 목표?, 범위?, 승인? remain. White background, one blue accent.
Explanation anchors: 목표 미확인; 범위 미확인; 승인 전 구현
Design constraints: white background #ffffff; minimal black hand-drawn linework; one blue accent #2563eb only; simple doodle-like lecture illustration; no gradients; no glow, glass, blur, or glossy effects; no photorealistic, 3D, or complex icon set; large readable visual anchors for projector use; consistent Kimai character: same round face, small antenna headset, simple desk-work posture, black linework, blue accent only; no visible cell numbers, circled numbers, sheet labels, crop marks, borders, or panel numbering inside final artwork; strictly follow 디자인.md: gradients and decorative effects are forbidden; strictly follow 디자인.md: use black/white plus at most one blue accent.
Composition: keep one clear teaching point, enough whitespace, and visible workplace/requester/context relationships when relevant. Keep Kimai visually consistent across all generated assets.
Avoid: decorative backgrounds, dense text, tiny labels, generic office icon clusters, gradients, shadows used as decoration, glass effects, glow, 3D, photorealism, visible cell numbers, circled numbers, grid labels, crop marks, or sprite-sheet borders.
```

### 6. act4-skill-manual

Kind: `single-image`
Target: `assets/visuals/act4-skill-manual.png`

```text
Use case: scientific-educational
Asset type: Korean beginner workshop lecture image
Asset id: act4-skill-manual
Teaching role: Skill을 반복 업무를 파일로 만든 매뉴얼로 설명한다.
Primary request: Hand-drawn minimal Korean lecture illustration. Kimai stands beside a document titled Skill 업무 매뉴얼 with sections 언제 쓰나, 어떤 순서인가, 무엇을 남기나. White background, one blue accent.
Explanation anchors: 언제 쓰나; 어떤 순서인가; 무엇을 남기나
Design constraints: white background #ffffff; minimal black hand-drawn linework; one blue accent #2563eb only; simple doodle-like lecture illustration; no gradients; no glow, glass, blur, or glossy effects; no photorealistic, 3D, or complex icon set; large readable visual anchors for projector use; consistent Kimai character: same round face, small antenna headset, simple desk-work posture, black linework, blue accent only; no visible cell numbers, circled numbers, sheet labels, crop marks, borders, or panel numbering inside final artwork; strictly follow 디자인.md: gradients and decorative effects are forbidden; strictly follow 디자인.md: use black/white plus at most one blue accent.
Composition: keep one clear teaching point, enough whitespace, and visible workplace/requester/context relationships when relevant. Keep Kimai visually consistent across all generated assets.
Avoid: decorative backgrounds, dense text, tiny labels, generic office icon clusters, gradients, shadows used as decoration, glass effects, glow, 3D, photorealism, visible cell numbers, circled numbers, grid labels, crop marks, or sprite-sheet borders.
```

### 7. act4-mini-brainstorming-flow

Kind: `single-image`
Target: `assets/visuals/act4-mini-brainstorming-flow.png`

```text
Use case: scientific-educational
Asset type: Korean beginner workshop lecture image
Asset id: act4-mini-brainstorming-flow
Teaching role: mini-brainstorming Skill이 구현 전에 질문, 접근안 비교, 승인 순서로 좁히게 만든다는 점을 설명한다.
Primary request: Hand-drawn minimal Korean lecture illustration. A simple flow: 질문 -> 접근안 비교 -> 승인 후 진행. Kimai pauses before implementation. White background, black linework, one blue accent.
Explanation anchors: 한 번에 하나씩; 접근안 비교; 승인 후 진행
Design constraints: white background #ffffff; minimal black hand-drawn linework; one blue accent #2563eb only; simple doodle-like lecture illustration; no gradients; no glow, glass, blur, or glossy effects; no photorealistic, 3D, or complex icon set; large readable visual anchors for projector use; consistent Kimai character: same round face, small antenna headset, simple desk-work posture, black linework, blue accent only; no visible cell numbers, circled numbers, sheet labels, crop marks, borders, or panel numbering inside final artwork; strictly follow 디자인.md: gradients and decorative effects are forbidden; strictly follow 디자인.md: use black/white plus at most one blue accent.
Composition: keep one clear teaching point, enough whitespace, and visible workplace/requester/context relationships when relevant. Keep Kimai visually consistent across all generated assets.
Avoid: decorative backgrounds, dense text, tiny labels, generic office icon clusters, gradients, shadows used as decoration, glass effects, glow, 3D, photorealism, visible cell numbers, circled numbers, grid labels, crop marks, or sprite-sheet borders.
```

### 8. kimai-verification-checkpoint

Kind: `single-image`
Target: `assets/visuals/kimai-verification-checkpoint.png`

```text
Use case: scientific-educational
Asset type: Korean beginner workshop lecture image
Asset id: kimai-verification-checkpoint
Teaching role: 김아이 팀의 결과물이 팀장에게 제출되기 전 품질검문소에서 작업 기록, 기준 대조, 남은 위험을 확인한다는 Act 6 메시지를 설명한다.
Primary request: Hand-drawn minimal Korean lecture illustration: Kimai, Choi-ai, and Park-ai bring a finished report to a pre-submit quality gate before it reaches the team lead. The gate checks three large papers labeled 작업 기록, 기준 대조, 남은 위험. Use black linework and one blue accent on a white background. Keep labels large and readable.
Explanation anchors: 제출 전 확인; 작업 기록; 기준 대조; 남은 위험
Design constraints: white background #ffffff; minimal black hand-drawn linework; one blue accent #2563eb only; simple doodle-like lecture illustration; no gradients; no glow, glass, blur, or glossy effects; no photorealistic, 3D, or complex icon set; large readable visual anchors for projector use; consistent Kimai character: same round face, small antenna headset, simple desk-work posture, black linework, blue accent only; no visible cell numbers, circled numbers, sheet labels, crop marks, borders, or panel numbering inside final artwork; strictly follow 디자인.md: gradients and decorative effects are forbidden; strictly follow 디자인.md: use black/white plus at most one blue accent.
Composition: keep one clear teaching point, enough whitespace, and visible workplace/requester/context relationships when relevant. Keep Kimai visually consistent across all generated assets.
Avoid: decorative backgrounds, dense text, tiny labels, generic office icon clusters, gradients, shadows used as decoration, glass effects, glow, 3D, photorealism, visible cell numbers, circled numbers, grid labels, crop marks, or sprite-sheet borders.
```

### 9. act1-desk-contamination

Kind: `single-image`
Target: `assets/visuals/act1-desk-contamination.png`

```text
Use case: scientific-educational
Asset type: Korean beginner workshop lecture image
Asset id: act1-desk-contamination
Teaching role: 관련 없는 자료가 김아이의 데스크 위에 섞이면 의사결정이 혼란스러워지고 작업이 느려진다는 점을 설명한다.
Primary request: Hand-drawn minimal Korean lecture illustration on a white background. Kimai sits at a desk for a product review report, but unrelated documents are mixed in: 다른 제품 자료, 지난달 기준, 미확정 의견. Show confusion and slower decision making without clutter. Use black linework and one blue accent only.
Explanation anchors: 다른 제품 자료; 지난달 기준; 미확정 의견
Design constraints: white background #ffffff; minimal black hand-drawn linework; one blue accent #2563eb only; simple doodle-like lecture illustration; no gradients; no glow, glass, blur, or glossy effects; no photorealistic, 3D, or complex icon set; large readable visual anchors for projector use; consistent Kimai character: same round face, small antenna headset, simple desk-work posture, black linework, blue accent only; no visible cell numbers, circled numbers, sheet labels, crop marks, borders, or panel numbering inside final artwork; strictly follow 디자인.md: gradients and decorative effects are forbidden; strictly follow 디자인.md: use black/white plus at most one blue accent.
Composition: keep one clear teaching point, enough whitespace, and visible workplace/requester/context relationships when relevant. Keep Kimai visually consistent across all generated assets.
Avoid: decorative backgrounds, dense text, tiny labels, generic office icon clusters, gradients, shadows used as decoration, glass effects, glow, 3D, photorealism, visible cell numbers, circled numbers, grid labels, crop marks, or sprite-sheet borders.
```

### 10. act1-source-failure-merge

Kind: `single-image`
Target: `assets/visuals/act1-source-failure-merge.png`

```text
Use case: scientific-educational
Asset type: Korean beginner workshop lecture image
Asset id: act1-source-failure-merge
Teaching role: 기존 실패 사례를 읽기 전 수정, 느슨한 테스트, 오래된 가정이 모두 빈칸 추측 또는 컨텍스트 오염으로 묶인다는 점을 설명한다.
Primary request: Hand-drawn minimal Korean lecture illustration on a white background. Three simple failure cards labeled 읽기 전 수정, 느슨한 테스트, 오래된 가정 flow into one desk labeled 빈칸 추측 / 오염 자료. Use black linework and one blue accent only. No code, no UI.
Explanation anchors: 읽기 전 수정; 느슨한 테스트; 오래된 가정
Design constraints: white background #ffffff; minimal black hand-drawn linework; one blue accent #2563eb only; simple doodle-like lecture illustration; no gradients; no glow, glass, blur, or glossy effects; no photorealistic, 3D, or complex icon set; large readable visual anchors for projector use; consistent Kimai character: same round face, small antenna headset, simple desk-work posture, black linework, blue accent only; no visible cell numbers, circled numbers, sheet labels, crop marks, borders, or panel numbering inside final artwork; strictly follow 디자인.md: gradients and decorative effects are forbidden; strictly follow 디자인.md: use black/white plus at most one blue accent.
Composition: keep one clear teaching point, enough whitespace, and visible workplace/requester/context relationships when relevant. Keep Kimai visually consistent across all generated assets.
Avoid: decorative backgrounds, dense text, tiny labels, generic office icon clusters, gradients, shadows used as decoration, glass effects, glow, 3D, photorealism, visible cell numbers, circled numbers, grid labels, crop marks, or sprite-sheet borders.
```

### 11. act1-report-direction-blanks

Kind: `single-image`
Target: `assets/visuals/act1-report-direction-blanks.png`

```text
Use case: scientific-educational
Asset type: Korean beginner workshop lecture image
Asset id: act1-report-direction-blanks
Teaching role: 제품 리뷰자료 보고서의 방향을 정하는 빈칸이 대상 제품, 사용 상황, 보고서 목적이라는 점을 설명한다.
Primary request: Hand-drawn minimal Korean lecture illustration on a white background. A blank product review report sheet. Three large labels are attached: 대상 제품, 사용 상황, 보고서 목적. Kimai looks at the sheet and waits for those blanks to be filled. Use black linework and one blue accent only. Large readable Korean labels. No gradients, no glossy effects, no app UI, no tiny text.
Explanation anchors: 대상 제품; 사용 상황; 보고서 목적
Design constraints: white background #ffffff; minimal black hand-drawn linework; one blue accent #2563eb only; simple doodle-like lecture illustration; no gradients; no glow, glass, blur, or glossy effects; no photorealistic, 3D, or complex icon set; large readable visual anchors for projector use; consistent Kimai character: same round face, small antenna headset, simple desk-work posture, black linework, blue accent only; no visible cell numbers, circled numbers, sheet labels, crop marks, borders, or panel numbering inside final artwork; strictly follow 디자인.md: gradients and decorative effects are forbidden; strictly follow 디자인.md: use black/white plus at most one blue accent.
Composition: keep one clear teaching point, enough whitespace, and visible workplace/requester/context relationships when relevant. Keep Kimai visually consistent across all generated assets.
Avoid: decorative backgrounds, dense text, tiny labels, generic office icon clusters, gradients, shadows used as decoration, glass effects, glow, 3D, photorealism, visible cell numbers, circled numbers, grid labels, crop marks, or sprite-sheet borders.
```

### 12. act1-report-criteria-blanks

Kind: `single-image`
Target: `assets/visuals/act1-report-criteria-blanks.png`

```text
Use case: scientific-educational
Asset type: Korean beginner workshop lecture image
Asset id: act1-report-criteria-blanks
Teaching role: 제품 리뷰자료 보고서의 숫자와 제출 조건을 정하는 빈칸이 기준 기간, 비교 기준, 제출 조건이라는 점을 설명한다.
Primary request: Hand-drawn minimal Korean lecture illustration on a white background. A product review report sheet with three bottom labels: 기준 기간, 비교 기준, 제출 조건. Simple arrows show these labels deciding how numbers are interpreted and when the report is done. Use black linework and one blue accent only. Large readable Korean labels. No gradients, no glossy effects, no app UI, no tiny text.
Explanation anchors: 기준 기간; 비교 기준; 제출 조건
Design constraints: white background #ffffff; minimal black hand-drawn linework; one blue accent #2563eb only; simple doodle-like lecture illustration; no gradients; no glow, glass, blur, or glossy effects; no photorealistic, 3D, or complex icon set; large readable visual anchors for projector use; consistent Kimai character: same round face, small antenna headset, simple desk-work posture, black linework, blue accent only; no visible cell numbers, circled numbers, sheet labels, crop marks, borders, or panel numbering inside final artwork; strictly follow 디자인.md: gradients and decorative effects are forbidden; strictly follow 디자인.md: use black/white plus at most one blue accent.
Composition: keep one clear teaching point, enough whitespace, and visible workplace/requester/context relationships when relevant. Keep Kimai visually consistent across all generated assets.
Avoid: decorative backgrounds, dense text, tiny labels, generic office icon clusters, gradients, shadows used as decoration, glass effects, glow, 3D, photorealism, visible cell numbers, circled numbers, grid labels, crop marks, or sprite-sheet borders.
```

### 13. act4-skill-start-condition

Kind: `single-image`
Target: `assets/visuals/act4-skill-start-condition.png`

```text
Use case: scientific-educational
Asset type: Korean beginner workshop lecture image
Asset id: act4-skill-start-condition
Teaching role: 스킬 매뉴얼은 호출 조건, 입력 자료, 멈출 조건을 먼저 정해야 한다는 점을 설명한다.
Primary request: Hand-drawn minimal Korean lecture illustration on a white background. A 업무 매뉴얼 first page shows three large fields: 호출 조건, 입력 자료, 멈출 조건. Kimai pauses before implementation and reads the manual. Use black linework and one blue accent only. Large readable Korean labels. No gradients, no glossy effects, no app UI, no tiny text.
Explanation anchors: 호출 조건; 입력 자료; 멈출 조건
Design constraints: white background #ffffff; minimal black hand-drawn linework; one blue accent #2563eb only; simple doodle-like lecture illustration; no gradients; no glow, glass, blur, or glossy effects; no photorealistic, 3D, or complex icon set; large readable visual anchors for projector use; consistent Kimai character: same round face, small antenna headset, simple desk-work posture, black linework, blue accent only; no visible cell numbers, circled numbers, sheet labels, crop marks, borders, or panel numbering inside final artwork; strictly follow 디자인.md: gradients and decorative effects are forbidden; strictly follow 디자인.md: use black/white plus at most one blue accent.
Composition: keep one clear teaching point, enough whitespace, and visible workplace/requester/context relationships when relevant. Keep Kimai visually consistent across all generated assets.
Avoid: decorative backgrounds, dense text, tiny labels, generic office icon clusters, gradients, shadows used as decoration, glass effects, glow, 3D, photorealism, visible cell numbers, circled numbers, grid labels, crop marks, or sprite-sheet borders.
```

### 14. act1-empty-desk-blanks

Kind: `single-image`
Target: `assets/visuals/act1-empty-desk-blanks.png`

```text
Use case: scientific-educational
Asset type: Korean beginner workshop lecture image
Asset id: act1-empty-desk-blanks
Teaching role: 빈 책상에서 제품, 사용 상황, 비교 기준을 김아이가 추측하게 된다는 점을 설명한다.
Primary request: Hand-drawn minimal Korean lecture illustration on a white background. An empty Kimai desk with floating question cards: 어떤 제품, 어디에 쓸지, 무엇과 비교. A report request note is on the side. Use black linework and one blue accent only. Large readable Korean labels. No gradients, no glossy effects, no app UI, no tiny text.
Explanation anchors: 빈 책상; 어떤 제품; 어디에 쓸지; 무엇과 비교
Design constraints: white background #ffffff; minimal black hand-drawn linework; one blue accent #2563eb only; simple doodle-like lecture illustration; no gradients; no glow, glass, blur, or glossy effects; no photorealistic, 3D, or complex icon set; large readable visual anchors for projector use; consistent Kimai character: same round face, small antenna headset, simple desk-work posture, black linework, blue accent only; no visible cell numbers, circled numbers, sheet labels, crop marks, borders, or panel numbering inside final artwork; strictly follow 디자인.md: gradients and decorative effects are forbidden; strictly follow 디자인.md: use black/white plus at most one blue accent.
Composition: keep one clear teaching point, enough whitespace, and visible workplace/requester/context relationships when relevant. Keep Kimai visually consistent across all generated assets.
Avoid: decorative backgrounds, dense text, tiny labels, generic office icon clusters, gradients, shadows used as decoration, glass effects, glow, 3D, photorealism, visible cell numbers, circled numbers, grid labels, crop marks, or sprite-sheet borders.
```

### 15. act4-regulation-vs-manual

Kind: `single-image`
Target: `assets/visuals/act4-regulation-vs-manual.png`

```text
Use case: scientific-educational
Asset type: Korean beginner workshop lecture image
Asset id: act4-regulation-vs-manual
Teaching role: CLAUDE.md는 기준이고 Skill은 절차라는 차이를 설명한다.
Primary request: Hand-drawn minimal Korean lecture illustration. Kimai compares two documents: 회사 내규 CLAUDE.md labeled 기준 and 업무 매뉴얼 Skill labeled 순서. White background, black linework, one blue accent.
Explanation anchors: 회사 내규 CLAUDE.md; 업무 매뉴얼 Skill; 기준; 순서
Design constraints: white background #ffffff; minimal black hand-drawn linework; one blue accent #2563eb only; simple doodle-like lecture illustration; no gradients; no glow, glass, blur, or glossy effects; no photorealistic, 3D, or complex icon set; large readable visual anchors for projector use; consistent Kimai character: same round face, small antenna headset, simple desk-work posture, black linework, blue accent only; no visible cell numbers, circled numbers, sheet labels, crop marks, borders, or panel numbering inside final artwork; strictly follow 디자인.md: gradients and decorative effects are forbidden; strictly follow 디자인.md: use black/white plus at most one blue accent.
Composition: keep one clear teaching point, enough whitespace, and visible workplace/requester/context relationships when relevant. Keep Kimai visually consistent across all generated assets.
Avoid: decorative backgrounds, dense text, tiny labels, generic office icon clusters, gradients, shadows used as decoration, glass effects, glow, 3D, photorealism, visible cell numbers, circled numbers, grid labels, crop marks, or sprite-sheet borders.
```

### 16. act4-repeat-verbal-drift

Kind: `single-image`
Target: `assets/visuals/act4-repeat-verbal-drift.png`

```text
Use case: scientific-educational
Asset type: Korean beginner workshop lecture image
Asset id: act4-repeat-verbal-drift
Teaching role: 반복 업무를 매번 말로 설명하면 실행 순서가 흔들리는 문제를 설명한다.
Primary request: Hand-drawn minimal Korean lecture illustration. Three panels show same repeated request but Kimai starts differently: 질문함, 바로 실행, 기록 누락. White background, one blue accent.
Explanation anchors: 세 번 반복되는 요청; 질문함; 바로 실행; 기록 누락
Design constraints: white background #ffffff; minimal black hand-drawn linework; one blue accent #2563eb only; simple doodle-like lecture illustration; no gradients; no glow, glass, blur, or glossy effects; no photorealistic, 3D, or complex icon set; large readable visual anchors for projector use; consistent Kimai character: same round face, small antenna headset, simple desk-work posture, black linework, blue accent only; no visible cell numbers, circled numbers, sheet labels, crop marks, borders, or panel numbering inside final artwork; strictly follow 디자인.md: gradients and decorative effects are forbidden; strictly follow 디자인.md: use black/white plus at most one blue accent.
Composition: keep one clear teaching point, enough whitespace, and visible workplace/requester/context relationships when relevant. Keep Kimai visually consistent across all generated assets.
Avoid: decorative backgrounds, dense text, tiny labels, generic office icon clusters, gradients, shadows used as decoration, glass effects, glow, 3D, photorealism, visible cell numbers, circled numbers, grid labels, crop marks, or sprite-sheet borders.
```

### 17. act4-manual-trigger

Kind: `single-image`
Target: `assets/visuals/act4-manual-trigger.png`

```text
Use case: scientific-educational
Asset type: Korean beginner workshop lecture image
Asset id: act4-manual-trigger
Teaching role: 업무 매뉴얼의 시작 조건을 설명한다.
Primary request: Hand-drawn minimal Korean lecture illustration. Manual first page with large fields 호출 조건, 필요한 입력, 멈출 조건. Kimai pauses before implementation.
Explanation anchors: 호출 조건; 필요한 입력; 멈출 조건; 김아이
Design constraints: white background #ffffff; minimal black hand-drawn linework; one blue accent #2563eb only; simple doodle-like lecture illustration; no gradients; no glow, glass, blur, or glossy effects; no photorealistic, 3D, or complex icon set; large readable visual anchors for projector use; consistent Kimai character: same round face, small antenna headset, simple desk-work posture, black linework, blue accent only; no visible cell numbers, circled numbers, sheet labels, crop marks, borders, or panel numbering inside final artwork; strictly follow 디자인.md: gradients and decorative effects are forbidden; strictly follow 디자인.md: use black/white plus at most one blue accent.
Composition: keep one clear teaching point, enough whitespace, and visible workplace/requester/context relationships when relevant. Keep Kimai visually consistent across all generated assets.
Avoid: decorative backgrounds, dense text, tiny labels, generic office icon clusters, gradients, shadows used as decoration, glass effects, glow, 3D, photorealism, visible cell numbers, circled numbers, grid labels, crop marks, or sprite-sheet borders.
```

### 18. act4-manual-sequence

Kind: `single-image`
Target: `assets/visuals/act4-manual-sequence.png`

```text
Use case: scientific-educational
Asset type: Korean beginner workshop lecture image
Asset id: act4-manual-sequence
Teaching role: 매뉴얼이 질문, 비교, 승인 순서를 고정함을 설명한다.
Primary request: Hand-drawn minimal Korean lecture illustration. Workflow in a manual: 질문 -> 접근안 비교 -> 승인 후 진행. White background, one blue accent.
Explanation anchors: 질문 순서; 접근안 비교; 승인 후 진행; 업무 매뉴얼
Design constraints: white background #ffffff; minimal black hand-drawn linework; one blue accent #2563eb only; simple doodle-like lecture illustration; no gradients; no glow, glass, blur, or glossy effects; no photorealistic, 3D, or complex icon set; large readable visual anchors for projector use; consistent Kimai character: same round face, small antenna headset, simple desk-work posture, black linework, blue accent only; no visible cell numbers, circled numbers, sheet labels, crop marks, borders, or panel numbering inside final artwork; strictly follow 디자인.md: gradients and decorative effects are forbidden; strictly follow 디자인.md: use black/white plus at most one blue accent.
Composition: keep one clear teaching point, enough whitespace, and visible workplace/requester/context relationships when relevant. Keep Kimai visually consistent across all generated assets.
Avoid: decorative backgrounds, dense text, tiny labels, generic office icon clusters, gradients, shadows used as decoration, glass effects, glow, 3D, photorealism, visible cell numbers, circled numbers, grid labels, crop marks, or sprite-sheet borders.
```

### 19. act4-manual-output

Kind: `single-image`
Target: `assets/visuals/act4-manual-output.png`

```text
Use case: scientific-educational
Asset type: Korean beginner workshop lecture image
Asset id: act4-manual-output
Teaching role: 매뉴얼이 남길 결과와 다음 단계를 정함을 설명한다.
Primary request: Hand-drawn minimal Korean lecture illustration. Kimai leaves output cards 결정 기록, 다음 단계, 재사용 형식 at the end of a manual.
Explanation anchors: 결정 기록; 다음 단계; 재사용 가능한 형식
Design constraints: white background #ffffff; minimal black hand-drawn linework; one blue accent #2563eb only; simple doodle-like lecture illustration; no gradients; no glow, glass, blur, or glossy effects; no photorealistic, 3D, or complex icon set; large readable visual anchors for projector use; consistent Kimai character: same round face, small antenna headset, simple desk-work posture, black linework, blue accent only; no visible cell numbers, circled numbers, sheet labels, crop marks, borders, or panel numbering inside final artwork; strictly follow 디자인.md: gradients and decorative effects are forbidden; strictly follow 디자인.md: use black/white plus at most one blue accent.
Composition: keep one clear teaching point, enough whitespace, and visible workplace/requester/context relationships when relevant. Keep Kimai visually consistent across all generated assets.
Avoid: decorative backgrounds, dense text, tiny labels, generic office icon clusters, gradients, shadows used as decoration, glass effects, glow, 3D, photorealism, visible cell numbers, circled numbers, grid labels, crop marks, or sprite-sheet borders.
```

### 20. act4-question-first-skill

Kind: `single-image`
Target: `assets/visuals/act4-question-first-skill.png`

```text
Use case: scientific-educational
Asset type: Korean beginner workshop lecture image
Asset id: act4-question-first-skill
Teaching role: 좋은 Skill은 구현 전에 질문하게 함을 설명한다.
Primary request: Hand-drawn minimal Korean lecture illustration. Kimai receives a vague request and stops at question cards 목표 확인, 범위 확인, 승인 확인 before implementation.
Explanation anchors: 모호한 요청; 목표 확인; 범위 확인; 승인 확인; 구현 전 멈춤
Design constraints: white background #ffffff; minimal black hand-drawn linework; one blue accent #2563eb only; simple doodle-like lecture illustration; no gradients; no glow, glass, blur, or glossy effects; no photorealistic, 3D, or complex icon set; large readable visual anchors for projector use; consistent Kimai character: same round face, small antenna headset, simple desk-work posture, black linework, blue accent only; no visible cell numbers, circled numbers, sheet labels, crop marks, borders, or panel numbering inside final artwork; strictly follow 디자인.md: gradients and decorative effects are forbidden; strictly follow 디자인.md: use black/white plus at most one blue accent.
Composition: keep one clear teaching point, enough whitespace, and visible workplace/requester/context relationships when relevant. Keep Kimai visually consistent across all generated assets.
Avoid: decorative backgrounds, dense text, tiny labels, generic office icon clusters, gradients, shadows used as decoration, glass effects, glow, 3D, photorealism, visible cell numbers, circled numbers, grid labels, crop marks, or sprite-sheet borders.
```
