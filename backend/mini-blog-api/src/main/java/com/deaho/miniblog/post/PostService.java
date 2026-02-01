package com.deaho.miniblog.post;

import java.util.List;

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
        // ✅ 실제로는 username(subject)일 가능성이 높으니 이름부터 맞추기
        String username = CurrentUserUtil.getCurrentUsername();
        if (username == null) throw new IllegalStateException("인증 정보를 찾을 수 없습니다.");

        // ✅ username 기준으로 조회
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + username));

        Post saved = postRepository.save(new Post(req.title(), req.content(), author));
        return toResponse(saved, author.getEmail()); // authorEmail은 그대로 email 내려줘도 OK
    }

    @Transactional(readOnly = true)
    public List<PostResponse> findAll() {
        return postRepository.findAll().stream()
                .map(p -> toResponse(p, p.getAuthor().getEmail()))
                .toList();
    }

    @Transactional(readOnly = true)
    public PostResponse findById(Long id) {
        Post p = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다: " + id));
        return toResponse(p, p.getAuthor().getEmail());
    }

    private PostResponse toResponse(Post p, String authorEmail) {
        return new PostResponse(
                p.getId(),
                p.getTitle(),
                p.getContent(),
                authorEmail,
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}
