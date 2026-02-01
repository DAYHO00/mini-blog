package com.deaho.miniblog.post.like;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.deaho.miniblog.security.CurrentUserUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/posts")
public class PostLikeController {

    private final PostLikeService postLikeService;

    // 좋아요 누르기
    @PostMapping("/{postId}/likes")
    public ResponseEntity<LikeResponse> like(@PathVariable Long postId) {
        String username = CurrentUserUtil.getCurrentUsername();
        long count = postLikeService.like(postId, username);
        return ResponseEntity.ok(new LikeResponse(postId, count, true));
    }

    // 좋아요 취소
    @DeleteMapping("/{postId}/likes")
    public ResponseEntity<LikeResponse> unlike(@PathVariable Long postId) {
        String username = CurrentUserUtil.getCurrentUsername();
        long count = postLikeService.unlike(postId, username);
        return ResponseEntity.ok(new LikeResponse(postId, count, false));
    }

    // 좋아요 개수 조회 (로그인 없이도 가능하게 하고 싶으면 SecurityConfig에서 permitAll 처리)
    @GetMapping("/{postId}/likes/count")
    public ResponseEntity<LikeCountResponse> count(@PathVariable Long postId) {
        long count = postLikeService.count(postId);
        return ResponseEntity.ok(new LikeCountResponse(postId, count));
    }

    // 내가 좋아요 눌렀는지
    @GetMapping("/{postId}/likes/me")
    public ResponseEntity<MyLikeResponse> myLike(@PathVariable Long postId) {
        String username = CurrentUserUtil.getCurrentUsername();
        boolean liked = postLikeService.likedByMe(postId, username);
        return ResponseEntity.ok(new MyLikeResponse(postId, liked));
    }

    public record LikeResponse(Long postId, long likeCount, boolean liked) {}
    public record LikeCountResponse(Long postId, long likeCount) {}
    public record MyLikeResponse(Long postId, boolean liked) {}
}
