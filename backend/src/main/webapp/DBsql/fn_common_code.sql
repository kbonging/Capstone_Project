
###### 공통 코드 이름 조회 함수 ########
DELIMITER $$
CREATE FUNCTION FN_GET_CODE_NM(p_code_id VARCHAR(20))
RETURNS VARCHAR(100)
DETERMINISTIC
BEGIN
    DECLARE v_code_nm VARCHAR(100);

    SELECT code_nm 
      INTO v_code_nm
      FROM tb_common_code
     WHERE code_id = p_code_id
       AND del_yn = 'N'
     LIMIT 1;

    RETURN v_code_nm;
END$$
DELIMITER ;

SELECT FN_GET_CODE_NM('CAMP001'); -- 방문형
