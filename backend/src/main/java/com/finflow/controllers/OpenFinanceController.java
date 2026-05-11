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
        int newTxCount = random.nextInt(5) + 5; 
        
        List<Transaction> syncedTransactions = new ArrayList<>();
        
        // Probabilidade REALISTA de banco: 80% despesas, 20% receitas
        double expenseProbability = 0.80;
        
        String[] incomeDesc = {
            "Pix Recebido - Venda", "Salário Mensal", "Rendimentos Tesouro Direto", 
            "Bônus Semestral", "Reembolso Despesas", "Dividendos", "Pix de Amigo"
        };
        String[] incomeCat = {"Transferência", "Salário", "Investimentos", "Salário", "Outros", "Investimentos", "Transferência"};

        String[] expenseDesc = {
            "Supermercado BH", "Posto Shell", "Ifood - Almoço", "Farmácia Droga Raia", 
            "Netflix Mensal", "Amazon Prime", "Pagamento Empréstimo", "Juros Banco", 
            "Fatura Cartão Nubank", "Uber - Viagem", "Padaria Panini", "Restaurante Sabor",
            "Assinatura Spotify", "Loja de Conveniência", "Manutenção Carro"
        };
        String[] expenseCat = {
            "Alimentação", "Transporte", "Alimentação", "Saúde", 
            "Assinaturas", "Assinaturas", "Dívidas", "Taxas", 
            "Cartão de Crédito", "Transporte", "Alimentação", "Alimentação",
            "Assinaturas", "Alimentação", "Transporte"
        };
        
        for (int i = 0; i < newTxCount; i++) {
            Transaction tx = new Transaction();
            tx.setUser(user);
            
            boolean isExpense = random.nextDouble() < expenseProbability;
            
            if (isExpense) {
                int idx = random.nextInt(expenseDesc.length);
                tx.setDescription(expenseDesc[idx]);
                tx.setType(TransactionType.EXPENSE);
                tx.setCategory(expenseCat[idx]);
                
                double baseAmount = expenseCat[idx].equals("Dívidas") ? 800 : 15;
                tx.setAmount(BigDecimal.valueOf(random.nextDouble() * 250 + baseAmount).setScale(2, java.math.RoundingMode.HALF_UP));
            } else {
                int idx = random.nextInt(incomeDesc.length);
                tx.setDescription(incomeDesc[idx]);
                tx.setType(TransactionType.INCOME);
                tx.setCategory(incomeCat[idx]);
                
                double baseAmount = incomeCat[idx].equals("Salário") ? 3500 : 50;
                tx.setAmount(BigDecimal.valueOf(random.nextDouble() * 500 + baseAmount).setScale(2, java.math.RoundingMode.HALF_UP));
            }
            
            tx.setTransactionDate(LocalDateTime.now().minusDays(random.nextInt(15)));
            tx.setIsSync(true);
            
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
