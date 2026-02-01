package com.deaho.miniblog.post;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.deaho.miniblog.post.dto.PostCreateRequest;
import com.deaho.miniblog.post.dto.PostResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/posts")
public class PostController {

    private final PostService postService;

    // 인증 필요: 글 작성
    @PostMapping
    public PostResponse create(@Valid @RequestBody PostCreateRequest req) {
        System.out.println("[POST CONTROLLER] HIT");
        return postService.create(req);
    }

    // 필요에 따라 공개/비공개 선택 가능 (일단 인증 필요로 두고 검증하는 게 깔끔)
    @GetMapping
    public List<PostResponse> list() {
        return postService.findAll();
    }

    @GetMapping("/{id}")
    public PostResponse detail(@PathVariable Long id) {
        return postService.findById(id);
    }
}
