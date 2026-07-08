# [제2편] NPC와의 상호작용: FSM을 활용한 대화 플로우 제어

> **시리즈 목차**
> - [제1편] 3D 공간 속의 2D: 빌보드 기법과 8방향 스프라이트
> - **[제2편] NPC와의 상호작용: FSM을 활용한 대화 플로우 제어** (현재 글)
> - [제3편] 목소리로 연기하다: NAVER CLOVA API 연동기
> - [제4편] 반복 작업 줄이기: TMP 폰트 일괄 교체 커스텀 에디터 툴

## 1. 꼬이기 쉬운 게임의 흐름 제어하기

플레이어가 로비(Lobby)를 돌아다니다가 NPC에게 다가가 말을 걸면, 화면 아래에 대화창이 뜨면서 대사가 한 글자씩 출력됩니다. 
이때 **가장 중요한 규칙**이 하나 있습니다. 대화창이 떠 있는 동안에는 플레이어가 마음대로 이리저리 걸어 다니거나 점프할 수 없어야 한다는 것입니다. 

만약 "걷기"와 "대화하기" 코드를 마구잡이로 섞어 쓰게 되면, 대화 중에 캐릭터가 미끄러지듯 이동하거나 엉뚱한 버튼이 눌리는 온갖 버그에 시달리게 됩니다. 이를 방지하기 위해 저희는 캐릭터의 상태를 명확하게 나누는 **유한 상태 기계(FSM)** 를 도입했습니다.

## 2. 플레이어의 두 가지 상태 (PlayerState)

로비에서 플레이어의 상태는 아주 심플하게 두 가지로 나뉩니다.

```csharp
// Scripts/Lobby/Player/PlayerController.cs

enum PlayerState
{
    Moving,     // 자유롭게 돌아다닐 수 있는 상태
    InDialogue  // NPC와 대화 중이라 조작이 막힌 상태
}
```

캐릭터는 평소에 `Moving` 상태로 존재하다가, NPC 앞에서 상호작용 버튼을 누르는 순간 `InDialogue` 상태로 전환됩니다.

```csharp
void Update()
{
    switch (currentState)
    {
        case PlayerState.Moving:
            // 키보드 입력을 받아 캐릭터를 움직이게 합니다.
            HandleMovementInput();
            break;
            
        case PlayerState.InDialogue:
            // 키보드 입력을 차단하고, 움직임을 강제로 멈춥니다(Vector3.zero).
            HandleDialogue(); 
            break;
    }
}
```

이렇게 `switch-case` 문을 이용해 상태를 완벽하게 분리해 두면, 대화 중에 발생할 수 있는 키보드 조작 버그를 원천적으로 차단할 수 있습니다.

## 3. 대화의 흐름을 통제하는 Queue (DialogueManager)

상태가 `InDialogue`로 바뀌면, 이제 대화의 흐름은 중앙 통제 센터인 `DialogueManager`가 넘겨받습니다. 
여러 줄의 대사가 순서대로 출력되어야 하므로, 들어온 순서대로 데이터를 꺼낼 수 있는 **큐(Queue)** 자료구조를 사용했습니다.

```csharp
// Scripts/Lobby/Dialogue/DialogueManager.cs

private Queue<DialogueLine> lines; // 대사들을 일렬로 줄 세워둘 공간

public void StartDialogue(Dialogue dialogue)
{
    isDialogueActive = true;
    
    // NPC가 해야 할 모든 대사를 큐(Queue)에 순서대로 밀어 넣습니다.
    foreach (DialogueLine line in dialogue.dialogueLines)
    {
        lines.Enqueue(line);
    }
    
    // 첫 번째 대사 출력을 시작합니다.
    DisplayNextDialogueLine();
}
```

플레이어가 화면을 터치할 때마다 `lines.Dequeue()`를 호출하여 대사를 하나씩 뽑아 화면에 뿌려줍니다. 더 이상 뽑아낼 대사가 없다면(큐가 비어있다면) 대화를 종료(`EndDialogue`)하고, 플레이어의 상태를 다시 `Moving`으로 되돌려줍니다. 

## 4. 자연스러운 화면 전환

대화가 완전히 종료되면, 바로 다음 액션으로 이어지도록 화면 중앙에 에피소드 선택 창(`episodeWindow`)이 부드럽게 나타납니다. 

이처럼 "자유 이동 ➔ 상호작용 ➔ 대화창 출력 ➔ 텍스트 타이핑 효과 ➔ 윈도우 등장 ➔ 씬 이동" 이라는 복잡한 흐름(플로우)을 FSM과 Queue라는 아주 기본적이고 튼튼한 구조를 통해 꼬임 없이 깔끔하게 제어할 수 있었습니다.

## 5. 다음 편 예고

이번 글에서는 NPC 앞에서의 상호작용과 대화창을 처리하는 내부 로직에 대해 다루어 보았습니다. 

다음 **[제3편] 목소리로 연기하다: NAVER CLOVA API 연동기**에서는 대화를 단순히 눈으로 읽는 것을 넘어, 플레이어가 직접 마이크에 대고 말을 하면 텍스트로 인식되고, NPC의 답변이 실제 목소리로 들리게 만드는 음성 인식/합성 기능의 구현 과정을 살펴보겠습니다.