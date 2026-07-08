---
title: "[제2편] 웹캠 실루엣 추출: Barracuda와 SelfieSegmentation"
series: "Jellyfish Dancers"
part: 2
date: "2026-07-03"
tags: ["unity", "webcam", "segmentation", "barracuda", "shader"]
---

# [제2편] 웹캠 실루엣 추출: Barracuda와 SelfieSegmentation

> **시리즈 목차**
> - [제1편] 센서 네트워크 연동: TCP/OSC 입력과 이벤트 파이프라인 구축
> - **[제2편] 웹캠 실루엣 추출: Barracuda와 SelfieSegmentation** (현재 글)
> - [제3편] 실시간 파티클 아트: Visual Effect Graph와 해파리 군집
> - [제4편] 전시 환경 최적화: 멀티 디스플레이와 빌드 자동화

## 1. 관객의 모습을 인식하는 방법

미디어 아트 전시에서 관객이 작품에 더 몰입하게 하려면, 관객 자신의 모습이 화면에 직접 나타나거나 관객의 움직임에 따라 그림(그래픽)이 반응하게 만드는 것이 좋습니다.

'Jellyfish Dancers'는 전시장에 설치된 웹캠을 통해 관객의 모습을 촬영합니다. 하지만 단순히 촬영한 영상을 그대로 보여주는 것이 아니라, 인공지능(AI)을 이용해 배경은 지우고 사람의 형태(실루엣)만 흑백으로 분리해내는 **세그멘테이션(Segmentation)** 기술을 사용합니다. 이렇게 분리된 사람의 형태는 화면 속의 빛(파티클)이나 해파리가 관객을 향해 모여들게 만드는 중요한 재료가 됩니다.

## 2. Unity Barracuda 엔진 활용

유니티(Unity)에서 인공지능 모델을 실시간으로 실행하기 위해 **Barracuda**라는 도구를 사용했습니다. 외부 서버로 영상을 보내지 않고 관객의 컴퓨터(또는 전시용 컴퓨터) 안에서 곧바로 연산을 처리하기 때문에 화면이 끊기거나 지연되는 현상을 최소화할 수 있습니다.

특히 사람의 형태를 빠르고 정확하게 찾아내기 위해, 미리 학습된 [SelfieSegmentation](https://github.com/creativeIKEP/SelfieSegmentationBarracuda) 모델을 가져와 프로젝트에 적용했습니다.

## 3. 웹캠 영상과 AI 모델의 연결 (MaskToShaderBinder)

컴퓨터에 연결된 웹캠 영상을 가져와서 AI 모델에 넣고 사람의 형태(마스크)를 뽑아내는 과정은 `MaskToShaderBinder` 파일에서 담당합니다.

```csharp
// _Project/Scripts/Webcam/MaskToShaderBinder.cs 내부의 주요 코드

private void LateUpdate()
{
    // 1. 웹캠 카메라가 켜져 있는지 확인합니다.
    if (webcamRenderer == null || !webcamRenderer.IsUsingWebcam) return;

    WebCamTexture webcamTex = webcamRenderer.WebcamTexture;
    
    // 2. 화면이 새로고침(업데이트)되지 않았거나, 지정된 속도(FPS)보다 너무 빠르면 연산을 건너뜁니다.
    if (webcamTex == null || !webcamTex.didUpdateThisFrame || Time.unscaledTime < nextInferenceTime)
    {
        return;
    }
    
    // 다음 연산 시간을 설정합니다. (예: 1초에 20번만 연산하도록 제한)
    nextInferenceTime = Time.unscaledTime + (1f / maxInferenceFps);

    // 3. 웹캠 이미지를 AI 모델(segmentation)에 넣어 사람의 형태(마스크 텍스처)를 뽑아냅니다.
    segmentation.ProcessImage(webcamTex);

    // 4. 뽑아낸 이미지 데이터를 그래픽(셰이더) 설정에 전달합니다.
    if (runtimeMaterial != null)
    {
        // 원본 웹캠 영상 전달
        runtimeMaterial.SetTexture("_WebcamTex", webcamTex);
        // 배경을 지운 사람 형태(흑백 마스크) 전달
        runtimeMaterial.SetTexture("_MaskTex", segmentation.texture);
    }
}
```

위 코드는 영상이 입력될 때마다 쉴 새 없이 동작합니다. 단, 컴퓨터가 너무 무리하지 않도록 `maxInferenceFps` 값을 설정해 1초에 일정 횟수(예: 20번)만 AI 모델이 동작하도록 속도를 조절했습니다.

## 4. 셰이더(Shader)로 데이터 넘겨주기

위 코드의 마지막 부분을 보면 `_WebcamTex`와 `_MaskTex`라는 이름으로 이미지 데이터를 넘겨주는 것을 볼 수 있습니다.

이렇게 코드를 통해 넘겨진 두 개의 이미지는 **셰이더(Shader)** 와 **비주얼 이펙트 그래프(VFX Graph)** 라는 유니티의 그래픽 도구로 들어갑니다. 그래픽 도구는 이 흑백 마스크 이미지를 이용해 "하얀색 부분(사람이 있는 곳)에만 별빛을 뿌려라" 또는 "해파리들이 하얀색 부분을 피해서 헤엄치게 만들어라" 같은 시각적인 마술을 부리게 됩니다.

## 5. 다음 편 예고

이번 글에서는 웹캠 영상을 받아 AI 기술로 관객의 형태만 분리해내고, 그 결과물을 그래픽 도구로 전달하는 과정을 살펴보았습니다.

다음 **[제3편] 실시간 파티클 아트: Visual Effect Graph와 해파리 군집**에서는 이렇게 전달받은 센서 데이터와 실루엣 이미지를 바탕으로, 수많은 해파리와 빛 무리(파티클)들이 화면 속에서 어떻게 화려하게 움직이도록 렌더링하는지 설명하겠습니다.
