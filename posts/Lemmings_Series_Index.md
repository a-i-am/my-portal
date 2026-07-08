# Lemmings Win32 API: 자체 프레임워크 기반 고전 게임 모작

이 시리즈는 C++과 Win32 API만을 사용하여 고전 게임 'Lemmings(레밍즈)'를 모작하며 학습한 게임 엔진 아키텍처와 렌더링 기법을 다룹니다.
유니티나 언리얼 같은 상용 엔진이 내부적으로 어떻게 동작하는지 이해하기 위해, 바닥부터 직접 프레임워크를 설계하고 구현한 과정을 기록했습니다.

## 📝 시리즈 목차 (Draft)

- **[제1편] Win32 API 기반 자체 프레임워크 설계**
  - 상용 엔진의 구조를 벤치마킹한 Actor-Component 패턴 구현
  - Game, Scene 단위의 상태 관리 및 TimeManager를 활용한 프레임 제어
- **[제2편] 레밍즈의 행동 패턴: Job 시스템과 상태 관리**
  - 레밍즈의 다양한 직업(Walker, Digger, Faller 등)을 관리하기 위한 상태 패턴(State Pattern) 및 JobFactory 구현
  - 직업 변경 시 발생하는 메모리 할당 및 해제 구조
- **[제3편] 픽셀 단위 마스크 충돌과 비트맵 렌더링 최적화**
  - GDI(Graphics Device Interface)를 활용한 비트맵 이미지 출력(BitBlt, TransparentBlt)
  - 지형(Terrain) 파괴 및 픽셀 단위 충돌을 판정하기 위한 마스크(Mask) 시스템 처리 구조

---

## 📌 주요 기술 스택
- C++
- Win32 API (GDI)
- Visual Studio (MSVC)

## 📁 작업 폴더 구조
`/Blog/TIL/Lemmings/` 하위에 시리즈 포스트가 저장될 예정입니다.