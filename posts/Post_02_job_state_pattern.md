# [제2편] 레밍즈의 행동 패턴: Job 시스템과 상태 관리

> **시리즈 목차**
> - [제1편] Win32 API 기반 자체 프레임워크 설계
> - **[제2편] 레밍즈의 행동 패턴: Job 시스템과 상태 관리** (현재 글)
> - [제3편] 픽셀 단위 마스크 충돌과 비트맵 렌더링 최적화

## 1. 레밍즈의 직업(Job) 설계

레밍즈 게임에서 각 개체(Lemming)는 걷기(Walker), 파기(Digger), 떨어지기(Faller), 탈출하기(Escaper) 등 다양한 직업을 가집니다. 플레이어의 명령이나 지형지물에 의해 레밍의 행동 상태가 실시간으로 변경되어야 합니다.

이를 효과적으로 제어하기 위해 상태 패턴(State Pattern)을 적용하여, 모든 직업을 `Job`이라는 추상 클래스로 정의하고 각 직업별 세부 동작을 상속받아 구현했습니다.

## 2. Job 추상 클래스와 하위 상태

`Job` 클래스는 레밍의 행동 로직(`UpdateStateMachine`)과 애니메이션(`InitAnims`), 충돌 판정(`IsCollisionWall`, `CollideFloor`)을 처리하는 인터페이스를 제공합니다.

```cpp
// src/Job.h

class Job
{
public:
    virtual ~Job() {}

    virtual void InitAnims(Actor* owner) = 0;
    virtual void UpdateStateMachine(float deltaTime) = 0;
    virtual SpriteRenderer* GetCurrentJobSprite() const = 0;

    Job* GetNextJob() { return nextJob; }

protected:
    bool IsCollisionWall(Vector nextPos);
    int32 CollideFloor(Vector nextPos, int32 maxFall);

    Job* nextJob;
    bool isFinished;
};
```

각 행동(예: `Walker`, `Digger`)은 이 `Job` 클래스를 상속받아 고유한 로직을 수행합니다. 행동이 종료조건을 만족하면 `isFinished`를 `true`로 설정하고 `nextJob` 포인터에 다음 행동 객체를 할당합니다.

## 3. 런타임 상태 전환 (ChangeJob)

`Lemming` 클래스는 현재 자신이 수행 중인 `Job` 객체를 포인터로 들고 있으며, 매 프레임마다 `job->UpdateStateMachine(deltaTime)`을 호출하여 행동을 위임합니다. 상태 변경이 필요할 때는 `ChangeJob` 함수를 통해 메모리를 교체합니다.

```cpp
// src/Lemming.cpp

void Lemming::ChangeJob(Job* nextJob)
{
    if (job) {
        // 기존 상태의 정보(방향 등)를 임시 저장합니다.
        _isWalkingRight = job->GetIsWalkingRight();
        
        // 기존 상태 객체를 메모리에서 해제합니다.
        delete job;
    }

    // 새로운 상태 객체를 할당합니다.
    this->job = nextJob;
    this->job->InitAnims(this);
    this->job->SetWalkingRight(_isWalkingRight);
}
```

이 구조의 장점은 레밍 객체(`Lemming.cpp`) 내부에 복잡한 `if-else` 분기문이 쌓이지 않는다는 점입니다. 새로운 직업(예: 우산 낙하)이 추가되더라도 `Job`을 상속받는 클래스만 추가로 구현하고 할당해 주면 되므로 유지보수성과 확장성이 높습니다. 

또한 `JobFactory` 클래스를 싱글톤으로 구현하여 객체 생성 로직을 분리함으로써, 직업 인스턴스 생성 시의 메모리 할당 관리를 중앙화했습니다.

## 4. 다음 편 예고

이번 글에서는 상태 패턴(State Pattern)을 적용해 레밍의 행동 변화를 유연하고 모듈화된 코드로 관리하는 방법을 다루었습니다.

다음 **[제3편] 픽셀 단위 마스크 충돌과 비트맵 렌더링 최적화**에서는 곡괭이질(Digger)에 의해 지형 픽셀이 깎여나가고, GDI를 사용해 이를 효율적으로 화면에 출력하는 렌더링 과정을 분석해 보겠습니다.