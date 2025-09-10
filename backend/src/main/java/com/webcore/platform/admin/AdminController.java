package com.webcore.platform.admin;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    /** 기간 만료된 캠페인 CLOSED */
    @PostMapping("/campaigns/close-expired")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> closeExpiredCampaigns() {
        int updatedCount = adminService.closeExpiredCampaigns();
        return ResponseEntity.ok(updatedCount + "개의 캠페인이 마감 처리되었습니다.");
    }
}
