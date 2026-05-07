package com.finflow.controllers;

import com.finflow.models.AccountPayable;
import com.finflow.models.User;
import com.finflow.repositories.AccountPayableRepository;
import com.finflow.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/payables")
public class AccountPayableController {

    @Autowired
    private AccountPayableRepository accountPayableRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<AccountPayable>> getAllPayables(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<AccountPayable> payables = accountPayableRepository.findByUserIdOrderByDueDateAsc(user.getId());
        return ResponseEntity.ok(payables);
    }

    @PostMapping
    public ResponseEntity<AccountPayable> createPayable(@RequestBody AccountPayable payable, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        payable.setUser(user);
        AccountPayable saved = accountPayableRepository.save(payable);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountPayable> getPayableById(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Optional<AccountPayable> payable = accountPayableRepository.findById(id);

        if (payable.isPresent() && payable.get().getUser().getId().equals(user.getId())) {
            return ResponseEntity.ok(payable.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountPayable> updatePayable(@PathVariable Long id, @RequestBody AccountPayable details, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Optional<AccountPayable> payableOptional = accountPayableRepository.findById(id);

        if (payableOptional.isPresent() && payableOptional.get().getUser().getId().equals(user.getId())) {
            AccountPayable payable = payableOptional.get();
            payable.setDescription(details.getDescription());
            payable.setAmount(details.getAmount());
            payable.setDueDate(details.getDueDate());
            payable.setStatus(details.getStatus());
            
            return ResponseEntity.ok(accountPayableRepository.save(payable));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePayable(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Optional<AccountPayable> payable = accountPayableRepository.findById(id);

        if (payable.isPresent() && payable.get().getUser().getId().equals(user.getId())) {
            accountPayableRepository.delete(payable.get());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
