package com.deaho.miniblog.comment;

import com.deaho.miniblog.comment.dto.CommentCreateRequest;
import com.deaho.miniblog.comment.dto.CommentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1")
public class CommentControl {

    private final CommentService commentService;

    // ?Œ“ê¸? ?ƒ?„±
    @PostMapping("/posts/{postId}/comments")
    public CommentResponse create(
            @PathVariable Long postId,
            @RequestBody CommentCreateRequest req
    ) {
        System.out.println("[CommentController]");
        System.out.println(" postId = " + postId);
        System.out.println("content = " + req.content());

        return commentService.create(postId, req);
    }

    // ?Š¹? • ê²Œì‹œê¸??˜ ?Œ“ê¸? ëª©ë¡ ì¡°íšŒ
    @GetMapping("/posts/{postId}/comments")
    public List<CommentResponse> findByPost(@PathVariable Long postId) {
        System.out.println("?Ÿ“? [CommentController] ?Œ“ê¸? ëª©ë¡ ì¡°íšŒ");
        System.out.println("?Ÿ“? postId = " + postId);

        return commentService.findByPost(postId);
    }

    // ?Œ“ê¸? ?‚­? œ
    @DeleteMapping("/comments/{commentId}")
    public void delete(@PathVariable Long commentId) {
        System.out.println("?Ÿ—‘ï¸ [CommentController] ?Œ“ê¸? ?‚­? œ ?š”ì²?");
        System.out.println("?Ÿ—‘ï¸ commentId = " + commentId);

        commentService.delete(commentId);
    }
}
