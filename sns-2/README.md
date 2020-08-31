# TODOLIST

### MODEL 구현
 1. USER O
   - 아이디,비밀번호,닉네임, 팔로워,팔로잉
 2. POST O
   - 작성자, 이미지, 내용, 좋아요갯수
 3. POST-LIKE O
   -포스트ID와 좋아요 USER ID 관계 표현
 3. HASHTAG O
   - 해시태그 목록
 4. POST-HASHTAG O
   - 포스트와 해시태그간 관계 표현
 5. STORY O
   - 작성자, 이미지
 6. 필요한 method 구현
  
### ROUTER 구현
 0. GET / ( 메인 화면 ) o
 
 1. 회원가입, 로그인(로그아웃) ROUTER ( passport module ) o
   - POST /auth/join : 계정 회원가입
   - POST /auth/login : 계정 로그인
   - GET /auth/logout : 계정 로그아웃
 2. 검색 ROUTER o
   - GET /search/hashtag?hashtag=@@ : 해시태그로 검색
   - GET /search/nick?nick=@@ : 닉네임으로 검색
 3. 포스팅 ROUTER
   - POST /post : 게시글 업로드 o
   - DELETE /post/:id : 게시글 삭제 
   - POST /post/story : 스토리 업로드
 4. 프로필 ROUTER
   - GET /profile/:id : 프로필
 5. 메인 ROUTER
   - STORY 등 
   
### VIEW 구현
 0. 메인 로그인 o
 1. 메인(포스팅) o
 2. 스토리
 3. 프로필
 4. ERROR
 
 
 
 ### 한거
 - 8.21 : 데이터베이스, localStrategy 구현
 - 8.24 : 로그인부분 ,kakaoStrategy
  page.js 나머지 라우터 구현
 - 8.25 : kakaoStrategy 완료, 포스팅, search 라우터작성
 >> 연결해야함
 - 8.26 : search 라우터 작성완료.
 - 8.27 : 팔로우 기능 /프로필 완성
 - 8.28 : 좋아요 완성
 - 8.29 : 깔끔하게 정리!