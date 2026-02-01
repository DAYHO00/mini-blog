package com.deaho.miniblog.post.dto;

import java.time.LocalDateTime;

public record PostResponse(
        Long id,
        String title,
        String content,
        String authorUsername,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
