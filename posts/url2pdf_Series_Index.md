# url2pdf: 웹 페이지를 PDF로 변환하는 파이썬 패키지 구현기 (Series Index)

## 📌 [제1편] url2pdf 아키텍처 설계와 Python 패키징
**주제**: 기존 HTML-to-PDF 도구들의 한계점을 극복하기 위한 새로운 접근법과, 유지보수를 위한 Python 패키지 설계 원칙
**핵심 다룰 내용**:
- 왜 이미지 기반 PDF가 아닌 진짜 PDF(텍스트 선택 가능)가 필요한가?
- 프로토타입 스크립트에서 `src` 레이아웃 기반의 견고한 패키지로 승격시키는 과정
- 단일 원본(Single Source of Truth) 원칙 적용 및 `pyproject.toml`을 활용한 의존성 관리
**집중 분석 파일**: 
- `pyproject.toml`
- `prototype/url_to_pdf.py` (래퍼 스크립트로의 전환 과정)

## 📌 [제2편] Playwright로 지연 로딩(Lazy-Load) 한계 돌파하기
**주제**: 동적 웹페이지의 가장 큰 난관인 무한 스크롤 및 Lazy-Load 콘텐츠를 완벽히 캡처하는 렌더링 로직
**핵심 다룰 내용**:
- `Playwright`를 이용한 Headless Chromium 구동 원리
- 가장 깊은 스크롤 컨테이너를 자동으로 감지하고, `--scroll-rounds` 만큼 반복 스크롤을 트리거하는 알고리즘
- 깨끗한 `<body>`로 컨테이너 내용을 이식하고 CSS 제약을 해제하는 트러블슈팅 과정
**집중 분석 파일**: 
- `src/url2pdf/converter.py` (`convert()` 함수의 핵심 로직 및 브라우저 제어)

## 📌 [제3편] 확장 가능한 CLI 설계와 봇 방지 시스템 우회
**주제**: 사용자가 커맨드라인 환경에서 도구를 직관적으로 사용하게 만들고, 까다로운 환경(예: Cloudflare Turnstile)에 유연하게 대처하는 방법
**핵심 다룰 내용**:
- `argparse`를 활용한 정교한 CLI 옵션 구성 (`--scale`, `--format` 등)
- CLI 환경의 Windows 인코딩(cp949) 문제 회피 기법
- 봇 방지 화면을 우회하기 위한 `--headed` 및 `--manual-verification` (수동 검증) 모드 도입
**집중 분석 파일**: 
- `src/url2pdf/cli.py` (CLI 파싱 및 예외 처리 로직)

## 📌 [제4편] GitHub Actions를 활용한 Private-to-Public 미러링 자동화
**주제**: 개발 중인 Private 코드베이스를 안전하게 보호하면서도 오픈소스로 릴리즈하는 효율적인 CI/CD 파이프라인
**핵심 다룰 내용**:
- 왜 Private 저장소에서 개발하고 Public으로 배포하는가? (보안 및 환경 설정 분리)
- `v*` Tag Push를 트리거로 동작하는 GitHub Actions Workflow 설계
- `cpina/github-action-push-to-another-repository`를 활용한 미러링과 PAT(Personal Access Token) 권한 최소화 원칙
**집중 분석 파일**: 
- `.github/workflows/deploy_to_public.yml`
- `.gitignore` (보안을 위한 추적 제외 설정)