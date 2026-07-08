---
title: "[제3편] 개발 효율 극대화: 맵 배치 및 경로 커스텀 에디터 툴"
series: "Project LUP"
part: 3
date: "2026-07-03"
tags: ["unity", "editor-tool", "json", "map-editor", "custom-editor"]
---

# [제3편] 개발 효율 극대화: 맵 배치 및 경로 커스텀 에디터 툴

> **시리즈 목차**
> - [제1편] 작업자 AI 설계: 행동 트리(BT)와 Blackboard
> - [제2편] 복합 길찾기: 2D 그리드 A*와 실내 PathPoint의 결합
> - **[제3편] 개발 효율 극대화: 맵 배치 및 경로 커스텀 에디터 툴** (현재 글)
> - [제4편] 렌더링 최적화: GPU Instancing과 오클루전 컬링

## 1. 노가다의 늪에 빠진 기획자 구출하기

게임을 개발하다 보면 개발자뿐만 아니라 맵이나 밸런스를 짜는 '기획자'와의 협업이 필수적입니다. 저희 SLG 프로젝트는 벙커 내 건물들의 배치 정보를 JSON 형태의 파일로 저장해 사용했습니다.

하지만 기획자가 메모장을 켜서 `{"x": 10, "y": 5, "type": "WHEATFARM"}` 처럼 수백 줄의 텍스트를 직접 치며 맵을 만든다는 것은 엄청난 고역입니다. 오타라도 하나 나면 게임이 켜지지도 않았죠.

그래서 저는 기획자가 **마우스 드래그와 클릭만으로** 직관적으로 맵을 찍어낼 수 있는 전용 에디터 툴을 유니티 내부에 직접 만들었습니다.

## 2. 씬 뷰(Scene View)에 직접 그리는 맵 에디터

유니티가 제공하는 `SceneView.duringSceneGui` 이벤트를 가로채면, 개발자가 작업하는 씬 화면 위에 나만의 그림이나 버튼을 띄울 수 있습니다.

```csharp
// Scripts/Editor/MapEditorWindow.cs

[InitializeOnLoad]
public static class MapEditorOverlay
{
    static MapEditorOverlay()
    {
        // 유니티 씬 화면을 그릴 때 내 코드를 먼저 실행하도록 끼워 넣습니다.
        SceneView.duringSceneGui += OnSceneGUI;
    }

    private static void OnSceneGUI(SceneView sceneView)
    {
        // 1. 화면 좌측에 건물 목록(팔레트)을 그려줍니다. (밀밭, 식당, 발전소 등)
        DrawPalette();

        // 2. 마우스가 올라간 타일에 반투명한 건물을 미리 보여줍니다. (미리보기 기능)
        DrawHoverPreview();

        // 3. 마우스를 클릭하면 해당 위치에 건물을 '설치'하고 JSON 데이터를 업데이트합니다.
        HandleMouseClick();
    }
}
```

이제 기획자는 게임을 켜지 않고도 에디터 화면에서 심시티를 하듯 건물을 클릭해서 배치하고, [저장] 버튼을 누르면 이 배치 정보가 깔끔한 JSON 파일(`production_runtime.json`)로 자동 변환되어 저장됩니다.

## 3. 선으로 연결하는 직관적인 실내 경로 에디터

이전 편에서 언급했던 **'실내 PathPoint'** 역시 숫자로 일일이 좌표를 치는 것은 매우 힘든 일입니다. 이 문제를 해결하기 위해, 건물(Structure) 오브젝트를 클릭했을 때 나타나는 속성 창(Inspector)을 개조했습니다.

```csharp
// Scripts/Editor/PCRStructureEditor.cs

[CustomEditor(typeof(StructureBase), true)]
public class PCRStructureEditor : Editor
{
    protected override void OnSceneGUI()
    {
        // 1. 건물이 가지고 있는 웨이포인트(localWaypoints) 개수만큼 점을 그립니다.
        for (int i = 0; i < structure.localWaypoints.Count; i++)
        {
            // 2. 마우스로 드래그할 수 있는 입체적인 핸들(Handle)을 생성합니다.
            Vector3 newPos = Handles.PositionHandle(worldPos, Quaternion.identity);

            // 3. 점 옆에 "1", "2" 처럼 순서를 표시하는 텍스트 라벨을 띄웁니다.
            Handles.Label(newPos, $"{i + 1}");
            
            // 4. 개발자가 핸들을 잡고 끌었다면, 그 위치를 새 경로로 저장합니다.
            structure.localWaypoints[i] = newPos;
        }
    }
}
```

건물을 선택하기만 하면 화면에 형형색색의 화살표 핸들이 나타납니다. 개발자는 그냥 핸들을 꾹 잡고 엘리베이터 앞으로 당기거나 복도 모퉁이로 당겨서 경로를 시각적으로 이어주면 끝납니다. 점을 추가하고 싶다면 인스펙터 창에 만들어둔 **[Way Point 추가]** 버튼을 누르기만 하면 되죠.

## 4. 다음 편 예고

이번 글에서는 에디터 툴의 강력함을 활용해 기획자와 프로그래머의 불필요한 반복 노동을 없애고 직관적인 작업 환경을 구축한 경험을 살펴보았습니다. 게임 개발에 있어 "우리가 쓸 도구를 먼저 만드는 것"은 전체 작업 시간을 극적으로 단축시켜주는 핵심 기술이었습니다.

마지막 **[제4편] 렌더링 최적화: GPU Instancing과 오클루전 컬링**에서는 건물이 수십 채로 늘어나면서 모바일 기기가 뜨거워지고 버벅이는 현상을, 어떻게 그래픽 최적화 기술로 부드럽게 해결했는지 파헤쳐 보겠습니다.
