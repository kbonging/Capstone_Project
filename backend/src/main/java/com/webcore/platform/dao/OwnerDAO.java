package com.webcore.platform.dao;

import com.webcore.platform.domain.OwnerDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OwnerDAO {
    void insertOwnerProfile(OwnerDTO ownerDTO);
}
