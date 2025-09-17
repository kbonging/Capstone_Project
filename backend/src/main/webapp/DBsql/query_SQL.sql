################## 각 테이블 조회 ##############
SELECT * FROM tb_common_code;
SELECT * FROM tb_member;
SELECT * FROM tb_member_auth;
SELECT * FROM tb_reviewer_profile;
SELECT * FROM tb_reviewer_channel;
SELECT * FROM tb_owner_profile;
SELECT * FROM tb_community;
SELECT * FROM tb_comment;
SELECT * FROM tb_like;

############## 공통 코드 조회 ###############
select * from tb_common_code where del_yn='n' order by group_sort, sort asc;
-- 그룹으로 조회
SELECT code_id, group_code, code_nm, image_url, group_sort, sort, code_dc, del_yn 
FROM tb_common_code
WHERE group_code='COMMU_CATE' AND del_yn='N'
ORDER BY group_sort, sort;
################ 로그인 요청 시 정보 조회 ################
SELECT  M.member_idx, M.member_id, M.member_pwd, M.member_name, M.del_yn, A.auth_idx, A.auth
FROM TB_MEMBER M LEFT JOIN TB_MEMBER_AUTH A 
ON M.member_idx = A.member_idx
WHERE M.member_id = 'apple75391' AND M.del_yn = 'N';

############### 회원 조회(관리자 조회할때 사용중) #############
select mb.member_idx, mb.member_id, mb.member_name, au.auth , member_email, profile_img_url, intro, heart_count, penalty, mb.del_yn
FROM tb_member mb JOIN tb_member_auth au
ON mb.member_idx = au.member_idx;
# WHERE mb.member_idx=29 AND mb.del_yn='N';

###### 아이디 중복 체크 #######
SELECT COUNT(*) FROM TB_MEMBER WHERE member_Id = 'apple75391';
##### 이메일 중복 체크 ######
SELECT count(*) from tb_member where member_email = 'apple75391@gmail.com';

##************************************************##
##********************** 리뷰어 ********************##
##************************************************##
##### 리뷰어 전체 조회 #####
select * 
FROM tb_member mb JOIN tb_member_auth au
ON mb.member_idx = au.member_idx
JOIN tb_reviewer_profile rp
ON mb.member_idx = rp.member_idx;

###### 리뷰어 채널 전체 조회 ######
select mb.member_idx, mb.member_name, rc.inf_type_code_id, rc.channel_url
FROM tb_member mb JOIN tb_member_auth au
ON mb.member_idx = au.member_idx
JOIN tb_reviewer_profile rp
ON mb.member_idx = rp.member_idx
JOIN tb_reviewer_channel rc
ON mb.member_idx = rc.member_idx;

###### (리뷰어) 회원 고유번호로 정보 조회 ######
select mb.member_idx, mb.member_id, mb.member_name, mb.member_email, mb.member_phone, mb.profile_img_url, mb.intro, mb.heart_count, mb.penalty, mb.del_yn, mb.reg_date, au.auth, 
	rp.NICKNAME, rp.GENDER, rp.BIRTH_DATE, rp.ACTIVITY_AREA, rp.ACTIVITY_TOPIC, rp.ZIP_CODE, rp.ADDRESS, rp.DETAIL_ADDRESS,
	rc.CHANNEL_URL, rc.INF_TYPE_CODE_ID
FROM tb_member mb JOIN tb_member_auth au
ON mb.member_idx = au.member_idx
JOIN tb_reviewer_profile rp
ON mb.member_idx = rp.member_idx
JOIN tb_reviewer_channel rc
ON mb.member_idx = rc.member_idx
where mb.member_idx=1;

##************************************************##
##********************* 소상공인 *******************##
##************************************************##
##### 소상공인 전체 조회 #####
select * 
FROM tb_member mb JOIN tb_member_auth au
ON mb.member_idx = au.member_idx
JOIN tb_owner_profile op
ON mb.member_idx = op.member_idx;

############## (소상공인) 회원 고유번호로 정보 조회 ##############
select mb.member_idx, mb.member_id, mb.member_name, mb.member_email, mb.member_phone, 
	mb.profile_img_url, mb.intro, mb.heart_count, mb.penalty, mb.del_yn, mb.reg_date, au.auth, 
	op.BUSINESS_NAME, op.BUSINESS_URL
FROM tb_member mb JOIN tb_member_auth au
ON mb.member_idx = au.member_idx
JOIN tb_owner_profile op
on mb.MEMBER_IDX=op.MEMBER_IDX
where mb.member_idx=25;

##************************************************##
##********************* 커뮤니티 *******************##
##************************************************##
select * from tb_community;
##### 커뮤니티 글 전체 조회 #####
SELECT
    cm.community_idx,
    cm.member_idx,
    cm.category_id,
    cc.code_nm,
    cm.title,
    cm.content,
    cm.view_count,
    (
		SELECT COUNT(*)
		FROM tb_like l
		WHERE l.community_idx = cm.community_idx
	) AS like_count,
    (
		SELECT COUNT(*)
        FROM tb_comment cmmt
        where cmmt.community_idx = cm.community_idx
    ) AS comment_count,
    cm.reg_date,
    ma.auth,
    CASE
        WHEN ma.auth = 'ROLE_USER' THEN rp.nickname
        WHEN ma.auth = 'ROLE_OWNER' THEN op.business_name
        WHEN ma.auth = 'ROLE_ADMIN' THEN m.member_name
        ELSE '알 수 없음'
    END AS writer_name
FROM tb_community cm
JOIN tb_member m ON cm.member_idx = m.member_idx
JOIN tb_member_auth ma ON m.member_idx = ma.member_idx
JOIN tb_common_code cc ON cm.category_id=cc.code_id
LEFT JOIN tb_reviewer_profile rp ON m.member_idx = rp.member_idx
LEFT JOIN tb_owner_profile op ON m.member_idx = op.member_idx
WHERE cm.del_yn='N'
ORDER BY cm.reg_date DESC
LIMIT 0, 1000;

### 게시글 전체 수 조회 ###
SELECT COUNT(*)
FROM tb_community cm
JOIN tb_member m ON cm.member_idx = m.member_idx
JOIN tb_member_auth ma ON m.member_idx = ma.member_idx
JOIN tb_common_code cc ON cm.category_id=cc.code_id
LEFT JOIN tb_reviewer_profile rp ON m.member_idx = rp.member_idx
LEFT JOIN tb_owner_profile op ON m.member_idx = op.member_idx
WHERE cm.del_yn='N';

####커뮤니티 상세 조회#####
SELECT
	cm.community_idx,
	cm.member_idx,
	cm.category_id,
	cc.code_nm,
	cm.title,
	cm.content,
	cm.view_count,
	cm.reg_date,
	cm.mod_date,
	(
		SELECT COUNT(*)
		FROM tb_like l
		WHERE l.community_idx = cm.community_idx
	) AS like_count,
	(
		SELECT COUNT(*)
		FROM tb_comment cmmt
		where cmmt.community_idx = cm.community_idx
	) AS comment_count,
    CASE
		WHEN EXISTS(
			SELECT 1
			FROM tb_like l
			WHERE l.community_idx = cm.community_idx
		    AND l.member_idx = 1
        ) THEN 1
        ELSE 0
	END AS liked_by_me,
	ma.auth,
	CASE
		WHEN ma.auth = 'ROLE_USER' THEN rp.nickname
		WHEN ma.auth = 'ROLE_OWNER' THEN op.business_name
		WHEN ma.auth = 'ROLE_ADMIN' THEN m.member_name
		ELSE '알 수 없음'
	END AS writer_name
FROM tb_community cm
JOIN tb_member m ON cm.member_idx = m.member_idx
JOIN tb_member_auth ma ON m.member_idx = ma.member_idx
JOIN tb_common_code cc ON cm.category_id = cc.code_id
LEFT JOIN tb_reviewer_profile rp ON m.member_idx = rp.member_idx
LEFT JOIN tb_owner_profile op ON m.member_idx = op.member_idx
WHERE cm.community_idx = 1
	AND cm.del_yn = 'N';
###### 좋아요 등록 #######
INSERT INTO tb_like (community_idx, member_idx, reg_date)
VALUES (1, 1, now());
select * from tb_like;

###### 조회수 증가 ########
UPDATE tb_community
SET view_count = view_count + 1
WHERE community_idx = 2;

####### 댓글 조회 #########
SELECT
c.comment_idx,
c.community_idx,
c.content,
c.comment_type,
CASE
WHEN ma.auth = 'ROLE_USER' THEN rp.nickname
WHEN ma.auth = 'ROLE_OWNER' THEN op.business_name
WHEN ma.auth = 'ROLE_ADMIN' THEN m.member_name
ELSE '알 수 없음'
END AS writer_name,
ma.auth,
c.parent_id,
c.depth,
DATE_FORMAT(c.reg_date, '%Y-%m-%d %H:%i:%s') AS reg_date,
DATE_FORMAT(c.mod_date, '%Y-%m-%d %H:%i:%s') AS mod_date
FROM tb_comment c
JOIN tb_member m ON c.member_idx = m.member_idx
JOIN tb_member_auth ma ON m.member_idx = ma.member_idx
LEFT JOIN tb_reviewer_profile rp ON m.member_idx = rp.member_idx
LEFT JOIN tb_owner_profile op ON m.member_idx = op.member_idx
WHERE c.community_idx = 2
AND c.del_yn = 'N'
ORDER BY c.group_id ASC, c.sort_order ASC;

######################## 캠페인 관련 ############################
-- 캠페인 전체 목록 조회
SELECT
	c.CAMPAIGN_IDX        AS campaignIdx,
	c.MEMBER_IDX          AS memberIdx,
	c.TITLE               AS title,
	c.SHOP_NAME           AS shopName,
	c.THUMBNAIL_URL       AS thumbnailUrl,
	c.CONTACT_PHONE       AS contactPhone,
	c.CAMPAIGN_TYPE       AS campaignType,
	FN_GET_CODE_NM(c.CAMPAIGN_TYPE)  AS campaignTypeName,
	c.CAM_CATE_CODE       AS categoryCode,
	FN_GET_CODE_NM(c.CAM_CATE_CODE)  AS categoryName,
	c.CHANNEL_CODE        AS channelCode,
	FN_GET_CODE_NM(c.CHANNEL_CODE)   AS channelName,
	c.MISSION             AS mission,
	c.KEYWORD_1           AS keyword1,
	c.KEYWORD_2           AS keyword2,
	c.KEYWORD_3           AS keyword3,
	c.BENEFIT_DETAIL      AS benefitDetail,
	c.RECRUIT_COUNT       AS recruitCount,
	c.APPLY_START_DATE    AS applyStartDate,
	c.APPLY_END_DATE      AS applyEndDate,
	c.ANNOUNCE_DATE       AS announceDate,
	c.EXP_START_DATE      AS expStartDate,
	c.EXP_END_DATE        AS expEndDate,
	c.DEADLINE_DATE       AS deadlineDate,
	c.RECRUIT_STATUS      AS recruitStatus,
	c.CAMPAIGN_STATUS     AS campaignStatus,
	v.ADDRESS             AS address,
	v.ADDRESS_DETAIL      AS addressDetail,
	v.EXP_DAY             AS expDay,
	v.START_TIME          AS startTime,
	v.END_TIME            AS endTime,
	v.RESERVATION_NOTICE  AS reservationNotice,
	CONCAT('https://map.naver.com/v5/search/',
	REPLACE(IFNULL(v.ADDRESS, ''), ' ', '%20')) AS mapUrl,
	d.PURCHASE_URL        AS purchaseUrl,
	(
		SELECT COUNT(*)
		FROM TB_CAMPAIGN_APPLICATION a
		WHERE a.CAMPAIGN_IDX = c.CAMPAIGN_IDX AND del_yn='N'
	) AS applicantsCount
FROM TB_CAMPAIGN c
LEFT JOIN TB_CAMPAIGN_VISIT v ON v.CAMPAIGN_IDX = c.CAMPAIGN_IDX
LEFT JOIN TB_CAMPAIGN_DELIVERY d ON d.CAMPAIGN_IDX = c.CAMPAIGN_IDX
WHERE c.DEL_YN = 'N'
ORDER BY c.REG_DATE DESC;

## 캠페인 전체 목록 카운트 수 ##
SELECT COUNT(*)
FROM TB_CAMPAIGN c
LEFT JOIN TB_CAMPAIGN_VISIT v ON v.CAMPAIGN_IDX = c.CAMPAIGN_IDX
LEFT JOIN TB_CAMPAIGN_DELIVERY d ON d.CAMPAIGN_IDX = c.CAMPAIGN_IDX
WHERE c.DEL_YN = 'N';

## 캠페인 신청자 목록 조회 ##
SELECT
a.APPLICATION_IDX AS applicationIdx,
a.MEMBER_IDX AS memberIdx,
r.NICKNAME AS nickname,
a.APPLY_REASON AS applyReason,
cc.CODE_NM AS applyStatusName,
cc.CODE_ID AS applyStatusCode,
a.REG_DATE AS regDate,
a.MOD_DATE AS modDate
FROM tb_campaign_application a
LEFT JOIN tb_reviewer_profile r ON a.MEMBER_IDX = r.MEMBER_IDX
LEFT JOIN tb_common_code cc ON a.APPLY_STATUS_CODE = cc.CODE_ID
WHERE a.DEL_YN = 'N';


