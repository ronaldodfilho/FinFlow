package com.finflow.repositories;

import com.finflow.models.AccountPayable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountPayableRepository extends JpaRepository<AccountPayable, Long> {
    List<AccountPayable> findByUserId(Long userId);
    List<AccountPayable> findByUserIdOrderByDueDateAsc(Long userId);
}
