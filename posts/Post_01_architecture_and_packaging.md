---
title: "[제1편] url2pdf: 파이썬 기반 웹 브라우저 제어 도구 설계와 패키지 구성"
series: "url2pdf"
part: 1
date: "2026-07-03"
tags: ["url2pdf", "python", "playwright", "architecture", "packaging", "hatchling"]
---

# [제1편] url2pdf: 파이썬 기반 웹 브라우저 제어 도구 설계와 패키지 구성

> **시리즈 목차**
> - **[제1편] 파이썬 기반 웹 브라우저 제어 도구 설계와 패키지 구성** (현재 글)
> - [제2편] 웹 브라우저 자동화와 지연 로딩(Lazy-Load) 콘텐츠 처리
> - [제3편] 명령어 입력 방식(CLI) 설계와 봇 방지 화면 처리
> - [제4편] GitHub Actions를 이용한 저장소 코드 자동 복사 설정

## 1. 프로젝트의 목적: 텍스트 복사와 검색이 가능한 PDF

웹 페이지를 PDF 파일로 저장하는 기존 프로그램들은 대부분 화면을 단순한 이미지(사진)로 저장합니다. 이렇게 저장된 PDF는 문서 안의 글자를 마우스로 선택해서 복사할 수 없고, 검색 기능도 사용할 수 없습니다. 또한 웹 페이지의 스크롤을 내리지 않으면 내용이 보이지 않는 웹사이트의 경우, 숨겨진 내용이 PDF에 저장되지 않는 문제가 있습니다.

`url2pdf`는 화면을 단순한 이미지로 변환하는 것이 아니라, 웹 문서의 구조(HTML과 텍스트)를 그대로 유지하여 **텍스트 선택과 검색이 가능한 형태의 PDF**를 만들기 위해 시작된 프로젝트입니다.

## 2. 코드 구조의 변경: 단일 파일에서 패키지로

처음 프로그램을 만들 때는 기능이 제대로 동작하는지 확인하기 위해 `prototype/url_to_pdf.py` 라는 하나의 파일에 모든 코드를 작성했습니다. 하지만 기능이 추가되고, 사용자가 터미널 창에 명령어를 입력해 사용하는 방식(CLI)을 지원해야 하면서 코드를 체계적으로 나누어야 할 필요성이 생겼습니다.

이를 해결하기 위해 파이썬의 표준 패키지 구조 중 하나인 **src 레이아웃(src-layout)** 을 적용했습니다.

### src 레이아웃 적용

```text
url2pdf/
├── pyproject.toml
├── src/
│   └── url2pdf/
│       ├── __init__.py
│       ├── cli.py         # 터미널 명령어 처리 코드
│       ├── converter.py   # PDF 변환 기능 코드
│       └── exceptions.py  # 오류 처리 코드
└── tests/
    └── test_url2pdf.py
```

`src/` 라는 폴더를 만들고 그 안에 기능별로 파일을 나누어 저장했습니다. 이렇게 하면 사용자가 프로그램을 설치했을 때와 개발자가 로컬 컴퓨터에서 코드를 수정할 때 동일한 구조를 가지게 되어 프로그램 오류를 줄일 수 있습니다.

## 3. 단일 원본(Single Source of Truth) 원칙 적용

테스트용 코드와 실제 배포용 코드가 따로 존재하면, 하나의 기능을 수정할 때 두 개의 파일을 모두 수정해야 하는 문제가 발생합니다. 이를 방지하기 위해 핵심 변환 기능은 `src/url2pdf/converter.py` 파일 하나에만 작성했습니다.

### 모듈 설정 (`__init__.py`)

```python
"""url2pdf - convert any web page to a searchable PDF."""

from .converter import convert, make_filename
from .exceptions import PageLoadError, PDFGenerationError, Url2PdfError

__all__ = [
    "convert",
    "make_filename",
    "Url2PdfError",
    "PageLoadError",
    "PDFGenerationError",
]

__version__ = "1.0.0"
```

사용자가 이 프로그램을 외부에서 가져다 쓸 때는 `__init__.py` 파일에 명시된 기능(`convert` 함수 등)만 사용할 수 있도록 설정했습니다. 과거에 사용하던 테스트용 스크립트 파일은 내부의 변환 코드를 모두 지우고, 이 `converter.py`에 있는 기능을 불러와서 실행하는 용도로만 남겨두었습니다. 따라서 코드를 여러 번 수정할 필요 없이 한 곳에서만 관리할 수 있습니다.

## 4. 프로그램 설정과 빌드 (pyproject.toml)

파이썬 프로그램을 사용자가 설치할 수 있는 형태(패키지)로 만들려면 설정 파일이 필요합니다. 과거에는 `setup.py` 파일을 사용했지만, 최근 파이썬 표준에 맞춰 `pyproject.toml` 이라는 파일을 사용했습니다. 패키지를 만드는 도구로는 속도가 빠른 **Hatchling**을 선택했습니다.

```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "url2pdf"
version = "1.0.0"
description = "Convert any web page to a searchable, text-selectable PDF"
requires-python = ">=3.10"
dependencies = [
    "playwright>=1.40",
]

[project.scripts]
url2pdf = "url2pdf.cli:main"
```

위 코드의 `[project.scripts]` 부분을 통해 사용자가 터미널에 `url2pdf` 라고 명령어를 입력하면, 프로그램 내부의 `url2pdf.cli` 파일에 있는 `main` 함수가 실행되도록 연결했습니다.

또한 개발 시에만 필요한 테스트 도구(`pytest`, `ruff` 등)는 일반 사용자에게 설치되지 않도록 별도로 분리하여 작성했습니다.

## 마무리 및 다음 편 예고

이번 글에서는 하나의 파일로 구성되어 있던 코드를 여러 파일로 나누어 체계적인 파이썬 패키지 구조로 변경하는 과정과, `pyproject.toml`을 이용해 사용자가 명령어로 프로그램을 실행할 수 있도록 설정하는 방법을 설명했습니다.

다음 **[제2편] 웹 브라우저 자동화와 지연 로딩(Lazy-Load) 콘텐츠 처리**에서는 파이썬으로 웹 브라우저를 직접 조작하는 방법과, 스크롤을 내려야만 이미지가 표시되는 웹페이지를 처리하는 코드를 설명하겠습니다.
