---
title: "[제3편] url2pdf: 명령어 입력 방식(CLI) 설계와 봇 방지 화면 처리"
series: "url2pdf"
part: 3
date: "2026-07-03"
tags: ["url2pdf", "python", "cli", "argparse", "bot-bypass"]
---

# [제3편] url2pdf: 명령어 입력 방식(CLI) 설계와 봇 방지 화면 처리

> **시리즈 목차**
> - [제1편] 파이썬 기반 웹 브라우저 제어 도구 설계와 패키지 구성
> - [제2편] 웹 브라우저 자동화와 지연 로딩(Lazy-Load) 콘텐츠 처리
> - **[제3편] 명령어 입력 방식(CLI) 설계와 봇 방지 화면 처리** (현재 글)
> - [제4편] GitHub Actions를 이용한 저장소 코드 자동 복사 설정

## 1. argparse를 활용한 명령어 입력 방식(CLI) 구현

`url2pdf`는 프로그램을 설치한 후 터미널(명령 프롬프트) 창에서 문자를 입력하여 곧바로 실행할 수 있는 명령어 환경(CLI, Command Line Interface)을 지원합니다. 파이썬에 내장된 `argparse`라는 도구를 사용하면 사용자가 입력한 명령어 옵션을 쉽게 분류하고 처리할 수 있습니다.

```python
# src/url2pdf/cli.py 파일

import argparse

def build_parser() -> argparse.ArgumentParser:
    # 1. 프로그램 이름과 설명을 설정합니다.
    parser = argparse.ArgumentParser(
        prog="url2pdf",
        description="웹 페이지를 텍스트 검색이 가능한 PDF로 변환합니다.",
    )
    
    # 2. 사용자가 입력할 수 있는 옵션들을 정의합니다.
    parser.add_argument("url", help="변환할 웹 페이지의 주소(URL)를 입력합니다.")
    parser.add_argument("-o", "--output", help="저장할 PDF 파일의 이름을 지정합니다.")
    parser.add_argument("--scale", type=float, default=0.9, help="PDF 안의 화면 크기 비율을 설정합니다.")
    
    # action="store_true"는 이 옵션이 입력되었을 때만 기능을 '켜짐(True)' 상태로 만든다는 의미입니다.
    parser.add_argument("--headed", action="store_true", help="작업 중에 실제 웹 브라우저 화면을 보여줍니다.")
    parser.add_argument("--manual-verification", action="store_true", help="봇 방지 화면이 나타나면 사용자가 수동으로 인증할 수 있도록 대기합니다.")
    
    return parser
```

위와 같이 코드를 작성하면, 사용자는 터미널 창에 `url2pdf https://example.com --scale 0.8 --headed` 처럼 띄어쓰기를 기준으로 옵션을 조합하여 프로그램을 실행할 수 있습니다. 또한 명령어를 잘못 입력하거나 `--help` 를 입력하면 사용 방법을 자동으로 안내해 줍니다.

## 2. 윈도우(Windows) 터미널 화면 글자 깨짐 방지

윈도우 운영체제의 터미널 창은 한글이나 특수기호를 처리하는 기본 방식(cp949)이 제한적입니다. 그래서 웹 페이지 제목에 이모티콘이나 특수한 기호(긴 줄표 등)가 포함되어 있으면 화면에 출력하다가 오류(UnicodeEncodeError)가 발생하고 프로그램이 강제로 종료될 수 있습니다.

이 문제를 방지하기 위해 `url2pdf` 프로그램이 터미널 창에 진행 상황을 출력할 때는, 윈도우 터미널에서 표시할 수 없는 특수 문자를 모두 일반 기호로 바꾸거나 제거하도록 구성했습니다.

## 3. 봇 방지 화면 통과하기

파이썬 프로그램으로 웹 브라우저를 자동 조작하다 보면, 봇 방지 시스템(Cloudflare Turnstile 등)이 이를 감지하고 사람인지 확인하기 위한 화면을 띄우곤 합니다. 보통 '연결이 안전한지 확인 중입니다' 또는 '로봇이 아닙니다'라는 문구와 함께 체크박스를 누르게 합니다.

자동화 프로그램만으로는 이 과정을 통과하기가 매우 어렵기 때문에, `url2pdf`는 사용자가 직접 이 화면을 해결할 수 있도록 **수동 검증 모드**를 만들었습니다.

### 수동 검증 모드 기능 구현

사용자가 명령어를 실행할 때 `--headed --manual-verification` 옵션을 입력하면, 웹 브라우저가 화면에 표시된 상태로 실행되고 프로그램은 봇 방지 화면이 나타났는지 검사합니다.

```python
# src/url2pdf/converter.py 파일 내부

# 봇 방지 화면에서 주로 사용하는 문구 목록입니다.
CHALLENGE_TITLE_KEYWORDS = ("just a moment", "verify you are human", "attention required")

def wait_for_manual_verification(page):
    title = page.title().lower() # 현재 웹 페이지의 제목을 소문자로 가져옵니다.
    
    # 제목에 봇 방지 문구가 포함되어 있지 않으면 아무 작업 없이 그대로 통과합니다.
    if not any(keyword in title for keyword in CHALLENGE_TITLE_KEYWORDS):
        return  

    print("[수동 모드] 봇 방지 인증 화면이 감지되었습니다.")
    # 사용자가 직접 마우스를 클릭해 봇 방지 화면을 해결할 때까지 파이썬 프로그램의 진행을 멈춥니다.
    input("[수동 모드] 인증을 마치고 웹 페이지 내용이 전부 보이면 터미널 창에서 Enter 키를 누르세요...")
    
    # Enter 키를 누르면, 웹 페이지가 완전히 로딩될 때까지 최대 60초간 대기합니다.
    page.wait_for_load_state("load", timeout=60000)
```

이 방식을 통해 봇 방지 시스템이 나타나면 파이썬 프로그램은 잠시 멈춥니다. 사용자가 브라우저 창에서 마우스로 인증을 마치고 터미널 창에서 `Enter` 키를 누르면, 프로그램은 멈췄던 지점부터 다시 코드를 실행하여 남은 스크롤 작업과 PDF 변환 작업을 마무리합니다.

## 4. 다음 편 예고

여기까지 `url2pdf` 프로그램의 핵심 동작 방식과 명령어 입력 구조를 설명했습니다. 
마지막 **[제4편] GitHub Actions를 이용한 저장소 코드 자동 복사 설정**에서는, 프로젝트 코드를 작업하는 과정에서 비공개(Private) 저장소의 코드를 공개(Public) 저장소로 안전하게 자동으로 복사(미러링)하는 설정 방법을 설명하겠습니다.
