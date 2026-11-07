package com.shivam.supportlyAi.dto;

import java.time.LocalDateTime;

import com.shivam.supportlyAi.entity.MessageDirection;
import com.shivam.supportlyAi.entity.MessageStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {
    private Long id;
    private Long conversationId;
    private MessageDirection direction;
    private String content;
    private MessageStatus status;
    private String metaMessageId;
    private LocalDateTime timestamp;
}
