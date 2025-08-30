package com.webcore.platform.campaign;

import com.webcore.platform.campaign.dto.CampaignDetailRes;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/campaigns")
public class CampaignDetailController {

  private final CampaignDetailService service;

  @GetMapping("/{id}")
  public CampaignDetailRes detail(@PathVariable int id,
      @RequestParam(required = false) Integer memberId) {
    return service.getDetail(id, memberId);
  }
}
