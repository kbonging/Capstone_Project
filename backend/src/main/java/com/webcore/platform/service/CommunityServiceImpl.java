package com.webcore.platform.service;

import com.webcore.platform.common.PaginationInfo;
import com.webcore.platform.constants.Paging;
import com.webcore.platform.dao.CommunityDAO;
import com.webcore.platform.domain.CommunityDTO;
import com.webcore.platform.response.CommunityDetailResponseDTO;
import com.webcore.platform.response.CommunityListResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService {
    private final CommunityDAO communityDAO;

    @Override
    public Map<String, Object> getCommunityListResult(CommunityDTO communityDTO) {
        // 1. 전체 게시글 수 조회
        int totalRecord = communityDAO.selectCommunityCount(communityDTO);

        // 2. PaginationInfo 객체 셍성 및 세팅
        PaginationInfo paginationInfo = new PaginationInfo();
        paginationInfo.setCurrentPage(communityDTO.getPage() <= 0 ? 1 : communityDTO.getPage());
        paginationInfo.setBlockSize(Paging.PAGE_BLOCK_SIZE);
        paginationInfo.setRecordCountPerPage(Paging.RECORDS_PER_PAGE);
        paginationInfo.setTotalRecord(totalRecord);

        // 3. 조회 범위 인덱스 계산
        int firstIndex = paginationInfo.getFirstRecordIndex();
        int recordCnt = paginationInfo.getRecordCountPerPage();

        // 4. 시작인덱스와 limit 설정
        communityDTO.setFirstIndex(firstIndex);
        communityDTO.setRecordCount(recordCnt);

        // 5. 게시글 목록 조회
        List<CommunityListResponseDTO> communityList = communityDAO.selectCommunityList(communityDTO);

        Map<String, Object> result = new HashMap<>();
        result.put("communityList", communityList);
        result.put("paginationInfo", paginationInfo);

        return result;
    }

    @Transactional
    @Override
    public CommunityDetailResponseDTO getCommunityByIdx(int communityIdx, int memberIdx) {
        communityDAO.increaseViewCount(communityIdx);
        return communityDAO.getCommunityByIdx(communityIdx, memberIdx);
    }

    @Override
    @Transactional
    public boolean addLike(int communityIdx, int memberIdx) {
        int result = communityDAO.insertLike(communityIdx, memberIdx);
        return result > 0;
    }

    @Override
    @Transactional
    public boolean removeLike(int communityIdx, int memberIdx) {
        int result = communityDAO.deleteLike(communityIdx, memberIdx);
        return result > 0;
    }

    @Override
    public int createPost(CommunityDTO communityDTO) {
        int result = communityDAO.insertCommunity(communityDTO);
        if(result > 0) {
            log.info("Insert community successfully!! insert user's idx : {}", communityDTO.getMemberIdx());
        }

        return result;
    }

    @Override
    public int deletePost(CommunityDTO communityDTO) {
        int result = communityDAO.deleteCommunity(communityDTO);
        if(result > 0) {
            log.info("Delete Post successfully!! delete user's idx : {}", communityDTO.getMemberIdx());
        }

        return result;
    }

    @Override
    public int updatePost(CommunityDTO communityDTO) {
        int result = communityDAO.updateCommunity(communityDTO);
        if(result > 0) {
            log.info("Update Post successfully!! update user's idx : {}", communityDTO.getMemberIdx());
        }

        return result;
    }
}
