package com.deaho.miniblog.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtProvider {

    private final Key signingKey;
    private final long accessTokenExpireMs;

    public JwtProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-expire-ms:3600000}") long accessTokenExpireMs
    ) {
        // ✅ HS256용 Key 생성 (secret이 충분히 길면 OK)
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpireMs = accessTokenExpireMs;
    }

    /** 로그인 성공 시 Access Token 발급 */
    public String generateAccessToken(String username) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + accessTokenExpireMs);

        return Jwts.builder()
                .subject(username)      // ✅ 0.12.x 스타일 (setSubject 대신)
                .issuedAt(now)          // ✅ setIssuedAt 대신
                .expiration(expiry)     // ✅ setExpiration 대신
                .signWith(signingKey)   // ✅ SignatureAlgorithm 명시 없이도 됨(HS256)
                .compact();
    }

    /** 토큰 서명/만료 등 검증 */
    public boolean validateToken(String token) {
        try {
            // ✅ 0.12.x: verifyWith(key).build().parseSignedClaims(token)
            Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) signingKey)
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /** 토큰에서 username(subject) 추출 */
    public String getUsername(String token) {
        Claims claims = Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }
}
