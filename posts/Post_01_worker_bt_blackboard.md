# [제1편] 작업자 AI 설계: 행동 트리(BT)와 Blackboard

> **시리즈 목차**
> - **[제1편] 작업자 AI 설계: 행동 트리(BT)와 Blackboard** (현재 글)
> - [제2편] 복합 길찾기: 2D 그리드 A*와 실내 PathPoint의 결합
> - [제3편] 개발 효율 극대화: 맵 배치 및 경로 커스텀 에디터 툴
> - [제4편] 렌더링 최적화: GPU Instancing과 오클루전 컬링

## 1. if-else 지옥에서 벗어나기

SLG(시뮬레이션) 게임의 벙커 시설을 관리하다 보면, 수십 명의 작업자(Worker)들이 각자 돌아다니며 밥도 먹고 작업도 해야 합니다. 

초기에는 "배가 고프면 식당으로 가고, 아니면 일을 하고, 일도 없으면 그냥 배회해라"라는 로직을 거대한 `if-else` 코드로 작성하기 쉽습니다. 하지만 작업자가 병에 걸리거나, 적이 쳐들어오거나, 수면을 취해야 하는 등 행동 패턴이 늘어날수록 코드는 걷잡을 수 없이 복잡해집니다.

이를 해결하기 위해 저는 **행동 트리(Behaviour Tree, BT)** 와 **블랙보드(Blackboard)** 패턴을 도입해 AI를 설계했습니다.

## 2. 우선순위를 결정하는 행동 트리 (BT)

행동 트리는 AI의 우선순위를 직관적으로 나누어 실행하는 구조입니다. 코드를 보면 크게 3가지 행동으로 분리되어 있습니다.

```csharp
// Scripts/Games/PCR/6_Worker/WorkerAI.cs의 트리 구성 로직

private void SettingBT()
{
    // 1순위: 배고픔 해결 흐름
    BTNode hungerSequence = new SequenceNode(new List<BTNode>
    {
        new IsHealthLowChecker(LocalBlackboard), // 배가 고픈지 확인
        new PauseCurrentTask(LocalBlackboard),   // 하던 일을 멈춤
        new GoToEatingPlace(LocalBlackboard),    // 식당으로 이동
        new EatFood(LocalBlackboard)             // 밥 먹기
    });

    // 2순위: 작업 수행 흐름
    BTNode workingSequence = new SequenceNode(new List<BTNode>
    {
        new IsNewTaskChecker(LocalBlackboard),   // 할당된 일이 있는지 확인
        new GoToNewTaskLocation(LocalBlackboard),// 작업장으로 이동
        new StartNewTask(LocalBlackboard),       // 작업 시작 준비
        new PerformTask(LocalBlackboard)         // 실제 작업 수행
    });

    // 3순위: 기본 배회 흐름 (위의 두 흐름이 모두 해당 안 될 때)
    root = new SelectorNode(new List<BTNode>
    {
        hungerSequence,
        workingSequence,
        new RoamAroundBuilding(LocalBlackboard)
    });
}
```

이 구조의 가장 큰 장점은 **유연함**입니다. 만약 나중에 '수면' 기능을 추가하고 싶다면 기존 코드를 뜯어고칠 필요 없이 `sleepingSequence`를 새로 만들어서 `SelectorNode`의 적당한 우선순위 위치에 끼워 넣기만 하면 됩니다.

## 3. 정보 공유의 장: 블랙보드 (Blackboard)

위의 `hungerSequence`나 `workingSequence` 안에 있는 각각의 노드(이동, 식사, 작업 등)는 서로 독립적인 부품입니다. 
하지만 "식당으로 이동"하는 노드와 "밥 먹기" 노드는 현재 작업자의 체력과 식당의 위치를 똑같이 알아야 합니다. 

이때 부품들끼리 서로 정보를 공유할 수 있도록 만들어둔 공용 게시판이 바로 **블랙보드(Blackboard)** 입니다.

```csharp
private void InitBlackboard()
{
    // 블랙보드 게시판에 작업자의 필수 정보들을 등록해 둡니다.
    LocalBlackboard.SetValue(BBKeys.OwnerAI, this);
    LocalBlackboard.SetValue(BBKeys.UnitMover, mover); // 이동 관리자
    LocalBlackboard.SetValue(BBKeys.Hunger, hunger);
    LocalBlackboard.SetValue(BBKeys.IsHunger, IsHunger);
    LocalBlackboard.SetValue(BBKeys.HasTask, hasTask);
}
```

이제 어떤 노드든(예: `EatFood` 노드) 작업자의 체력을 회복시켜야 할 때 `LocalBlackboard`에서 체력 값을 꺼내오고 갱신하면 됩니다. 
정보와 행동이 분리되면서 코드가 훨씬 깔끔해졌고, 여러 개발자가 동시에 각기 다른 AI 노드를 개발하더라도 블랙보드의 키(Key)값만 약속하면 되기 때문에 충돌 없는 협업이 가능했습니다.

## 4. 다음 편 예고

이번 글에서는 복잡한 시뮬레이션 작업자들의 두뇌를 행동 트리(BT)와 블랙보드로 유연하게 설계한 경험을 공유했습니다.

하지만 작업자가 식당이나 작업장으로 이동하려면 **어떻게 장애물을 피해 길을 찾을 것인가?** 라는 물리적인 이동 문제가 남아 있습니다. 
다음 **[제2편] 복합 길찾기: 2D 그리드 A*와 실내 PathPoint의 결합**에서는 광활한 맵에서의 경로 탐색과 벙커 내부에서의 정교한 이동을 어떻게 결합했는지 살펴보겠습니다.