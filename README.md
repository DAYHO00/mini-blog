# Mini Blog - B.L.O.G

JWT 기반 인증과 게시글·댓글·좋아요 기능을 갖춘  
개인 미니 블로그 웹 애플리케이션

## 목차

- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [시작하기](#-시작하기)
- [핵심 기능](#-핵심-기능)
- [데이터 흐름](#-데이터-흐름)
- [주의사항](#-주의사항)

---

## 🎯 주요 기능

### 인증 / 인가
- 회원가입 / 로그인
- JWT 기반 인증
- 인증이 필요한 API 보호

### 게시글 관리
- 게시글 작성
- 게시글 목록 조회
- 게시글 상세 조회
- 게시글 삭제

### 좋아요 기능
- 게시글 좋아요 / 취소
- 내 좋아요 여부 조회
- 좋아요 수 조회

### 댓글 기능
- 게시글별 댓글 목록 조회
- 댓글 작성
- 댓글 삭제

---

## 🛠 기술 스택

### Frontend
Framework: React
Language: TypeScript
Build Tool: Vite
Routing: react-router-dom
HTTP Client: Axios

### Backend
Framework: Spring Boot 3.x
Language: Java 17
Security: Spring Security + JWT
ORM: JPA / Hibernate
API Docs: Swagger (OpenAPI)

### Database
Database: PostgreSQL 16

### Infrastructure
Containerization: Docker / Docker Compose
Cloud: AWS EC2 (Production)
CI/CD: GitHub Actions
Image Registry: GHCR

---

## 🚀 시작하기

### 사전 요구사항
- Docker / Docker Compose

### Docker로 전체 실행 (FE + BE + DB)

```bash
cd mini-blog/infra
docker compose up -d --build

- Frontend: http://localhost
- Backend: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui/index.html

---

### 💡 핵심 기능
- 1. JWT 인증 흐름
로그인 시 JWT 발급
Authorization 헤더에 토큰 포함
필터 기반 인증 처리

- 2. 게시글 / 댓글 / 좋아요 API
RESTful API 설계
인증/비인증 요청 분리
작성자 권한 기반 삭제 처리

- 3. Docker 기반 통합 구성
Frontend / Backend / DB를 Docker Compose로 묶어서 실행
로컬/운영 환경 모두 동일한 실행 방식 유지

---

### 🔄 데이터 흐름

Client (Browser)
  ↓
Frontend (React)
  ↓  JWT
Backend (Spring Boot)
  ↓
PostgreSQL
  ↓
JSON Response

--- 

### ⚠️ 주의사항 및 개선사항
- DB 구체적 설계
- 백엔드 추가 기능 설계
- 프론트엔드 UI 개선
- 운영 흐름 정리
- 크롤링 기능 추가
- LLM 기능 추가
- Redis 추가
