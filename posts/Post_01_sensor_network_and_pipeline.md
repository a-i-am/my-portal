# [제1편] 센서 네트워크 연동: TCP/OSC 입력과 이벤트 파이프라인 구축

> **시리즈 목차**
> - **[제1편] 센서 네트워크 연동: TCP/OSC 입력과 이벤트 파이프라인 구축** (현재 글)
> - [제2편] 웹캠 실루엣 추출: Barracuda와 SelfieSegmentation 
> - [제3편] 실시간 파티클 아트: Visual Effect Graph와 해파리 군집
> - [제4편] 전시 환경 최적화: 멀티 디스플레이와 빌드 자동화

## 1. 외부 센서 데이터를 사용하는 이유

'Jellyfish Dancers'는 전시장을 방문한 관객의 움직임에 반응하는 미디어 아트입니다. 키보드나 마우스 대신, 스마트폰이나 외부 센서 기기에서 보내는 신호(기울기, 가속도, 화면 터치 등)를 받아 화면 속 해파리의 움직임을 제어합니다.

기기끼리 데이터를 주고받기 위해 **OSC(Open Sound Control)** 라는 통신 방식을 사용합니다. OSC는 네트워크를 통해 숫자를 빠르게 전달하기 위해 만들어진 규칙입니다. 주로 미디어 아트나 음악 공연 장비에서 많이 사용됩니다.

## 2. 데이터 수신 및 해독 (OscMessageDecoder)

외부 센서에서 OSC 형식으로 데이터를 보내면, 유니티(Unity) 프로그램은 네트워크(TCP 또는 UDP)를 통해 이 신호를 수신합니다. 수신된 신호는 컴퓨터가 처리할 수 있는 숫자로 변환해야 합니다.

OSC 데이터는 문자와 숫자가 결합된 형태로 전달됩니다. 예를 들어 스마트폰의 화면 터치 위치를 보내면 `"/phone/touch, x좌표, y좌표"` 형태로 들어옵니다. 

`OscMessageDecoder` 파일은 수신된 데이터에서 주소(`"/phone/touch"`)와 숫자 배열을 분리하는 역할을 합니다. 만약 데이터 형식이 올바르지 않으면 오류로 처리하고 무시하여 프로그램이 멈추지 않도록 설계했습니다.

## 3. 데이터를 이벤트로 변환하는 라우터 (SensorMessageRouter)

데이터를 숫자로 바꾼 다음에는, 이 숫자가 무엇을 의미하는지 분류해서 프로그램의 각 요소에 전달해야 합니다. 이 역할을 `SensorMessageRouter`가 담당합니다.

```csharp
// SensorMessageRouter.cs 내부의 주요 코드 형태

// 스마트폰이나 태블릿 등 기기별로 데이터를 분류합니다.
if (id == config.phone.deviceId)
{
    // 화면 터치 위치(Vector2) 데이터를 읽어옵니다.
    if (TryReadVector2(address, values, config.oscMappings.phoneTouch, out Vector2 uv))
    {
        // 터치 좌표를 유니티 화면 비율(0~1)에 맞게 변환합니다.
        uv = ConvertToUv(uv, config.oscMappings.phoneTouch);
        
        // 프로그램 전체에 "화면 터치 이벤트가 발생했다"고 방송(Publish)합니다.
        eventBus.Publish(new TouchUvEvent(id, uv, time, ep));
    }
}
else if (id == config.tablet.deviceId)
{
    // 태블릿의 기울기(Tilt) 데이터를 읽어옵니다.
    if (TryReadVector3(address, values, config.oscMappings.tabletTilt, out Vector3 tilt))
    {
        eventBus.Publish(new VectorSensorEvent(id, SensorVectorType.Tilt, tilt, time, ep));
    }
}
```

위 코드처럼 라우터는 기기(스마트폰, 태블릿)와 주소(`address`)를 확인한 뒤, 값을 화면 좌표나 기울기 데이터로 정리합니다. 그리고 `eventBus.Publish` 기능을 통해 **"새로운 센서 입력이 들어왔다"** 는 사실을 프로그램 전체에 알립니다(이벤트 발행).

## 4. 공통된 이벤트 파이프라인의 장점

이렇게 네트워크로 받은 데이터를 곧바로 해파리를 조종하는 코드에 연결하지 않고, 중간에 **이벤트 버스(Event Bus)** 를 거치도록 만든 이유가 있습니다.

프로그램을 만들 때는 실제 전시장에서 사용하는 센서가 없을 때도 테스트를 해야 합니다. 이벤트 방식을 사용하면, 마우스 클릭이나 테스트용 가짜 코드를 만들어서 `TouchUvEvent`를 발생시켜도 프로그램은 실제 센서가 입력된 것과 똑같이 반응합니다. 

즉, 입력 장치가 무엇이든 상관없이 하나로 통합된 이벤트 처리 방식(파이프라인)을 가지게 되어, 코드를 수정하거나 새로운 센서를 추가하기가 매우 쉬워집니다.

## 5. 다음 편 예고

이번 글에서는 외부 센서의 신호를 유니티 프로그램으로 받아오고, 이를 프로그램이 사용할 수 있는 이벤트로 변환하는 구조를 설명했습니다.

다음 **[제2편] 웹캠 실루엣 추출: Barracuda와 SelfieSegmentation**에서는 센서 신호 외에도 관객의 모습을 직접 인지하기 위해, 웹캠 영상을 분석하고 사람의 형태(실루엣)만 잘라내는 방법을 설명하겠습니다.