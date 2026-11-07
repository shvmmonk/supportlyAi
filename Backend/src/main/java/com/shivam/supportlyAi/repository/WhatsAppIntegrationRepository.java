package com.shivam.supportlyAi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shivam.supportlyAi.entity.User;
import com.shivam.supportlyAi.entity.WhatsAppIntegration;

@Repository
public interface WhatsAppIntegrationRepository extends JpaRepository<WhatsAppIntegration, Long> {

    Optional<WhatsAppIntegration> findByPhoneNumberId(String phoneNumberId);

    Optional<WhatsAppIntegration> findFirstByBusinessOwner(User businessOwner);

    List<WhatsAppIntegration> findAllByBusinessOwner(User businessOwner);

    boolean existsByPhoneNumberId(String phoneNumberId);
}
