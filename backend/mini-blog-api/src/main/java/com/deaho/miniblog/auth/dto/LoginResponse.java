package com.deaho.miniblog.auth.dto;

public class LoginResponse {

    private String accessToken;
    private String tokenType = "Bearer";

    public LoginResponse() {}

    public LoginResponse(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getAccessToken() { return accessToken; }
    public String getTokenType() { return tokenType; }

    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }
}
