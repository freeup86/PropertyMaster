using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PropertyMaster.Models.DTOs;
using PropertyMaster.Models.Entities;
using PropertyMaster.PropertyManagement.API.Services.Interfaces;

namespace PropertyMaster.PropertyManagement.API.Services.Implementations
{
    public class FinancialService : IFinancialService
    {
        private readonly PropertyMasterApiContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<FinancialService> _logger;

        public FinancialService(
            PropertyMasterApiContext context,
            IMapper mapper,
            ILogger<FinancialService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<TransactionDto>> GetTransactionsByPropertyIdAsync(Guid propertyId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.Transactions
                .Include(t => t.Property)
                .Include(t => t.Unit)
                .Include(t => t.Category)
                //.Include(t => t.Account)
                .Where(t => t.PropertyId == propertyId);

            if (startDate.HasValue)
                query = query.Where(t => t.Date >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(t => t.Date <= endDate.Value);

            var transactions = await query.ToListAsync();
            
            return _mapper.Map<IEnumerable<TransactionDto>>(transactions);
        }

        public async Task<IEnumerable<TransactionDto>> GetTransactionsByUnitIdAsync(Guid unitId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.Transactions
                .Include(t => t.Property)
                .Include(t => t.Unit)
                .Include(t => t.Category)
                //.Include(t => t.Account)
                .Where(t => t.UnitId == unitId);

            if (startDate.HasValue)
                query = query.Where(t => t.Date >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(t => t.Date <= endDate.Value);

            var transactions = await query.ToListAsync();
            
            return _mapper.Map<IEnumerable<TransactionDto>>(transactions);
        }

        public async Task<TransactionDto> GetTransactionByIdAsync(Guid transactionId)
        {
            var transaction = await _context.Transactions
                .Include(t => t.Property)
                .Include(t => t.Unit)
                .Include(t => t.Category)
                //.Include(t => t.Account)
                .FirstOrDefaultAsync(t => t.Id == transactionId);
            
            return _mapper.Map<TransactionDto>(transaction);
        }

        public async Task<TransactionDto> CreateTransactionAsync(CreateTransactionDto transactionDto)
        {
            // Validate property exists
            var property = await _context.Properties.FindAsync(transactionDto.PropertyId);
            if (property == null)
                throw new Exception($"Property with ID {transactionDto.PropertyId} not found");

            // Validate unit belongs to property if specified
            if (transactionDto.UnitId.HasValue)
            {
                var unit = await _context.Units
                    .FirstOrDefaultAsync(u => u.Id == transactionDto.UnitId.Value && u.PropertyId == transactionDto.PropertyId);
                
                if (unit == null)
                    throw new Exception($"Unit with ID {transactionDto.UnitId} not found for the specified property");
            }

            // Validate category exists
            var category = await _context.Categories.FindAsync(transactionDto.CategoryId);
            if (category == null)
                throw new Exception($"Category with ID {transactionDto.CategoryId} not found");

            // Validate account exists if specified
            if (transactionDto.AccountId.HasValue)
            {
                //var account = await _context.Accounts.FindAsync(transactionDto.AccountId.Value);
                //if (account == null)
                //    throw new Exception($"Account with ID {transactionDto.AccountId} not found");
            }

            var transaction = _mapper.Map<Transaction>(transactionDto);
            transaction.Id = Guid.NewGuid();
            transaction.CreatedDate = DateTime.UtcNow;
            transaction.ModifiedDate = DateTime.UtcNow;

            // Set tax deductible based on category if not explicitly set
            if (category.IsTaxDeductible && transaction.Type == TransactionType.Expense)
                transaction.IsTaxDeductible = true;

            await _context.Transactions.AddAsync(transaction);
            await _context.SaveChangesAsync();

            // Update account balance if specified
            if (transactionDto.AccountId.HasValue)
            {
                await UpdateAccountBalanceAsync(transactionDto.AccountId.Value, transaction.Type, transaction.Amount);
            }

            // Load navigation properties for mapping
            _context.Entry(transaction).Reference(t => t.Property).Load();
            _context.Entry(transaction).Reference(t => t.Category).Load();
            
            if (transaction.UnitId.HasValue)
                _context.Entry(transaction).Reference(t => t.Unit).Load();
            
            //if (transaction.AccountId.HasValue)
                //_context.Entry(transaction).Reference(t => t.Account).Load();

            return _mapper.Map<TransactionDto>(transaction);
        }

        public async Task<TransactionDto> UpdateTransactionAsync(Guid transactionId, UpdateTransactionDto transactionDto)
        {
            var transaction = await _context.Transactions
                .Include(t => t.Property)
                .Include(t => t.Unit)
                .Include(t => t.Category)
                //.Include(t => t.Account)
                .FirstOrDefaultAsync(t => t.Id == transactionId);
            
            if (transaction == null)
                return null;

            // Store old values for account balance update
            var oldAccountId = transaction.AccountId;
            var oldType = transaction.Type;
            var oldAmount = transaction.Amount;

            // Validate category exists if being updated
            if (transactionDto.CategoryId.HasValue)
            {
                var category = await _context.Categories.FindAsync(transactionDto.CategoryId.Value);
                if (category == null)
                    throw new Exception($"Category with ID {transactionDto.CategoryId} not found");
            }

            // Validate account exists if being updated
            if (transactionDto.AccountId.HasValue)
            {
                var account = await _context.Accounts.FindAsync(transactionDto.AccountId.Value);
                if (account == null)
                    throw new Exception($"Account with ID {transactionDto.AccountId} not found");
            }

            _mapper.Map(transactionDto, transaction);
            transaction.ModifiedDate = DateTime.UtcNow;
            
            _context.Transactions.Update(transaction);
            await _context.SaveChangesAsync();

            // Update account balances if needed
            if (oldAccountId.HasValue)
            {
                // Reverse old transaction effect
                await UpdateAccountBalanceAsync(oldAccountId.Value, GetOppositeType(oldType), oldAmount);
            }

            if (transaction.AccountId.HasValue)
            {
                // Apply new transaction effect
                await UpdateAccountBalanceAsync(transaction.AccountId.Value, transaction.Type, transaction.Amount);
            }

            return _mapper.Map<TransactionDto>(transaction);
        }

        public async Task<bool> DeleteTransactionAsync(Guid transactionId)
        {
            var transaction = await _context.Transactions.FindAsync(transactionId);
            
            if (transaction == null)
                return false;

            // Reverse transaction effect on account balance
            if (transaction.AccountId.HasValue)
            {
                await UpdateAccountBalanceAsync(transaction.AccountId.Value, GetOppositeType(transaction.Type), transaction.Amount);
            }

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<FinancialReportDto> GetFinancialReportAsync(Guid propertyId, DateTime startDate, DateTime endDate)
        {
            // Validate property exists
            var property = await _context.Properties.FindAsync(propertyId);
            if (property == null)
                throw new Exception($"Property with ID {propertyId} not found");

            // Get all transactions for the property in the date range
            var transactions = await _context.Transactions
                .Include(t => t.Category)
                .Where(t => t.PropertyId == propertyId && t.Date >= startDate && t.Date <= endDate)
                .ToListAsync();

            var incomeTransactions = transactions.Where(t => t.Type == TransactionType.Income).ToList();
            var expenseTransactions = transactions.Where(t => t.Type == TransactionType.Expense).ToList();

            var totalIncome = incomeTransactions.Sum(t => t.Amount);
            var totalExpenses = expenseTransactions.Sum(t => t.Amount);
            var netOperatingIncome = totalIncome - totalExpenses;
            var expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

            // Group transactions by category
            var incomeByCategory = incomeTransactions
                .GroupBy(t => t.CategoryId)
                .Select(g => new CategorySummaryDto
                {
                    CategoryId = g.Key,
                    CategoryName = g.First().Category.Name,
                    Amount = g.Sum(t => t.Amount),
                    Percentage = totalIncome > 0 ? (g.Sum(t => t.Amount) / totalIncome) * 100 : 0
                })
                .ToList();

            var expensesByCategory = expenseTransactions
                .GroupBy(t => t.CategoryId)
                .Select(g => new CategorySummaryDto
                {
                    CategoryId = g.Key,
                    CategoryName = g.First().Category.Name,
                    Amount = g.Sum(t => t.Amount),
                    Percentage = totalExpenses > 0 ? (g.Sum(t => t.Amount) / totalExpenses) * 100 : 0
                })
                .ToList();

            // Group transactions by month
            var monthlySummary = transactions
                .GroupBy(t => new { t.Date.Year, t.Date.Month })
                .Select(g => new MonthlyFinancialSummaryDto
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Income = g.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount),
                    Expenses = g.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount),
                    NetOperatingIncome = g.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount) - g.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount),
                    CashFlow = g.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount) - g.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount)
                })
                .OrderBy(s => s.Year)
                .ThenBy(s => s.Month)
                .ToList();

            return new FinancialReportDto
            {
                PropertyId = propertyId,
                PropertyName = property.Name,
                StartDate = startDate,
                EndDate = endDate,
                TotalIncome = totalIncome,
                TotalExpenses = totalExpenses,
                NetOperatingIncome = netOperatingIncome,
                CashFlow = netOperatingIncome, // This is simplified; real cash flow would subtract mortgage payments
                ExpenseRatio = expenseRatio,
                IncomeByCategory = incomeByCategory,
                ExpensesByCategory = expensesByCategory,
                MonthlySummary = monthlySummary
            };
        }

        public async Task<CashFlowReportDto> GetCashFlowReportAsync(Guid propertyId, DateTime? date = null)
        {
            // Default to current month if no date provided
            var reportDate = date ?? DateTime.UtcNow;
            var startOfMonth = new DateTime(reportDate.Year, reportDate.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);

            // Validate property exists
            var property = await _context.Properties.FindAsync(propertyId);
            if (property == null)
                throw new Exception($"Property with ID {propertyId} not found");

            // Get monthly financial data
            var monthlyCashFlows = await GetMonthlyCashFlowsAsync(propertyId, startOfMonth.AddMonths(-11), endOfMonth);

            // Get current month's data
            var currentMonthData = monthlyCashFlows.FirstOrDefault(m => m.Year == reportDate.Year && m.Month == reportDate.Month) 
                ?? new MonthlyFinancialSummaryDto { Year = reportDate.Year, Month = reportDate.Month };

            // Calculate performance metrics
            var totalInvestment = property.AcquisitionPrice;
            var capRate = property.CurrentValue > 0 ? (currentMonthData.NetOperatingIncome * 12) / property.CurrentValue * 100 : 0;
            var cashOnCashReturn = totalInvestment > 0 ? (currentMonthData.CashFlow * 12) / totalInvestment * 100 : 0;

            // Get detailed income and expense breakdown
            var monthlyTransactions = await _context.Transactions
                .Include(t => t.Category)
                .Where(t => t.PropertyId == propertyId && t.Date >= startOfMonth && t.Date <= endOfMonth)
                .ToListAsync();

            var rentalIncome = monthlyTransactions
                .Where(t => t.Type == TransactionType.Income && t.Category.Name.Contains("Rent"))
                .Sum(t => t.Amount);

            var otherIncome = monthlyTransactions
                .Where(t => t.Type == TransactionType.Income && !t.Category.Name.Contains("Rent"))
                .Sum(t => t.Amount);

            var vacancyLoss = monthlyTransactions
                .Where(t => t.Type == TransactionType.Expense && t.Category.Name.Contains("Vacancy"))
                .Sum(t => t.Amount);

            var propertyManagement = monthlyTransactions
                .Where(t => t.Type == TransactionType.Expense && t.Category.Name.Contains("Management"))
                .Sum(t => t.Amount);

            var propertyTax = monthlyTransactions
                .Where(t => t.Type == TransactionType.Expense && t.Category.Name.Contains("Tax"))
                .Sum(t => t.Amount);

            var insurance = monthlyTransactions
                .Where(t => t.Type == TransactionType.Expense && t.Category.Name.Contains("Insurance"))
                .Sum(t => t.Amount);

            var maintenance = monthlyTransactions
                .Where(t => t.Type == TransactionType.Expense && t.Category.Name.Contains("Maintenance"))
                .Sum(t => t.Amount);

            var utilities = monthlyTransactions
                .Where(t => t.Type == TransactionType.Expense && t.Category.Name.Contains("Utilit"))
                .Sum(t => t.Amount);

            var mortgage = monthlyTransactions
                .Where(t => t.Type == TransactionType.Expense && t.Category.Name.Contains("Mortgage"))
                .Sum(t => t.Amount);

            var otherFinancing = monthlyTransactions
                .Where(t => t.Type == TransactionType.Expense && 
                        (t.Category.Name.Contains("Interest") || t.Category.Name.Contains("Loan") || t.Category.Name.Contains("Financing")) && 
                        !t.Category.Name.Contains("Mortgage"))
                .Sum(t => t.Amount);

            var otherExpenses = monthlyTransactions
                .Where(t => t.Type == TransactionType.Expense && 
                        !t.Category.Name.Contains("Vacancy") && 
                        !t.Category.Name.Contains("Management") && 
                        !t.Category.Name.Contains("Tax") && 
                        !t.Category.Name.Contains("Insurance") && 
                        !t.Category.Name.Contains("Maintenance") && 
                        !t.Category.Name.Contains("Utilit") && 
                        !t.Category.Name.Contains("Mortgage") && 
                        !t.Category.Name.Contains("Interest") && 
                        !t.Category.Name.Contains("Loan") && 
                        !t.Category.Name.Contains("Financing"))
                .Sum(t => t.Amount);

               var totalOperatingExpenses = vacancyLoss + propertyManagement + propertyTax + insurance + maintenance + utilities + otherExpenses;
               var netOperatingIncome = rentalIncome + otherIncome - totalOperatingExpenses;
               var totalFinancingCosts = mortgage + otherFinancing;
               var monthlyCashFlow = netOperatingIncome - totalFinancingCosts;

               return new CashFlowReportDto
               {
                   PropertyId = propertyId,
                   PropertyName = property.Name,
                   MonthlyRentalIncome = rentalIncome,
                   OtherMonthlyIncome = otherIncome,
                   TotalMonthlyIncome = rentalIncome + otherIncome,
                   VacancyLoss = vacancyLoss,
                   PropertyManagement = propertyManagement,
                   PropertyTax = propertyTax,
                   Insurance = insurance,
                   Maintenance = maintenance,
                   Utilities = utilities,
                   OtherExpenses = otherExpenses,
                   TotalOperatingExpenses = totalOperatingExpenses,
                   NetOperatingIncome = netOperatingIncome,
                   MortgagePayment = mortgage,
                   OtherFinancingCosts = otherFinancing,
                   TotalFinancingCosts = totalFinancingCosts,
                   MonthlyCashFlow = monthlyCashFlow,
                   AnnualCashFlow = monthlyCashFlow * 12,
                   CashOnCashReturn = cashOnCashReturn,
                   CapRate = capRate,
                   MonthlyCashFlows = monthlyCashFlows
               };
           }

           public async Task<PropertyPerformanceDto> GetPropertyPerformanceAsync(Guid propertyId)
           {
               // Validate property exists
               var property = await _context.Properties.FindAsync(propertyId);
               if (property == null)
                   throw new Exception($"Property with ID {propertyId} not found");

               // Calculate purchase date and ownership duration
               var acquisitionDate = property.AcquisitionDate;
               var timespan = DateTime.UtcNow - acquisitionDate;
               var yearsOwned = timespan.TotalDays / 365.25;

               // Calculate value appreciation
               var appreciation = property.CurrentValue - property.AcquisitionPrice;
               var appreciationPercentage = property.AcquisitionPrice > 0 ? 
                   (appreciation / property.AcquisitionPrice) * 100 : 0;
               var annualizedAppreciation = yearsOwned > 0 ? 
                    (decimal)(Math.Pow((1 + (double)(appreciationPercentage / 100m)), (1 / (double)yearsOwned)) - 1) * 100 : 0;

               // Get all transactions for the property
               var transactions = await _context.Transactions
                   .Include(t => t.Category)
                   .Where(t => t.PropertyId == propertyId)
                   .ToListAsync();

               var incomeTransactions = transactions.Where(t => t.Type == TransactionType.Income).ToList();
               var expenseTransactions = transactions.Where(t => t.Type == TransactionType.Expense).ToList();
               var investmentTransactions = transactions.Where(t => t.Type == TransactionType.Investment).ToList();

               var totalIncome = incomeTransactions.Sum(t => t.Amount);
               var totalExpenses = expenseTransactions.Sum(t => t.Amount);
               var totalCashInvested = property.AcquisitionPrice + investmentTransactions.Sum(t => t.Amount);
               var netOperatingIncome = totalIncome - totalExpenses;

               // Calculate annual metrics
               var annualCashFlow = yearsOwned > 0 ? netOperatingIncome / (decimal)yearsOwned : 0m;
               var cashOnCashReturn = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0;
               var capRate = property.CurrentValue > 0 ? (netOperatingIncome / (decimal)yearsOwned) / property.CurrentValue * 100m : 0m;

               // Calculate total return
               var totalReturn = appreciation + netOperatingIncome;
               var totalReturnPercentage = totalCashInvested > 0 ? (totalReturn / totalCashInvested) * 100 : 0;
               var annualizedReturn = yearsOwned > 0 ? 
                    (decimal)(Math.Pow((1 + (double)(totalReturnPercentage / 100m)), (1 / (double)yearsOwned)) - 1) * 100 : 0;

               // Calculate expense ratio and occupancy rate
               var expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
               
               // Calculate occupancy rate (if units are available)
               var occupancyRate = 100.0m;
               var units = await _context.Units.Where(u => u.PropertyId == propertyId).ToListAsync();
               if (units.Any())
               {
                   occupancyRate = units.Count > 0 ? 
                       ((decimal)units.Count(u => u.IsOccupied) / units.Count) * 100 : 100;
               }

               return new PropertyPerformanceDto
               {
                   PropertyId = propertyId,
                   PropertyName = property.Name,
                   PurchasePrice = property.AcquisitionPrice,
                   CurrentValue = property.CurrentValue,
                   Appreciation = appreciation,
                   AppreciationPercentage = appreciationPercentage,
                   TotalCashInvested = totalCashInvested,
                   AnnualCashFlow = annualCashFlow,
                   CashOnCashReturn = cashOnCashReturn,
                   CapRate = capRate,
                   TotalReturn = totalReturn,
                   AnnualizedReturn = annualizedReturn,
                   ExpenseRatio = expenseRatio,
                   OccupancyRate = occupancyRate
               };
           }

           public async Task<IEnumerable<PropertyPerformanceDto>> GetPortfolioPerformanceAsync(Guid userId)
           {
               var properties = await _context.Properties
                   .Where(p => p.OwnerId == userId)
                   .ToListAsync();

               var performanceMetrics = new List<PropertyPerformanceDto>();

               foreach (var property in properties)
               {
                   var performance = await GetPropertyPerformanceAsync(property.Id);
                   performanceMetrics.Add(performance);
               }

               return performanceMetrics;
           }

           #region Helper Methods

           private async Task<List<MonthlyFinancialSummaryDto>> GetMonthlyCashFlowsAsync(Guid propertyId, DateTime startDate, DateTime endDate)
           {
               // Get all transactions for the property in the date range
               var transactions = await _context.Transactions
                   .Include(t => t.Category)
                   .Where(t => t.PropertyId == propertyId && t.Date >= startDate && t.Date <= endDate)
                   .ToListAsync();

               // Create a list of all months in the range
               var allMonths = new List<MonthlyFinancialSummaryDto>();
               var currentDate = startDate;
               while (currentDate <= endDate)
               {
                   allMonths.Add(new MonthlyFinancialSummaryDto
                   {
                       Year = currentDate.Year,
                       Month = currentDate.Month,
                       Income = 0,
                       Expenses = 0,
                       NetOperatingIncome = 0,
                       CashFlow = 0
                   });
                   currentDate = currentDate.AddMonths(1);
               }

               // Group transactions by month
               var transactionsByMonth = transactions
                   .GroupBy(t => new { t.Date.Year, t.Date.Month })
                   .Select(g => new
                   {
                       Year = g.Key.Year,
                       Month = g.Key.Month,
                       Income = g.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount),
                       Expenses = g.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount)
                   });

               // Update the months with transaction data
               foreach (var month in transactionsByMonth)
               {
                   var monthSummary = allMonths.FirstOrDefault(m => m.Year == month.Year && m.Month == month.Month);
                   if (monthSummary != null)
                   {
                       monthSummary.Income = month.Income;
                       monthSummary.Expenses = month.Expenses;
                       monthSummary.NetOperatingIncome = month.Income - month.Expenses;
                       
                       // For cash flow, we would subtract mortgage payments, but for simplicity, using NOI
                       monthSummary.CashFlow = monthSummary.NetOperatingIncome;
                   }
               }

               return allMonths.OrderBy(m => m.Year).ThenBy(m => m.Month).ToList();
           }

           private async Task UpdateAccountBalanceAsync(Guid accountId, TransactionType type, decimal amount)
           {
               var account = await _context.Accounts.FindAsync(accountId);
               if (account == null)
                   return;

               switch (type)
               {
                   case TransactionType.Income:
                       account.Balance += amount;
                       break;
                   case TransactionType.Expense:
                       account.Balance -= amount;
                       break;
                   case TransactionType.Investment:
                       account.Balance -= amount;
                       break;
                   case TransactionType.Transfer:
                       // Transfers should be handled separately with two transactions
                       break;
               }

               account.ModifiedDate = DateTime.UtcNow;
               await _context.SaveChangesAsync();
           }

           private TransactionType GetOppositeType(TransactionType type)
           {
               switch (type)
               {
                   case TransactionType.Income:
                       return TransactionType.Expense;
                   case TransactionType.Expense:
                       return TransactionType.Income;
                   case TransactionType.Investment:
                       return TransactionType.Income; // Approximate opposite
                   case TransactionType.Transfer:
                       return TransactionType.Transfer; // No clear opposite
                   default:
                       return type;
               }
           }

           #endregion
       }
   }