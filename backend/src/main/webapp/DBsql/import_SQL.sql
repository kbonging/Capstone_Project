###################################  공지사항  ###################################
-- 파일에 작성된 데이터들은 "반드시" 모두 실행 해주시길 바랍니다.
-- 데이터를 넣지않아 프로그램 오류가 발생할 수 있습니다.
###############################################################################
-- create database capstone;
-- use capstone;
-- drop database capstone;

# 전체 테이블 삭제 명령어 조회
-- SELECT CONCAT('DROP TABLE IF EXISTS `', table_name, '`;')
-- FROM information_schema.tables
-- WHERE table_schema = 'capstone';


######################### 회원 테이블 시작 ######################
-- 회원 테이블 삭제
-- drop table tb_member;
-- 회원 테이블 데이터만 삭제
-- truncate table tb_member;
-- 공통 코드 테이블 데이터만 삭제
-- truncate table tb_common_code;

-- truncate 실행 시 foreign_key가 등록된 테이블을 truncate할 경우 오류가 발생한다.
-- 아래와 같이 해결
-- set foreign_key_checks = 0;

-- 소셜 멤버 테이블 (현재 사용 안함)
-- create table tb_social_member (
--     social_idx int primary key auto_increment comment '소셜 고유 번호',
--     member_idx int not null comment '회원 테이블의 회원 고유번호',
--     social_type varchar(20) not null comment '소셜 로그인 타입 (예: kakao, google)',
--     social_id varchar(255) unique not null comment '소셜 로그인 사용자 고유 id',
--     foreign key (member_idx) references tb_member(member_idx) on delete cascade
-- ) comment='소셜 로그인 정보 테이블';
######################### 회원 테이블 끝 #######################

################## 새로운 db 설계 중입니다 ###################
############ 아래 코드는 얘기 전 까지 import(실행) 금지 !! ############
#########################################################

-- 공통코드
create table tb_common_code (
	code_id			varchar(20)		primary key not null comment '코드번호',
	group_code		varchar(20)		null comment '그룹 코드',
	code_nm			varchar(100)	not null comment '코드이름',
	image_url		varchar(255)	null comment '이미지 경로',
	group_sort		int 			null default 0 comment '그룹 정렬 순서',
	sort			int			null default 0 comment '정렬 순서',
	code_dc			varchar(255)	null comment '코드 설명',
	del_yn			char(1)			not null default 'N' comment '삭제 여부(Y/N)',
	reg_date		datetime		not null comment '가입일시',
	mod_date		datetime		null comment '수정일시'
)comment='공통 코드 테이블';

-- 공통 회원
create table tb_member (
	member_idx		int			primary key auto_increment comment '회원 고유번호',
	member_id		varchar(60)	unique not null comment '로그인 아이디',
	member_pwd		varchar(255)	not null comment '비밀번호',
	member_name		varchar(30)	not null comment '실명(이름) (한글만 입력)',
	member_email	varchar(255)	unique not null comment '이메일',
	member_phone	varchar(20)	null comment '휴대폰 번호',
	profile_img_url	varchar(500)	default 'defaultprofile.png' comment '프로필 이미지 url (미작성시 기본 프로필 적용)',
	intro			text		null comment '소개글',
	heart_count		int			null default 0 comment '하트수',
	penalty			int			null default 0 comment '패널티',
	del_yn			char(1)			not null default 'N' comment '삭제 여부(Y/N)',
	reg_date		datetime		not null comment '가입일시',
	mod_date		datetime		null comment '수정일시'
) COMMENT='공통 회원 정보 테이블';

-- 권한
create table tb_member_auth (
	auth_idx		int			primary key auto_increment comment '권한 고유번호',
	member_idx		int			not null comment '회원 고유번호',
	auth			varchar(60)	not null comment '권한(role_user, role_admin, role_owner)',
	foreign key (member_idx) references tb_member(member_idx)
		on delete cascade
		on update cascade
)comment='권한 테이블';

-- 리뷰어 프로필
create table tb_reviewer_profile (
	member_idx		int			not null comment '회원 고유번호',
	nickname		varchar(60)	not null comment '회원 닉네임',
	gender			char(1)		null comment '성별',
	birth_date		varchar(10)	null comment '생년월일',
	activity_area	varchar(30)	null comment '활동지역',
	activity_topic	varchar(30)	null comment '활동주제 (공통코드 ACT_TOPIC)',
	zip_code		varchar(10)	null comment '우편번호',
	address			varchar(255)	null comment '주소',
	detail_address	varchar(255)	null comment '상세주소',
	primary key (member_idx),
	foreign key (member_idx) references tb_member(member_idx)
		on delete cascade
		on update cascade
) COMMENT='리뷰어 프로필 테이블';

-- 리뷰어 채널 정보
create table tb_reviewer_channel (
	rev_cha_idx		int			primary key auto_increment comment '채널 고유번호',
	member_idx			int		not null comment '회원 고유번호',
	inf_type_code_id	varchar(20)	not null comment '인플루언서 유형 코드 (공통 코드 INF_TYPE)',
	channel_url			varchar(500)	not null comment '채널 주소',
	reg_date			datetime	not null comment '등록일',
	mod_date			datetime	null comment '수정일시',
	foreign key (member_idx) references tb_member(member_idx)
		on delete cascade
		on update cascade,
	foreign key (inf_type_code_id) references tb_common_code(code_id)
		on delete cascade
		on update cascade
) COMMENT='리뷰어 채널 정보(리뷰어=인플루언서 유형 정보)';

-- 소상공인
create table tb_owner_profile (
	member_idx		int			not null comment '회원 고유번호',
	business_name	varchar(255)	not null comment '상호명',
	business_url	text		null comment '사업장 관련 url',
	primary key (member_idx),
	foreign key (member_idx) references tb_member(member_idx)
		on delete cascade
		on update cascade
) COMMENT='소상공인 프로필 테이블';

-- 커뮤니티 테이블
-- DROP TABLE tb_community;
CREATE TABLE tb_community (
    community_idx   INT AUTO_INCREMENT PRIMARY KEY 	COMMENT '커뮤니티 고유번호',
    member_idx      INT NOT NULL 					COMMENT '회원 고유번호',
    category_id     VARCHAR(20) NOT NULL 			COMMENT '카테고리 코드 (공통 코드 COMMU_CATE)',
    title           VARCHAR(255) NOT NULL 			COMMENT '제목',
    content         TEXT NOT NULL 					COMMENT '내용',
    view_count      INT NOT NULL DEFAULT 0 			COMMENT '조회수',
    reg_date        DATETIME NOT NULL 				COMMENT '등록일',
    mod_date        DATETIME DEFAULT NULL 			COMMENT '수정일',
    del_yn          CHAR(1) NOT NULL DEFAULT 'N' 	COMMENT '삭제 여부 (Y/N)',
        FOREIGN KEY (member_idx) REFERENCES tb_member(member_idx)
			on delete cascade
			on update cascade,
        FOREIGN KEY (category_id)  REFERENCES tb_common_code(code_id)
			on delete cascade
			on update cascade
) COMMENT='커뮤니티 게시판 테이블';

	-- 댓글 테이블
    -- DROP TABLE tb_comment
CREATE TABLE tb_comment (
	comment_idx		INT AUTO_INCREMENT PRIMARY KEY 	COMMENT '댓글 고유번호',
    community_idx	INT NOT NULL					COMMENT '게시글 고유번호',
	member_idx		INT NOT NULL					COMMENT '회원 고유번호',
    content			TEXT NOT NULL					COMMENT '내용',
    parent_id		INT NULL						COMMENT '부모 댓글',
    group_id		INT NOT NULL					COMMENT '트리 그룹',
    depth			INT NOT NULL DEFAULT 0			COMMENT '계층',
    sort_order		INT NOT NULL DEFAULT 0			COMMENT '정렬 순서',
    comment_type	VARCHAR(20) NOT NULL			COMMENT '댓글 타입',
    reg_date		DATETIME NOT NULL				COMMENT '등록일',
    mod_date		DATETIME DEFAULT NULL			COMMENT '수정일',
    del_yn			CHAR(1) NOT NULL DEFAULT 'N'	COMMENT '삭제 여부(Y/N)',
		CHECK (depth <= 2),
		FOREIGN KEY (parent_id)		REFERENCES tb_comment(comment_idx)
			on delete cascade
            on update cascade,
		FOREIGN KEY (group_id)		REFERENCES tb_comment(comment_idx)
			on delete cascade
            on update cascade,
		FOREIGN KEY (member_idx)	REFERENCES tb_member(member_idx)
			on delete cascade
            on update cascade,
		FOREIGN KEY (community_idx) REFERENCES tb_community(community_idx)
			on delete cascade
            on update cascade,
		FOREIGN KEY (comment_type)	REFERENCES tb_common_code(code_id)
			on update cascade
) COMMENT = '댓글 테이블';

######### Campaign 테이블 없어서 불가능 ㄱㄷ ############
-- ALTER TABLE tb_comment
-- ADD FOREIGN KEY (campaign_idx)
-- REFERENCES tb_campaign(campaign_idx)
-- ON DELETE CASCADE
-- ON UPDATE CASCADE;

-- ALTER TABLE tb_comment
-- ADD
-- CHECK (
--     (community_idx IS NOT NULL AND campaign_idx IS NULL) OR
--     (community_idx IS NULL AND campaign_idx IS NOT NULL)
-- );

###### 커무니티 좋아요 테이블 #####
    -- DROP TABLE tb_like
CREATE TABLE tb_like (
	like_idx		INT AUTO_INCREMENT PRIMARY KEY COMMENT '좋아요 고유번호',
    community_idx	INT NOT NULL				   COMMENT '커뮤니티 고유번호',
    member_idx		INT NOT NULL				   COMMENT '회원 고유번호',
    reg_date		DATETIME NOT NULL				COMMENT '등록일',
        UNIQUE KEY uniq_like (community_idx, member_idx),
		FOREIGN KEY (member_idx) REFERENCES tb_member(member_idx)
			on delete cascade
            on update cascade,
		FOREIGN KEY (community_idx) REFERENCES tb_community(community_idx)
			on delete cascade
            on update cascade
) COMMENT = '좋아요 테이블';

######################################################################
############################# 체험단 관련 ###############################
######################################################################

############# 체험단 캠페인 #############
CREATE TABLE `tb_campaign` (
	`CAMPAIGN_IDX`		INT AUTO_INCREMENT PRIMARY KEY 	COMMENT '캠페인 고유번호',
	`MEMBER_IDX`		INT NOT NULL 					COMMENT '소상공인 고유번호',
	`TITLE`				VARCHAR(255) NOT NULL			COMMENT '체험단 제목',
    `SHOP_NAME`			varchar(100) NOT NULL 			COMMENT '캠페인 상호명',
	`THUMBNAIL_URL` 	VARCHAR(255) NOT NULL			COMMENT '썸네일 이미지 경로',
	`CONTACT_PHONE`		VARCHAR(20) NOT NULL			COMMENT '담당자 연락처',
	`CAMPAIGN_TYPE`		VARCHAR(20) NOT NULL 			COMMENT '캠페인 홍보 유형(CAM_PROM)',
	`CAM_CATE_CODE`		VARCHAR(20) NOT NULL 			COMMENT '캠페인 카테고리코드(CAM_CATE)',
	`CHANNEL_CODE`		VARCHAR(20) NOT NULL 			COMMENT '채널코드(CAM_CHANNEL)',
	`MISSION`       	TEXT 		NOT NULL			COMMENT '체험 미션 내용',
	`KEYWORD_1`			VARCHAR(100)	NOT NULL		COMMENT '키워드1',
	`KEYWORD_2`			VARCHAR(100)	NULL			COMMENT '키워드2',
	`KEYWORD_3`			VARCHAR(100)	NULL			COMMENT '키워드3',
	`BENEFIT_DETAIL`	TEXT	NOT NULL				COMMENT '제공 금액',
	`RECRUIT_COUNT`		INT			NULL				COMMENT '모집인원',
	`APPLY_START_DATE`	DATE	NOT NULL				COMMENT '신청 시작일',
	`APPLY_END_DATE`	DATE	NOT NULL				COMMENT '신청 마감일',
	`ANNOUNCE_DATE`		DATE	NOT NULL				COMMENT '리뷰어 발표일',
	`EXP_START_DATE`	DATE	NOT NULL				COMMENT '체험 시작일',
	`EXP_END_DATE`		DATE	NOT NULL				COMMENT '체험 종료일',
	`DEADLINE_DATE`		DATE	NOT NULL				COMMENT '리뷰 마감일',
	`CAMPAIGN_STATUS`	VARCHAR(20)	NOT NULL			COMMENT '캠페인 게시상태(CAM_STA)',
	`RECRUIT_STATUS`	VARCHAR(20)	NOT NULL			COMMENT '모집 상태(REC_STA)',
	`DEL_YN`	CHAR(1)	NOT NULL	DEFAULT 'N',
	`REG_DATE`	DATETIME	NOT NULL,
	`MOD_DATE`	DATETIME	NULL
);
-- drop table TB_CAMPAIGN; 
############ 방문형/포장형 테이블 ###############
CREATE TABLE `tb_campaign_visit` (
	`CAMPAIGN_IDX`		INT				PRIMARY KEY 		COMMENT '켐페인 고유번호',
	`ADDRESS`			VARCHAR(255)	NOT NULL			COMMENT '체험주소',
	`ADDRESS_DETAIL`	VARCHAR(255)	NOT NULL			COMMENT '상세주소',
	`EXP_DAY`			VARCHAR(15)		NOT NULL			COMMENT '체험 가능 요일',
	`START_TIME`		VARCHAR(15)		NOT NULL			COMMENT '체험 시작 시간',
	`END_TIME`			VARCHAR(15)		NOT NULL			COMMENT '체험 종료 시간',
	`RESERVATION_NOTICE`	TEXT		NULL				COMMENT '예약 시 주의사항',
    FOREIGN KEY (`CAMPAIGN_IDX`) REFERENCES `TB_CAMPAIGN`(`CAMPAIGN_IDX`)
		on delete cascade
		on update cascade
);
-- drop table TB_CAMPAIGN_VISIT;
########## 배송형/구매형 #############
CREATE TABLE `tb_campaign_delivery` (
	`CAMPAIGN_IDX`	INT	PRIMARY KEY	COMMENT '켐페인 고유번호',
	`PURCHASE_URL`	VARCHAR(255)	NOT NULL COMMENT '구매링크',
	FOREIGN KEY (`CAMPAIGN_IDX`) REFERENCES `TB_CAMPAIGN`(`CAMPAIGN_IDX`)
		on delete cascade
		on update cascade
);
-- drop table TB_CAMPAIGN_DELIVERY;

############# 캠페인 신청 테이블 ##############
CREATE TABLE `tb_campaign_application` (
	`APPLICATION_IDX`	INT	AUTO_INCREMENT PRIMARY KEY NOT NULL COMMENT '캠페인 신청 고유번호',
	`CAMPAIGN_IDX`	INT				NOT NULL					COMMENT '켐페인 고유번호',
	`MEMBER_IDX`	INT				NOT NULL					COMMENT '회원 고유번호',
	`APPLY_REASON`	TEXT			NOT NULL 					COMMENT '신청 사유',
	`APPLY_STATUS_CODE`	VARCHAR(20)	NOT NULL 					COMMENT '신청 상태 코드',
	`DEL_YN`	CHAR(1)				NOT NULL	DEFAULT 'N' 	COMMENT '삭제 여부',
	`REG_DATE`	DATETIME			NOT NULL 					COMMENT '등록일',
	`MOD_DATE`	DATETIME			NULL 						COMMENT '수정일',
    FOREIGN KEY (`CAMPAIGN_IDX`) REFERENCES `TB_CAMPAIGN`(`CAMPAIGN_IDX`)
		on delete cascade
        on update cascade,
	FOREIGN KEY (`MEMBER_IDX`) REFERENCES `TB_MEMBER`(`MEMBER_IDX`)
		on delete cascade
        on update cascade,
	FOREIGN KEY (`APPLY_STATUS_CODE`) REFERENCES `TB_COMMON_CODE`(`CODE_ID`)
        on delete cascade
        on update cascade
);

######### 캠페인 찜(북마크) 테이블 ###########
CREATE TABLE `tb_bookmark` (
    `BOOKMARK_IDX` INT AUTO_INCREMENT PRIMARY KEY NOT NULL COMMENT '찜 고유번호',
    `MEMBER_IDX` INT NOT NULL COMMENT '찜한 회원 고유번호',
    `CAMPAIGN_IDX` INT NOT NULL COMMENT '찜한 캠페인 고유번호',
    UNIQUE KEY uq_member_campaign (`MEMBER_IDX`, `CAMPAIGN_IDX`),
    FOREIGN KEY (`MEMBER_IDX`) REFERENCES `TB_MEMBER`(`MEMBER_IDX`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (`CAMPAIGN_IDX`) REFERENCES `TB_CAMPAIGN`(`CAMPAIGN_IDX`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


