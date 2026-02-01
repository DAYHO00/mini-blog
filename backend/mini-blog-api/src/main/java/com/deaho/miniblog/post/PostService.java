package com.deaho.miniblog.post;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.deaho.miniblog.post.dto.PostCreateRequest;
import com.deaho.miniblog.post.dto.PostResponse;
import com.deaho.miniblog.security.CurrentUserUtil;
import com.deaho.miniblog.user.User;
import com.deaho.miniblog.user.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public PostResponse create(PostCreateRequest req) {
        String username = CurrentUserUtil.getCurrentUsername();
        if (username == null) {
            throw new IllegalStateException("인증 정보를 찾을 수 없습니다.");
        }

        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + username));

        Post saved = postRepository.save(new Post(req.title(), req.content(), author));
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<PostResponse> findAll() {
        return postRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PostResponse findById(Long id) {
        Post p = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다: " + id));
        return toResponse(p);
    }

    // ✅ 추가: 게시글 삭제 (작성자만 가능)
    @Transactional
    public void delete(Long id) {
        String username = CurrentUserUtil.getCurrentUsername();
        if (username == null) {
            throw new IllegalStateException("인증 정보를 찾을 수 없습니다.");
        }

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다: " + id));

        // 작성자 검증
        String authorUsername = post.getAuthor().getUsername();
        if (!authorUsername.equals(username)) {
            throw new AccessDeniedException("작성자만 삭제할 수 있습니다.");
        }

        postRepository.delete(post);
    }

    private PostResponse toResponse(Post p) {
        return new PostResponse(
                p.getId(),
                p.getTitle(),
                p.getContent(),
                p.getAuthor().getUsername(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}
