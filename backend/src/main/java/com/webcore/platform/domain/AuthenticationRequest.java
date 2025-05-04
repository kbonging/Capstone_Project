package com.webcore.platform.domain;

import lombok.Data;

@Data
public class AuthenticationRequest {
    private String userId;
    private String password;

}
