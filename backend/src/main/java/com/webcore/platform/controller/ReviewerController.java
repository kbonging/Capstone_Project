package com.webcore.platform.controller;

import com.webcore.platform.domain.ReviewerDTO;
import com.webcore.platform.service.ReviewerService;
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
@RequestMapping("/api/reviewer")
public class ReviewerController {
    private final ReviewerService reviewerService;

    /**
     * 회원가입
     * @param reviewerDTO
     * @return
     * @throws Exception
     */
    @PostMapping("")
    public ResponseEntity<?> signupReviewer(@RequestBody ReviewerDTO reviewerDTO) throws Exception{
        log.info("[POST] : /api/reviewer");
        log.info("리뷰어 회원가입 데이터 : {}",reviewerDTO.toString());
        try{
            reviewerService.signupReviewer(reviewerDTO);
            log.info("회원가입 성공!!!! - SUCCESS");
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch (Exception e) {
            log.info("회원가입 실패.... - FAIL");
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }
}
