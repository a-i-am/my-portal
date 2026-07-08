# [제3편] 픽셀 단위 마스크 충돌과 비트맵 렌더링 최적화

> **시리즈 목차**
> - [제1편] Win32 API 기반 자체 프레임워크 설계
> - [제2편] 레밍즈의 행동 패턴: Job 시스템과 상태 관리
> - **[제3편] 픽셀 단위 마스크 충돌과 비트맵 렌더링 최적화** (현재 글)

## 1. 지형 파괴와 픽셀 단위 충돌 판정

'Lemmings'의 핵심 메커니즘은 캐릭터가 땅을 파고(Digger) 길을 뚫는 상호작용입니다. 이를 구현하기 위해 일반적인 바운딩 박스(AABB) 충돌이 아닌 픽셀 단위의 마스크 충돌(Pixel Perfect Collision) 시스템을 구축했습니다.

`Terrain` 클래스는 맵 전체 이미지를 가지고 있으며, 런타임에 메모리에 로드된 픽셀 배열 데이터를 직접 참조하여 충돌 여부를 확인합니다.

```cpp
// src/Terrain.cpp

bool Terrain::isSolid(int32 x, int32 y) const
{
    // 맵 범위를 벗어나면 충돌하지 않은 것으로 처리
    if (x < 0 || x >= _width || y < 0 || y >= _height)
        return false;
        
    // (x, y) 픽셀의 데이터가 0(투명/빈 공간)이 아니라면 충돌(Solid) 상태로 판정
    return _levelTexture->getTexture()->GetPixelData()[y * _width + x] != 0;
}
```

캐릭터가 지형을 파괴할 때는 해당 좌표의 픽셀 데이터(RGB)를 강제로 0(검은색)으로 덮어씌웁니다. 이후 렌더링을 갱신하면 파괴된 지형이 화면에 반영되며, 다음 프레임부터 `isSolid` 함수는 이 공간을 통과 가능한 영역으로 인식하게 됩니다.

## 2. GDI 비트맵 렌더링 최적화 (TransparentBlt vs StretchDIBits)

지형의 픽셀 조작과 캐릭터 애니메이션을 화면에 출력하기 위해 Win32 GDI 시스템을 활용했습니다. 렌더링 속도와 투명도 처리를 위해 상황에 따라 다른 API를 적용했습니다.

```cpp
// src/Texture.cpp (Render 로직 요약)

if (!isTransparent) 
{
    // 1. 지형 등 투명 처리가 필요 없는 정적 이미지 출력
    StretchDIBits(hdc,
        (int32)screenPos.x, (int32)screenPos.y, frameSize.x, frameSize.y,
        0, 0, _originTexSizeX, _originTexSizeY,
        _rawData, &_bitmapInfo, DIB_RGB_COLORS, SRCCOPY
    );
}
else 
{
    // 2. 캐릭터 스프라이트 등 투명 배경(마젠타 등) 제거 후 출력
    TransparentBlt(hdc,
        (int32)screenPos.x, (int32)screenPos.y, frameSize.x, frameSize.y,
        _hdc, (int32)srcPos.x, (int32)srcPos.y, _frameWidth, _frameHeight, 
        _transparent  // 투명하게 처리할 색상(Color Key)
    );
}
```

- **StretchDIBits**: `_rawData` 배열을 통째로 HDC(Device Context)에 전송합니다. 루프를 돌며 픽셀 하나씩 `SetPixel`을 호출하는 방식보다 압도적으로 속도가 빠르며, 메모리 상에서 파괴된 지형 픽셀 데이터가 즉각적으로 화면에 갱신됩니다.
- **TransparentBlt**: 애니메이션 스프라이트 시트에서 특정 프레임(srcPos)만 잘라내어 출력합니다. 스프라이트의 배경색을 투명색(`_transparent`)으로 지정하여 사각형 외곽선이 보이지 않고 캐릭터만 깔끔하게 렌더링되도록 구현했습니다.

## 3. 마무리

총 3편에 걸쳐 C++와 Win32 API로 고전 명작 'Lemmings'를 재현하며 겪었던 주요 시스템 구현 과정을 정리했습니다. 
상용 엔진이 추상화하여 제공하는 객체지향적 컴포넌트 프레임워크, 상태 관리를 통한 행동 제어, 그리고 메모리 기반의 렌더링과 충돌 구조를 바닥부터 설계하며 게임 엔진 내부의 작동 원리를 깊이 이해할 수 있었습니다.