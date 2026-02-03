package com.deaho.miniblog.security;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final JwtProvider jwtProvider;

    public JwtAuthenticationFilter(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // ✅ 토큰이 "없어도 되는" 요청은 JWT 검사 자체를 스킵
        // (로그인/회원가입/스웨거/액추에이터 등)
        if (path.startsWith("/api/v1/auth/")
            || path.equals("/api/v1/auth")
            || path.startsWith("/swagger-ui")
            || path.startsWith("/v3/api-docs")
            || path.startsWith("/actuator")) {

            filterChain.doFilter(request, response);
            return;
        }

        log.info("[JWT FILTER] HIT {} {}", request.getMethod(), path);

        String authHeader = request.getHeader("Authorization");
        log.info("[JWT FILTER] Authorization header = {}", authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7).trim();

            boolean valid = jwtProvider.validateToken(token);
            log.info("[JWT FILTER] token valid = {}", valid);

            if (valid) {
                AbstractAuthenticationToken auth =
                        (AbstractAuthenticationToken) jwtProvider.getAuthentication(token);

                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);

                log.info("[JWT FILTER] AUTH SET principal={}", auth.getPrincipal());
            }
        }

        filterChain.doFilter(request, response);
    }
}
