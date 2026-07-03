# [Git] 로컬 브랜치 생성 CLI 명령어 및 'dubious ownership' 에러 해결 방법

<h2 data-ke-size="size26">1. Git 브랜치 생성 및 이동하기 (CLI)</h2>
<p data-ke-size="size16">터미널에서 새 브랜치를 만드는 방법은 크게 두 가지. 브랜치 생성과 동시에 해당 브랜치로 바로 이동하는 1번 방식 추천.</p>
<h3 data-ke-size="size23">① 생성과 동시에 새 브랜치로 이동하기 (추천)</h3>
<p data-ke-size="size16">브랜치를 만들고 바로 전환할 때 <code>-b</code> 옵션 사용.</p>
<pre class="haxe"><code>git switch -b [브랜치_이름]
# 또는 구버전 명령어
git checkout -b [브랜치_이름]</code></pre>
<h3 data-ke-size="size23">② 브랜치만 생성하기</h3>
<p data-ke-size="size16">현재 작업 중인 브랜치 위치를 유지한 채 브랜치 공간만 먼저 만들 때 사용.</p>
<pre class="apache"><code>git branch [브랜치_이름]</code></pre>
<p data-ke-size="size16"><i>※ 생성 후 해당 브랜치로 이동하려면 <code>git switch [브랜치_이름]</code> 별도 입력 필요.</i></p>
<hr data-ke-style="style1" />
<h2 data-ke-size="size26">2. "fatal: detected dubious ownership" 에러 해결법</h2>
<p data-ke-size="size16">윈도우 포맷 후 계정을 새로 생성했거나, 다른 PC에서 사용하던 외장 하드 디렉터리를 연결했을 때 발생.</p>
<blockquote data-ke-style="style1">
<p data-ke-size="size16"><b>에러 메시지 예시:</b><br /><code>fatal: detected dubious ownership in repository at 'D:/repos/...'</code><br /><code>... is owned by: 'S-1-5-21-...' but the current user is: 'S-1-5-21-...'</code></p>
</blockquote>
<p data-ke-size="size16">현재 로그인한 윈도우 사용자 계정과 해당 프로젝트 폴더의 소유자 계정이 일치하지 않아 Git이 보안상 명령어를 차단하는 현상.</p>
<h3 data-ke-size="size23">해결 방법: 안전한 디렉터리(safe.directory) 예외 등록</h3>
<h4 data-ke-size="size20">방법 A. 특정 프로젝트 폴더만 예외 등록하기</h4>
<p data-ke-size="size16">에러가 발생한 해당 폴더 경로를 Git 안전 구역으로 지정.</p>
<pre class="routeros"><code>git config --global --add safe.directory D:/repos/the-living-frame-unity-vfx-media-art</code></pre>
<h4 data-ke-size="size20">방법 B. 모든 폴더 예외 등록하기 (추천)</h4>
<p data-ke-size="size16">여러 Git 저장소에서 같은 에러가 반복될 때 모든 폴더를 일괄 예외 처리하여 번거로움 해결.</p>
<pre class="routeros"><code>git config --global --add safe.directory "*"</code></pre>
<p data-ke-size="size16"><i>※ 명령어 실행 후 기존에 하려던 <code>git branch</code>나 <code>git switch</code> 명령어 재실행.</i></p>
<hr data-ke-style="style1" />
<h2 data-ke-size="size26">3. Git 명령어에서 <code>-c</code> 옵션의 의미</h2>
<p data-ke-size="size16"><code>git -c [설정]=[값]</code> 형태의 명령어 구조.</p>
<p data-ke-size="size16">Git 환경 설정을 영구적으로 바꾸지 않고, 오직 해당 명령어를 실행하는 순간에만 <b>일회성으로 임시 변경</b>하여 적용하는 옵션.</p>
<h3 data-ke-size="size23">주요 활용 예시</h3>
<ul style="list-style-type: disc;" data-ke-list-type="disc">
<li><b>특정 폴더 임시 허용 후 명령어 실행:</b>
<pre class="gradle"><code>git -c safe.directory=D:/repos/my-project branch 새브랜치</code></pre>
</li>
<li><b>이번 커밋만 다른 작성자 이름으로 기록:</b>
<pre class="pgsql"><code>git -c user.name="TemporaryName" commit -m "임시 작성자 커밋"</code></pre>
</li>
<li><b>이번 커밋만 보안 서명(GPG) 건너뛰기:</b>
<pre class="pgsql"><code>git -c commit.gpgsign=false commit -m "빠른 커밋"</code></pre>
</li>
</ul>
<p data-ke-size="size16">평소 자주 사용하는 설정은 <code>git config</code> 사용, 특수한 상황에서 한 번만 설정을 바꿀 때는 <code>-c</code> 옵션 활용.</p>