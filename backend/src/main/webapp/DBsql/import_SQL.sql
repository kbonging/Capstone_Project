###################################  공지사항  ###################################
-- 파일에 작성된 데이터들은 "반드시" 모두 실행 해주시길 바랍니다.
-- 데이터를 넣지않아 프로그램 오류가 발생할 수 있습니다.
###############################################################################
create database platfrom;
use platfrom;
-- drop database platfrom;
######################### 회원 테이블 시작 ######################
# 회원 테이블 삭제
-- drop table tb_member;
# 회원 테이블 데이터만 삭제
-- truncate table tb_member;
# 공통 코드 테이블 데이터만 삭제
-- truncate table TB_COMMON_CODE;

# truncate 실행 시 foreign_key가 등록된 테이블을 truncate할 경우 오류가 발생한다.
# 아래와 같이 해결
-- set FOREIGN_KEY_CHECKS = 0;



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

################## 새로운 DB 설계 중입니다 ###################
############ 아래 코드는 얘기 전 까지 import(실행) 금지 !! ############
#########################################################
##! 공통코드 !## (완)
CREATE TABLE TB_COMMON_CODE (
	CODE_ID		VARCHAR(20)		PRIMARY KEY NOT NULL COMMENT '코드번호', -- 예) BLOG, INSTA, YOUTUBE 등
	GROUP_CODE	VARCHAR(20)		NULL				COMMENT '그룹 코드', -- 예) 인풀루언서 유형이면 INF_TYPE
	CODE_NM		VARCHAR(100)	NOT NULL			COMMENT '코드이름',
	IMAGE_URL	VARCHAR(255)	NULL				COMMENT '이미지 경로',
    GROUP_SORT 	INT 			NULL	DEFAULT 0 	COMMENT '그룹 정렬 순서',
	SORT		INT				NULL	DEFAULT 0	COMMENT '정렬 순서',
	CODE_DC		VARCHAR(255)	NULL				COMMENT '코드 설명',
	DEL_YN      CHAR(1)      	NOT NULL DEFAULT 'N'  COMMENT '삭제 여부(Y/N)',
    REG_DATE    DATETIME     	NOT NULL             COMMENT '가입일시',
    MOD_DATE    DATETIME                            COMMENT '수정일시'
);
-- drop table TB_COMMON_CODE;

##! 공통 회원 !## (완)
CREATE TABLE TB_MEMBER (
    MEMBER_IDX       INT            PRIMARY KEY AUTO_INCREMENT   COMMENT '회원 고유번호',
    MEMBER_ID        VARCHAR(60)    UNIQUE NOT NULL 			 COMMENT '로그인 아이디',
    MEMBER_PWD       VARCHAR(255)   NOT NULL                     COMMENT '비밀번호',
    MEMBER_NAME      VARCHAR(30)    NOT NULL                     COMMENT '실명(이름) (한글만 입력)',
    MEMBER_EMAIL     VARCHAR(255)   UNIQUE NOT NULL              COMMENT '이메일',
    MEMBER_PHONE	 VARCHAR(20)    NULL                         COMMENT '휴대폰 번호',
    PROFILE_IMG_URL VARCHAR(500)  DEFAULT 'defaultProfile.png'  COMMENT '프로필 이미지 URL (미작성시 기본 프로필 적용)',
    INTRO		 	 TEXT	NULL								COMMENT '소개글',
	HEART_COUNT		 INT	NULL	DEFAULT 0					COMMENT '하트수',
	PENALTY			 INT	NULL	DEFAULT 0					COMMENT '패널티',
    DEL_YN           CHAR(1)      NOT NULL DEFAULT 'N'          COMMENT '삭제 여부(Y/N)',
    REG_DATE         DATETIME     NOT NULL                      COMMENT '가입일시',
    MOD_DATE         DATETIME                                   COMMENT '수정일시'
) COMMENT='공통 회원 정보 테이블';
-- drop table TB_MEMBER;

##! 권한 !## (완)
CREATE TABLE TB_MEMBER_AUTH(
	AUTH_IDX 	INT 		PRIMARY KEY AUTO_INCREMENT 	COMMENT '권한 고유번호',
    MEMBER_IDX 	INT 		NOT NULL 					COMMENT '회원 고유번호',
    AUTH 		VARCHAR(60) NOT NULL 					COMMENT '권한(ROLE_USER, ROLE_ADMIN, ROLE_OWNER) 리뷰어, 관리자, 소상공인',
    FOREIGN KEY (MEMBER_IDX) REFERENCES TB_MEMBER(MEMBER_IDX) 
		ON DELETE CASCADE  
        ON UPDATE CASCADE
) COMMENT='권한 테이블';
-- drop table TB_MEMBER_AUTH;

##! 리뷰어프로필  !## (완)
CREATE TABLE TB_REVIEWER_PROFILE (
	MEMBER_IDX 		INT 			NOT NULL 	COMMENT '회원 고유번호',
	NICKNAME 		VARCHAR(60) 	NULL 		COMMENT '회원 닉네임',
	GENDER 			CHAR(1) 		NULL 		COMMENT '성별',
	BIRTH_DATE		VARCHAR(10) 	NULL 		COMMENT '생년월일',
	ACTIVITY_AREA 	VARCHAR(30) 	NULL 		COMMENT '활동지역',
	ACTIVITY_TOPIC  VARCHAR(30) 	NULL 		COMMENT '활동주제 (공통코드 ACT_TOPIC)', -- 맛집, 식품 뷰티 등등
	ZIP_CODE 		VARCHAR(10) 	NULL 		COMMENT '우편번호',
	ADDRESS 		VARCHAR(255) 	NULL 		COMMENT '주소',
	DETAIL_ADDRESS VARCHAR(255) 	NULL 		COMMENT '상세주소',
	PRIMARY KEY (MEMBER_IDX),
	FOREIGN KEY (MEMBER_IDX) REFERENCES TB_MEMBER(MEMBER_IDX)
		ON DELETE CASCADE  
        ON UPDATE CASCADE
) COMMENT='리뷰어 프로필 테이블';
-- drop table TB_REVIEWER_PROFILE;

##!  리뷰어 채널 정보 !## (완)
CREATE TABLE TB_REVIEWER_CHANNEL (
	REV_CHA_IDX 		INT PRIMARY KEY AUTO_INCREMENT 	COMMENT '채널 고유번호',
	MEMBER_IDX 			INT 		NOT NULL 			COMMENT '회원 고유번호',
	INF_TYPE_CODE_ID 	VARCHAR(20) NOT NULL 			COMMENT '인플루언서 유형 코드 (공통 코드 INF_TYPE)',
	CHANNEL_URL 		VARCHAR(500) NOT NULL			COMMENT '채널 주소',
	REG_DATE 			DATETIME 	NOT NULL 			COMMENT '등록일',
	MOD_DATE 			DATETIME	 NULL 				COMMENT '수정일시',
	FOREIGN KEY (MEMBER_IDX) REFERENCES TB_MEMBER(MEMBER_IDX)
    	ON DELETE CASCADE
        ON UPDATE CASCADE,
	FOREIGN KEY (INF_TYPE_CODE_ID) REFERENCES TB_COMMON_CODE(CODE_ID)
    	ON DELETE CASCADE
        ON UPDATE CASCADE
) COMMENT='리뷰어 채널 정보(리뷰어=인플루언서 유형 정보)';
-- drop table TB_REVIEWER_CHANNEL;

##! 소상공인 !## (완)
CREATE TABLE TB_OWNER_PROFILE (
	MEMBER_IDX 		INT 			NOT NULL 	COMMENT '회원 고유번호',
	BUSINESS_NAME 	VARCHAR(255) 	NOT NULL 	COMMENT '상호명',
	BUSINESS_URL 	TEXT 			NULL 	 	COMMENT '사업장 관련 URL',
	PRIMARY KEY (MEMBER_IDX),
	FOREIGN KEY (MEMBER_IDX) REFERENCES TB_MEMBER(MEMBER_IDX)
    	ON DELETE CASCADE
        ON UPDATE CASCADE
) COMMENT='소상공인 프로필 테이블';
-- drop table TB_OWNER_PROFILE;











