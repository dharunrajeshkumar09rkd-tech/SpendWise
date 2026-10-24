package com.SpendWise.SpendWise.controller;

import com.SpendWise.SpendWise.model.Category;
import com.SpendWise.SpendWise.model.Transaction;
import com.SpendWise.SpendWise.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return expenseService.getAllTransactions();
    }

    @PostMapping
    public Transaction createTransaction(@RequestBody Transaction transaction) {
        return expenseService.saveTransaction(transaction);
    }

    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable Long id) {
        expenseService.deleteTransaction(id);
    }

    @GetMapping("/categories")
    public List<Category> getAllCategories() {
        return expenseService.getAllCategories();
    }
}