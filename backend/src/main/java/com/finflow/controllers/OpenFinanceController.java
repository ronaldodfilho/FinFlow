package com.finflow.controllers;

import com.finflow.models.Transaction;
import com.finflow.models.TransactionType;
import com.finflow.models.User;
import com.finflow.repositories.TransactionRepository;
import com.finflow.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/open-finance")
public class OpenFinanceController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/sync")
    public ResponseEntity<?> syncTransactions(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        
        // Simulating Open Finance API delay and mock data generation
        Random random = new Random();
        int newTxCount = random.nextInt(3) + 2; // 2 to 4 transactions
        
        List<Transaction> syncedTransactions = new ArrayList<>();
        
        String[] descriptions = {"Supermercado", "Posto de Gasolina", "Ifood", "Pix Recebido", "Salário", "Farmácia"};
        TransactionType[] types = {TransactionType.EXPENSE, TransactionType.EXPENSE, TransactionType.EXPENSE, TransactionType.INCOME, TransactionType.INCOME, TransactionType.EXPENSE};
        
        for (int i = 0; i < newTxCount; i++) {
            int index = random.nextInt(descriptions.length);
            
            Transaction tx = new Transaction();
            tx.setUser(user);
            tx.setDescription(descriptions[index]);
            tx.setAmount(BigDecimal.valueOf(random.nextDouble() * 500 + 10).setScale(2, java.math.RoundingMode.HALF_UP));
            tx.setType(types[index]);
            tx.setTransactionDate(LocalDateTime.now().minusDays(random.nextInt(7)));
            tx.setCategory("Geral");
            tx.setIsSync(true); // Flag to show it came from Open Finance
            
            syncedTransactions.add(transactionRepository.save(tx));
        }

        return ResponseEntity.ok(new SyncResponse("Sincronização concluída com sucesso", syncedTransactions.size()));
    }

    // Inner record for response
    public static class SyncResponse {
        public String message;
        public int transactionsAdded;

        public SyncResponse(String message, int transactionsAdded) {
            this.message = message;
            this.transactionsAdded = transactionsAdded;
        }
    }
}
