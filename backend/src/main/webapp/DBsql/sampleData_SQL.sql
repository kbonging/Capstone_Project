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
#############################################
