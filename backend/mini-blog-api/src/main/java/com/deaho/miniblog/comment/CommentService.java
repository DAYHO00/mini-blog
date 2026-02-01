package com.deaho.miniblog.comment;

import com.deaho.miniblog.comment.dto.CommentCreateRequest;
import com.deaho.miniblog.comment.dto.CommentResponse;
import com.deaho.miniblog.post.Post;
import com.deaho.miniblog.post.PostRepository;
import com.deaho.miniblog.security.CurrentUserUtil;
import com.deaho.miniblog.user.User;
import com.deaho.miniblog.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public CommentResponse create(Long postId, CommentCreateRequest req) {
        String subject = CurrentUserUtil.getCurrentUsername();
        if (subject == null) throw new IllegalStateException("인증 정보를 찾을 수 없습니다.");

        // ⚠️ 여기 findByEmail / findByUsername 중 뭘 쓸지 "토큰 sub"에 맞춰야 함
        // 대호님은 현재 sub에 username 넣는 형태였으니 보통 findByUsername이 맞음.
        User author = userRepository.findByUsername(subject)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + subject));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다: " + postId));

        Comment saved = commentRepository.save(new Comment(req.content(), post, author));
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> findByPost(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void delete(Long commentId) {
        String subject = CurrentUserUtil.getCurrentUsername();
        if (subject == null) throw new IllegalStateException("인증 정보를 찾을 수 없습니다.");

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다: " + commentId));

        // 작성자만 삭제
        if (!comment.getAuthor().getUsername().equals(subject)) {
            throw new IllegalStateException("본인 댓글만 삭제할 수 있습니다.");
        }

        commentRepository.delete(comment);
    }

    private CommentResponse toResponse(Comment c) {
        return new CommentResponse(
                c.getId(),
                c.getPost().getId(),
                c.getContent(),
                c.getAuthor().getEmail(),
                c.getCreatedAt(),
                c.getUpdatedAt()
        );
    }
}
