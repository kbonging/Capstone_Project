###################################  공지사항  ###################################
-- 파일에 작성된 데이터들은 "반드시" 모두 실행 해주시길 바랍니다.
-- 데이터를 넣지않아 프로그램 오류가 발생할 수 있습니다.
###############################################################################

select * from tb_member;
#############################  tb_member 테이블 샘플 데이터 #############################
-- INSERT INTO tb_member (member_id, member_pwd, member_name, member_email, member_nickname, profile_image_url, reg_date, mod_date)
-- VALUES ('superadmin', '$2a$10$icZ9WU92wGzRuGJLBvWwmOWUuCtEp4vezbFUS7RUaM0C3UwuFamnS', '메인관리자', 'apple75391@gmail.com', '총괄관리자', 'defaultProfile.png', NOW(), NULL);
-- INSERT INTO tb_member (member_id, member_pwd, member_name, member_email, member_nickname, profile_image_url, reg_date, mod_date)
-- VALUES ('testUser01', '$2b$12$/lenMCtwsZPw.JJQzb8sJOgTHwpq3Ca6J43rtToUIzrjXf8AIN.8W', '테스트공일', 'testUser01@naver.com', '테스트유저', 'defaultProfile.png', NOW(), NULL);

## devadmin 계정(개발팀 공동 계정)의 비밀번호는 개발 문서 확인해주세요. ## 
## 개발시 개발팀 계정 사용하시면됩니다. 본인 계정 필요 시 사이트 회원가입해서 사용바랍니다. ##
## 만일 데이터베이스에서 직접 insert 필요 시 관리자에게 문의 바랍니다. ##

-- SET foreign_key_checks = 0;  -- 외래 키 체크 비활성화
-- TRUNCATE TABLE tb_member;    -- 테이블 데이터 삭제
-- SET foreign_key_checks = 1;  -- 외래 키 체크 활성화
#####################################################################################

#############################  tb_member_auth 테이블 샘플 데이터 #############################
# role_user, role_admin, role_owner) 리뷰어, 관리자, 소상공인
SELECT * FROM tb_member_auth;
-- INSERT INTO tb_member_auth(member_idx, auth) values(1, 'ROLE_USER');
-- INSERT INTO tb_member_auth(member_idx, auth) values(1, 'ROLE_ADMIN');
-- INSERT INTO tb_member_auth(member_idx, auth) values(2, 'ROLE_USER');

################################ 새로 생성 중 아직 import 금지 #######################
## 인플루언서 유형 (INF_TYPE)
INSERT INTO tb_common_code (code_id, group_code, code_nm, image_url, group_sort, sort, code_dc, reg_date)
VALUES 
('INF_TYPE', '', '인플루언서 유형', '', 0, 0, '인플루언서 유형 그룹', NOW()),
('INF001', 'INF_TYPE', '블로그', '', 0, 1, '인플루언서 유형', NOW()),
('INF002', 'INF_TYPE', '인스타', '', 0, 2, '인플루언서 유형', NOW()),
('INF003', 'INF_TYPE', '유튜브', '', 0, 3, '인플루언서 유형', NOW()),
('INF004', 'INF_TYPE', '기타', '', 0, 4, '인플루언서 유형', NOW());
## 활동주제 (ACT_TOPIC)
INSERT INTO tb_common_code (code_id, group_code, code_nm, image_url,  group_sort, sort, code_dc, reg_date)
VALUES 
('ACT_TOPIC', '', '활동주제', '', 1, 0, '활동주제 카테고리 그룹', NOW()),
('ACT001', 'ACT_TOPIC', '맛집', '', 1, 1, '활동주제 카테고리', NOW()),
('ACT002', 'ACT_TOPIC', '식품', '', 1, 2, '활동주제 카테고리', NOW()),
('ACT003', 'ACT_TOPIC', '뷰티', '', 1, 3, '활동주제 카테고리', NOW());

## 커뮤니티_카테고리 (COMMU_CATE)
INSERT INTO TB_COMMON_CODE (CODE_ID, GROUP_CODE, CODE_NM, GROUP_SORT, SORT, CODE_DC, REG_DATE)
VALUES
('COMMU_CATE', '', '커뮤니티카테고리', 2, 0, '커뮤니티 카테고리 그룹', NOW()),
('COMMU001', 'COMMU_CATE', '노하우', 2, 1, '커뮤니티 카테고리', NOW()),
('COMMU002', 'COMMU_CATE', '일상', 2, 2, '커뮤니티 카테고리', NOW()),
('COMMU003', 'COMMU_CATE', '질문하기', 2, 3, '커뮤니티 카테고리', NOW()),
('COMMU004', 'COMMU_CATE', '공지', 2, 4, '커뮤니티 카테고리', NOW());

## 1대1문의_카테고리(QA_CATE)
INSERT INTO TB_COMMON_CODE (CODE_ID, GROUP_CODE, CODE_NM, GROUP_SORT, SORT, CODE_DC, REG_DATE)
VALUES
('QA_CATE', '', '1대1문의카테고리', 3, 0, '1대1문의 카테고리 그룹', NOW()),
('QAC001', 'QA_CATE', '계정', 3, 1, '1대1문의 카테고리', NOW()),
('QAC002', 'QA_CATE', '체험단', 3, 2, '1대1문의 카테고리', NOW()),
('QAC003', 'QA_CATE', '리뷰', 3, 3, '1대1문의 카테고리', NOW()),
('QAC004', 'QA_CATE', '포인트', 3, 4, '1대1문의 카테고리', NOW()),
('QAC005', 'QA_CATE', '광고', 3, 5, '1대1문의 카테고리', NOW()),
('QAC006', 'QA_CATE', '기타', 3, 6, '1대1문의 카테고리', NOW());

## 1대1문의_처리상태(QA_STA)
INSERT INTO TB_COMMON_CODE (CODE_ID, GROUP_CODE, CODE_NM, GROUP_SORT, SORT, CODE_DC, REG_DATE)
VALUES
('QA_STA', '', '1대1문의처리상태', 4, 0, '1대1문의 처리상태 그룹', NOW()),
('QAS001', 'QA_STA', '대기', 4, 1, '1대1문의 처리상태', NOW()),
('QAS002', 'QA_STA', '답변완료', 4, 2, '1대1문의 처리상태', NOW());

## 캠페인_유형(CAM_PROM)
INSERT INTO TB_COMMON_CODE (CODE_ID, GROUP_CODE, CODE_NM, GROUP_SORT, SORT, CODE_DC, REG_DATE)
VALUES
('CAM_PROM', '', '캠페인유형', 5, 0, '캠페인 유형 그룹', NOW()),
('CAMP001', 'CAM_PROM', '방문형', 5, 1, '캠페인 유형', NOW()),
('CAMP002', 'CAM_PROM', '포장형', 5, 2, '캠페인 유형', NOW()),
('CAMP003', 'CAM_PROM', '배송형', 5, 3, '캠페인 유형', NOW()),
('CAMP004', 'CAM_PROM', '구매형', 5, 4, '캠페인 유형', NOW());

## 캠페인_카테고리(CAM_CATE)
INSERT INTO TB_COMMON_CODE (CODE_ID, GROUP_CODE, CODE_NM, GROUP_SORT, SORT, CODE_DC, REG_DATE)
VALUES
('CAM_CATE', '', '캠페인카테고리', 6, 0, '캠페인 카테고리 그룹', NOW()),
('CAMT001', 'CAM_CATE', '맛집', 6, 1, '캠페인 카테고리', NOW()),
('CAMT002', 'CAM_CATE', '식품', 6, 2, '캠페인 카테고리', NOW()),
('CAMT003', 'CAM_CATE', '뷰티', 6, 3, '캠페인 카테고리', NOW()),
('CAMT004', 'CAM_CATE', '여행', 6, 4, '캠페인 카테고리', NOW()),
('CAMT005', 'CAM_CATE', '디지털', 6, 5, '캠페인 카테고리', NOW()),
('CAMT006', 'CAM_CATE', '반려동물', 6, 6, '캠페인 카테고리', NOW()),
('CAMT007', 'CAM_CATE', '기타', 6, 7, '캠페인 카테고리', NOW());

## 캠페인_채널(CAM_CHANNEL)
INSERT INTO TB_COMMON_CODE (CODE_ID, GROUP_CODE, CODE_NM, GROUP_SORT, SORT, CODE_DC, REG_DATE)
VALUES
('CAM_CHANNEL', '', '캠페인채널', 7, 0, '캠페인 채널 그룹', NOW()),
('CAMC001', 'CAM_CHANNEL', '블로그', 7, 1, '캠페인 채널', NOW()),
('CAMC002', 'CAM_CHANNEL', '인스타그램', 7, 2, '캠페인 채널', NOW()),
('CAMC003', 'CAM_CHANNEL', '블로그+클립', 7, 3, '캠페인 채널', NOW()),
('CAMC004', 'CAM_CHANNEL', '클립', 7, 4, '캠페인 채널', NOW()),
('CAMC005', 'CAM_CHANNEL', '릴스', 7, 5, '캠페인 채널', NOW()),
('CAMC006', 'CAM_CHANNEL', '유튜브', 7, 6, '캠페인 채널', NOW()),
('CAMC007', 'CAM_CHANNEL', '쇼츠', 7, 7, '캠페인 채널', NOW()),
('CAMC008', 'CAM_CHANNEL', '틱톡', 7, 8, '캠페인 채널', NOW());

## 캠페인_게시_상태(CAM_STA)
INSERT INTO TB_COMMON_CODE (CODE_ID, GROUP_CODE, CODE_NM, GROUP_SORT, SORT, CODE_DC, REG_DATE)
VALUES
('CAM_STA', '', '게시상태', 8, 0, '캠페인 게시 상태 그룹', NOW()),
('CAMS001', 'CAM_STA', '대기', 8, 1, '캠페인 게시 상태', NOW()),
('CAMS002', 'CAM_STA', '승인', 8, 2, '캠페인 게시 상태', NOW()),
('CAMS003', 'CAM_STA', '반려', 8, 3, '캠페인 게시 상태', NOW());

## 캠페인_모집_상태(REC_STA)
INSERT INTO TB_COMMON_CODE (CODE_ID, GROUP_CODE, CODE_NM, GROUP_SORT, SORT, CODE_DC, REG_DATE)
VALUES
('REC_STA', '', '모집상태', 9, 0, '캠페인 모집 상태 그룹', NOW()),
('REC001', 'REC_STA', '모집중', 9, 1, '캠페인 모집 상태', NOW()),
('REC002', 'REC_STA', '마감', 9, 2, '캠페인 모집 상태', NOW());

## 체험단_신청_상태_코드(CAM_APP_STA)
INSERT INTO TB_COMMON_CODE (CODE_ID, GROUP_CODE, CODE_NM, GROUP_SORT, SORT, CODE_DC, REG_DATE)
VALUES
('CAM_APP_STA', '', '신청상태', 10, 0, '체험단 신청 상태 코드', NOW()),
('CAMAPP001', 'CAM_APP_STA', '대기', 10, 1, '체험단 신청 상태', NOW()),
('CAMAPP002', 'CAM_APP_STA', '탈락', 10, 2, '체험단 신청 상태', NOW()),
('CAMAPP003', 'CAM_APP_STA', '당첨', 10, 3, '체험단 신청 상태', NOW());

select * from TB_COMMON_CODE where del_yn='N' order by group_sort, sort asc;
-- update TB_COMMON_CODE set group_code='' where code_id='INF_TYPE';
select * from tb_common_code where del_yn='n' order by group_sort, sort asc;
-- update tb_common_code set group_code='' where code_id='INF_TYPE';

################ 리뷰어 회원가입 ################
# 리뷰어 회원 가입 시 아래 쿼리문 동시 insert #
INSERT INTO tb_member (member_id, member_pwd, member_name, member_email, member_phone, reg_date)
VALUES ('apple75391','$2a$10$icZ9WU92wGzRuGJLBvWwmOWUuCtEp4vezbFUS7RUaM0C3UwuFamnS', '김봉중', 'apple75391@gmail.com', '010-1234-5678', NOW());
## 권한 등록
INSERT INTO tb_member_auth(member_idx, auth) values(1, 'ROLE_USER');
## 리뷰어 프로필
INSERT INTO tb_reviewer_profile (member_idx, nickname, gender, birth_date)
VALUES (1, 'bonging', 'M', '2000-02-01');
INSERT INTO tb_reviewer_channel(member_idx, inf_type_code_id, channel_url, reg_date)
VALUES 
(1, 'INF001', 'https://blog.naver.com/apple75391', NOW()),
(1, 'INF002', 'https://instagram.com/apple75391', NOW());