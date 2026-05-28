# Visual Inspection Report

## Result

PASS

## Viewports Checked

- 1440x900: deck screenshot captured.
- 1024x768: deck screenshot captured.
- 1440x900: presenter review full-page screenshot captured.

## Screenshot Evidence

- `generated-decks/kimai-act0-prototype/visual-inspection/kimai-act0-deck-1440x900.png`
- `generated-decks/kimai-act0-prototype/visual-inspection/kimai-act0-deck-1024x768.png`
- `generated-decks/kimai-act0-prototype/visual-inspection/kimai-act0-presenter-review-1440x900.png`
- `generated-decks/kimai-act0-prototype/visual-inspection/kimai-act0-deck-1440x900-snapshot.md`
- `generated-decks/kimai-act0-prototype/visual-inspection/kimai-act0-deck-1024x768-snapshot.md`
- `generated-decks/kimai-act0-prototype/visual-inspection/kimai-act0-presenter-review-snapshot.md`

## Automated Checks

```text
PASS playwright visual inspection
1440x900 image box: 1120x214
1024x768 image box: 900x172
Headline present: yes
Image alt text present: yes
Wide visual layout class: yes
Viewport overflow: no
Presenter review includes Visual Semantic Contract: yes
Presenter review includes Visual Review Status: yes
Presenter review includes Status PASS and Score 90: yes
Presenter review includes Asset Trace: yes
Presenter review includes sourceAssetId, assetCrop, and renderedVisualAsset: yes
Presenter review includes Forbidden Element Findings: yes
EXIT_CODE=0
```

## Human Visual Judgment

1. 김아이가 중심에 보이는가? PASS. 중앙의 큰 Kimai가 가장 강한 시각 앵커다.
2. 슬라이드 글과 그림이 함께 발표 흐름을 만든다. PASS. 상단 텍스트가 강의 목표와 3개 앵커를 잡고, 하단 이미지는 업무 환경 전체 경로를 보여 준다.
3. 그림이 담당하는 설명 구간은 그림 안 요소를 짚어 설명 가능하다. PASS. 요청자, 지시서, 맥락/자료, 규칙판, 스킬/매뉴얼, 역할 팀, 도구/권한, 검증 게이트가 분리되어 있다.
4. 1024px 화면에서 주요 요소가 잘리지 않는다. PASS. 화면 overflow는 없고 이미지가 900x172로 렌더링된다.
5. generic workflow icon처럼 보이지 않는다. PASS. 김아이 캐릭터와 매니저/업무 환경 패널이 함께 있어 일반 아이콘 나열과 구분된다.
6. presenter review에서 sourceAssetId, crop 좌표, renderedVisualAsset, score, evidence를 추적할 수 있다. PASS. `Asset Trace`, `sourceAssetId: kimai-work-environment-sheet`, `assetCrop`, `renderedVisualAsset`, `Visual Review Status`, `Forbidden Element Findings`가 화면에 노출된다.

## Remaining Visual Risks

- 1024x768에서도 이미지가 통과 가능한 크기로 보이지만, 강의장 뒤쪽 좌석에서는 이미지 안 작은 한국어 라벨 일부가 완전히 읽히지 않을 수 있다. 발표자는 라벨을 읽히는 자료가 아니라 시각 앵커로 사용해야 한다.
- 본격 덱 제작에서는 Act 0 전체 지도와 각 Act별 상세 장면을 별도 슬라이드로 나누는 편이 더 안전하다.
