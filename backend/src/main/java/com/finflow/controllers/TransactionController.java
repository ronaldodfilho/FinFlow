package com.finflow.controllers;

import com.finflow.models.Transaction;
import com.finflow.models.User;
import com.finflow.repositories.TransactionRepository;
import com.finflow.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<Transaction> transactions = transactionRepository.findByUserIdOrderByTransactionDateDesc(user.getId());
        return ResponseEntity.ok(transactions);
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        transaction.setUser(user);
        Transaction saved = transactionRepository.save(transaction);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Optional<Transaction> transaction = transactionRepository.findById(id);

        if (transaction.isPresent() && transaction.get().getUser().getId().equals(user.getId())) {
            return ResponseEntity.ok(transaction.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Long id, @RequestBody Transaction transactionDetails, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Optional<Transaction> transactionOptional = transactionRepository.findById(id);

        if (transactionOptional.isPresent() && transactionOptional.get().getUser().getId().equals(user.getId())) {
            Transaction transaction = transactionOptional.get();
            transaction.setDescription(transactionDetails.getDescription());
            transaction.setAmount(transactionDetails.getAmount());
            transaction.setType(transactionDetails.getType());
            transaction.setTransactionDate(transactionDetails.getTransactionDate());
            transaction.setCategory(transactionDetails.getCategory());
            
            return ResponseEntity.ok(transactionRepository.save(transaction));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Optional<Transaction> transaction = transactionRepository.findById(id);

        if (transaction.isPresent() && transaction.get().getUser().getId().equals(user.getId())) {
            transactionRepository.delete(transaction.get());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
