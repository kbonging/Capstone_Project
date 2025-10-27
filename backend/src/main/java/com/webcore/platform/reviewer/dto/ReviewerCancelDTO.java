package com.webcore.platform.reviewer.dto;

import com.webcore.platform.common.dto.DefaultDTO;
import java.util.List;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import lombok.EqualsAndHashCode;


@EqualsAndHashCode(callSuper = false)
@Data
public class ReviewerCancelDTO extends DefaultDTO {
  // ====== 프론트 입력 ======
  private String type;            // SIMPLE | NEGOTIATED
  private Integer campaignId;     // 프론트에서 보내는 campaignId
  private String reason;          // 협의취소 시 필수
  private List<MultipartFile> images; // 선택, 최대 4장

  // ====== 서비스에서 채워서 DAO로 넘기는 값 ======
  private Integer applicationIdx; // tb_campaign_application.APPLICATION_IDX
  private Integer memberIdx;      // 로그인한 회원 PK
  private String evidenceJson;    // JSON 문자열 ["url1","url2"]
}
