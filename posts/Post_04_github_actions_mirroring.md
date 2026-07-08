# [제4편] url2pdf: GitHub Actions를 이용한 저장소 코드 자동 복사 설정

> **시리즈 목차**
> - [제1편] 파이썬 기반 웹 브라우저 제어 도구 설계와 패키지 구성
> - [제2편] 웹 브라우저 자동화와 지연 로딩(Lazy-Load) 콘텐츠 처리
> - [제3편] 명령어 입력 방식(CLI) 설계와 봇 방지 화면 처리
> - **[제4편] GitHub Actions를 이용한 저장소 코드 자동 복사 설정** (현재 글)

## 1. 비공개(Private) 저장소와 공개(Public) 저장소를 분리하는 이유

개발자들이 오픈소스 프로그램을 만들어 코드를 대중에게 공개할 때, 비밀번호가 적힌 설정 파일이나 개발 중인 불완전한 코드는 보여주고 싶지 않을 수 있습니다. 

`url2pdf` 프로젝트 역시 이러한 보안 유지와 코드 관리를 위해 두 개의 깃허브(GitHub) 저장소를 사용했습니다.
1. **비공개(Private) 저장소 (`url2pdf-project`)**: 실제 개발을 진행하고 코드를 수정하는 공간입니다. 외부인은 볼 수 없습니다.
2. **공개(Public) 저장소 (`url2pdf-public`)**: 개발이 완료되어 배포 준비가 끝난 코드만 모아 외부 사용자에게 공개하는 공간입니다.

이 두 저장소를 분리해두면 안전하지만, 개발이 끝날 때마다 비공개 저장소의 코드를 복사해서 공개 저장소에 붙여넣고 다시 업로드(Push)하는 작업은 매우 번거롭습니다. 그래서 이 작업을 컴퓨터가 알아서 처리하도록 **GitHub Actions**라는 자동화 기능을 설정했습니다.

## 2. 자동화 설정 파일 작성 (Workflow)

GitHub Actions는 특정 조건이 만족되었을 때 미리 작성해둔 명령어를 자동으로 실행해 주는 기능입니다. 이 자동화 규칙은 `.github/workflows` 라는 폴더 안에 YAML(`yml`) 형식의 파일로 저장합니다.

이 자동화 설정은 코드를 수정할 때마다 동작하는 것이 아니라, 특정 버전 표시(예: `v1.0.0`)가 붙은 코드가 올라왔을 때만 동작하도록 조건을 걸었습니다.

### 특정 버전(Tag)이 업로드될 때만 작동하도록 설정

```yaml
# .github/workflows/deploy_to_public.yml 파일의 앞부분

name: Deploy to public repository

on:
  push:
    tags:
      - "v*"
```
`on: push: tags: - "v*"` 라는 설정은 개발자가 `v`로 시작하는 버전 이름표(태그)를 코드에 달아서 깃허브에 업로드할 때만 아래의 작업들을 실행하라는 뜻입니다.

### 코드를 다른 저장소로 복사하는 기능 적용

비공개 저장소의 코드를 공개 저장소로 보내기 위해, 다른 개발자가 미리 만들어 둔 자동화 명령어 꾸러미(Action)인 `cpina/github-action-push-to-another-repository`를 사용했습니다.

```yaml
    steps:
      - name: 비공개 저장소 코드 가져오기
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 공개 저장소로 코드 전송하기
        uses: cpina/github-action-push-to-another-repository@main
        env:
          API_TOKEN_GITHUB: ${{ secrets.PUBLIC_REPO_PAT }}
        with:
          source-directory: "."
          destination-github-username: "a-i-am"
          destination-repository-name: "url2pdf-public"
          user-email: "github-actions[bot]@users.noreply.github.com"
          user-name: "github-actions[bot]"
          target-branch: "main"
```

위 코드는 다음과 같은 순서로 작동합니다.
1. 현재 작업 중인 비공개 저장소의 모든 코드를 가져옵니다 (`source-directory: "."`).
2. 복사한 코드를 `a-i-am` 사용자의 `url2pdf-public` 이라는 이름의 공개 저장소 메인 브랜치(`target-branch: "main"`)로 보냅니다.
3. 이때 코드를 올리는 사람의 이름을 봇(github-actions[bot])으로 지정하여, 자동으로 업로드되었음을 표시합니다.

## 3. 권한 문제 해결: 접근 권한 토큰 (Personal Access Token)

다른 저장소에 코드를 수정하거나 올리려면 비밀번호 역할을 하는 권한 인증키가 필요합니다. 하지만 설정 파일 안에 실제 비밀번호를 문자로 그대로 적어두면 매우 위험합니다.

따라서 깃허브에서 제공하는 '접근 권한 토큰(Personal Access Token)'을 발급받은 뒤, 깃허브 설정 메뉴의 **Secrets** 항목에 `PUBLIC_REPO_PAT` 라는 이름으로 등록하여 숨겼습니다. 설정 파일의 `env` 블록을 보면 `${{ secrets.PUBLIC_REPO_PAT }}` 라는 코드를 통해 숨겨진 키를 안전하게 불러와 사용하고 있습니다.

또한 여기서 발급한 토큰은 모든 권한을 주는 클래식(Classic) 토큰이 아니라, 세부 권한을 지정할 수 있는 **Fine-grained 토큰**을 사용했습니다.
- **대상 범위**: 내 깃허브 전체가 아닌 `url2pdf-public` 단 한 개의 저장소만 접근 가능하게 설정
- **권한 범위**: 코드를 읽고 쓰는 권한(`Contents: Read and write`)만 허용

이렇게 꼭 필요한 권한만 주도록 설정(최소 권한 원칙)하면, 실수로 토큰이 유출되더라도 다른 중요한 프로젝트에 피해가 가는 것을 막을 수 있습니다.

## 마무리

총 4편에 걸쳐 `url2pdf` 프로젝트의 기술적인 구성 과정을 모두 살펴보았습니다. 
파이썬의 패키지 설정 방법부터, 웹 브라우저를 자동 조작하여 숨겨진 내용을 찾아내는 방법, 사용자가 직접 명령어를 입력하는 화면을 설계하는 과정, 그리고 마지막으로 깃허브를 이용해 코드를 안전하게 다른 공간으로 복사하는 자동화 설정까지 확인했습니다. 

이러한 개발 과정과 문제 해결 방법이 프로그램 개발을 학습하는 분들께 도움이 되기를 바랍니다.