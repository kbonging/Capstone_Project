package com.webcore.platform.email;

import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;

public interface EmailService {
    /** 
     * 사용자의 이메일로 인증번호를 생성하여 전송하고, 생성된 인증번호를 반환
     * @param memberEmail 수신자 이메일
     * @return 생성된 인증번호
     * */
    String sendVerificationCode(String memberEmail) throws MessagingException, UnsupportedEncodingException;
    /** 인증코드 생성 */
    public String randomCode();
    /** 이메일 전송 내용 */
    public String createEmailContent(String randomCode);
}
