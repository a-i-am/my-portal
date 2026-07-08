---
title: "[제4편] 전시 환경 최적화: 멀티 디스플레이와 빌드 자동화"
series: "Jellyfish Dancers"
part: 4
date: "2026-07-03"
tags: ["unity", "multi-display", "build", "automation"]
---

# [제4편] 전시 환경 최적화: 멀티 디스플레이와 빌드 자동화

> **시리즈 목차**
> - [제1편] 센서 네트워크 연동: TCP/OSC 입력과 이벤트 파이프라인 구축
> - [제2편] 웹캠 실루엣 추출: Barracuda와 SelfieSegmentation
> - [제3편] 실시간 파티클 아트: Visual Effect Graph와 해파리 군집
> - **[제4편] 전시 환경 최적화: 멀티 디스플레이와 빌드 자동화** (현재 글)

## 1. 전시장에서 여러 대의 모니터 사용하기

미디어 아트 전시에서는 하나의 컴퓨터에 여러 대의 빔 프로젝터나 대형 모니터를 연결해서 거대한 화면을 만드는 경우가 많습니다. 'Jellyfish Dancers' 역시 메인 화면(관객이 서 있는 곳)과 서브 화면(TV 디스플레이)으로 구성되어 있습니다.

유니티(Unity)에서 여러 대의 모니터를 사용하려면, 프로그램이 시작될 때 컴퓨터에 연결된 모니터가 몇 대인지 확인하고 각 모니터에 어떤 화면을 띄울지 코드로 지정해 주어야 합니다. 이 역할을 `MultiDisplayBootstrap` 파일이 담당합니다.

```csharp
// _Project/Scripts/Runtime/MultiDisplayBootstrap.cs 내부 코드

// 1. 컴퓨터에 연결된 모니터(디스플레이)의 개수를 확인합니다.
if (Display.displays.Length <= 1)
{
    Debug.Log("[MultiDisplay] 2번째 모니터(TV)가 연결되어 있지 않습니다.");
    return;
}

// 2. 2번째 모니터가 연결되어 있다면 화면을 켭니다. (Activate)
Display.displays[1].Activate();

// 3. 서브 화면용 카메라를 찾아, 그 카메라가 촬영하는 화면을 2번째 모니터로 보냅니다.
camera.targetDisplay = 1;
```

이렇게 설정해두면, 전시장에 도착해 컴퓨터와 2대의 모니터를 연결하고 프로그램을 켜기만 해도 자동으로 메인 화면과 서브 화면이 분리되어 띄워집니다. 마우스로 창을 끌어다 옮길 필요가 없게 됩니다.

## 2. 다양한 환경을 위한 프로그램 제작 (빌드 자동화)

개발이 끝난 유니티 프로젝트를 윈도우(Windows) 실행 파일이나 안드로이드(Android) 앱으로 만드는 과정을 **빌드(Build)** 라고 부릅니다. 

보통은 유니티 편집기 화면에서 버튼을 눌러 빌드를 진행하지만, 'Jellyfish Dancers'는 전시용 윈도우 컴퓨터, 인터넷 브라우저(WebGL), 스마트폰(Android) 등 다양한 환경에서 작동하는지 확인하기 위해 여러 개의 빌드 파일을 자주 만들어야 했습니다.

이 과정을 편하게 만들기 위해 `BuildPlatforms.cs` 파일에 파이썬 스크립트처럼 명령어로 빌드를 지시할 수 있는 코드를 작성했습니다.

```csharp
// _Project/Scripts/Editor/BuildPlatforms.cs 내부 코드

public static void Build()
{
    // 1. 터미널(명령 프롬프트)에서 입력한 옵션 값들을 읽어옵니다.
    // 예: -buildTarget Android -buildOutput ./build/android
    
    // 2. 읽어온 옵션에 따라 어떤 형태(윈도우, 안드로이드 등)로 만들지 결정합니다.
    BuildPlayerOptions options = new BuildPlayerOptions();
    options.target = ... // 입력받은 타겟 설정
    options.locationPathName = ... // 저장할 폴더 설정
    
    // 3. 유니티에 내장된 빌드 명령을 실행합니다.
    BuildPipeline.BuildPlayer(options);
}
```

이렇게 코드를 만들어두면, 마우스를 클릭할 필요 없이 터미널 창에 명령어 한 줄만 입력하면 유니티가 알아서 프로젝트를 열고 지정된 폴더에 실행 파일을 만들어 줍니다. 이 방법은 나중에 깃허브(GitHub) 같은 서버에서 자동으로 앱을 만들게 할 때(자동화 배포) 반드시 필요한 기술입니다.

## 마무리

총 4편에 걸쳐 **Jellyfish Dancers** 미디어 아트 프로젝트의 제작 과정을 살펴보았습니다.
외부 센서와 네트워크 통신을 통해 관객의 움직임을 숫자로 바꾸고, 웹캠과 인공지능을 이용해 형태를 분리해내고, 이 데이터들을 조합하여 수백 마리의 해파리와 빛을 그려내는 전체 흐름을 확인했습니다. 그리고 마지막으로 이를 전시장에서 편하게 켜고 끌 수 있는 자동화 설정까지 완성했습니다.

기술적인 내용들을 최대한 직관적으로 풀어 설명하고자 노력했습니다. 이 시리즈가 유니티를 이용한 인터랙티브 미디어 아트나 실시간 그래픽에 관심이 있는 분들께 도움이 되기를 바랍니다.
