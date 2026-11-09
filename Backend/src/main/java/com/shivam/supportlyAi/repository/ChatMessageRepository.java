package com.shivam.supportlyAi.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import jakarta.persistence.LockModeType;
import com.shivam.supportlyAi.entity.ChatMessage;
import com.shivam.supportlyAi.entity.Conversation;
import com.shivam.supportlyAi.entity.MessageDirection;
import com.shivam.supportlyAi.entity.MessageStatus;
import com.shivam.supportlyAi.entity.User;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByConversationOrderByTimestampAsc(Conversation conversation);
    Optional<ChatMessage> findByMetaMessageId(String metaMessageId);
    boolean existsByMetaMessageId(String metaMessageId);
    long countByConversationBusinessOwnerAndDirection(User businessOwner, MessageDirection direction);
    long countByConversationBusinessOwnerAndStatus(User businessOwner, MessageStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select m from ChatMessage m where m.metaMessageId = :metaId")
    Optional<ChatMessage> findByMetaMessageIdForUpdate(@Param("metaId") String metaId);
}
