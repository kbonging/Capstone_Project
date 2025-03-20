package com.vibeStay.platform.domain;

import lombok.Data;

@Data
public class AuthenticationRequest {
    private String userName;
    private String password;

}
