window.DECK_SLIDES = [
  {
    "index": 1,
    "id": "act0-workflow-map",
    "file": "act0-workflow-map.html",
    "section": "Act 0 · 오늘의 약속",
    "sectionObjective": "4시간 일반인 대상 강의의 전체 여정을 보여 주고 Act 1 실습으로 연결한다.",
    "estimatedMinutes": 3,
    "title": "4시간 동안 김아이의 업무 환경을 하나씩 만듭니다.",
    "message": "오늘 배울 것은 프롬프트 문장 하나가 아니라, AI가 흔들려도 다시 돌아오게 만드는 업무 시스템입니다.",
    "bullets": [
      "무엇을 알려줄까 / Prompt",
      "어떤 자료를 올릴까 / Context",
      "완료를 어떻게 확인할까 / Hook + Evaluation"
    ],
    "visualIntent": "김아이의 업무 환경이 말풍선, 지시서, 매뉴얼, 검증 게이트, 완료 확인으로 이어지는 손그림 여정 지도",
    "visualType": "existing-image",
    "visualAsset": "",
    "visualPrompt": "Use the top-row journey-map region from generated-decks/kimai-act0-prototype/prompts/kimai-work-environment-sheet.xml",
    "visualAssetId": "kimai-journey-map",
    "sourceAssetId": "kimai-work-environment-sheet",
    "assetTeachingRole": "슬라이드의 글과 함께 Act 0 전체 여정을 설명하고, 그림이 담당하는 구간은 그림 안의 요소만 짚어도 설명할 수 있게 하는 김아이 중심 여정 지도",
    "assetExplanationAnchors": [
      "김아이는 빠르지만 회사 맥락은 모른다",
      "지시, 자료, 규칙, 매뉴얼은 서로 다른 역할이다",
      "역할과 도구를 나누면 판단이 덜 섞인다",
      "완료는 말이 아니라 검증 게이트로 확인한다",
      "오늘 4시간 동안 이 환경을 하나씩 만든다"
    ],
    "assetSemanticRequirements": {
      "mustShow": [
        "김아이 또는 AI 신입사원이 중앙에 있어야 한다",
        "상사 또는 업무 요청자가 왼쪽에서 업무를 주는 모습이 보여야 한다",
        "업무 지시서가 첫 단계로 보여야 한다",
        "자료 또는 맥락이 업무 지시와 별도 요소로 보여야 한다",
        "회사 규칙판 또는 반복 규칙이 별도 요소로 보여야 한다",
        "업무 매뉴얼 또는 Skill 책자가 보여야 한다",
        "역할 분리 또는 작은 팀이 보여야 한다",
        "도구 또는 권한 연결이 보여야 한다",
        "완료 전 검증 게이트와 체크 표시가 마지막에 보여야 한다"
      ],
      "mustNotShow": [
        "김아이 없이 일반 아이콘만 일렬로 나열된 워크플로우",
        "추상적 도형만 있는 프로세스 다이어그램",
        "어두운 미래형 관제실",
        "설명할 요소가 없는 장식 배경"
      ],
      "teachingQuestions": [
        "슬라이드의 글과 함께 볼 때 오늘 배울 전체 흐름을 30초 안에 설명할 수 있는가?",
        "그림이 맡은 설명 구간은 그림만 보고도 말할 수 있을 만큼 구체적인가?",
        "지시, 자료, 규칙, 매뉴얼, 검증이 서로 다른 요소로 보이는가?",
        "김아이가 중심에 있어 신입 AI 비유가 유지되는가?"
      ],
      "minimumPassScore": 85
    },
    "assetCrop": {
      "x": 0,
      "y": 0,
      "width": 100,
      "height": 34,
      "unit": "percent"
    },
    "renderedVisualAsset": "../assets/visuals/act0-workflow-map-kimai-journey-map.png",
    "presenterCues": [
      "김아이는 빠르지만 회사 맥락은 모른다",
      "오늘은 지시, 자료, 검증이 연결된 환경을 만든다",
      "각 단계마다 직접 해보고 점수와 결과를 확인한다"
    ],
    "bridge": "다음: 김아이에게 대충 시키면 무엇을 추측하게 될까요?",
    "interaction": {
      "type": "tooltip",
      "description": "Prompt, Context, Hook, Evaluation 용어에 마우스를 올리면 일반인용 설명 툴팁을 보여 준다."
    },
    "xmlPrompt": {
      "instruction": "<instruction>Act 0의 전체 지도 슬라이드를 만든다. 일반인 수강생에게 4시간 동안 김아이의 업무 환경을 하나씩 만든다는 기대값을 잡아 준다. 전문 용어는 보조 라벨과 툴팁으로만 연결하고, 긴 설명은 speakerNote에 둔다.</instruction>",
      "screenContent": "<screen_content><headline>4시간 동안 김아이의 업무 환경을 하나씩 만듭니다.</headline><message>오늘 배울 것은 프롬프트 문장 하나가 아니라, AI가 흔들려도 다시 돌아오게 만드는 업무 시스템입니다.</message><anchors><anchor>무엇을 알려줄까 / Prompt</anchor><anchor>어떤 자료를 올릴까 / Context</anchor><anchor>완료를 어떻게 확인할까 / Hook + Evaluation</anchor></anchors><bridge>다음: 김아이에게 대충 시키면 무엇을 추측하게 될까요?</bridge></screen_content>",
      "speakerNavigation": "<speaker_navigation><cue>김아이는 빠르지만 회사 맥락은 모른다</cue><cue>오늘은 지시, 자료, 검증이 연결된 환경을 만든다</cue><cue>각 단계마다 직접 해보고 점수와 결과를 확인한다</cue></speaker_navigation>",
      "assetRequirement": "<asset_requirement>김아이의 업무 환경이 말풍선, 지시서, 매뉴얼, 검증 게이트, 완료 확인으로 이어지는 손그림 여정 지도를 사용한다. 이미지는 발표자가 그림을 보며 각 역을 짚어 설명할 수 있어야 한다.</asset_requirement>"
    },
    "speakerNote": "김아이라는 AI 신입사원을 소개한 뒤, 오늘 강의가 프롬프트 예문 암기가 아니라 업무 환경을 만드는 시간임을 말한다. 지시, 자료, 검증의 세 축을 먼저 잡고, 이후 Skill과 Agent는 뒤에서 하나씩 연결한다고 예고한다. 마지막에는 첫 실습으로 넘어가기 위해 김아이가 무엇을 추측하는지 묻는다.",
    "evidenceClaimIds": [
      "claim-001"
    ],
    "glossaryTerms": [
      "Prompt",
      "Context",
      "Hook",
      "Evaluation"
    ],
    "qualityChecks": [
      "1280x720 한 화면에서 제목, 3개 앵커, 이미지, 브릿지가 보인다.",
      "speakerNote 전문이 슬라이드 HTML에 노출되지 않는다.",
      "전문 용어는 glossary tooltip으로 설명된다.",
      "시각 자료는 hand-drawn minimal 방향을 따른다."
    ]
  }
];
window.DECK_CLAIMS = [
  {
    "id": "claim-001",
    "claim": "lecture-cuts redesign is structured around a 4-hour general-audience workshop using the AI new hire Kimai narrative.",
    "sourceType": "local",
    "source": "docs/harness/lecture-cuts-redesign-master-spec.md",
    "checkedDate": "2026-05-28",
    "useLocation": "slide",
    "confidence": "high",
    "notes": "Used for Act 0 audience, duration, and Kimai framing."
  },
  {
    "id": "claim-002",
    "claim": "The deck visual direction is hand-drawn minimal with white background, black text, blue accent, and generated hand-drawn illustration assets.",
    "sourceType": "local",
    "source": "디자인.md",
    "checkedDate": "2026-05-28",
    "useLocation": "speaker-note",
    "confidence": "high",
    "notes": "Used for the visual style and existing hand-drawn asset requirement."
  }
];
window.DECK_GLOSSARY = [
  {
    "term": "Prompt",
    "definition": "AI에게 이번 업무의 목표, 조건, 출력 형식을 알려 주는 업무 지시문입니다.",
    "match": "whole-word"
  },
  {
    "term": "Context",
    "definition": "AI가 지금 참고하는 자료와 대화입니다. 회사 비유로는 김아이 책상 위에 펼친 자료입니다.",
    "match": "whole-word"
  },
  {
    "term": "Skill",
    "definition": "반복 업무 절차를 파일로 남긴 업무 매뉴얼입니다.",
    "match": "whole-word"
  },
  {
    "term": "Agent",
    "definition": "역할을 나눠 일하는 AI 담당자입니다. 리뷰어, 조사자, 구현자처럼 나눌 수 있습니다.",
    "match": "whole-word"
  },
  {
    "term": "Hook",
    "definition": "특정 순간에 자동으로 켜지는 검문소입니다. 완료 직전 확인에 사용할 수 있습니다.",
    "match": "whole-word"
  },
  {
    "term": "Evaluation",
    "definition": "결과가 기준을 만족하는지 채점표와 증거로 확인하는 과정입니다.",
    "match": "whole-word"
  }
];
window.DECK_ASSET_REVIEWS = [
  {
    "assetId": "kimai-workflow-map",
    "status": "FAIL",
    "score": 55,
    "summary": "이미지는 지시서, 매뉴얼, 검증 흐름은 보이지만 김아이 또는 AI 신입사원이 중심에 없어 김아이 중심 여정 지도 요구를 만족하지 못한다.",
    "mustShowResults": [
      {
        "label": "김아이 또는 AI 신입사원이 중심에 있어야 한다",
        "result": "FAIL",
        "evidence": "중심 캐릭터가 없다."
      },
      {
        "label": "업무 지시가 시작점으로 보여야 한다",
        "result": "PASS",
        "evidence": "말풍선이 시작점으로 보인다."
      },
      {
        "label": "자료 또는 맥락이 별도 요소로 보여야 한다",
        "result": "FAIL",
        "evidence": "자료와 지시서의 구분이 불명확하다."
      },
      {
        "label": "매뉴얼 또는 반복 규칙이 별도 요소로 보여야 한다",
        "result": "PASS",
        "evidence": "체크리스트가 있는 책이 보인다."
      },
      {
        "label": "완료 전 검증 게이트가 보여야 한다",
        "result": "PASS",
        "evidence": "게이트와 완료 체크가 보인다."
      }
    ],
    "forbiddenElementFindings": [
      {
        "label": "김아이 없이 일반 아이콘만 나열된 워크플로우",
        "observed": true,
        "evidence": "현재 이미지가 이 상태다."
      },
      {
        "label": "강의 내용과 무관한 장식용 배경",
        "observed": false,
        "evidence": "장식 배경은 없다."
      },
      {
        "label": "발표자가 설명할 수 없는 추상 도형",
        "observed": false,
        "evidence": "각 아이콘은 설명 가능하다."
      }
    ]
  },
  {
    "assetId": "kimai-work-environment-sheet",
    "status": "FAIL",
    "score": 0,
    "summary": "김아이 전용 이미지 시트 파일은 생성됐지만, 아직 정식 semantic review를 완료하지 않았다. PASS로 처리할 수 없다.",
    "mustShowResults": [
      {
        "label": "김아이 또는 AI 신입사원이 중심에 있어야 한다",
        "result": "FAIL",
        "evidence": "이미지는 생성됐지만, Task 3의 정식 리뷰 전이라 PASS 근거로 사용하지 않는다."
      },
      {
        "label": "Act 0-6의 주요 업무 환경 요소가 분리되어 보여야 한다",
        "result": "FAIL",
        "evidence": "이미지는 생성됐지만, Task 3에서 Act별 영역을 실제 관찰 근거로 다시 검수해야 한다."
      },
      {
        "label": "각 crop region이 발표 중 설명 가능한 시각 요소를 가져야 한다",
        "result": "FAIL",
        "evidence": "이미지는 생성됐지만, crop 산출물 기준 발표 설명 가능성 검수는 아직 완료되지 않았다."
      }
    ],
    "forbiddenElementFindings": [
      {
        "label": "김아이 없이 일반 아이콘만 나열된 워크플로우",
        "observed": false,
        "evidence": "이미지는 생성됐지만, 정식 금지 요소 검수는 아직 완료되지 않았다."
      },
      {
        "label": "강의 내용과 무관한 장식용 배경",
        "observed": false,
        "evidence": "이미지는 생성됐지만, 정식 금지 요소 검수는 아직 완료되지 않았다."
      },
      {
        "label": "발표자가 설명할 수 없는 추상 도형",
        "observed": false,
        "evidence": "이미지는 생성됐지만, 정식 금지 요소 검수는 아직 완료되지 않았다."
      }
    ]
  },
  {
    "assetId": "kimai-journey-map",
    "status": "PASS",
    "score": 90,
    "summary": "상단 crop은 중앙의 큰 김아이를 기준으로 왼쪽 업무 요청자, 업무 지시서, 맥락/자료, 회사 규칙판, 스킬/매뉴얼, 역할 분담 팀, 도구/권한, 최종 검증 게이트가 좌우로 연결되어 있다. 슬라이드의 3개 앵커와 함께 보면 발표자가 4시간 강의의 전체 업무 환경을 그림 요소를 짚으며 설명할 수 있다.",
    "mustShowResults": [
      {
        "label": "김아이 또는 AI 신입사원이 중앙에 있어야 한다",
        "result": "PASS",
        "evidence": "crop 중앙에 파란 귀와 넥타이, Kimai 이름표가 있는 큰 로봇 캐릭터가 배치되어 있고 주변 패널들이 점선으로 이 캐릭터에 연결된다."
      },
      {
        "label": "상사 또는 업무 요청자가 왼쪽에서 업무를 주는 모습이 보여야 한다",
        "result": "PASS",
        "evidence": "가장 왼쪽 패널에 '1 업무 요청 (매니저)' 라벨, 노트북 앞 사람, '이번 캠페인 분석 보고서 작성해줘!' 말풍선이 있고 오른쪽 업무 지시 패널로 화살표가 이어진다."
      },
      {
        "label": "업무 지시서가 첫 단계로 보여야 한다",
        "result": "PASS",
        "evidence": "왼쪽 위 두 번째 패널에 '2 업무 지시 (Instruction)' 라벨과 클립보드가 있으며 목표, 대상, 제약, 완료 기준, 출력 형식 체크 항목이 세로로 정리되어 있다."
      },
      {
        "label": "자료 또는 맥락이 업무 지시와 별도 요소로 보여야 한다",
        "result": "PASS",
        "evidence": "업무 지시서 아래 별도 패널에 '3 맥락/자료 (Context)' 라벨이 있고 문서 묶음, 차트가 있는 종이, 데이터베이스 원통, 폴더가 클립보드와 분리되어 그려져 있다."
      },
      {
        "label": "회사 규칙판 또는 반복 규칙이 별도 요소로 보여야 한다",
        "result": "PASS",
        "evidence": "김아이 오른쪽 위 패널에 '4 회사 규칙 (Company Rules)' 라벨과 체크리스트 보드가 있으며 회사 규칙 따르기, 개인정보 보호, 정확한 요구 같은 반복 규칙이 적혀 있다."
      },
      {
        "label": "업무 매뉴얼 또는 Skill 책자가 보여야 한다",
        "result": "PASS",
        "evidence": "김아이 오른쪽 아래 패널에 '5 스킬/매뉴얼 (Skill/Manual)' 라벨, 펼쳐진 책, 절차/예시/검증 카드가 함께 있어 반복 업무 매뉴얼 역할을 시각화한다."
      },
      {
        "label": "역할 분리 또는 작은 팀이 보여야 한다",
        "result": "PASS",
        "evidence": "오른쪽 위 패널 '6 역할 분담 팀 (Agent Team)' 안에 네 명의 작은 로봇이 구분되어 있고 구현 담당, 검토 담당, 조사 담당, 보안 담당 라벨이 각각 붙어 있다."
      },
      {
        "label": "도구 또는 권한 연결이 보여야 한다",
        "result": "PASS",
        "evidence": "오른쪽 아래 패널 '7 도구/권한 (Tools & Permissions)'에 도구 상자, 허용/차단 표시, 자물쇠 아이콘이 있어 도구 사용과 권한 제어를 함께 보여 준다."
      },
      {
        "label": "완료 전 검증 게이트와 체크 표시가 마지막에 보여야 한다",
        "result": "PASS",
        "evidence": "가장 오른쪽 패널에 '8 최종 검증 게이트 (Verification Gate)' 라벨, 파란 체크 표시가 있는 게이트, 클립보드를 든 작은 김아이가 있고 전체 흐름의 마지막 화살표가 이 패널을 향한다."
      }
    ],
    "forbiddenElementFindings": [
      {
        "label": "김아이 없이 일반 아이콘만 일렬로 나열된 워크플로우",
        "observed": false,
        "evidence": "중앙의 큰 Kimai 캐릭터와 오른쪽 검증 게이트 안의 작은 Kimai가 반복 등장하고, 왼쪽 매니저와 업무 환경 패널들이 함께 있어 아이콘만 나열된 흐름이 아니다."
      },
      {
        "label": "추상적 도형만 있는 프로세스 다이어그램",
        "observed": false,
        "evidence": "말풍선, 클립보드, 문서/데이터베이스, 규칙 보드, 펼친 책, 로봇 팀, 도구 상자, 자물쇠, 검증 게이트처럼 실제 강의 개념을 가리키는 사물이 들어 있다."
      },
      {
        "label": "어두운 미래형 관제실",
        "observed": false,
        "evidence": "배경은 흰색이고 검은 손그림 선과 파란 강조색만 사용되며, 관제실 배경이나 어두운 조명 효과가 없다."
      },
      {
        "label": "설명할 요소가 없는 장식 배경",
        "observed": false,
        "evidence": "각 패널은 업무 요청, 지시서, 맥락 자료, 규칙판, 매뉴얼, 역할 팀, 도구 권한, 검증 게이트라는 발표 설명 대상을 가지고 있고 배경 장식은 거의 없다."
      }
    ]
  }
];
