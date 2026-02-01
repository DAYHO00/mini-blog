package com.deaho.miniblog.post.like;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.deaho.miniblog.post.Post;
import com.deaho.miniblog.post.PostRepository;
import com.deaho.miniblog.user.User;
import com.deaho.miniblog.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public long like(Long postId, String username) {
        if (username == null) {
            throw new IllegalStateException("인증 정보가 없습니다.");
        }

        // 존재 검증
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시물이 존재하지 않습니다. postId=" + postId));

        // username으로 유저 찾기
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다. username=" + username));

        Long userId = user.getId();

        // 이미 눌렀으면 그냥 현재 카운트 반환(멱등)
        if (postLikeRepository.existsByPostIdAndUserId(postId, userId)) {
            return postLikeRepository.countByPostId(postId);
        }

        // 저장
        postLikeRepository.save(
                PostLike.builder()
                        .post(post)
                        .user(user)
                        .build()
        );

        return postLikeRepository.countByPostId(postId);
    }

    @Transactional
    public long unlike(Long postId, String username) {
        if (username == null) {
            throw new IllegalStateException("인증 정보가 없습니다.");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다. username=" + username));

        postLikeRepository.deleteByPostIdAndUserId(postId, user.getId());
        return postLikeRepository.countByPostId(postId);
    }

    @Transactional(readOnly = true)
    public long count(Long postId) {
        return postLikeRepository.countByPostId(postId);
    }

    @Transactional(readOnly = true)
    public boolean likedByMe(Long postId, String username) {
        if (username == null) {
            return false; // 로그인 안 했으면 false
        }

        return userRepository.findByUsername(username)
                .map(user -> postLikeRepository.existsByPostIdAndUserId(postId, user.getId()))
                .orElse(false);
    }
}
