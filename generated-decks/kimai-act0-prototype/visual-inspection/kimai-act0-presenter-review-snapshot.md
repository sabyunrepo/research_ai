# Presenter Review Snapshot

Generated from current assets/slides.js and assets/presenter-review.js after Task 4 sourceAssetId trace fix.

Act 0 · 오늘의 약속
4시간 동안 김아이의 업무 환경을 하나씩 만듭니다.
오늘 배울 것은 프롬프트 문장 하나가 아니라, AI가 흔들려도 다시 돌아오게 만드는 업무 시스템입니다.
Speaker Note
김아이라는 AI 신입사원을 소개한 뒤, 오늘 강의가 프롬프트 예문 암기가 아니라 업무 환경을 만드는 시간임을 말한다. 지시, 자료, 검증의 세 축을 먼저 잡고, 이후 Skill과 Agent는 뒤에서 하나씩 연결한다고 예고한다. 마지막에는 첫 실습으로 넘어가기 위해 김아이가 무엇을 추측하는지 묻는다.
Presenter Cues
김아이는 빠르지만 회사 맥락은 모른다
오늘은 지시, 자료, 검증이 연결된 환경을 만든다
각 단계마다 직접 해보고 점수와 결과를 확인한다
Visual / Interaction
Type: existing-image
Asset ID: kimai-journey-map
Teaching role: 슬라이드의 글과 함께 Act 0 전체 여정을 설명하고, 그림이 담당하는 구간은 그림 안의 요소만 짚어도 설명할 수 있게 하는 김아이 중심 여정 지도
Prompt: Use the top-row journey-map region from generated-decks/kimai-act0-prototype/prompts/kimai-work-environment-sheet.xml
Interaction: tooltip - Prompt, Context, Hook, Evaluation 용어에 마우스를 올리면 일반인용 설명 툴팁을 보여 준다.
Bridge: 다음: 김아이에게 대충 시키면 무엇을 추측하게 될까요?
Asset Trace
visualAssetId: kimai-journey-map
sourceAssetId: kimai-work-environment-sheet
assetCrop: x=0, y=0, width=100, height=34, unit=percent
renderedVisualAsset: ../assets/visuals/act0-workflow-map-kimai-journey-map.png
Asset Explanation Anchors
김아이는 빠르지만 회사 맥락은 모른다
지시, 자료, 규칙, 매뉴얼은 서로 다른 역할이다
역할과 도구를 나누면 판단이 덜 섞인다
완료는 말이 아니라 검증 게이트로 확인한다
오늘 4시간 동안 이 환경을 하나씩 만든다
Visual Semantic Contract
Must Show
김아이 또는 AI 신입사원이 중앙에 있어야 한다
상사 또는 업무 요청자가 왼쪽에서 업무를 주는 모습이 보여야 한다
업무 지시서가 첫 단계로 보여야 한다
자료 또는 맥락이 업무 지시와 별도 요소로 보여야 한다
회사 규칙판 또는 반복 규칙이 별도 요소로 보여야 한다
업무 매뉴얼 또는 Skill 책자가 보여야 한다
역할 분리 또는 작은 팀이 보여야 한다
도구 또는 권한 연결이 보여야 한다
완료 전 검증 게이트와 체크 표시가 마지막에 보여야 한다
Must Not Show
김아이 없이 일반 아이콘만 일렬로 나열된 워크플로우
추상적 도형만 있는 프로세스 다이어그램
어두운 미래형 관제실
설명할 요소가 없는 장식 배경
Teaching Questions
슬라이드의 글과 함께 볼 때 오늘 배울 전체 흐름을 30초 안에 설명할 수 있는가?
그림이 맡은 설명 구간은 그림만 보고도 말할 수 있을 만큼 구체적인가?
지시, 자료, 규칙, 매뉴얼, 검증이 서로 다른 요소로 보이는가?
김아이가 중심에 있어 신입 AI 비유가 유지되는가?
Review Threshold
Minimum pass score: 85
Visual Review Status
Status: PASS
Score: 90
Summary: 상단 crop은 중앙의 큰 김아이를 기준으로 왼쪽 업무 요청자, 업무 지시서, 맥락/자료, 회사 규칙판, 스킬/매뉴얼, 역할 분담 팀, 도구/권한, 최종 검증 게이트가 좌우로 연결되어 있다. 슬라이드의 3개 앵커와 함께 보면 발표자가 4시간 강의의 전체 업무 환경을 그림 요소를 짚으며 설명할 수 있다.
Forbidden Element Findings
Not observed: 김아이 없이 일반 아이콘만 일렬로 나열된 워크플로우 - 중앙의 큰 Kimai 캐릭터와 오른쪽 검증 게이트 안의 작은 Kimai가 반복 등장하고, 왼쪽 매니저와 업무 환경 패널들이 함께 있어 아이콘만 나열된 흐름이 아니다.
Not observed: 추상적 도형만 있는 프로세스 다이어그램 - 말풍선, 클립보드, 문서/데이터베이스, 규칙 보드, 펼친 책, 로봇 팀, 도구 상자, 자물쇠, 검증 게이트처럼 실제 강의 개념을 가리키는 사물이 들어 있다.
Not observed: 어두운 미래형 관제실 - 배경은 흰색이고 검은 손그림 선과 파란 강조색만 사용되며, 관제실 배경이나 어두운 조명 효과가 없다.
Not observed: 설명할 요소가 없는 장식 배경 - 각 패널은 업무 요청, 지시서, 맥락 자료, 규칙판, 매뉴얼, 역할 팀, 도구 권한, 검증 게이트라는 발표 설명 대상을 가지고 있고 배경 장식은 거의 없다.
XML Prompt Boundaries
Instruction
<instruction>Act 0의 전체 지도 슬라이드를 만든다. 일반인 수강생에게 4시간 동안 김아이의 업무 환경을 하나씩 만든다는 기대값을 잡아 준다. 전문 용어는 보조 라벨과 툴팁으로만 연결하고, 긴 설명은 speakerNote에 둔다.</instruction>
Screen Content
<screen_content><headline>4시간 동안 김아이의 업무 환경을 하나씩 만듭니다.</headline><message>오늘 배울 것은 프롬프트 문장 하나가 아니라, AI가 흔들려도 다시 돌아오게 만드는 업무 시스템입니다.</message><anchors><anchor>무엇을 알려줄까 / Prompt</anchor><anchor>어떤 자료를 올릴까 / Context</anchor><anchor>완료를 어떻게 확인할까 / Hook + Evaluation</anchor></anchors><bridge>다음: 김아이에게 대충 시키면 무엇을 추측하게 될까요?</bridge></screen_content>
Speaker Navigation
<speaker_navigation><cue>김아이는 빠르지만 회사 맥락은 모른다</cue><cue>오늘은 지시, 자료, 검증이 연결된 환경을 만든다</cue><cue>각 단계마다 직접 해보고 점수와 결과를 확인한다</cue></speaker_navigation>
Asset Requirement
<asset_requirement>김아이의 업무 환경이 말풍선, 지시서, 매뉴얼, 검증 게이트, 완료 확인으로 이어지는 손그림 여정 지도를 사용한다. 이미지는 발표자가 그림을 보며 각 역을 짚어 설명할 수 있어야 한다.</asset_requirement>
Evidence Claim IDs
claim-001
: lecture-cuts redesign is structured around a 4-hour general-audience workshop using the AI new hire Kimai narrative. (docs/harness/lecture-cuts-redesign-master-spec.md)
