package com.webcore.platform.owner;

import com.webcore.platform.member.dao.MemberDAO;
import com.webcore.platform.member.dto.MemberAuthDTO;
import com.webcore.platform.owner.dao.OwnerDAO;
import com.webcore.platform.owner.dto.OwnerDTO;
import com.webcore.platform.owner.dto.OwnerReviewCheckListDTO;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Service
public class OwnerServiceImpl implements OwnerService {
    private final PasswordEncoder passwordEncoder;
    private final MemberDAO memberDAO;
    private final OwnerDAO ownerDAO;


    @Transactional
    @Override
    public void signupOwner(OwnerDTO ownerDTO) {
        // 비밀번호 암호화
        ownerDTO.setMemberPwd(passwordEncoder.encode(ownerDTO.getMemberPwd()));

        // 1. 공통 회원 정보 등록
        memberDAO.insertMember(ownerDTO);

        // 2. 권한 등록
        MemberAuthDTO memberAuthDTO = new MemberAuthDTO();
        memberAuthDTO.setMemberIdx(ownerDTO.getMemberIdx());
        memberAuthDTO.setAuth("ROLE_OWNER");
        memberDAO.insertMemberAuth(memberAuthDTO);

        // 3. 소상공인 프로필 등록
        ownerDAO.insertOwnerProfile(ownerDTO);
    }

    @Override
    public OwnerDTO selectOwnerByIdx(int memberIdx) {
        return ownerDAO.selectOwnerByIdx(memberIdx);
    }

    /** 리뷰 제출 목록 (DefaultDTO 기반 페이징) */
    @Transactional(readOnly = true)
    @Override
    public Map<String, Object> getOwnerReviewList(
        Long campaignId,
        Integer ownerIdFromJwt,
        OwnerReviewCheckListDTO cond
    ) {
        // 1) 권한 체크
        Integer ownerId = ownerDAO.selectCampaignOwner(campaignId);
        if (ownerId == null || !ownerId.equals(ownerIdFromJwt)) {
            throw new RuntimeException("권한이 없습니다.");
        }

        // 2) 페이징 계산 (DefaultDTO 사용)
        int page = (cond.getPage() <= 0) ? 1 : cond.getPage();
        int perPage = (cond.getRecordCount() <= 0 || cond.getRecordCount() > 100) ? 10 : cond.getRecordCount();
        int firstIndex = (page - 1) * perPage;

        cond.setPage(page);
        cond.setRecordCount(perPage);
        cond.setFirstIndex(firstIndex);

        String sortDir = (cond.getSearchCondition() != null && cond.getSearchCondition().equalsIgnoreCase("asc"))
            ? "asc" : "desc"; // 필요하면 별도 필드 사용

        // 3) 데이터 조회
        int total = ownerDAO.countOwnerReviews(campaignId, cond.getChannelCode());
        List<OwnerReviewCheckListDTO> list = ownerDAO.selectOwnerReviews(
            campaignId,
            cond.getChannelCode(),
            cond.getFirstIndex(),
            cond.getRecordCount(),
            sortDir
        );

        // 4) 프론트 포맷 보정
        for (OwnerReviewCheckListDTO dto : list) {
            dto.setStatus("제출");
            dto.setImages(dto.getImageUrl() == null ? List.of() : List.of(dto.getImageUrl()));
        }

        // 5) 응답 묶기 (PagedResponse 없이 Map으로)
        Map<String, Object> res = new HashMap<>();
        res.put("list", list);
        res.put("totalCount", total);
        res.put("page", page);
        res.put("recordCount", perPage);
        return res;
    }


}
