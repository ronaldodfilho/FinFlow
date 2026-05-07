package com.finflow.controllers;

import com.finflow.models.AccountReceivable;
import com.finflow.models.User;
import com.finflow.repositories.AccountReceivableRepository;
import com.finflow.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/receivables")
public class AccountReceivableController {

    @Autowired
    private AccountReceivableRepository accountReceivableRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<AccountReceivable>> getAllReceivables(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<AccountReceivable> receivables = accountReceivableRepository.findByUserIdOrderByDueDateAsc(user.getId());
        return ResponseEntity.ok(receivables);
    }

    @PostMapping
    public ResponseEntity<AccountReceivable> createReceivable(@RequestBody AccountReceivable receivable, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        receivable.setUser(user);
        AccountReceivable saved = accountReceivableRepository.save(receivable);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountReceivable> getReceivableById(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Optional<AccountReceivable> receivable = accountReceivableRepository.findById(id);

        if (receivable.isPresent() && receivable.get().getUser().getId().equals(user.getId())) {
            return ResponseEntity.ok(receivable.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountReceivable> updateReceivable(@PathVariable Long id, @RequestBody AccountReceivable details, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Optional<AccountReceivable> receivableOptional = accountReceivableRepository.findById(id);

        if (receivableOptional.isPresent() && receivableOptional.get().getUser().getId().equals(user.getId())) {
            AccountReceivable receivable = receivableOptional.get();
            receivable.setDescription(details.getDescription());
            receivable.setAmount(details.getAmount());
            receivable.setDueDate(details.getDueDate());
            receivable.setStatus(details.getStatus());
            
            return ResponseEntity.ok(accountReceivableRepository.save(receivable));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReceivable(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Optional<AccountReceivable> receivable = accountReceivableRepository.findById(id);

        if (receivable.isPresent() && receivable.get().getUser().getId().equals(user.getId())) {
            accountReceivableRepository.delete(receivable.get());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
