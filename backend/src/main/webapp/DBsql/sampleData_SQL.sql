###################################  공지사항  ###################################
-- 파일에 작성된 데이터들은 "반드시" 모두 실행 해주시길 바랍니다.
-- 데이터를 넣지않아 프로그램 오류가 발생할 수 있습니다.
###############################################################################

select * from tb_member;
select count(*) from tb_member;
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
('INF001', 'INF_TYPE', '블로그', '', 0, 1, '블로그 게시물 1건 업로드', NOW()),
('INF002', 'INF_TYPE', '인스타', '', 0, 2, '사진 3장 이상의 피드게시물 1개 업로드', NOW()),
('INF003', 'INF_TYPE', '유튜브', '', 0, 3, '3분 이상의 영상(유튜브) 1개 업로드', NOW()),
('INF004', 'INF_TYPE', '기타', '', 0, 4, '기타', NOW());

## 활동주제 (ACT_TOPIC)
INSERT INTO tb_common_code (code_id, group_code, code_nm, image_url,  group_sort, sort, code_dc, reg_date)
VALUES 
('ACT_TOPIC', '', '활동주제', '', 1, 0, '활동주제 카테고리 그룹', NOW()),
('ACT001', 'ACT_TOPIC', '맛집', '', 1, 1, '활동주제 카테고리', NOW()),
('ACT002', 'ACT_TOPIC', '식품', '', 1, 2, '활동주제 카테고리', NOW()),
('ACT003', 'ACT_TOPIC', '뷰티', '', 1, 3, '활동주제 카테고리', NOW()),
('ACT004', 'ACT_TOPIC', '여행', '', 1, 4, '활동주제 카테고리', NOW()),
('ACT005', 'ACT_TOPIC', '디지털', '', 1, 5, '활동주제 카테고리', NOW()),
('ACT006', 'ACT_TOPIC', '반려동물', '', 1, 6, '활동주제 카테고리', NOW()),
('ACT007', 'ACT_TOPIC', '기타', '', 1, 7, '활동주제 카테고리', NOW());

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
('PENDING', 'CAM_STA', '대기', 8, 1, '캠페인 게시 상태', NOW()),
('APPROVED', 'CAM_STA', '승인', 8, 2, '캠페인 게시 상태', NOW()),
('REJECTED', 'CAM_STA', '반려', 8, 3, '캠페인 게시 상태', NOW());

## 캠페인_모집_상태(REC_STA)
INSERT INTO TB_COMMON_CODE (CODE_ID, GROUP_CODE, CODE_NM, GROUP_SORT, SORT, CODE_DC, REG_DATE)
VALUES
('REC_STA', '', '모집상태', 9, 0, '캠페인 모집 상태 그룹', NOW()),
('OPEN', 'REC_STA', '모집중', 9, 1, '캠페인 모집 상태', NOW()),
('CLOSED', 'REC_STA', '마감', 9, 2, '캠페인 모집 상태', NOW());

## 체험단_신청_상태_코드(CAM_APP_STA)
INSERT INTO TB_COMMON_CODE (CODE_ID, GROUP_CODE, CODE_NM, GROUP_SORT, SORT, CODE_DC, REG_DATE)
VALUES
('CAM_APP_STA', '', '신청상태', 10, 0, '체험단 신청 상태 그룹', NOW()),
('CAMAPP_PENDING', 'CAM_APP_STA', '대기', 10, 1, '체험단 신청 상태', NOW()),
('CAMAPP_REJECTED', 'CAM_APP_STA', '탈락', 10, 2, '체험단 신청 상태', NOW()),
('CAMAPP_APPROVED', 'CAM_APP_STA', '당첨', 10, 3, '체험단 신청 상태', NOW()),
('CAMAPP_CANCEL', 'CAM_APP_STA', '당첨취소', 10, 4, '체험단 신청 상태', NOW());

## 댓글_타입_코드(COMMENT_TYPE)
INSERT INTO TB_COMMON_CODE (CODE_ID, GROUP_CODE, CODE_NM, GROUP_SORT, SORT, CODE_DC, REG_DATE)
VALUES
('COMMENT_TYPE', '', '댓글타입', 11, 0, '댓글 타입 그룹', NOW()),
('COMMT001', 'COMMENT_TYPE', '커뮤니티댓글', 11, 1, '커뮤니티댓글', NOW()),
('COMMT002', 'COMMENT_TYPE', '캠페인댓글', 11, 2, '캠페인댓글', NOW());

select * from TB_COMMON_CODE where del_yn='N' order by group_sort, sort asc;
-- update TB_COMMON_CODE set group_code='' where code_id='INF_TYPE';
select * from tb_common_code where del_yn='n' order by group_sort, sort asc;
-- update tb_common_code set group_code='' where code_id='INF_TYPE';

####### 관리자 계정 등록 ##############
INSERT INTO tb_member (member_id, member_pwd, member_name, member_email, member_phone, reg_date)
VALUES ('superadmin','$2a$10$icZ9WU92wGzRuGJLBvWwmOWUuCtEp4vezbFUS7RUaM0C3UwuFamnS', '리보리', 'revoryadmin@revory.com', '010-1111-9999', NOW());
## 권한 등록
INSERT INTO tb_member_auth(member_idx, auth) values(29, 'ROLE_ADMIN');
-- 개발팀 관리자 계정
INSERT INTO tb_member (member_id, member_pwd, member_name, member_email, member_phone, reg_date)
VALUES ('devadmin','$2a$10$icZ9WU92wGzRuGJLBvWwmOWUuCtEp4vezbFUS7RUaM0C3UwuFamnS', '개발1팀', 'dev1admin@revory.com', '010-2222-6666', NOW());
## 권한 등록
INSERT INTO tb_member_auth(member_idx, auth) values(50, 'ROLE_ADMIN');

update tb_member set member_pwd='$2a$10$Ax3c0sOPU0UqbzEqA9IRIOZB4SuBQhHpsl7BN/wBWpxMSDdXxUsmS' where member_idx=48;
delete from tb_member where member_idx=49;
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

-- UPDATE tb_reviewer_profile SET nickname = CASE member_idx
--   when 1 then '봉잉'
--   WHEN 2 THEN '현지번개'
--   WHEN 3 THEN '하나푸딩'
--   WHEN 4 THEN '민수핫도그'
--   WHEN 5 THEN '소연고래'
--   WHEN 6 THEN '재민감자'
--   WHEN 7 THEN '은지슈퍼스타'
--   WHEN 8 THEN '현우뽀짝'
--   WHEN 9 THEN '유나초코'
--   WHEN 10 THEN '동해번쩍'
--   WHEN 11 THEN '서윤캔디'
--   WHEN 12 THEN '규민펭귄'
--   WHEN 13 THEN '아린구름'
--   WHEN 14 THEN '준서멜로디'
--   WHEN 15 THEN '예빈루돌프'
--   ELSE nickname
-- END
-- WHERE member_idx IN (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15);


################# 커뮤니티 글 등록 ##################
#! 회원 27명 등록 후 입력 !#
INSERT INTO tb_community (
    member_idx, category_id, title, content, view_count, reg_date, mod_date, del_yn
) VALUES
(1, 'COMMU001', 'SNS 마케팅 노하우 공유합니다', '인스타그램 운영 팁과 노출 노하우를 정리해봤어요.', 34, DATE_SUB(NOW(), INTERVAL 0 DAY), NULL, 'N'),
(2, 'COMMU001', '고객 응대 매뉴얼 공유', '리뷰 대응할 때 효과적인 방법을 정리했습니다.', 21, DATE_SUB(NOW(), INTERVAL 1 DAY), NULL, 'N'),
(3, 'COMMU002', '오늘 가게에 귀여운 손님이 왔어요', '강아지를 데리고 온 손님 덕분에 하루 종일 기분 좋았어요.', 56, DATE_SUB(NOW(), INTERVAL 2 DAY), NULL, 'N'),
(4, 'COMMU002', '요즘 날씨가 좋아서 테라스 장사 대박', '봄 날씨에 테라스 자리에 손님이 가득하네요.', 18, DATE_SUB(NOW(), INTERVAL 3 DAY), NULL, 'N'),
(5, 'COMMU003', '배달 앱 수수료 줄이는 팁 있을까요?', '배달의민족 수수료가 너무 부담입니다. 다들 어떻게 하고 계신가요?', 44, DATE_SUB(NOW(), INTERVAL 4 DAY), NULL, 'N'),
(6, 'COMMU003', '간판 제작 업체 추천 부탁드립니다', '저렴하면서 퀄리티 좋은 간판 업체 아시는 분 계실까요?', 12, DATE_SUB(NOW(), INTERVAL 5 DAY), NULL, 'N'),
(7, 'COMMU004', '5월 커뮤니티 활동 이벤트 안내', '활동 많은 회원 분들께 소정의 상품을 드립니다.', 89, DATE_SUB(NOW(), INTERVAL 6 DAY), NULL, 'N'),
(8, 'COMMU004', '신규 기능 안내: 댓글 알림 도입', '이제 댓글이 달리면 알림으로 받아보실 수 있어요.', 35, DATE_SUB(NOW(), INTERVAL 7 DAY), NULL, 'N'),
(9, 'COMMU002', '오늘도 가게 셀프 오픈했어요', '직원 없이 혼자 운영하니 점점 익숙해지네요.', 23, DATE_SUB(NOW(), INTERVAL 8 DAY), NULL, 'N'),
(10, 'COMMU001', '매출 관리 엑셀 양식 공유', '월별 정산에 도움이 되는 템플릿 공유합니다.', 40, DATE_SUB(NOW(), INTERVAL 9 DAY), NULL, 'N');
INSERT INTO tb_community (
    member_idx, category_id, title, content, view_count, reg_date, mod_date, del_yn
) VALUES
(11, 'COMMU001', 'SNS 해시태그 전략 공유', '노출을 늘리는 해시태그 조합 방법에 대해 공유합니다.', 27, DATE_SUB(NOW(), INTERVAL 10 DAY), NULL, 'N'),
(12, 'COMMU002', '손님 아이 돌잔치 후기', '돌잔치를 가게에서 진행했는데 분위기가 너무 좋았어요.', 65, DATE_SUB(NOW(), INTERVAL 11 DAY), NULL, 'N'),
(13, 'COMMU003', '주방 인덕션 추천 부탁드려요', '가성비 좋은 인덕션 제품이 있을까요?', 19, DATE_SUB(NOW(), INTERVAL 12 DAY), NULL, 'N'),
(14, 'COMMU004', '신규 회원을 위한 커뮤니티 가이드', '처음 방문하신 분들을 위한 이용 안내입니다.', 75, DATE_SUB(NOW(), INTERVAL 13 DAY), NULL, 'N'),
(15, 'COMMU001', '인플루언서 협업 후기', '최근 진행한 체험단 캠페인의 성과를 공유합니다.', 38, DATE_SUB(NOW(), INTERVAL 14 DAY), NULL, 'N'),
(1, 'COMMU002', '가게 인테리어 셀프 리모델링 후기', '직접 인테리어 작업한 후기를 공유드려요.', 51, DATE_SUB(NOW(), INTERVAL 15 DAY), NULL, 'N'),
(2, 'COMMU003', '카드 단말기 수수료 고민', '단말기 수수료가 비싸서 다른 방법 고민 중입니다.', 29, DATE_SUB(NOW(), INTERVAL 16 DAY), NULL, 'N'),
(3, 'COMMU004', '이달의 인기글 선정 기준 안내', '인기글 선정 기준과 혜택을 알려드립니다.', 80, DATE_SUB(NOW(), INTERVAL 17 DAY), NULL, 'N'),
(4, 'COMMU002', '점심 장사 꿀팁 공유', '짧은 시간에 많은 손님을 응대하는 노하우입니다.', 33, DATE_SUB(NOW(), INTERVAL 18 DAY), NULL, 'N'),
(5, 'COMMU001', '리뷰 이벤트 아이디어 나눔', '참여율 높은 리뷰 이벤트 사례를 공유합니다.', 42, DATE_SUB(NOW(), INTERVAL 19 DAY), NULL, 'N');
INSERT INTO tb_community (
    member_idx, category_id, title, content, view_count, reg_date, mod_date, del_yn
) VALUES
(16, 'COMMU003', '현금영수증 발행 기준 문의', '소액 결제 시에도 꼭 발행해야 하나요? 경험 공유 부탁드려요.', 17, DATE_SUB(NOW(), INTERVAL 20 DAY), NULL, 'N'),
(17, 'COMMU002', '비 오는 날 매장 분위기 최고였어요', '조용히 음악 틀고 분위기 있게 운영했더니 손님 반응이 좋았어요.', 48, DATE_SUB(NOW(), INTERVAL 21 DAY), NULL, 'N');
INSERT INTO tb_community (
    member_idx, category_id, title, content, view_count, reg_date, mod_date, del_yn
) VALUES
(18, 'COMMU002', '신메뉴 출시 반응이 궁금해요', '신메뉴 출시했는데 손님들 반응이 미지근하네요. 개선 아이디어 있으신가요?', 35, DATE_SUB(NOW(), INTERVAL 5 DAY), NULL, 'N'),
(19, 'COMMU004', '포장 주문 시 실수 줄이는 팁', '포장 주문이 늘어 실수가 잦아요. 실수 줄이는 팁 공유해요.', 22, DATE_SUB(NOW(), INTERVAL 3 DAY), NULL, 'N'),
(20, 'COMMU001', '블로그 리뷰로 방문자 급증', '리뷰어 덕분에 매장 방문자가 늘었어요. 체험단 효과 대단하네요.', 89, DATE_SUB(NOW(), INTERVAL 7 DAY), NULL, 'N'),
(21, 'COMMU005', '이벤트 쿠폰 발송 기준은?', '어떤 기준으로 쿠폰을 제공하고 계신가요? 참고하고 싶습니다.', 15, DATE_SUB(NOW(), INTERVAL 10 DAY), NULL, 'N'),
(22, 'COMMU003', '현금 결제 유도는 어떻게?', '수수료 절약하려고 현금 결제를 유도하고 싶은데 괜찮은 방법 없을까요?', 29, DATE_SUB(NOW(), INTERVAL 8 DAY), NULL, 'N'),
(23, 'COMMU002', '아이동반 손님 응대 노하우', '아이들과 함께 오는 손님에게 좋은 인상을 주려면 어떤 점이 중요할까요?', 31, DATE_SUB(NOW(), INTERVAL 6 DAY), NULL, 'N'),
(24, 'COMMU001', '리뷰어 선정 기준이 궁금해요', '체험단 리뷰어 선정 시 어떤 기준으로 선택하시나요?', 42, DATE_SUB(NOW(), INTERVAL 4 DAY), NULL, 'N'),
(25, 'COMMU004', '포스기 교체 후 후기', '최근 포스기를 교체했는데 속도와 안정성 모두 만족합니다.', 27, DATE_SUB(NOW(), INTERVAL 2 DAY), NULL, 'N'),
(26, 'COMMU005', '배달 앱 리뷰 요청 전략', '배달 앱에서 좋은 리뷰를 유도하는 멘트, 어떻게 쓰고 계신가요?', 54, DATE_SUB(NOW(), INTERVAL 1 DAY), NULL, 'N'),
(27, 'COMMU003', '계산 오류 발생 시 대처법?', '계산 실수로 고객에게 불신을 준 적이 있는데 어떻게 대처하시나요?', 18, DATE_SUB(NOW(), INTERVAL 9 DAY), NULL, 'N');

######### 댓글 등록 ############
INSERT INTO tb_comment (community_idx, member_idx, content, parent_id, group_id, depth, sort_order, comment_type, reg_date)
VALUES
(2, 2, '최상위 댓글', NULL, 1, 0, 1, 'COMMT001', NOW()), # commentidx 1
(2, 3, '대댓글 1', 1, 1, 1, 2, 'COMMT001', NOW()), # 2
(2, 4, '대댓글 2', 1, 1, 1, 4, 'COMMT001', NOW()), # 3
(2, 2, '대대댓글 1-1', 2, 1, 2, 3, 'COMMT001', NOW()), # 4
(2, 2, '대대댓글 2-1', 3, 1, 2, 5, 'COMMT001', NOW()); # 5

-- ==========================================
-- TB_CAMPAIGN 샘플 데이터 (방문형)
-- ==========================================
INSERT INTO TB_CAMPAIGN (
    MEMBER_IDX, TITLE, SHOP_NAME, THUMBNAIL_URL, CONTACT_PHONE,
    CAMPAIGN_TYPE, CAM_CATE_CODE, CHANNEL_CODE, MISSION,
    KEYWORD_1, KEYWORD_2, KEYWORD_3, BENEFIT_DETAIL, RECRUIT_COUNT,
    APPLY_START_DATE, APPLY_END_DATE, ANNOUNCE_DATE,
    EXP_START_DATE, EXP_END_DATE, DEADLINE_DATE,
    CAMPAIGN_STATUS, RECRUIT_STATUS, DEL_YN, REG_DATE
) VALUES
(56, '맛집 체험단 모집', '맛집 1번지', '/images/thumb1.jpg', '010-1234-5678',
 'CAMP001', 'CAMT001', 'CAMC001', '음식 체험 및 후기 작성',
 '맛집', '리뷰', '체험', '1인 식사권 제공', 10,
 '2025-09-01', '2025-09-10', '2025-09-12',
 '2025-09-15', '2025-09-20', '2025-09-25',
 'CAMS001', 'REC001', 'N', NOW());
 INSERT INTO TB_CAMPAIGN (
    MEMBER_IDX, TITLE, SHOP_NAME, THUMBNAIL_URL, CONTACT_PHONE,
    CAMPAIGN_TYPE, CAM_CATE_CODE, CHANNEL_CODE, MISSION,
    KEYWORD_1, KEYWORD_2, KEYWORD_3, BENEFIT_DETAIL, RECRUIT_COUNT,
    APPLY_START_DATE, APPLY_END_DATE, ANNOUNCE_DATE,
    EXP_START_DATE, EXP_END_DATE, DEADLINE_DATE,
    CAMPAIGN_STATUS, RECRUIT_STATUS, DEL_YN, REG_DATE
) VALUES
(56, '뷰티 체험단 모집', '뷰티샵 2호점', '/images/thumb2.jpg', '010-9876-5432',
 'CAMP001', 'CAMT003', 'CAMC002', '뷰티 제품 체험 및 후기 작성',
 '뷰티', '후기', NULL, '제품 샘플 제공', 15,
 '2025-09-05', '2025-09-15', '2025-09-17',
 '2025-09-18', '2025-09-25', '2025-09-30',
 'CAMS001', 'REC001', 'N', NOW());
 
 -- ==========================================
-- TB_CAMPAIGN_VISIT 샘플 데이터 (방문형 세부)
-- ==========================================
INSERT INTO TB_CAMPAIGN_VISIT (
    CAMPAIGN_IDX, ADDRESS, ADDRESS_DETAIL, EXP_DAY, START_TIME, END_TIME, RESERVATION_NOTICE
) VALUES
(1, '서울시 강남구 테헤란로 1', '1층', '월,수,금', '10:30', '21:30', '예약 필수');

INSERT INTO TB_CAMPAIGN_VISIT (
    CAMPAIGN_IDX, ADDRESS, ADDRESS_DETAIL, DAY, START_TIME, END_TIME, RESERVATION_NOTICE
) VALUES
(2, '서울시 서초구 서초대로 5', '2층', '화,목,토', '11:00', '20:00', '전화 예약 필수');