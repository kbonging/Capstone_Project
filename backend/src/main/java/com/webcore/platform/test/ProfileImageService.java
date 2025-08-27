package com.webcore.platform.test;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Service
public class ProfileImageService {

  @Value("${app.upload-dir:./uploads}") //프로퍼티 설정한 경로 읽음
  private String uploadDir; // 실제 저장 경로

  @Value("${app.public-base-path:/uploads}")//프로퍼티 설정한 경로 읽음
  private String publicBasePath; // 브라우저에서 접근할 URL prefix (/img 또는 /uploads)

  private final MemberMapper memberMapper;

  public ProfileImageService(MemberMapper memberMapper) {
    this.memberMapper = memberMapper;
  }

  /** 파일 저장 + 이력 INSERT + 멤버 프로필 URL 업데이트 */
  @Transactional
  public UploadResponse uploadProfileImage(Long memberIdx, MultipartFile file) throws IOException {
    if (file == null || file.isEmpty()) {
      throw new IllegalArgumentException("파일이 비었습니다.");
    }
    if (file.getSize() > 10 * 1024 * 1024) {
      throw new IllegalArgumentException("최대 10MB까지 업로드 가능합니다.");
    }

    // 허용 확장자(선택)
    Set<String> allowed = Set.of("jpg", "jpeg", "png", "gif", "webp");
    String ext = StringUtils.getFilenameExtension(file.getOriginalFilename());
    ext = (ext == null || ext.isBlank()) ? "png" : ext.toLowerCase();
    if (!allowed.contains(ext)) {
      throw new IllegalArgumentException("허용되지 않은 파일 형식입니다. (jpg, jpeg, png, gif, webp)");
    }

    // 날짜별 폴더 + UUID 파일명
    String date = LocalDate.now().toString().replace("-", "");
    Path root = Paths.get(uploadDir).toAbsolutePath().normalize();
    Path dir  = root.resolve(date);
    Files.createDirectories(dir);

    String filename = UUID.randomUUID() + "." + ext;
    Path target = dir.resolve(filename);

    //  디버깅 로그
    System.out.println("[UPLOAD] uploadDir=" + uploadDir);
    System.out.println("[UPLOAD] root=" + root);
    System.out.println("[UPLOAD] target=" + target);

    // 실제 저장
    try {
      Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
    } catch (IOException ioe) {
      // 저장 실패
      throw new IOException("파일 저장 중 오류가 발생했습니다.", ioe);
    }

    // 공개 URL 생성 (예: /img/20250827/uuid.jpg 또는 /uploads/20250827/uuid.jpg)
    // publicBasePath는 앞에 슬래시가 포함되어 있어야 함 (/img 또는 /uploads)
    String url = normalizeUrl(publicBasePath) + "/" + date + "/" + filename;

    try {
      // 업로드 이력 기록 (한 매퍼에서 처리)
      memberMapper.insertProfileImage(
          memberIdx,
          url,
          file.getOriginalFilename(),
          file.getSize(),
          file.getContentType()
      );

      // 멤버 현재 프로필 URL 갱신
      memberMapper.updateProfileImageUrl(memberIdx, url);

    } catch (Exception e) {
      // DB 실패 시 디스크에 남은 고아 파일 삭제 (보상 처리)
      try { Files.deleteIfExists(target); } catch (IOException ignore) {}
      throw e;
    }

    return new UploadResponse(url);
  }

  /** "/img" 또는 "/uploads" 같은 prefix를 안전하게 정규화 */
  private String normalizeUrl(String base) {
    if (base == null || base.isBlank()) return "";
    String b = base.trim();
    if (!b.startsWith("/")) b = "/" + b;
    // 뒤에 슬래시가 붙어있으면 제거 (예: "/img/")
    if (b.endsWith("/")) b = b.substring(0, b.length() - 1);
    return b;
  }
}
