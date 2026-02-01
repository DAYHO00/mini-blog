package com.deaho.miniblog.post.like;

import com.deaho.miniblog.post.Post;
import com.deaho.miniblog.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "post_like",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_post_like_post_user", columnNames = {"post_id", "user_id"})
    }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class PostLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 게시물
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "post_id")
    private Post post;

    // 누른 사람
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;
}