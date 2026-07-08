---
title: "[제3편] 적 AI 구현: FSM 기반의 똑똑한 몬스터 만들기"
series: "Where Is My Toillet"
part: 3
date: "2026-07-03"
tags: ["unity", "2d", "ai", "fsm", "gamejam"]
---

# [제3편] 적 AI 구현: FSM 기반의 똑똑한 몬스터 만들기

> **시리즈 목차**
> - [제1편] 2D 맵 설계: Tilemap을 활용한 빠른 레벨 디자인
> - [제2편] 애니메이션 제어: Spine과 Unity Animator의 만남
> - **[제3편] 적 AI 구현: FSM 기반의 똑똑한 몬스터 만들기** (현재 글)

## 1. 몬스터는 어떻게 생각하고 움직일까?

게임 속 몬스터가 아무 생각 없이 앞으로만 걷는다면 금방 재미가 없어질 것입니다. 몬스터는 평소에는 자기 구역을 어슬렁거리다가(순찰), 플레이어가 나타나면 발견하고(탐지), 플레이어를 향해 달려와야(추격) 합니다. 

이렇게 몬스터의 행동을 여러 개의 '상태(State)'로 나누고, 특정 조건이 맞을 때마다 상태를 바꿔주는 방식을 **유한 상태 기계(FSM, Finite State Machine)** 라고 부릅니다.

## 2. 상태 전환 로직과 규칙의 분리 (순찰과 추격)

만약 몬스터의 걷기, 뛰기, 공격하기 코드를 하나의 파일에 전부 섞어 적는다면 나중에 코드를 고치기가 매우 힘들어집니다. 
그래서 저희는 몬스터의 머리 역할을 하는 `MonsterBase.cs` 파일과 몸통 역할을 하는 `Monster.cs` 파일로 역할을 나누어 **상태 전환 규칙을 분리**했습니다.

```csharp
// Scripts/Enemy/MonsterBase.cs 의 핵심 로직

protected virtual void Update()
{
    // 1. 플레이어가 시야에 들어왔는지 확인합니다. (탐지)
    bool isDetectedNow = detector.IsPlayerDetected();

    // 2. 평상시 상태 (순찰)
    if (!playerDetectedOnce)
    {
        mover?.Move(); // 설정된 구역을 어슬렁거립니다.

        // 그러다 플레이어를 발견하면 상태를 '추격'으로 바꿉니다.
        if (isDetectedNow)
        {
            playerDetectedOnce = true;
            isTracking = true;
        }
    }

    // 3. 흥분 상태 (추격)
    if (playerDetectedOnce)
    {
        OnPlayerDetected(); // 플레이어를 향해 쫓아갑니다.

        // 만약 플레이어가 시야에서 사라지면 다시 '순찰' 상태로 돌아갑니다.
        if (!isDetectedNow)
        {
            OnLostPlayer();
            playerDetectedOnce = false;
        }
    }
}
```

이 구조 덕분에, 새로운 종류의 몬스터(예: 날아다니는 새, 기어 다니는 슬라임)를 추가할 때도 기본 두뇌 로직은 그대로 둔 채 "어떻게 이동할 것인가(Move)"에 대한 코드만 추가하면 되어서 개발 속도가 크게 단축되었습니다.

## 3. 플레이어 감지 최적화와 시야 처리

몬스터가 플레이어를 발견하려면 시야를 뜻하는 보이지 않는 레이더망(Collider 또는 Raycast)이 필요합니다. 
저희는 플레이어를 감지하는 기능(`IPlayerDetectable`)과 이동하는 기능(`IMoveable`)을 완전히 쪼개어 코드 분리를 이뤄냈습니다.

- **감지 로직**: 몬스터의 앞쪽으로 보이지 않는 레이저를 쏴서 플레이어와 닿는지 확인합니다.
- **추적 한계 거리**: 무작정 끝까지 쫓아가면 게임이 너무 어려워지므로, 일정 거리 이상 플레이어가 도망가면 감지망에서 벗어난 것으로 처리(`!isDetectedNow`)하여 몬스터가 추격을 포기하고 원래 위치로 돌아가게 만들었습니다.

```csharp
// Scripts/Enemy/Monster.cs 에서 추격을 담당하는 부분
protected override void OnPlayerDetected()
{
    // 추격 속도로 발걸음을 빨리합니다.
    mover?.SetMoveSpeed(chaseSpeed);
    
    // 플레이어가 있는 방향을 계산해서 그쪽으로 이동(MoveTo)합니다.
    Vector2 direction = (playerTransform.position - transform.position).normalized;
    mover?.MoveTo(direction);
}
```

이렇게 시야 감지와 이동 코드가 분리되어 있으니, 디버깅을 할 때 "몬스터가 안 움직이네? 이동 코드가 문제인가, 아니면 플레이어를 못 본 건가?"를 따로따로 테스트하기가 매우 수월했습니다.

## 마무리

총 3편에 걸쳐 **Where Is My Toillet** 프로젝트의 개발 과정을 정리했습니다. 
타일맵을 이용한 신속한 레벨 디자인부터, 스파인(Spine)을 활용한 캐릭터 애니메이션 제어, 그리고 FSM 패턴을 도입해 깔끔하게 분리한 몬스터 AI 설계까지. 단기간에도 구조를 탄탄하게 설계하면 오히려 개발 속도와 퀄리티를 모두 잡을 수 있다는 점을 배울 수 있었던 프로젝트였습니다.
