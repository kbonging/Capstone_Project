###################################  공지사항  ###################################
-- 파일에 작성된 데이터들은 "반드시" 모두 실행 해주시길 바랍니다.
-- 데이터를 넣지않아 프로그램 오류가 발생할 수 있습니다.
###############################################################################

select * from TB_MEMBER;
#############################  tb_member 테이블 샘플 데이터 #############################
-- INSERT INTO tb_member (MEMBER_ID, MEMBER_PWD, MEMBER_NAME, MEMBER_EMAIL, MEMBER_NICKNAME, PROFILE_IMAGE_URL, REG_DATE, MOD_DATE) 
-- VALUES ('superadmin', '$2a$10$icZ9WU92wGzRuGJLBvWwmOWUuCtEp4vezbFUS7RUaM0C3UwuFamnS', '메인관리자', 'apple75391@gmail.com', '총괄관리자', 'defaultProfile.png', NOW(), NULL);
-- INSERT INTO tb_member (MEMBER_ID, MEMBER_PWD, MEMBER_NAME, MEMBER_EMAIL, MEMBER_NICKNAME, PROFILE_IMAGE_URL, REG_DATE, MOD_DATE) 
-- VALUES ('testUser01', '$2b$12$/lenMCtwsZPw.JJQzb8sJOgTHwpq3Ca6J43rtToUIzrjXf8AIN.8W', '테스트공일', 'testUser01@naver.com', '테스트유저', 'defaultProfile.png', NOW(), NULL);

## devadmin 계정(개발팀 공동 계정)의 비밀번호는 개발 문서 확인해주세요. ## 
## 개발시 개발팀 계정 사용하시면됩니다. 본인 계정 필요 시 사이트 회원가입해서 사용바랍니다. ##
## 만일 데이터베이스에서 직접 insert 필요 시 관리자에게 문의 바랍니다. ##

-- SET foreign_key_checks = 0;  -- 외래 키 체크 비활성화
-- TRUNCATE TABLE tb_member;    -- 테이블 데이터 삭제
-- SET foreign_key_checks = 1;  -- 외래 키 체크 활성화
#####################################################################################

#############################  TB_MEMBER_AUTH 테이블 샘플 데이터 #############################
# ROLE_USER, ROLE_ADMIN, ROLE_OWNER) 리뷰어, 관리자, 소상공인
SELECT * FROM TB_MEMBER_AUTH;
-- INSERT INTO TB_MEMBER_AUTH(MEMBER_IDX, AUTH) values(1, 'ROLE_USER');
-- INSERT INTO TB_MEMBER_AUTH(MEMBER_IDX, AUTH) values(1, 'ROLE_ADMIN');
-- INSERT INTO TB_MEMBER_AUTH(MEMBER_IDX, AUTH) values(2, 'ROLE_USER');

################################ 새로 생성 중 아직 IMPORT 금지 #######################
## 인플루언서 유형 (INF_TYPE)
INSERT INTO TB_COMMON_CODE (CODE_ID, GROUP_CODE, CODE_NM, IMAGE_URL, GROUP_SORT, SORT, CODE_DC, REG_DATE)
VALUES 
('INF_TYPE', '', '인플루언서 유형', '', 0, 0, '인플루언서 유형 그룹', NOW()),
('INF001', 'INF_TYPE', '블로그', '', 0, 1, '인플루언서 유형', NOW()),
('INF002', 'INF_TYPE', '인스타', '', 0, 2, '인플루언서 유형', NOW()),
('INF003', 'INF_TYPE', '유튜브', '', 0, 3, '인플루언서 유형', NOW()),
('INF004', 'INF_TYPE', '기타', '', 0, 4, '인플루언서 유형', NOW());
## 활동주제 (ACT_TOPIC)
INSERT INTO TB_COMMON_CODE (CODE_ID, GROUP_CODE, CODE_NM, IMAGE_URL,  GROUP_SORT, SORT, CODE_DC, REG_DATE)
VALUES 
('ACT_TOPIC', '', '활동주제', '', 1, 0, '활동주제 카테고리 그룹', NOW()),
('ACT001', 'ACT_TOPIC', '맛집', '', 1, 1, '활동주제 카테고리', NOW()),
('ACT002', 'ACT_TOPIC', '식품', '', 1, 2, '활동주제 카테고리', NOW()),
('ACT003', 'ACT_TOPIC', '뷰티', '', 1, 3, '활동주제 카테고리', NOW());

select * from TB_COMMON_CODE where del_yn='N' order by group_sort, sort asc;
-- update TB_COMMON_CODE set group_code='' where code_id='INF_TYPE';

################ 리뷰어 회원가입 ################
# 리뷰어 회원 가입 시 아래 쿼리문 동시 INSERT #
INSERT INTO TB_MEMBER (MEMBER_ID, MEMBER_PWD, MEMBER_NAME, MEMBER_EMAIL, MEMBER_PHONE, REG_DATE) 
VALUES ('apple75391','$2a$10$icZ9WU92wGzRuGJLBvWwmOWUuCtEp4vezbFUS7RUaM0C3UwuFamnS', '김봉중', 'apple75391@gmail.com', '010-1234-5678', NOW());
## 권한 등록
INSERT INTO TB_MEMBER_AUTH(MEMBER_IDX, AUTH) values(1, 'ROLE_USER');
## 리뷰어 프로필
INSERT INTO TB_REVIEWER_PROFILE (MEMBER_IDX, NICKNAME, GENDER, BIRTH_DATE) 
VALUES (1, 'bonging', 'M', '2000-02-01');
INSERT INTO TB_REVIEWER_CHANNEL(MEMBER_IDX, INF_TYPE_CODE_ID, CHANNEL_URL, REG_DATE) 
VALUES 
(1, 'INF001', 'https://blog.naver.com/apple75391', NOW()),
(1, 'INF002', 'https://instagram.com/apple75391', NOW());


select * 
FROM TB_MEMBER MB JOIN TB_MEMBER_AUTH AU
ON MB.MEMBER_IDX = AU.MEMBER_IDX
JOIN TB_REVIEWER_PROFILE RP
ON MB.MEMBER_IDX = RP.MEMBER_IDX;

select * 
FROM TB_MEMBER MB JOIN TB_MEMBER_AUTH AU
ON MB.MEMBER_IDX = AU.MEMBER_IDX
JOIN TB_REVIEWER_PROFILE RP
ON MB.MEMBER_IDX = RP.MEMBER_IDX
JOIN TB_REVIEWER_CHANNEL RC
ON MB.MEMBER_IDX = RC.MEMBER_IDX;


select * from TB_MEMBER_AUTH;



