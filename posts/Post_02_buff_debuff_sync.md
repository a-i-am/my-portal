---
title: "[제2편] 상태 변화의 중심: 버프/디버프 시스템과 상태 동기화"
series: "Uni Birth"
part: 2
date: "2026-07-08"
tags: ["unreal-engine", "c++", "buff", "ui", "delegate"]
---

# [제2편] 상태 변화의 중심: 버프/디버프 시스템과 상태 동기화

> **시리즈 목차**
> - [제1편] 실시간 반응형 전투: 회피와 패링 QTE 시스템 설계
> - **[제2편] 상태 변화의 중심: 버프/디버프 시스템과 상태 동기화** (현재 글)
> - [제3편] 전략적 깊이 더하기: 동일 등급 버프의 연쇄 합성 시스템

## 1. 버프 시스템 설계계

RPG 게임에서 버프(Buff)와 디버프(Debuff)는 단순히 캐릭터의 공격력을 +10 해주는 것으로 끝나지 않습니다. "3턴 동안 지속", "최대 5번 중첩 가능", "새로 걸리면 지속시간 초기화" 등 복잡한 규칙들을 동시다발적으로 처리해야 하죠.

이러한 수많은 상태 이상을 유연하게 관리하기 위해, 캐릭터 컴포넌트 구조 내부에 `UBBuffComponent`를 직접 설계했습니다.

## 2. 규칙에 따라 중첩되는 버프 처리 (EBuffStackRule)

같은 종류의 버프가 캐릭터에게 두 번 걸렸을 때 어떤 일이 발생해야 할까요? 저희는 이 규칙을 `EBuffStackRule`이라는 열거형(Enum)으로 분리해 기획자가 의도에 맞게 선택할 수 있게 했습니다.

```cpp
// Source/UniBirth/Component/UBBuffComponent.cpp

void UUBBuffComponent::AddBuffToStat(FBuffSlot NewBuff, bool bApplyStat)
{
    // 이미 캐릭터가 똑같은 버프를 가지고 있는지 검사합니다.
    FBuffSlot* ExistingBuff = FindExistingBuff(NewBuff.ID);

    if (ExistingBuff)
    {
        switch (ExistingBuff->StackRule)
        {
        case EBuffStackRule::ResetTurnCount:
            // 규칙 1: 중첩 불가. 대신 지속시간(Turn)을 처음으로 초기화시킵니다.
            ExistingBuff->CurrTurnCount = 0;
            break;

        case EBuffStackRule::CalculateSum:
            // 규칙 2: 최대 중첩 횟수(MaxStackCount)까지 수치를 누적해서 더합니다.
            if (ExistingBuff->CurrentStack < ExistingBuff->MaxStackCount)
            {
                // 이전 수치를 빼고, 누적된 새 수치를 더하는 과정 (생략)
                ExistingBuff->CurrentStack++;
            }
            break;
        }
        
        // 상태가 변했음을 UI에 알립니다.
        if (onBuffChangedDynamic.IsBound())
        {
            onBuffChangedDynamic.Broadcast();
        }
        return;
    }
    
    // 처음 걸리는 버프라면 새롭게 목록에 추가합니다.
    CurrBuffs[(int32)NewBuff.priority].Add(NewBuff);
}
```

이러한 구조 덕분에 화상, 중독, 공격력 증가 등 어떤 종류의 버프가 추가되더라도 컴포넌트 내부 로직에 대한 유지보수가 용이해졌습니다. 

## 3. 델리게이트(Delegate)를 통한 UI 실시간 동기화

버프가 추가되거나 턴이 지나서 해제되었을 때, 화면 하단의 캐릭터 체력바 옆에 있는 '버프 아이콘'도 즉시 업데이트되어야 합니다.
하지만 UI가 매 프레임(Tick)마다 `UBBuffComponent`를 에 대해  버프가 바뀌었는지 확인하는것은 성능에 좋지 않았습니다.

대신 **언리얼 엔진의 델리게이트(Delegate) 시스템**을 적극 활용했습니다. 컴포넌트 측에는 `onBuffChangedDynamic` 을 통해, UI 위젯들은 연동된 데이터의 변동사항을 수신 받습니다.

위의 코드처럼 버프가 새롭게 추가, 중첩, 삭제되는 순간에만 단 한 번 `onBuffChangedDynamic.Broadcast()`를 쏘아 보내면, 델리게이트로 연결된 UI들이 이를 수신해 자신의 화면을 즉각적으로 갱신하게 됩니다. 불필요한 연산 없이 실시간 동기화가 이루어지는 셈이죠.

## 4. 다음 편 예고

이번 글에서는 복잡한 턴제 버프들을 규칙에 따라 누적하고, 델리게이트(Delegate)를 통해 UI와 가볍게 동기화하는 구조를 살펴보았습니다.

하지만 여기서 끝이 아닙니다. 만약 "1단계 공격력 증가 버프"가 3개 모여 "2단계 강력한 공격력 증가 버프" 1개로 진화(합성)한다면 어떨까요? 다음 **[제3편] 전략적 깊이 더하기: 동일 등급 버프의 연쇄 합성 시스템**에서는 이러한 독특한 합성 로직의 구현 과정을 다루어 보겠습니다.