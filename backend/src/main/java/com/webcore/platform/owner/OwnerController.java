package com.webcore.platform.owner;

import com.webcore.platform.owner.dto.OwnerDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/owner")
public class OwnerController {

    private final OwnerService ownerService;

    /**
     * 회원가입
     * @param ownerDTO 소상공인 정보를 담은 DTO
     * @return 가입 처리 결과 상태 객체
     * @throws Exception 오류가 발생한 경우
     */
    @PostMapping("")
    public ResponseEntity<?> signupOwner(@RequestBody OwnerDTO ownerDTO) throws Exception{
        log.info("[POST] : /api/owner");
        log.info("소상공인 회원가입 데이터 : {}", ownerDTO.toString());
        try {
            ownerService.signupOwner(ownerDTO);
            log.info("회원가입 성공!!!! - SUCCESS");
            return new ResponseEntity<>("success", HttpStatus.OK);
        }catch (Exception e){
            log.info("회원가입 실패..");
            return new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
        }
    }
}
