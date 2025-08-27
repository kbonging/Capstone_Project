package com.webcore.platform.test;


import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/members")
public class UploadController {

  private final ProfileImageService profileImageService;

  public UploadController(ProfileImageService profileImageService) {
    this.profileImageService = profileImageService;
  }

  // 예: POST /api/members/7/profile-image  (multipart/form-data: file)
  @PostMapping(
      value = "/{memberIdx}/profile-image",
      consumes = MediaType.MULTIPART_FORM_DATA_VALUE
  )
  public UploadResponse uploadProfileImage(
      @PathVariable Long memberIdx,
      @RequestPart("file") MultipartFile file
  ) throws Exception {
    return profileImageService.uploadProfileImage(memberIdx, file);
  }
}


