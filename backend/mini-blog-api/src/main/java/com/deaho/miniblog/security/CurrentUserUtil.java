package com.deaho.miniblog.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class CurrentUserUtil {

    private CurrentUserUtil() {}

    public static String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }

        Object principal = auth.getPrincipal();

        // JwtAuthenticationFilter에서 principal을 String(email)로 넣는 경우
        if (principal instanceof String s) return s;

        // UserDetails로 넣는 경우
        if (principal instanceof UserDetails ud) return ud.getUsername();

        return null;
    }
}
