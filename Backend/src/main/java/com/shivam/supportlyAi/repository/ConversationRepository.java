package com.shivam.supportlyAi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shivam.supportlyAi.entity.Conversation;
import com.shivam.supportlyAi.entity.User;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    Optional<Conversation> findByBusinessOwnerAndCustomerPhone(User businessOwner, String customerPhone);

    List<Conversation> findByBusinessOwnerOrderByLastMessageAtDesc(User businessOwner);

    long countByBusinessOwner(User businessOwner);
}
