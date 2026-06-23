package com.example.lineapp.dto;

import java.time.LocalDateTime;

public class MessageViewModel {
    private Integer id;
    private String senderName;
    private String content;
    private Boolean isMine;
    private LocalDateTime sentAt;
    private String formattedTime;
    private boolean showDateLabel;
    private String dateLabel;
    private boolean first;
    private boolean last;

    public MessageViewModel(Integer id, String senderName, String content, Boolean isMine,
                            LocalDateTime sentAt, String formattedTime,
                            boolean showDateLabel, String dateLabel,
                            boolean first, boolean last) {
        this.id = id;
        this.senderName = senderName;
        this.content = content;
        this.isMine = isMine;
        this.sentAt = sentAt;
        this.formattedTime = formattedTime;
        this.showDateLabel = showDateLabel;
        this.dateLabel = dateLabel;
        this.first = first;
        this.last = last;
    }

    public Integer getId() { return id; }
    public String getSenderName() { return senderName; }
    public String getContent() { return content; }
    public Boolean getIsMine() { return isMine; }
    public LocalDateTime getSentAt() { return sentAt; }
    public String getFormattedTime() { return formattedTime; }
    public boolean isShowDateLabel() { return showDateLabel; }
    public String getDateLabel() { return dateLabel; }
    public boolean isFirst() { return first; }
    public boolean isLast() { return last; }
}
