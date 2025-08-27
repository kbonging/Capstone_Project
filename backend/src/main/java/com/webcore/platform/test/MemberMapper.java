package com.webcore.platform.test;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MemberMapper {
  int updateProfileImageUrl(@Param("memberIdx") Long memberIdx, @Param("url") String url);
  int insertProfileImage(
      @Param("memberIdx") Long memberIdx,
      @Param("url") String url,
      @Param("originalName") String originalName,
      @Param("size") Long size,
      @Param("contentType") String contentType
  );
}
