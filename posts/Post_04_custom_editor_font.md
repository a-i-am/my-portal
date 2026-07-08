---
title: "[제4편] 반복 작업 줄이기: TMP 폰트 일괄 교체 커스텀 에디터 툴"
series: "Tell The Story"
part: 4
date: "2026-07-03"
tags: ["unity", "editor-tool", "tmp", "custom-editor", "automation"]
---

# [제4편] 반복 작업 줄이기: TMP 폰트 일괄 교체 커스텀 에디터 툴

> **시리즈 목차**
> - [제1편] 3D 공간 속의 2D: 빌보드 기법과 8방향 스프라이트
> - [제2편] NPC와의 상호작용: FSM을 활용한 대화 플로우 제어
> - [제3편] 목소리로 연기하다: NAVER CLOVA API 연동기
> - **[제4편] 반복 작업 줄이기: TMP 폰트 일괄 교체 커스텀 에디터 툴** (현재 글)

## 1. 폰트 일괄 변경 에디터 기능 만들기

게임을 열심히 개발하다 보면 중간에 아트 컨셉이 바뀌거나 가독성 문제로 UI의 폰트(글씨체)를 전부 교체해야 하는 상황이 빈번하게 발생합니다. 

문제는 유니티에서 텍스트를 이쁘게 그려주는 **TextMeshPro(TMP)** 컴포넌트가 로비 화면, 대화창, 설정창 등 수십 군데에 흩어져 있다는 점입니다. 이걸 일일이 마우스로 클릭해서 새로운 폰트를 끌어다 놓으려면 시간도 오래 걸릴뿐더러, 한두 군데 빼먹는 실수를 하기 십상입니다.

## 2. 나만의 유니티 버튼 만들기 (Custom Editor)

"단순 반복 작업은 컴퓨터에게 시켜라!" 라는 프로그래머의 격언에 따라, 저는 유니티 에디터 창에 **[Change Font!]** 라는 버튼을 직접 만들어 폰트를 한 방에 교체하기로 마음먹었습니다.

이를 위해 유니티가 제공하는 `CustomEditor` 기능을 활용했습니다.

```csharp
// Scripts/Font Changer/TMP_FontChanger.cs

// 게임을 플레이할 때가 아니라, '유니티 에디터 화면'에서만 동작하도록 설정합니다.
#if UNITY_EDITOR
using UnityEditor;

[CustomEditor(typeof(TMP_FontChanger))]
public class TMP_FontChangerEditor : Editor
{
    // 유니티 인스펙터(우측 창)를 내 마음대로 디자인하는 함수
    public override void OnInspectorGUI()
    {
        base.OnInspectorGUI(); // 기본적으로 보여줄 건 보여주고,

        // 화면에 'Change Font!' 라는 버튼을 하나 그립니다.
        // 그리고 누군가 이 버튼을 클릭하면 아래 코드가 실행됩니다.
        if (GUILayout.Button("Change Font!"))
        {
            // 1. 교체할 새 폰트를 가져옵니다.
            TMP_FontAsset fontAsset = ((TMP_FontChanger)target).FontAsset;

            // 2. 현재 화면(씬)에 존재하는 모든 3D 텍스트들을 싹 다 찾아서 폰트를 바꿉니다.
            foreach (TextMeshPro text3D in FindObjectsOfType<TextMeshPro>(true))
            {
                text3D.font = fontAsset;
            }

            // 3. UI에 쓰이는 텍스트들도 싹 다 찾아서 폰트를 바꿉니다.
            foreach (TextMeshProUGUI textUI in FindObjectsOfType<TextMeshProUGUI>(true))
            {
                textUI.font = fontAsset;
            }
            
            Debug.Log("모든 폰트 교체 완료!");
        }
    }
}
#endif
```

## 3. 버튼 한 번 클릭의 기적

이제 빈 게임 오브젝트에 `TMP_FontChanger` 스크립트를 하나 붙여넣기만 하면 인스펙터 창에 마법의 **[Change Font!]** 버튼이 생겨납니다. 교체하고 싶은 새로운 폰트를 칸에 올려놓고 버튼만 누르면, 1초도 안 되어서 씬 전체의 모든 글꼴이 완벽하게 일괄 교체됩니다.

이처럼 **유니티 에디터 툴(Editor Tool) 제작 기능**은 알아두면 단순 반복 작업(노가다)으로 버려지는 엄청난 시간과 체력을 절약해 줍니다. 이번 프로젝트에서 이 툴 하나 덕분에 기획이 수정될 때마다 스트레스 없이 마음껏 폰트 테스트를 해볼 수 있었습니다.

## 마무리

총 4편에 걸쳐 **Tell The Story** 프로젝트의 개발 경험을 나누어 보았습니다. 
3D와 2D가 결합된 시각적 연출, FSM을 통한 깔끔한 대화 흐름 제어, 클로바 음성 인식(STT) API를 활용한 색다른 플레이 경험, 그리고 커스텀 에디터 툴을 통한 작업 최적화까지. 규모가 제법 컸던 만큼 프로그래머로서 시야를 한 단계 더 넓힐 수 있었던 소중한 프로젝트였습니다.
