# [제2편] url2pdf: 웹 브라우저 자동화와 지연 로딩(Lazy-Load) 콘텐츠 처리

> **시리즈 목차**
> - [제1편] 파이썬 기반 웹 브라우저 제어 도구 설계와 패키지 구성
> - **[제2편] 웹 브라우저 자동화와 지연 로딩(Lazy-Load) 콘텐츠 처리** (현재 글)
> - [제3편] 명령어 입력 방식(CLI) 설계와 봇 방지 화면 처리
> - [제4편] GitHub Actions를 이용한 저장소 코드 자동 복사 설정

## 1. 정적 웹 수집의 한계와 웹 브라우저 자동화 도구 도입

파이썬의 `requests`와 `BeautifulSoup` 라이브러리를 사용하면 웹 페이지의 문서(HTML)를 빠르게 가져올 수 있습니다. 하지만 최근의 웹 페이지들은 문서를 처음 열 때 모든 내용을 한 번에 보여주지 않고, 화면을 스크롤해서 내릴 때마다 새로운 이미지나 글을 서버에서 가져와 표시하는 '지연 로딩(Lazy-Load)' 방식을 많이 사용합니다.

단순히 문서만 가져오는 방식으로는 스크롤을 내릴 수 없기 때문에, 화면에 표시되지 않은 숨겨진 내용을 수집할 수 없습니다.

`url2pdf`는 이 문제를 해결하기 위해 **Playwright**라는 라이브러리를 사용합니다. Playwright는 파이썬 코드를 이용해 실제 웹 브라우저(크롬 등)를 백그라운드에서 실행하고, 사람이 직접 마우스를 움직이고 화면을 내리는 것과 동일하게 조작할 수 있는 자동화 도구입니다.

## 2. 스크롤을 내려야 하는 영역(컨테이너) 찾기

일반적인 파이썬 코드로는 웹 문서의 전체 길이를 계산해 화면을 맨 아래로 내립니다. 하지만 최신 웹사이트들은 화면 전체가 스크롤되는 것이 아니라, 특정 네모 상자(div 태그 등) 안에서만 내용이 스크롤되도록 만들어진 경우가 많습니다.

이런 경우에는 전체 화면을 스크롤해도 숨겨진 내용이 나타나지 않습니다. 따라서 `url2pdf`는 웹 페이지 안에 있는 모든 상자를 검사해서, **실제로 스크롤 바가 있는 가장 긴 상자**를 찾아내는 자바스크립트 코드를 웹 브라우저에 실행시킵니다.

```javascript
/* 웹페이지 내부의 스크롤 영역을 찾는 코드 (_JS_FIND_SCROLLER) */
() => {
    let best = document.scrollingElement || document.body;
    let bestDiff = best.scrollHeight - best.clientHeight;
    
    // 문서 안의 모든 태그(요소)를 검사합니다.
    for (const el of document.querySelectorAll('*')) {
        // 요소의 전체 길이(scrollHeight)에서 화면에 보이는 길이(clientHeight)를 뺍니다.
        const diff = el.scrollHeight - el.clientHeight;
        
        // 스크롤 할 수 있는 길이가 가장 길고, 요소 자체의 세로 길이가 200픽셀 이상인 것을 찾습니다.
        if (diff > bestDiff && el.clientHeight > 200) {
            best = el;
            bestDiff = diff;
        }
    }
    // 가장 긴 스크롤 영역에 'data-pdf-scroller'라는 표시(속성)를 추가합니다.
    best.setAttribute('data-pdf-scroller', '1');
}
```

## 3. 반복 스크롤을 통한 내용 불러오기

스크롤해야 할 영역을 찾았다면, 이제 파이썬 코드를 이용해 화면을 바닥까지 계속 내립니다.

```python
# src/url2pdf/converter.py 파일 내부 코드

# 1. 앞서 만든 자바스크립트를 실행해 스크롤할 영역에 표시를 남깁니다.
page.evaluate(_JS_FIND_SCROLLER)
last_height = -1

# 2. 지정된 횟수(기본 80번)만큼 반복해서 스크롤을 내립니다.
for _ in range(scroll_rounds):
    try:
        # 표시를 남긴 영역을 찾아 스크롤 바를 맨 아래로 내리고, 현재 영역의 길이를 반환합니다.
        height = page.evaluate(
            "() => {"
            "  const el = document.querySelector('[data-pdf-scroller]');"
            "  if (!el) return -1;"
            "  el.scrollTop = el.scrollHeight;"
            "  return el.scrollHeight;"
            "}"
        )
    except Exception:
        break
        
    # 화면을 내린 후 새로운 이미지가 나타날 때까지 잠시 기다립니다. (기본 0.8초)
    time.sleep(scroll_pause)
    
    # 3. 방금 전 영역 길이와 지금 길이가 같다면 더 이상 불러올 내용이 없다는 뜻이므로 중지합니다.
    if height == last_height:
        break
    last_height = height
```

이 코드가 모두 실행되면 화면 밖에 숨겨져 있던 이미지나 글이 모두 화면에 표시됩니다.

## 4. 올바른 PDF 출력을 위한 웹 페이지 화면 속성 수정

모든 내용을 불러왔다고 해서 바로 PDF로 저장할 수는 없습니다. 웹 브라우저의 기본 인쇄 기능(또는 PDF 저장 기능)은 화면 밖으로 삐져나온 내용(스크롤을 해야 보이는 내용)을 잘라버리는 특성이 있습니다.

PDF를 만들 때 내용이 잘리는 것을 막기 위해, 인쇄하기 직전에 자바스크립트를 이용해 웹 페이지의 표시 설정(CSS)을 강제로 변경합니다.

```javascript
/* PDF 저장 전 속성 변경 코드 (_JS_PREPARE_FOR_PRINT) */
() => {
    // 1. 전체 문서의 높이 제한을 없애고, 숨겨진 내용을 모두 보이게(overflow: visible) 설정합니다.
    document.documentElement.style.cssText +=
        ';height:auto!important;overflow:visible!important;';
    document.body.style.cssText +=
        ';height:auto!important;overflow:visible!important;max-width:none!important;';

    // 2. 문서 내의 모든 요소 설정을 확인합니다.
    for (const el of document.querySelectorAll('*')) {
        try {
            const s = getComputedStyle(el);
            // 화면 상단에 팝업창이나 메뉴바가 화면에 고정(fixed)되어 있으면 페이지 아래쪽까지 같이 인쇄되므로 설정을 취소합니다.
            if (s.position === 'fixed' || s.position === 'sticky') {
                el.style.position = 'static';
            }
            // 상자 안에 스크롤이 있는 경우(hidden, auto, scroll), 상자의 크기를 내용물 전체 길이만큼 늘립니다.
            if (['hidden', 'auto', 'scroll'].includes(s.overflow)) {
                if (el.scrollHeight > 200) {
                    el.style.overflow = 'visible';
                    el.style.maxHeight = 'none';
                    el.style.height = 'auto';
                }
            }
        } catch (_) {}
    }
    // PDF 캡처를 위해 화면의 시선을 가장 위로 올립니다.
    window.scrollTo(0, 0);
    return true;
}
```

또한, 일부 웹사이트는 개발자가 설정해둔 인쇄용 디자인(`@media print`) 때문에 PDF 저장 시 화면 구성이 어색해질 수 있습니다. 이를 방지하기 위해 파이썬 코드에서 `page.emulate_media(media="screen")` 설정을 적용하여, 우리가 모니터로 보는 화면(screen) 모습 그대로 PDF로 저장하도록 설정했습니다.

## 5. 다음 편 예고

이번 글에서는 프로그램의 핵심이 되는 웹 브라우저 조작 기능과, 숨겨진 내용을 표시하고 올바르게 인쇄되도록 화면을 조정하는 과정을 설명했습니다.

다음 **[제3편] 명령어 입력 방식(CLI) 설계와 봇 방지 화면 처리**에서는 사용자가 터미널 창에서 다양한 옵션 값을 주어 프로그램을 실행할 수 있도록 만드는 방법과, 자동화 프로그램을 차단하는 화면이 나타났을 때 수동으로 해결하는 방법을 설명하겠습니다.