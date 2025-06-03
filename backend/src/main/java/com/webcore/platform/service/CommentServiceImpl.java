package com.webcore.platform.service;

import com.webcore.platform.dao.CommentDAO;
import com.webcore.platform.response.CommentListResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentDAO commentDAO;

    @Override
    public List<CommentListResponseDTO> selectCommentsByCommunityIdx(int communityIdx) {
        return commentDAO.selectCommentListByCommunityIdx(communityIdx);
    }

}
