# Few-shots

Few-shot은 실습 3에 둔다. `slide-spec.json` 바로 다음에 넣어야 출력 형식을 고정한다는 의미가 가장 잘 살아난다.

## Good Slide Spec

```json
{
  "id": "02-review-gate",
  "file": "slides/02-review-gate.html",
  "title": "검증은 마지막 장식이 아니라 통과문입니다",
  "message": "슬라이드가 생성된 뒤가 아니라 handoff 전 반드시 자동 검증을 통과해야 한다.",
  "visual": "Gate visual with pass/fail states and evidence list.",
  "speakerNote": "여기서 검증은 사람이 대충 훑는 과정이 아닙니다. 파일 누락, 링크, note 노출, overflow를 기계적으로 확인하는 통과문입니다.",
  "evidence": ["scripts/verify-deck.js", "hooks/verify-deck.json"]
}
```

## Bad Slide Spec

```json
{
  "title": "검증",
  "content": "검증이 중요하다",
  "visual": "nice image"
}
```

Why it fails:

- `message`가 없어 한 장에서 말할 핵심이 흐려진다.
- `speakerNote`가 없어 발표자 검토 화면을 만들 수 없다.
- `evidence`가 없어 근거와 출처를 확인할 수 없다.

## Good Presenter Script

```text
이 실습의 결과물은 발표자료 하나가 아닙니다.
source brief, slide spec, deck, presenter review, verification, handoff가 함께 남아야
다음 발표자료도 같은 품질로 만들 수 있습니다.
```

## Good Final Report

```text
변경 파일: slide-spec.json, slides/02-review-gate.html, assets/style.css
실행 명령: node scripts/verify-deck.js
결과: slide count 3, broken link 0, note exposure 0, overflow 0
남은 위험: 외부 이미지 없음. 실제 발표 전 문구 길이만 한 번 더 확인.
확인 URL: http://127.0.0.1:57610/deck.html
```
