################# 이메일로 회원 조회 ####################
SELECT 
    m.MEMBER_IDX,
	m.MEMBER_ID,
	m.MEMBER_PWD,
	m.MEMBER_NAME,
	m.MEMBER_EMAIL,
    m.MEMBER_NICKNAME,
    m.PROFILE_IMAGE_URL,
    ma.AUTH,
	m.DEL_YN,
	m.REG_DATE,
	m.MOD_DATE
FROM tb_member m join tb_member_auth ma
on m.MEMBER_IDX=ma.MEMBER_IDX
WHERE MEMBER_EMAIL='apple75391@gmail.com'AND DEL_YN = 'N';

################# 아이디로 회원 조회 ####################
SELECT 
    m.MEMBER_IDX,
	m.MEMBER_ID,
	m.MEMBER_PWD,
	m.MEMBER_NAME,
	m.MEMBER_EMAIL,
    m.MEMBER_NICKNAME,
    m.PROFILE_IMAGE_URL,
    ma.AUTH,
	m.DEL_YN,
	m.REG_DATE,
	m.MOD_DATE
FROM tb_member m join tb_member_auth ma
on m.MEMBER_IDX=ma.MEMBER_IDX
WHERE MEMBER_ID='superadmin'AND DEL_YN = 'N';

################ 아이디 유무 확인(중복 체크) ##############
SELECT COUNT(*) FROM tb_member WHERE MEMBER_ID='admin';

################ 이메일 유무 확인(중복 체크)#############
SELECT COUNT(*) FROM tb_member WHERE MEMBER_EMAIL='apple75391@gmail.com';