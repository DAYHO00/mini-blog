package com.deaho.miniblog.post.dto;

import java.time.LocalDateTime;

public record PostResponse(
        Long id,
        String title,
        String content,
        String authorEmail,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
