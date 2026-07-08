---
title: "[제1편] Win32 API 기반 자체 프레임워크 설계"
series: "Lemmings Win32 API"
part: 1
date: "2026-07-08"
tags: ["c++", "win32-api", "framework", "architecture", "actor-component"]
---

# [제1편] Win32 API 기반 자체 프레임워크 설계

> **시리즈 목차**
> - **[제1편] Win32 API 기반 자체 프레임워크 설계** (현재 글)
> - [제2편] 레밍즈의 행동 패턴: Job 시스템과 상태 관리
> - [제3편] 픽셀 단위 마스크 충돌과 비트맵 렌더링 최적화

## 1. 프레임워크 초기 설계

C++과 Win32 API를 사용하여 고전 게임 'Lemmings(레밍즈)'를 모작하는 과정에서, 상용 게임 엔진(Unity, Unreal Engine)의 구조를 참고하여 자체적인 프레임워크를 설계했습니다.
전체 게임 루프를 관리하는 `Game` 클래스와 화면 단위를 분리하는 `Scene` 구조를 도입하여 렌더링 및 업데이트의 책임 범위를 명확하게 나누었습니다.

## 2. 게임 루프와 Double Buffering (Game 클래스)

`Game` 클래스는 윈도우 생성부터 파괴까지의 전체 생명 주기를 관리하며, 싱글톤(Singleton) 패턴으로 구현되어 전역에서 접근이 가능합니다.

```cpp
// src/Game.h

class Game
{
public:
    static Game &getInstance() {
        static Game G;
        return G;
    }

    void Init(HWND hwnd);
    bool Update(float deltaTime);
    void Render();

private:
    HWND    _hwnd;          // 윈도우 핸들
    HDC     _hdc;           // 프론트 버퍼
    HDC     _hdcBack;       // 백 버퍼 (Double Buffering)
    HBITMAP _bmpBack;
    
    class GameScene* _currScene = nullptr;
};
```

깜빡임(Flickering) 현상을 방지하기 위해 Double Buffering 기법을 적용했습니다. `Update()`에서 게임 로직을 처리한 뒤, `Render()`에서 모든 그래픽 데이터를 `_hdcBack`(백 버퍼)에 먼저 그리고 난 후, 마지막에 `BitBlt` 함수를 사용해 프론트 버퍼로 한 번에 복사하는 방식을 사용합니다.

## 3. 유연성을 위한 Actor-Component 구조

게임 내 존재하는 모든 오브젝트(레밍, 지형, UI 등)를 일관성 있게 관리하기 위해 `Actor` 클래스와 `Component` 클래스를 기반으로 하는 Entity-Component 구조를 설계했습니다. 

```cpp
// src/Actor.h

class Actor
{
public:
    virtual void Init();
    virtual void Update(float deltaTime);
    virtual void Render(HDC hdc);

    template <typename T>
    T* getComponent()
    {
        for (Component* comp : _components)
        {
            if (T* casted = dynamic_cast<T*>(comp))
                return casted;
        }
        return nullptr;
    }

protected:
    Vector _pos = {};
    vector<Component*> _components;
};
```

- **Actor:** 위치 정보(`_pos`)를 가지며, 여러 개의 컴포넌트를 배열(`vector<Component*>`) 형태로 보유할 수 있는 컨테이너 역할을 합니다.
- **Component:** 렌더링(SpriteRenderer, ImageRenderer), 물리 연산, 충돌 처리 등 세부적인 기능을 정의하는 모듈입니다.

상속(Inheritance) 중심의 설계보다 컴포넌트(Composition) 중심의 설계를 채택하여, 레밍이나 구조물 객체 생성 시 필요한 컴포넌트만 조립하여 부착할 수 있도록 구성했습니다. `dynamic_cast`를 활용한 템플릿 함수 `getComponent()`를 통해 런타임에 필요한 컴포넌트 객체를 가져옵니다.

## 4. 다음 편 예고

이번 글에서는 Win32 API 환경에서 `Game`, `Scene`, `Actor`, `Component`로 이어지는 게임 프레임워크의 계층적 렌더링/업데이트 구조를 정리했습니다. 

다음 **[제2편] 레밍즈의 행동 패턴: Job 시스템과 상태 관리**에서는 구현된 구조를 바탕으로, 플레이어의 지시에 따라 땅을 파거나 계단을 짓는 등 레밍즈의 다양한 행동(Job)을 어떻게 상태 패턴(State Pattern)으로 제어했는지 다루어 보겠습니다.
