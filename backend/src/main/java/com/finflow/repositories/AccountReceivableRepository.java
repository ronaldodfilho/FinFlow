package com.finflow.repositories;

import com.finflow.models.AccountReceivable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountReceivableRepository extends JpaRepository<AccountReceivable, Long> {
    List<AccountReceivable> findByUserId(Long userId);
    List<AccountReceivable> findByUserIdOrderByDueDateAsc(Long userId);
}
