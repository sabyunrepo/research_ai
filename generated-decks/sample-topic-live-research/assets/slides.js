window.DECK_SLIDES = [
  {
    "index": 1,
    "id": "slide-001",
    "file": "slide-001.html",
    "section": "Skills And Tools",
    "sectionObjective": "Claude Code skills와 MCP tools의 역할 차이를 이해한다.",
    "estimatedMinutes": 4,
    "title": "반복 절차는 Skill로 둡니다",
    "message": "자주 반복하는 작업 순서는 SKILL.md로 분리하면 필요할 때만 열 수 있습니다.",
    "bullets": [
      "반복 절차",
      "필요할 때 로드",
      "프로젝트별 재사용"
    ],
    "visualIntent": "작업대 옆에 닫힌 매뉴얼이 놓여 있다가 필요할 때 열리는 그림",
    "speakerNote": "공식 문서는 skill을 SKILL.md 파일로 설명하고, 관련될 때 사용하거나 직접 호출할 수 있다고 설명합니다.",
    "evidenceClaimIds": [
      "claim-001",
      "claim-002"
    ],
    "glossaryTerms": [
      "SKILL.md"
    ],
    "qualityChecks": [
      "official-source",
      "glossary"
    ]
  },
  {
    "index": 2,
    "id": "slide-002",
    "file": "slide-002.html",
    "section": "Skills And Tools",
    "sectionObjective": "외부 기능 연결은 MCP tool layer로 설명한다.",
    "estimatedMinutes": 5,
    "title": "외부 기능은 MCP 도구로 연결합니다",
    "message": "MCP는 AI가 외부 도구를 호출할 수 있게 하는 연결 규칙입니다.",
    "bullets": [
      "도구 노출",
      "클라이언트 호출",
      "권한과 검증 필요"
    ],
    "visualIntent": "AI 작업대와 외부 도구가 플러그로 연결되는 그림",
    "speakerNote": "MCP tools spec은 서버가 language model이 호출할 수 있는 tools를 노출한다고 설명합니다.",
    "evidenceClaimIds": [
      "claim-003"
    ],
    "glossaryTerms": [
      "MCP"
    ],
    "qualityChecks": [
      "supporting-source",
      "beginner-term"
    ]
  },
  {
    "index": 3,
    "id": "slide-003",
    "file": "slide-003.html",
    "section": "Skills And Tools",
    "sectionObjective": "근거와 슬라이드 문장을 분리한다.",
    "estimatedMinutes": 5,
    "title": "슬라이드는 claim id만 들고 갑니다",
    "message": "URL, 확인 날짜, confidence는 source map에 두고 슬라이드는 claim id로 연결합니다.",
    "bullets": [
      "source map",
      "slide spec",
      "presenter evidence"
    ],
    "visualIntent": "슬라이드 카드가 claim id로 근거 지도와 연결되는 그림",
    "speakerNote": "이 구조는 같은 근거를 여러 슬라이드에서 재사용할 때 source update 부담을 줄입니다.",
    "evidenceClaimIds": [
      "claim-004"
    ],
    "glossaryTerms": [
      "claim id"
    ],
    "qualityChecks": [
      "no-source-url-in-slide-spec",
      "evidence-resolution"
    ]
  },
  {
    "index": 4,
    "id": "slide-004",
    "file": "slide-004.html",
    "section": "Skills And Tools",
    "sectionObjective": "inference claim을 명시적으로 다룬다.",
    "estimatedMinutes": 5,
    "title": "판단은 inference로 표시합니다",
    "message": "공식 문서의 사실과 우리가 내린 설계 판단은 source map에서 구분합니다.",
    "bullets": [
      "official claim",
      "supporting claim",
      "inference claim"
    ],
    "visualIntent": "근거 문서와 판단 메모가 다른 색 라벨로 구분되는 그림",
    "speakerNote": "Skill이 반복 절차에 맞다는 말은 공식 문서 문장 그대로가 아니라, 로드 방식 설명에서 도출한 설계 판단입니다.",
    "evidenceClaimIds": [
      "claim-001",
      "claim-005"
    ],
    "glossaryTerms": [
      "SKILL.md"
    ],
    "qualityChecks": [
      "inference-notes",
      "confidence"
    ]
  },
  {
    "index": 5,
    "id": "slide-005",
    "file": "slide-005.html",
    "section": "Skills And Tools",
    "sectionObjective": "피해야 할 claim도 명시한다.",
    "estimatedMinutes": 6,
    "title": "피해야 할 주장도 기록합니다",
    "message": "source map에는 사용할 claim뿐 아니라 쓰지 말아야 할 주장도 남깁니다.",
    "bullets": [
      "과도한 일반화 방지",
      "리뷰 기준 제공",
      "다음 세션 보호"
    ],
    "visualIntent": "사용할 카드와 피할 카드를 분리하는 체크리스트",
    "speakerNote": "모든 규칙을 CLAUDE.md에 넣자는 주장은 피해야 할 claim으로 남겨, 다음 에이전트가 다시 같은 방향으로 가지 않게 합니다.",
    "evidenceClaimIds": [
      "claim-004",
      "claim-005"
    ],
    "glossaryTerms": [
      "claim id"
    ],
    "qualityChecks": [
      "claims-to-avoid",
      "handoff"
    ]
  }
];
window.DECK_CLAIMS = [
  {
    "id": "claim-001",
    "claim": "Claude Code skills are defined with a SKILL.md file and can be invoked directly or loaded when relevant.",
    "sourceType": "official",
    "source": "https://code.claude.com/docs/en/skills",
    "checkedDate": "2026-05-25",
    "useLocation": "slide",
    "confidence": "high",
    "notes": "Official Claude Code skills documentation."
  },
  {
    "id": "claim-002",
    "claim": "Skill bodies are not always loaded; they load when the skill is used, which makes long procedure content cheaper until needed.",
    "sourceType": "official",
    "source": "https://code.claude.com/docs/en/skills",
    "checkedDate": "2026-05-25",
    "useLocation": "speaker-note",
    "confidence": "high",
    "notes": "Used in speaker note to explain why deck workflows belong in skills rather than always-on memory."
  },
  {
    "id": "claim-003",
    "claim": "MCP servers expose tools that clients can invoke on behalf of language models.",
    "sourceType": "supporting",
    "source": "https://modelcontextprotocol.io/specification/draft/server/tools",
    "checkedDate": "2026-05-25",
    "useLocation": "slide",
    "confidence": "high",
    "notes": "Protocol specification used as supporting context for tool-layer claims."
  },
  {
    "id": "claim-004",
    "claim": "A topic-to-deck workflow should keep source URLs in claim-source-map.json and let slide-spec.json reference only claim ids.",
    "sourceType": "local",
    "source": "deck-harness/quality-rubric.md",
    "checkedDate": "2026-05-25",
    "useLocation": "slide",
    "confidence": "high",
    "notes": "Local harness quality rule."
  },
  {
    "id": "claim-005",
    "claim": "For recurring deck generation, a skill is a better fit than always-on project memory when the content is a multi-step procedure.",
    "sourceType": "inference",
    "source": "https://code.claude.com/docs/en/skills",
    "checkedDate": "2026-05-25",
    "useLocation": "slide",
    "confidence": "medium",
    "notes": "Inference based on the official distinction that CLAUDE.md is always-on context while skill content loads when used."
  }
];
window.DECK_GLOSSARY = [
  {
    "term": "SKILL.md",
    "aliases": [
      "skill file"
    ],
    "definition": "AI가 반복 절차를 실행할 때 읽는 기술서 파일입니다.",
    "match": "exact-phrase"
  },
  {
    "term": "MCP",
    "aliases": [
      "Model Context Protocol"
    ],
    "definition": "AI가 외부 도구와 데이터를 같은 방식으로 연결하기 위한 프로토콜입니다.",
    "match": "whole-word"
  },
  {
    "term": "claim id",
    "aliases": [
      "evidence id"
    ],
    "definition": "슬라이드 문장을 근거 지도에 연결하는 짧은 식별자입니다.",
    "match": "exact-phrase"
  }
];
