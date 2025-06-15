package com.webcore.platform.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService{
    private final JavaMailSender mailSender;

    @Override
    public String sendVerificationCode(String memberEmail) throws MessagingException, UnsupportedEncodingException {
        String code = randomCode();
        String content = createEmailContent(code);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(memberEmail); // 받는 사람
        helper.setSubject("[Revory]에서 보낸 인증번호입니다."); // 이메일 제목
        helper.setText(content, true);   // 이메일 내용
        helper.setFrom(new InternetAddress("apple75391@gmail.com", "Revory"));

        mailSender.send(message);
        return code;
    }

    @Override
    public String randomCode() {
        StringBuffer key = new StringBuffer();
        Random rnd = new Random();

        for (int i = 0; i < 6; i++) { // 인증코드 6자리
            int index = rnd.nextInt(2); // 0~1 까지 랜덤
            switch (index) {
                case 0:
                    key.append((char) ((int) (rnd.nextInt(26)) + 65)); //  A~Z
                    break;
                case 1:
                    key.append((rnd.nextInt(10))); // 0~9
                    break;
            }
        }
        return key.toString();
    }

    @Override
    public String createEmailContent(String randomCode) {
        StringBuilder text = new StringBuilder();
        text.append("<!DOCTYPE html>");
        text.append("<html lang='ko'>");
        text.append("<head>");
        text.append("    <meta charset='UTF-8'>");
        text.append("    <meta name='viewport' content='width=device-width, initial-scale=1.0'>");
        text.append("    <title>이메일 인증 메시지</title>");
        text.append("</head>");
        text.append("<body style='font-family: \"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f6f9; color: #333;'>");
        text.append("    <div style='max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); overflow: hidden;'>");
        text.append("        <div style='background-color: #013c67; color: white; padding: 30px 20px; text-align: center; border-bottom: 5px solid #f9f9f9;'>");
        text.append("            <h1 style='margin: 0; font-size: 28px; font-weight: bold;'>이메일 인증</h1>");
        text.append("        </div>");
        text.append("        <div style='padding: 30px 20px; text-align: center;'>");
        text.append("            <h2 style='color: #333; font-size: 24px; margin-bottom: 20px;'>인증번호</h2>");
        text.append("            <p>아래 인증번호를 입력해 주세요.</p>");
        text.append("            <div style='display: inline-block; padding: 25px; margin-top: 20px; background-color: #e5f2fd; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); border: 2px solid #013c67;'>");
        text.append("                <div style='font-size: 36px; color: #013c67; font-weight: bold; padding: 10px 20px; border-radius: 5px; background-color: #e9f7fe;'>CODE: <strong>").append(randomCode).append("</strong></div>");
        text.append("            </div>");
        text.append("            <p>저희 Revory를 이용해 주셔서 감사합니다!</p>");
        text.append("        </div>");
        text.append("        <div style='padding: 20px 20px; text-align: center; background-color: #f7f7f7; border-top: 1px solid #ddd;'>");
        text.append("            <p style='margin: 0; color: #777;'>본 메일은 \"학습용\" 개발 목적 전용 인증메일 입니다. 실제 사이트에서 보낸 인증 메일이 아닙니다.</p>");
        text.append("        </div>");
        text.append("    </div>");
        text.append("</body>");
        text.append("</html>");

        return text.toString();
    }
}
