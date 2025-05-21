package com.webcore.platform.prop;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties("com.webcore.platform")
public class JwtProp {
    // 인코딩된 시크릿 키
    private String secretKey;
}
