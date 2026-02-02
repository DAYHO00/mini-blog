package com.deaho.miniblog.comment;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.deaho.miniblog.comment.dto.CommentCreateRequest;
import com.deaho.miniblog.comment.dto.CommentResponse;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1")
public class CommentControl {

    private final CommentService commentService;

  
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

   
    @GetMapping("/posts/{postId}/comments")
    public List<CommentResponse> findByPost(@PathVariable Long postId) {


        return commentService.findByPost(postId);
    }

    // ?���? ?��?��
    @DeleteMapping("/comments/{commentId}")
    public void delete(@PathVariable Long commentId) {


        commentService.delete(commentId);
    }
}
