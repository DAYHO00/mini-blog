package com.deaho.miniblog.comment.dto;

import java.time.LocalDateTime;

public record CommentResponse(
        Long id,
        Long postId,
        String content,
        String username,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
