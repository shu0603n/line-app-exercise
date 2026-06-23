package com.example.lineapp.controller;

import com.example.lineapp.dto.MessageViewModel;
import com.example.lineapp.dto.RoomViewModel;
import com.example.lineapp.entity.ChatRoom;
import com.example.lineapp.entity.Message;
import com.example.lineapp.entity.SystemInfo;
import com.example.lineapp.repository.ChatRoomRepository;
import com.example.lineapp.repository.MessageRepository;
import com.example.lineapp.repository.SystemInfoRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Controller
public class WebController {

    private final SystemInfoRepository systemInfoRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;

    public WebController(SystemInfoRepository systemInfoRepository,
                         ChatRoomRepository chatRoomRepository,
                         MessageRepository messageRepository) {
        this.systemInfoRepository = systemInfoRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.messageRepository = messageRepository;
    }

    @GetMapping("/")
    public String login(Model model) {
        systemInfoRepository.findFirstByIsActiveTrueOrderByCreatedAtDesc()
                .ifPresent(si -> model.addAttribute("systemInfo", si));
        return "login";
    }

    @GetMapping("/talk")
    public String talk(Model model) {
        systemInfoRepository.findFirstByIsActiveTrueOrderByCreatedAtDesc()
                .ifPresent(si -> model.addAttribute("systemInfo", si));

        List<ChatRoom> rooms = chatRoomRepository.findAllByOrderByCreatedAtAsc();
        List<RoomViewModel> roomViewModels = rooms.stream().map(room -> {
            Optional<Message> lastMsg = messageRepository.findFirstByRoomIdOrderBySentAtDesc(room.getId());
            String content = lastMsg.map(Message::getContent).orElse("");
            String time = lastMsg.map(m -> formatListTime(m.getSentAt())).orElse("");
            return new RoomViewModel(room.getId(), room.getName(), room.getAvatar(), content, time);
        }).toList();

        model.addAttribute("rooms", roomViewModels);
        return "talk/index";
    }

    @GetMapping("/talk/{id}")
    public String talkRoom(@PathVariable Integer id, Model model) {
        Optional<ChatRoom> roomOpt = chatRoomRepository.findById(id);
        if (roomOpt.isEmpty()) {
            return "redirect:/talk";
        }

        ChatRoom room = roomOpt.get();
        List<Message> messages = messageRepository.findByRoomIdOrderBySentAtAsc(id);
        List<MessageViewModel> viewModels = buildMessageViewModels(messages);

        model.addAttribute("room", room);
        model.addAttribute("messages", viewModels);
        return "talk/room";
    }

    private List<MessageViewModel> buildMessageViewModels(List<Message> messages) {
        List<MessageViewModel> result = new ArrayList<>();
        for (int i = 0; i < messages.size(); i++) {
            Message msg = messages.get(i);
            Message prev = i > 0 ? messages.get(i - 1) : null;
            Message next = i < messages.size() - 1 ? messages.get(i + 1) : null;

            boolean showDateLabel = prev == null || !isSameDay(prev.getSentAt(), msg.getSentAt());
            boolean isFirst = prev == null || !prev.getSenderName().equals(msg.getSenderName());
            boolean isLast = next == null || !next.getSenderName().equals(msg.getSenderName());
            String dateLabel = showDateLabel ? formatDateLabel(msg.getSentAt()) : "";

            result.add(new MessageViewModel(
                    msg.getId(), msg.getSenderName(), msg.getContent(), msg.getIsMine(),
                    msg.getSentAt(), formatMessageTime(msg.getSentAt()),
                    showDateLabel, dateLabel, isFirst, isLast
            ));
        }
        return result;
    }

    // トークリスト用: Next.jsのformatTime関数と同等
    private String formatListTime(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        LocalDate today = LocalDate.now();
        LocalDate msgDate = dateTime.toLocalDate();
        long diffDays = ChronoUnit.DAYS.between(msgDate, today);
        if (diffDays == 0) {
            return dateTime.format(DateTimeFormatter.ofPattern("HH:mm"));
        } else if (diffDays == 1) {
            return "昨日";
        } else if (diffDays < 7) {
            String[] days = {"日", "月", "火", "水", "木", "金", "土"};
            int dayIndex = dateTime.getDayOfWeek().getValue() % 7;
            return days[dayIndex] + "曜";
        } else {
            return dateTime.getMonthValue() + "/" + dateTime.getDayOfMonth();
        }
    }

    // チャット画面の時刻表示: "HH:mm"
    private String formatMessageTime(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        return dateTime.format(DateTimeFormatter.ofPattern("HH:mm"));
    }

    // チャット画面の日付ラベル: "今日" / "昨日" / "年月日"
    private String formatDateLabel(LocalDateTime dateTime) {
        LocalDate today = LocalDate.now();
        LocalDate msgDate = dateTime.toLocalDate();
        long diffDays = ChronoUnit.DAYS.between(msgDate, today);
        if (diffDays == 0) return "今日";
        if (diffDays == 1) return "昨日";
        return dateTime.getYear() + "年" + dateTime.getMonthValue() + "月" + dateTime.getDayOfMonth() + "日";
    }

    private boolean isSameDay(LocalDateTime a, LocalDateTime b) {
        return a.toLocalDate().equals(b.toLocalDate());
    }
}
