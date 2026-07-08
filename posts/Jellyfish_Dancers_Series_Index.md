# Jellyfish Dancers: 인터랙티브 미디어 아트 개발기

이 시리즈는 웹캠 및 센서 네트워크 입력에 반응하여 동작하는 인터랙티브 미디어 아트 프로젝트인 **Jellyfish Dancers**의 실전 구현 과정을 다룹니다. 관객의 실루엣과 센서 신호를 받아 Unity Visual Effect Graph로 화려한 해파리 군집을 연출하는 전체 파이프라인을 해부합니다.

## 📝 시리즈 목차 (Draft)

- **[제1편] 센서 네트워크 연동: TCP/OSC 입력과 이벤트 파이프라인 구축**
  - 미디어 아트 전시 환경을 위한 외부 센서 데이터(TCP/OSC) 수신 방법
  - 다양한 입력을 공통된 이벤트 흐름으로 변환하여 처리하는 아키텍처 설계
- **[제2편] 웹캠 실루엣 추출: Barracuda와 SelfieSegmentation**
  - Unity Barracuda 인퍼런스 엔진을 활용한 실시간 웹캠 세그멘테이션
  - 사람의 실루엣 이미지를 셰이더와 VFX 입력 데이터로 넘겨주는 방법
- **[제3편] 실시간 파티클 아트: Visual Effect Graph와 해파리 군집**
  - 센서와 웹캠 신호를 VFX Graph 파라미터로 연결하는 방법
  - 관객의 움직임과 음악 신호에 반응하는 해파리 군집 시각 효과(VFX) 구현
- **[제4편] 전시 환경 최적화: 멀티 디스플레이와 빌드 자동화**
  - 다중 모니터(멀티 디스플레이) 전시 환경 구성과 스테이지 모드 제어
  - Windows, WebGL, Android 크로스 플랫폼 실험과 CLI 빌드 자동화 스크립트 작성

---

## 📌 주요 기술 스택
- Unity 6000.x, URP, C#
- Visual Effect Graph (VFX)
- Unity Barracuda (Machine Learning Inference)
- TCP / UDP / OSC Network Programming

## 📁 작업 폴더 구조
`/Blog/TIL/jellyfish/` 하위에 시리즈 포스트가 저장될 예정입니다.