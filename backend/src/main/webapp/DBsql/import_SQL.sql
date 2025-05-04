###################################  공지사항  ###################################
-- 파일에 작성된 데이터들은 "반드시" 모두 실행 해주시길 바랍니다.
-- 데이터를 넣지않아 프로그램 오류가 발생할 수 있습니다.
###############################################################################
create database platfrom;
use platfrom;
-- drop database vibestay;
######################### 회원 테이블 시작 ######################
-- drop table tb_member;
-- truncate table tb_member;
-- drop table tb_social_member;

# tb_member 테이블
CREATE TABLE tb_member (
    MEMBER_IDX INT PRIMARY KEY AUTO_INCREMENT COMMENT '회원 고유번호', -- 회원 고유번호 (PK)
    MEMBER_ID VARCHAR(60) UNIQUE COMMENT '로컬 회원 아이디', -- 중복안됨, NULL허용
    MEMBER_PWD VARCHAR(255) COMMENT '로컬 회원 비밀번호', -- 로컬 회원 비밀번호 (소셜 로그인 계정은 비밀번호 없을 수 있음)
    MEMBER_NAME VARCHAR(30) NOT NULL COMMENT '회원명',
    MEMBER_EMAIL VARCHAR(255) UNIQUE NOT NULL COMMENT '회원 이메일 (로컬+소셜 공통)',
    MEMBER_NICKNAME VARCHAR(60) COMMENT '닉네임',
    PROFILE_IMAGE_URL VARCHAR(500) COMMENT '프로필 이미지 URL',
    DEL_YN CHAR(1) NOT NULL DEFAULT 'N' COMMENT '삭제 여부(Y, N)',
    REG_DATE DATETIME NOT NULL COMMENT '가입일',
    MOD_DATE DATETIME COMMENT '수정일'
) COMMENT='회원 테이블';

# 권한 테이블
CREATE TABLE TB_MEMBER_AUTH(
	AUTH_IDX INT PRIMARY KEY AUTO_INCREMENT COMMENT '권한 고유번호',
    MEMBER_IDX INT NOT NULL COMMENT '회원 고유번호',
    AUTH VARCHAR(60) NOT NULL COMMENT '권한(ROLE_USER, ROLE_ADMIN)'
);

# tb_social_member 테이블 (현재 사용 안함)
CREATE TABLE tb_social_member (
    SOCIAL_IDX INT PRIMARY KEY AUTO_INCREMENT COMMENT '소셜 고유 번호', -- 소셜 고유번호 (PK)
    MEMBER_IDX INT NOT NULL COMMENT '회원 테이블의 회원 고유번호 (FK)', -- tb_member의 MEMBER_IDX 참조
    SOCIAL_TYPE VARCHAR(20) NOT NULL COMMENT '소셜 로그인 타입 (예: kakao, google)', -- 소셜 로그인 서비스 타입
    SOCIAL_ID VARCHAR(255) UNIQUE NOT NULL COMMENT '소셜 로그인 사용자 고유 ID', -- 소셜 로그인 서비스에서 제공하는 사용자 ID
    FOREIGN KEY (MEMBER_IDX) REFERENCES tb_member(MEMBER_IDX) ON DELETE CASCADE -- FK 설정 및 삭제 규칙
) COMMENT='소셜 로그인 정보 테이블'; -- 테이블 설명
######################### 회원 테이블 끝 #######################




