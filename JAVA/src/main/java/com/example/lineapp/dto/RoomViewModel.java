package com.example.lineapp.dto;

public class RoomViewModel {
    private Integer id;
    private String name;
    private String avatar;
    private String lastMessageContent;
    private String formattedTime;

    public RoomViewModel(Integer id, String name, String avatar, String lastMessageContent, String formattedTime) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.lastMessageContent = lastMessageContent;
        this.formattedTime = formattedTime;
    }

    public Integer getId() { return id; }
    public String getName() { return name; }
    public String getAvatar() { return avatar; }
    public String getLastMessageContent() { return lastMessageContent; }
    public String getFormattedTime() { return formattedTime; }
}
