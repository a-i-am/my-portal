---
title: "[제2편] 복합 길찾기: 2D 그리드 A*와 실내 PathPoint의 결합"
series: "Project LUP"
part: 2
date: "2026-07-03"
tags: ["unity", "pathfinding", "astar", "slg"]
---

# [제2편] 복합 길찾기: 2D 그리드 A*와 실내 PathPoint의 결합

> **시리즈 목차**
> - [제1편] 작업자 AI 설계: 행동 트리(BT)와 Blackboard
> - **[제2편] 복합 길찾기: 2D 그리드 A*와 실내 PathPoint의 결합** (현재 글)
> - [제3편] 개발 효율 극대화: 맵 배치 및 경로 커스텀 에디터 툴
> - [제4편] 렌더링 최적화: GPU Instancing과 오클루전 컬링

## 1. 길을 찾는 두 가지 상황

시뮬레이션 게임에서는 작업자가 맵 끝에서 끝으로 이동해야 할 때가 많습니다. 이때 유니티에서 기본 제공하는 네비게이션(NavMesh) 기능을 쓸 수도 있지만, 이 프로젝트는 바닥이 타일(Grid) 형태로 나뉘어져 있고 건물이 실시간으로 지어졌다 부서졌다 하는 환경이었기 때문에 **A*(에이스타) 알고리즘**을 직접 구현해 사용했습니다.

하지만 건물의 입구까지 A* 알고리즘으로 잘 찾아왔더라도, 건물의 내부(방 안, 복도, 엘리베이터 등)까지 A* 알고리즘으로 계산하려고 하면 필요 이상으로 컴퓨터의 계산량이 늘어나게 됩니다.

그래서 저희는 **야외 이동(A*)** 과 **실내 이동(PathPoint)** 을 매끄럽게 결합하는 복합 길찾기 시스템을 구축했습니다.

## 2. 야외에서의 이동: 2D 그리드 A* (AGridMap)

작업자가 현재 위치에서 목표 건물까지 가야 할 때는 A* 알고리즘이 동작합니다. 맵 전체를 바둑판(Grid)처럼 나누고, 장애물(벽이나 바위)을 피해 가장 빠른 지름길을 계산합니다.

```csharp
// Scripts/Games/PCR/6_Worker/AStar/UnitMover.cs

// A* 알고리즘으로 건물의 입구(Entrance)까지 경로를 요청합니다.
public void MoveToDestination(Vector3 targetPos)
{
    path = pathfinder.FindPath(transform.position, targetPos);
    currentIndex = 0;
}
```

이 코드를 통해 작업자는 벙커의 복잡한 야외 지형을 부드럽게 통과하여 마침내 건물의 '입구'에 도착하게 됩니다.

## 3. 건물 내부에서의 이동: 실내 PathPoint (내부 큐 이동)

건물 입구에 도착하면 A* 알고리즘은 역할을 다하고 종료됩니다. 이제부터는 건물의 설계도에 미리 찍어둔 **웨이포인트(localWaypoints)** 들을 따라 기차 레일 위를 움직이듯 이동합니다.

```csharp
// 건물의 문턱을 넘으면 내부 이동 로직(SetInternalPath)으로 전환됩니다.
public void SetInternalPath(StructureBase building)
{
    internalPathQueue.Clear();

    // 1. 건물이 가지고 있는 내부 길잡이 점(Waypoints)들을 큐에 넣습니다.
    if (building.localWaypoints != null)
    {
        foreach (Vector3 localPoint in building.localWaypoints)
        {
            // 건물의 방향에 맞춰 실제 월드 좌표로 변환하여 넣습니다.
            Vector3 worldPoint = building.transform.TransformPoint(localPoint);
            internalPathQueue.Enqueue(worldPoint);
        }
    }

    // 2. 마지막으로 최종 작업해야 할 기계 앞(workSpotAnchor) 위치를 넣습니다.
    if (building.workSpotAnchor != null)
    {
        internalPathQueue.Enqueue(building.WorkSpotWorldPos);
    }

    // 3. 내부 이동을 시작합니다.
    isMovingInternally = true;
}
```

이렇게 큐(Queue)에 들어간 점들을 하나씩 꺼내어(Dequeue) 직선으로만 이동하면 됩니다. 복도 코너를 돌거나 엘리베이터를 타는 것도, A* 연산 없이 그저 순서대로 점들을 따라가기만 하면 되므로 성능 낭비가 전혀 없습니다.

## 4. 다음 편 예고

이번 글에서는 동적인 야외에서는 A* 알고리즘을, 좁은 실내에서는 미리 찍어둔 PathPoint들을 따라가게 하는 듀얼 길찾기 시스템을 살펴보았습니다.

그런데 여기서 한 가지 의문이 생깁니다. 건물 내부의 길잡이 점(`localWaypoints`)들을 개발자가 일일이 좌표 숫자로 적어서 입력해야 할까요? 만약 건물이 50채라면 끔찍한 막노동이 될 것입니다.
다음 **[제3편] 개발 효율 극대화: 맵 배치 및 경로 커스텀 에디터 툴**에서는 이 점들을 마우스 클릭만으로 쉽게 찍고 편집할 수 있도록 유니티 에디터를 직접 개조한 과정을 소개하겠습니다.
