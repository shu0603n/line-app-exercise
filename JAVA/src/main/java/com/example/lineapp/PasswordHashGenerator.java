//ハッシュ生成??

package com.example.lineapp;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String rawPassword = "1";
        String hashedPassword = encoder.encode(rawPassword);

        System.out.println("平文パスワード: " + rawPassword);
        System.out.println("ハッシュ値: " + hashedPassword);
    }
}