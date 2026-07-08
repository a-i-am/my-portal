# [제1편] 적을 아군으로: 포획과 팔로워 소환 파이프라인

> **시리즈 목차**
> - **[제1편] 적을 아군으로: 포획과 팔로워 소환 파이프라인** (현재 글)
> - [제2편] 다중 팔로워 제어: 똑똑한 타겟팅과 공격 로직
> - [제3편] 데이터의 분리: 유연한 인벤토리 리팩터링
> - [제4편] 게임에 생동감 불어넣기: Cinemachine과 DOTween

## 1. 어제의 적이 오늘의 동료로

'YOU' 데모 프로젝트의 가장 큰 특징은 **적을 쓰러뜨린 뒤 수집하여 나의 아군(Follower)으로 소환**할 수 있다는 점입니다. 
마치 네크로맨서처럼 필드 위의 몬스터를 기절(Faint)시키고, 인벤토리에 넣은 다음, 필요할 때 내 뒤를 따라다니며 같이 싸워주는 동료로 꺼내는 시스템입니다. 이 전체 과정을 하나의 자연스러운 파이프라인(흐름)으로 엮어내는 것이 첫 번째 목표였습니다.

## 2. 적의 기절과 수집

먼저 적의 체력이 다 닳으면 완전히 죽어서 사라지는 것이 아니라 '기절 상태(Fainted)'가 되도록 설계했습니다.

```csharp
// Scripts/Objects/Characters/Enemies/Enemy.cs 내부

// 적이 기절(Fainted)하면 실행되는 함수
private void Remove()
{
    isFainted = true;
    // 필드 위의 살아있는 적 목록에서 제외합니다.
    enemyNumberChecker?.RemoveActiveEnemy(this);
}
```

적이 기절하면 플레이어는 다가가서 상호작용 버튼을 눌러 적을 '수집'할 수 있습니다. 이때 필드에 쓰러져 있던 적 오브젝트는 사라지고, 대신 플레이어의 **인벤토리(가방)** 에 해당 몬스터의 데이터(아이템 형태)가 쏙 들어가게 됩니다.

## 3. 인벤토리에서 팔로워로 소환하기 (FollowerSpawner)

인벤토리에 들어온 몬스터 카드를 클릭하면, 이제 내 뒤를 졸졸 따라다니는 아군(Follower)으로 부활하게 됩니다. 여러 마리의 팔로워를 소환할 수 있기 때문에, 플레이어 주변에 팔로워들이 설 수 있는 **'빈자리(Position)'** 들을 미리 여러 개 만들어 두었습니다.

이를 관리하기 위해 `FollowerSpawner`라는 소환 전용 코드를 작성했습니다.

```csharp
// Scripts/Objects/Characters/Followers/Objects/FollowerSpawner.cs 핵심 로직

// 팔로워가 설 수 있는 빈자리들을 줄 세워둡니다 (Queue 활용)
[SerializeField] private Queue<Transform> emptySpawnQueue = new Queue<Transform>();

// 인벤토리에서 소환 버튼을 누르면 실행되는 함수
public void SpawnFollower(Character.CharacterData characterData)
{
    // 빈자리가 없으면 소환하지 않습니다.
    if (emptySpawnQueue.Count == 0) return;

    // 대기열에서 빈자리 하나를 꺼냅니다.
    Transform spawnPos = emptySpawnQueue.Dequeue();
    
    // 그 자리에 몬스터를 아군(Follower) 형태로 새롭게 만들어냅니다(Instantiate).
    follower = Instantiate(characterData.characterPrefab, spawnPos.position, Quaternion.identity, spawnPos);
    
    // 이제부터 이 무리는 플레이어를 따라다니게 됩니다.
    followerGroupMoving.enabled = true;
}
```

이처럼 **대기열(Queue)** 자료구조를 사용하면, 팔로워를 소환할 때마다 남는 자리를 찾기 위해 매번 전체 자리를 뒤적거릴 필요 없이 맨 앞의 빈자리를 즉시 꺼내 쓸 수 있어서 코드가 깔끔해지고 효율도 높아집니다.

## 4. 다음 편 예고

적을 기절시키고, 인벤토리에 넣은 뒤, 큐(Queue)를 활용해 내 뒤의 빈자리에 팔로워로 소환하는 전체 파이프라인을 완성했습니다.

하지만 여러 마리의 팔로워가 한 번에 소환되었을 때, 이 녀석들이 바보같이 한 마리의 적에게만 우르르 몰려가서 공격한다면 효율이 매우 떨어질 것입니다. 다음 **[제2편] 다중 팔로워 제어: 똑똑한 타겟팅과 공격 로직**에서는 팔로워들이 각자 알아서 가까운 적을 분산해서 공격하고, 다시 내 곁으로 돌아오게 만드는 인공지능 제어 방법을 살펴보겠습니다.