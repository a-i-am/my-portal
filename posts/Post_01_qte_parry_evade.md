---
title: "[제1편] 실시간 반응형 전투: 회피와 패링 QTE 시스템 설계"
series: "Uni Birth"
part: 1
date: "2026-07-08"
tags: ["unreal-engine", "c++", "qte", "rpg", "combat"]
---

# [제1편] 실시간 반응형 전투: 회피와 패링 QTE 시스템 설계

> **시리즈 목차**
> - **[제1편] 실시간 반응형 전투: 회피와 패링 QTE 시스템 설계** (현재 글)
> - [제2편] 상태 변화의 중심: 버프/디버프 시스템과 상태 동기화
> - [제3편] 전략적 깊이 더하기: 동일 등급 버프의 연쇄 합성 시스템

## 1. 33원정대 모티브 턴제 RPG 제작

**'Uni Birth'** 프로젝트에서는 적의 턴(공격 차례)에 **QTE(Quick Time Event)** 기반의 실시간 회피(Dodge)와 패링(Parry) 시스템이 존재합니다. 이는 33원정대를 모티브로 기획되었습니다.

## 2. 패링 구현 - 움직이는 화살표와 판정 영역 (UBParryUI)

패링 UI가 화면에 뜨면 화살표(`parryPointImage`)가 좌우로 빠르게 움직이기 시작합니다. 플레이어가 버튼을 누르는 순간 화살표가 타겟 영역(`timingAreaImage`) 안에 들어와 있는지 판단해야 합니다.

```cpp
// Source/UniBirth/UI/Combat/Combo/UBParryUI.cpp

void UUBParryUI::CheckParry()
{
    // 버튼을 누른 순간 화살표의 움직임을 멈춥니다.
    bCheckParrying = true;

    // 1. 화살표(A)와 타겟 영역(B)의 좌우 좌표를 가져옵니다.
    float ALeft = ArrowCanvasSlot->GetPosition().X;
    float ARight = ALeft + ArrowCanvasSlot->GetSize().X;
    
    float BLeft = TimingCanvasSlot->GetPosition().X;
    float BRight = BLeft + TimingCanvasSlot->GetSize().X;

    // 2. 두 영역이 겹쳐 있는지(Overlap) 수학적으로 검사합니다.
    bool BOverlapX = (ALeft < BRight) && (ARight > BLeft);

    // 3. 겹쳤다면 Success(성공), 아니라면 Fail(실패) 판정을 내립니다.
    BM->SetReactionResult(BOverlapX ? EResultType::Success : EResultType::Fail);
}
```

이처럼 UI 위젯의 `CanvasPanelSlot` 좌표를 활용한 직관적인 겹침(Overlap) 판정을 통해 빠르고 가볍게 QTE의 성공 여부를 가려낼 수 있습니다.

## 3. 몬스터마다 달라지는 난이도 (CSV 데이터 테이블 연동)

만약 항상 똑같은 위치에, 똑같은 크기의 패링 영역이 뜬다면 플레이어는 금세 타이밍을 외워버릴 것입니다. 그래서 저는 몬스터의 등급(보스, 엘리트, 일반)에 따라 패링 난이도가 자동으로 조절되도록 **데이터 테이블(Data Table)** 을 연동했습니다.

```cpp
// 1. 현재 공격하는 적의 등급을 파악합니다. (Boss, Elite, Base)
EParryzoneGrade TargetGrade = ConvertTypeToParryGrade(CurrEnemyType);

// 2. 기획자가 작성한 CSV 데이터 테이블에서 해당 등급의 패링 난이도(영역 폭) 데이터를 가져옵니다.
FParryStruct* ParryData = GetParryZoneData(TargetGrade);
float ZoneRatio = ParryData->ZoneWidth;

// 3. 가져온 너비를 적용해 타겟 영역의 크기를 조절합니다.
TimingAreaCanvasSlot->SetSize(FVector2D(parryAreaWidth, Height));
```

또한 플레이어가 패턴을 외우지 못하도록, `ApplyRandomizedPosition()` 함수를 구현해 타겟 영역이 전체 바(Bar) 위에서 **매번 랜덤한 위치**에 생성되도록 만들었습니다.

이러한 설계 덕분에 기획자는 언리얼 엔진 코드를 전혀 건드리지 않고도 엑셀(CSV) 파일의 수치만 변경하여 보스 몬스터의 패링 난이도를 쉽게 조절할 수 있었습니다.

## 4. 다음 편 예고

이번 글에서는 정적인 턴제 전투에 액션성을 더해주는 실시간 QTE 판정 시스템과 데이터 테이블을 활용한 난이도 조절 방법을 살펴보았습니다. 

이러한 패링과 회피의 성공/실패는 결국 캐릭터에게 유리한 '버프(Buff)'나 불리한 '디버프(Debuff)'로 이어지게 됩니다. 다음 **[제2편] 상태 변화의 중심: 버프/디버프 시스템과 상태 동기화**에서는 턴이 넘어갈 때마다 자동으로 계산되는 복잡한 버프 로직과 UI 동기화 과정에 대해 다루어 보겠습니다.
