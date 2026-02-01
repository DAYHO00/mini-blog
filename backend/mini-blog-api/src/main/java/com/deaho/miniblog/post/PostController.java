package com.deaho.miniblog.post;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.deaho.miniblog.post.dto.PostCreateRequest;
import com.deaho.miniblog.post.dto.PostResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/posts")
public class PostController {

    private final PostService postService;

    // ✅ 인증 필요: 글 작성
    @PostMapping
    public PostResponse create(@Valid @RequestBody PostCreateRequest req) {
        return postService.create(req);
    }

    // ✅ 피드/목록은 보통 공개 (SecurityConfig에서 permitAll로 열어줌)
    @GetMapping
    public List<PostResponse> list() {
        return postService.findAll();
    }

    // ✅ 단건 조회도 공개
    @GetMapping("/{id}")
    public PostResponse detail(@PathVariable Long id) {
        return postService.findById(id);
    }

    // ✅ 인증 필요: 글 삭제 (작성자만 가능하도록 Service에서 검증)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.noContent().build(); // 204
    }
}
