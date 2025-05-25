################## 각 테이블 조회 ##############
SELECT * FROM tb_common_code;
SELECT * FROM tb_member;
SELECT * FROM tb_member_auth;
SELECT * FROM tb_reviewer_profile;
SELECT * FROM tb_reviewer_channel;
SELECT * FROM tb_owner_profile;

############## 공통 코드 조회 ###############
select * from tb_common_code where del_yn='n' order by group_sort, sort asc;

################ 로그인 요청 시 정보 조회 ################
SELECT  M.member_idx, M.member_id, M.member_pwd, M.member_name, M.del_yn, A.auth_idx, A.auth
FROM TB_MEMBER M LEFT JOIN TB_MEMBER_AUTH A 
ON M.member_idx = A.member_idx
WHERE M.member_id = 'apple75391' AND M.del_yn = 'N';

################# 리뷰어 전체 조회 ##################
select * 
FROM tb_member mb JOIN tb_member_auth au
ON mb.member_idx = au.member_idx
JOIN tb_reviewer_profile rp
ON mb.member_idx = rp.member_idx;

############ 리뷰어 채널 전체 조회 #############
select mb.member_idx, mb.member_name, rc.inf_type_code_id, rc.channel_url
FROM tb_member mb JOIN tb_member_auth au
ON mb.member_idx = au.member_idx
JOIN tb_reviewer_profile rp
ON mb.member_idx = rp.member_idx
JOIN tb_reviewer_channel rc
ON mb.member_idx = rc.member_idx;

################# 소상공인 전체 조회 ####################
select * 
FROM tb_member mb JOIN tb_member_auth au
ON mb.member_idx = au.member_idx
JOIN tb_owner_profile op
ON mb.member_idx = op.member_idx;
