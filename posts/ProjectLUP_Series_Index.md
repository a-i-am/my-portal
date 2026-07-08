# Project LUP: 대규모 협업과 SLG 시스템 개발기

이 시리즈는 13인의 프로그래머가 공용 프레임워크 위에서 개발한 Unity 6 프로젝트, **'Project LUP'** 의 SLG(시뮬레이션 게임) 파트 개발 경험을 다룹니다.
벙커 시설 내 작업자(Worker)들의 AI, 복합적인 길찾기 알고리즘, 에디터 툴 제작, 그리고 렌더링 최적화(GPU Instancing, Occlusion Culling) 과정을 중점적으로 정리했습니다.

## 📝 시리즈 목차 (Draft)

- **[제1편] 작업자 AI 설계: 행동 트리(BT)와 Blackboard**
  - 작업자의 배회, 식사, 작업 등 복잡한 상태를 관리하기 위해 행동 트리(Behaviour Tree)를 도입한 이유
  - Blackboard를 활용해 작업자의 상태와 행동 데이터를 깔끔하게 공유하고, 조건과 행동을 분리해 유지보수성을 높인 설계
- **[제2편] 복합 길찾기: 2D 그리드 A*와 실내 PathPoint의 결합**
  - 야외의 동적인 환경에서는 A* 알고리즘을 사용하고, 벙커 건물 내부에서는 정해진 지점(PathPoint)을 따라 이동하도록 두 가지 길찾기 방식을 매끄럽게 연결한 방법
- **[제3편] 개발 효율 극대화: 맵 배치 및 경로 커스텀 에디터 툴**
  - Scene View에서 JSON 맵 데이터를 손쉽게 배치할 수 있도록 만든 커스텀 맵 에디터
  - 건물 내부 이동 지점을 유니티 에디터 화면에서 직접 생성하고 수정할 수 있는 구조물 경로 에디터 제작기
- **[제4편] 렌더링 최적화: GPU Instancing과 오클루전 컬링**
  - 동일한 Mesh와 Material을 사용하는 수많은 오브젝트를 한 번에 그려내어 배치를 1,615에서 961로 대폭 감소시킨 GPU Instancing 적용 과정
  - 시야에 보이지 않는 오브젝트의 렌더링을 차단하는 오클루전 컬링(Occlusion Culling)을 통한 프레임 최적화

---

## 📌 주요 기술 스택
- Unity 6000.0.x
- C# Scripting
- Behaviour Tree (BT) & A* Algorithm
- Custom Editor (Scene View Tools)
- GPU Instancing & Occlusion Culling

## 📁 작업 폴더 구조
`/Blog/TIL/ProjectLUP/` 하위에 시리즈 포스트가 저장될 예정입니다.