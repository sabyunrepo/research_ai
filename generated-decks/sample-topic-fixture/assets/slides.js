window.DECK_SLIDES = [
  {
    "index": 1,
    "id": "slide-001",
    "file": "slide-001.html",
    "section": "Fixture Smoke",
    "sectionObjective": "로컬 fixture로 생성 흐름을 확인한다.",
    "estimatedMinutes": 4,
    "title": "덱 생성은 파일 흐름입니다",
    "message": "입력과 근거를 먼저 고정하고 나서 슬라이드를 만듭니다.",
    "bullets": [
      "topic-intake",
      "claim-source-map",
      "slide-spec",
      "verification"
    ],
    "visualIntent": "파일들이 한 방향으로 연결되는 간단한 흐름도",
    "speakerNote": "이 슬라이드는 fixture의 목적을 설명합니다. 화면은 짧게 두고, 실제 검증은 뒤 슬라이드에서 확인합니다.",
    "evidenceClaimIds": [
      "claim-001"
    ],
    "glossaryTerms": [
      "verification"
    ],
    "qualityChecks": [
      "one-message",
      "local-source"
    ]
  },
  {
    "index": 2,
    "id": "slide-002",
    "file": "slide-002.html",
    "section": "Fixture Smoke",
    "sectionObjective": "근거가 slide spec과 분리되는 이유를 이해한다.",
    "estimatedMinutes": 5,
    "title": "근거는 source map에 둡니다",
    "message": "슬라이드는 claim id만 들고, URL과 확인 날짜는 source map이 관리합니다.",
    "bullets": [
      "슬라이드 본문은 짧게 유지합니다.",
      "근거와 날짜는 한 곳에서 갱신합니다."
    ],
    "visualIntent": "슬라이드 카드와 source map 문서가 claim id로 연결되는 그림",
    "speakerNote": "같은 claim을 여러 슬라이드에서 쓰더라도 source map 한 곳만 갱신하면 됩니다.",
    "evidenceClaimIds": [
      "claim-001",
      "claim-002"
    ],
    "glossaryTerms": [
      "handoff"
    ],
    "qualityChecks": [
      "evidence-resolution",
      "no-source-url-in-slide-spec"
    ]
  },
  {
    "index": 3,
    "id": "slide-003",
    "file": "slide-003.html",
    "section": "Fixture Smoke",
    "sectionObjective": "검증 결과가 handoff로 이어지는 구조를 확인한다.",
    "estimatedMinutes": 6,
    "title": "마지막은 검증과 handoff입니다",
    "message": "명령 결과와 남은 위험을 남겨야 다음 세션이 같은 기준으로 이어갑니다.",
    "bullets": [
      "검증 명령",
      "산출물 경로",
      "남은 위험",
      "다음 프롬프트"
    ],
    "visualIntent": "체크리스트에서 handoff 문서로 이어지는 그림",
    "speakerNote": "완료 보고는 완료 선언이 아니라 재현 가능한 증거 목록이어야 합니다.",
    "evidenceClaimIds": [
      "claim-002"
    ],
    "glossaryTerms": [
      "handoff",
      "verification"
    ],
    "qualityChecks": [
      "handoff-evidence",
      "risk-sections"
    ]
  }
];
window.DECK_CLAIMS = [
  {
    "id": "claim-001",
    "claim": "좋은 발표자료 생성 워크플로우는 입력, 근거, 슬라이드 명세, 검증, handoff를 분리한다.",
    "sourceType": "local",
    "source": "deck-harness/workflow.md",
    "checkedDate": "2026-05-25",
    "useLocation": "slide",
    "confidence": "high",
    "notes": "Local fixture claim for smoke testing."
  },
  {
    "id": "claim-002",
    "claim": "검증 가능한 결과물은 command evidence와 artifact path를 남겨야 다음 세션에서 재현할 수 있다.",
    "sourceType": "local",
    "source": "deck-harness/quality-rubric.md",
    "checkedDate": "2026-05-25",
    "useLocation": "slide",
    "confidence": "high",
    "notes": "Local fixture claim for smoke testing."
  }
];
window.DECK_GLOSSARY = [
  {
    "term": "handoff",
    "aliases": [
      "이어받기"
    ],
    "definition": "다음 작업자가 같은 상태에서 이어갈 수 있도록 현재 결정, 검증, 남은 위험을 남기는 문서입니다.",
    "match": "whole-word"
  },
  {
    "term": "verification",
    "aliases": [
      "검증"
    ],
    "definition": "작업이 실제로 끝났는지 명령과 산출물로 확인하는 과정입니다.",
    "match": "whole-word"
  }
];
