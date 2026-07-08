---
title: "[제3편] 목소리로 연기하다: NAVER CLOVA API 연동기"
series: "Tell The Story"
part: 3
date: "2026-07-03"
tags: ["unity", "api", "stt", "clova", "security"]
---

# [제3편] 목소리로 연기하다: NAVER CLOVA API 연동기

> **시리즈 목차**
> - [제1편] 3D 공간 속의 2D: 빌보드 기법과 8방향 스프라이트
> - [제2편] NPC와의 상호작용: FSM을 활용한 대화 플로우 제어
> - **[제3편] 목소리로 연기하다: NAVER CLOVA API 연동기** (현재 글)
> - [제4편] 반복 작업 줄이기: TMP 폰트 일괄 교체 커스텀 에디터 툴

## 1. 음성 인식(STT) 기능의 도입

'Tell The Story'는 플레이어가 직접 마이크에 대고 감정을 담아 대사를 "연기"하는 게임 입니다. 
이를 위해 플레이어의 목소리를 녹음하고, 녹음된 소리를 텍스트(글자)로 변환해 주는 **STT(Speech-To-Text)** 기능이 필수적이었습니다. 이에 한국어 정확도가 높은 **NAVER CLOVA Speech API**를 유니티에 연동하기로 했습니다.

## 2. 유니티에서 소리 녹음하고 파일로 변환하기

우선 유니티에서 지원하는 마이크 기능(`Microphone.Start`)을 이용해 플레이어의 목소리를 녹음합니다. 하지만 이렇게 녹음된 데이터는 유니티 전용 형태(`AudioClip`)이기 때문에 네이버 서버로 곧바로 보낼 수가 없습니다.

그래서 녹음이 끝나면 네이버가 이해할 수 있는 표준 오디오 포맷인 **WAV 파일 형태(byte 배열)** 로 수작업 변환하는 코드를 작성해야 했습니다. (`ConvertAudioClipToWav` 함수)

## 3. NAVER CLOVA 서버로 데이터 전송 (UnityWebRequest)

변환된 WAV 데이터를 네이버 서버로 보내기 위해 유니티의 통신 기능(`UnityWebRequest`)을 사용합니다. 

```csharp
// Scripts/RecordManager.cs 내부 핵심 로직

private IEnumerator SendSpeechRecognitionRequest(byte[] audioData)
{
    // 1. 네이버 클로바 서버 주소로 소포(POST)를 보낼 준비를 합니다.
    using UnityWebRequest request = new UnityWebRequest(API_URL, "POST");

    // 2. "나는 권한이 있는 사용자입니다" 라는 비밀번호(ID/Secret)를 적어서 붙입니다.
    request.SetRequestHeader("X-NCP-APIGW-API-KEY-ID", ClientId);
    request.SetRequestHeader("X-NCP-APIGW-API-KEY", ClientSecret);
    request.SetRequestHeader("Content-Type", "application/octet-stream");

    // 3. 변환해 둔 WAV 오디오 파일(audioData)을 소포에 넣고 전송합니다!
    request.uploadHandler = new UploadHandlerRaw(audioData);
    request.downloadHandler = new DownloadHandlerBuffer();

    yield return request.SendWebRequest();

    // 4. 네이버 서버가 소리를 글로 바꿔서(STT) 답장을 보내주면 화면에 출력합니다.
    if (request.result == UnityWebRequest.Result.Success)
    {
        Debug.Log("STT 성공: " + request.downloadHandler.text);
    }
}
```

## 4. API 비밀번호를 안전하게 숨기는 법 (보안 처리)

위 코드에서 가장 조심해야 할 부분은 **자격증명(Client ID와 Client Secret)** 입니다. 
이 비밀번호를 소스 코드 파일(C#) 안에 대놓고 `string ClientId = "abcdefg";` 처럼 적어두면, 깃허브(GitHub)에 코드를 올릴 때 전 세계 사람들에게 내 비밀번호가 공개되는 대형 사고가 발생합니다. 누군가 내 비밀번호를 훔쳐서 서버를 마구 사용하면 막대한 요금 폭탄을 맞을 수 있습니다.

이를 막기 위해, 코드를 작성할 때 직접 문자를 적어 넣지 않고 **시스템 환경 변수**를 활용하는 방식을 택했습니다.

```csharp
// 내 컴퓨터 시스템 자체에 등록된 변수에서 값을 몰래 빼옵니다.
private static readonly string ClientId = Environment.GetEnvironmentVariable("NAVER_CLOVA_CLIENT_ID");
private static readonly string ClientSecret = Environment.GetEnvironmentVariable("NAVER_CLOVA_CLIENT_SECRET");
```

이렇게 하면 깃허브에는 `Environment.GetEnvironmentVariable` 이라는 껍데기 코드만 올라가므로 안전을 보장할 수 있습니다. 로컬 환경에서 테스트할 때만 각자의 컴퓨터 윈도우 환경 변수 설정에 가서 ID와 비밀번호를 등록해 주면 됩니다.

## 5. 다음 편 예고

이번 글에서는 마이크 녹음부터 WAV 변환, 네이버 클로바 API를 활용한 STT 통신 및 보안 처리 과정까지 알아보았습니다.

마지막 **[제4편] 반복 작업 줄이기: TMP 폰트 일괄 교체 커스텀 에디터 툴**에서는 게임 개발 막바지에 수십 개의 화면 폰트를 통째로 바꿔야 하는 위기 상황에서, 수작업 대신 에디터 툴을 직접 만들어서 버튼 클릭 한 번으로 모든 폰트를 갈아 끼웠던 흥미로운 경험을 다루겠습니다.
