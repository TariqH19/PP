import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Target,
  TrendingUp,
  Euro,
  Calendar,
  PiggyBank,
  AlertCircle,
  CheckCircle,
  CreditCard,
  TrendingDown,
  Calculator,
  Bell,
  Moon,
  Sun,
} from "lucide-react";

const FinanceApp = () => {
  const [currentStep, setCurrentStep] = useState("dashboard");
  const [userProfile, setUserProfile] = useState({
    name: "",
    salary: "",
    payFrequency: "monthly",
    outgoings: [],
    currentSavings: "",
    isOnboarded: false,
  });
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [debts, setDebts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("financeAppData")) || {};
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedData.userProfile) setUserProfile(savedData.userProfile);
    if (savedData.savingsGoals) setSavingsGoals(savedData.savingsGoals);
    if (savedData.transactions) setTransactions(savedData.transactions);
    if (savedData.budgets) setBudgets(savedData.budgets);
    if (savedData.debts) setDebts(savedData.debts);
    if (!savedData.userProfile?.isOnboarded) setShowOnboarding(true);

    setDarkMode(prefersDark);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(
      "financeAppData",
      JSON.stringify({
        userProfile,
        savingsGoals,
        transactions,
        budgets,
        debts,
      })
    );
  }, [userProfile, savingsGoals, transactions, budgets, debts]);

  const handleOnboardingComplete = (profileData) => {
    setUserProfile({ ...profileData, isOnboarded: true });
    setShowOnboarding(false);
  };

  const addSavingsGoal = (goal) => {
    setSavingsGoals([...savingsGoals, { ...goal, id: Date.now() }]);
  };

  const addTransaction = (transaction) => {
    if (!transaction.amount || !transaction.category) return;
    setTransactions([
      ...transactions,
      { ...transaction, id: Date.now(), date: new Date().toISOString() },
    ]);
  };

  const addBudget = (budget) => {
    setBudgets([...budgets, { ...budget, id: Date.now() }]);
  };

  const addDebt = (debt) => {
    setDebts([...debts, { ...debt, id: Date.now() }]);
  };

  const calculateMonthlySavingsNeeded = (targetAmount, timeframe) => {
    const parsedTimeframe = parseInt(timeframe) || 12;
    const result = (parseFloat(targetAmount) / parsedTimeframe).toFixed(2);
    return isNaN(result) ? "0.00" : result;
  };

  const calculateMonthlyIncome = () => {
    const salary = parseFloat(userProfile.salary) || 0;
    switch (userProfile.payFrequency) {
      case "weekly":
        return salary * 4.33;
      case "biweekly":
        return salary * 2.17;
      case "monthly":
        return salary;
      case "annually":
        return salary / 12;
      default:
        return salary;
    }
  };

  const calculateTotalOutgoings = () => {
    return userProfile.outgoings.reduce(
      (total, outgoing) => total + (parseFloat(outgoing.amount) || 0),
      0
    );
  };

  const calculateTotalDebts = () => {
    return debts.reduce(
      (total, debt) => total + (parseFloat(debt.amount) || 0),
      0
    );
  };

  const calculateMonthlyDebtPayments = () => {
    return debts.reduce(
      (total, debt) => total + (parseFloat(debt.monthlyPayment) || 0),
      0
    );
  };

  const getSpendingByCategory = () => {
    const categorySpending = {};
    transactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        categorySpending[transaction.category] =
          (categorySpending[transaction.category] || 0) +
          (parseFloat(transaction.amount) || 0);
      }
    });
    return categorySpending;
  };

  const getBudgetStatus = () => {
    return budgets.map((budget) => {
      const spent = transactions
        .filter((t) => t.category === budget.category && t.type === "expense")
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
      const remaining = parseFloat(budget.amount) - spent;
      const percentage = (spent / parseFloat(budget.amount)) * 100 || 0;
      return {
        ...budget,
        spent,
        remaining,
        percentage,
      };
    });
  };

  const calculateDisposableIncome = () => {
    return (
      calculateMonthlyIncome() -
      calculateTotalOutgoings() -
      calculateMonthlyDebtPayments()
    );
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);

  const OnboardingFlow = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
      name: "",
      salary: "",
      payFrequency: "monthly",
      outgoings: [],
      currentSavings: "",
    });

    const addOutgoing = () => {
      setFormData({
        ...formData,
        outgoings: [
          ...formData.outgoings,
          { name: "", amount: "", category: "other" },
        ],
      });
    };

    const updateOutgoing = (index, field, value) => {
      const newOutgoings = [...formData.outgoings];
      newOutgoings[index][field] = value;
      setFormData({ ...formData, outgoings: newOutgoings });
    };

    const completeOnboarding = () => {
      handleOnboardingComplete(formData);
    };

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Get Started</h2>
            <span className="text-sm text-gray-500">Step {step} of 4</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              Welcome! Let's start with your name
            </h3>
            <input
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => formData.name && setStep(2)}
              disabled={!formData.name}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Tell us about your income</h3>
            <div className="space-y-3">
              <input
                type="number"
                placeholder="Your salary/wage amount (€)"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={formData.payFrequency}
                onChange={(e) =>
                  setFormData({ ...formData, payFrequency: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400">
                Back
              </button>
              <button
                onClick={() => formData.salary && setStep(3)}
                disabled={!formData.salary}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              Add your monthly outgoings
            </h3>
            <div className="space-y-3">
              {formData.outgoings.map((outgoing, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Expense name"
                    value={outgoing.name}
                    onChange={(e) =>
                      updateOutgoing(index, "name", e.target.value)
                    }
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={outgoing.amount}
                    onChange={(e) =>
                      updateOutgoing(index, "amount", e.target.value)
                    }
                    className="w-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={outgoing.category}
                    onChange={(e) =>
                      updateOutgoing(index, "category", e.target.value)
                    }
                    className="w-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="housing">Housing</option>
                    <option value="transport">Transport</option>
                    <option value="food">Food</option>
                    <option value="utilities">Utilities</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              ))}
              <button
                onClick={addOutgoing}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 text-gray-600 hover:border-blue-400 hover:text-blue-600">
                <PlusCircle className="inline mr-2" size={20} /> Add Expense
              </button>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400">
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              Current savings (optional)
            </h3>
            <input
              type="number"
              placeholder="How much do you currently have saved? (€)"
              value={formData.currentSavings}
              onChange={(e) =>
                setFormData({ ...formData, currentSavings: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400">
                Back
              </button>
              <button
                onClick={completeOnboarding}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">
                Complete Setup
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const Dashboard = () => {
    const monthlyIncome = calculateMonthlyIncome();
    const totalOutgoings = calculateTotalOutgoings();
    const disposableIncome = calculateDisposableIncome();
    const totalDebts = calculateTotalDebts();
    const monthlyDebtPayments = calculateMonthlyDebtPayments();
    const savingsRate =
      monthlyIncome > 0
        ? ((disposableIncome / monthlyIncome) * 100).toFixed(1)
        : 0;
    const budgetStatus = getBudgetStatus();
    const recentTransactions = transactions.slice(-5).reverse();

    return (
      <div className={`space-y-6 ${darkMode ? "bg-gray-900 text-white" : ""}`}>
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-lg dark:bg-gray-800">
          {["dashboard", "transactions", "budgets", "debts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentStep(tab)}
              className={`py-2 px-4 rounded-md text-sm font-medium ${
                currentStep === tab
                  ? "bg-white text-blue-600 shadow-sm dark:bg-gray-700"
                  : "text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
              }`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <FinancialCard
            title="Monthly Income"
            value={monthlyIncome}
            icon={<Euro />}
            color="blue"
            darkMode={darkMode}
          />
          <FinancialCard
            title="Monthly Outgoings"
            value={totalOutgoings}
            icon={<TrendingDown />}
            color="red"
            darkMode={darkMode}
          />
          <FinancialCard
            title="Disposable Income"
            value={disposableIncome}
            icon={<PiggyBank />}
            color="green"
            darkMode={darkMode}
          />
          <FinancialCard
            title="Savings Rate"
            value={`${savingsRate}%`}
            icon={<Target />}
            color="purple"
            darkMode={darkMode}
          />
          <FinancialCard
            title="Total Debts"
            value={totalDebts}
            icon={<CreditCard />}
            color="orange"
            darkMode={darkMode}
          />
        </div>

        {/* Recent Transactions */}
        <div
          className={`p-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <button
              onClick={() => setCurrentStep("add-transaction")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
              <PlusCircle size={16} className="mr-2" />
              Add Transaction
            </button>
          </div>
          {recentTransactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No transactions yet. Add one to get started!
            </p>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === "income"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}>
                      {transaction.type === "income" ? (
                        <TrendingUp size={16} />
                      ) : (
                        <TrendingDown size={16} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {transaction.category}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-semibold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}>
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Budget Overview */}
        {budgets.length > 0 && (
          <div
            className={`p-6 rounded-lg shadow-md ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}>
            <h3 className="text-lg font-semibold mb-4">Budget Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgetStatus.map((budget) => (
                <div
                  key={budget.id}
                  className={`border ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  } rounded-lg p-4`}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium capitalize">
                      {budget.category}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {formatCurrency(budget.amount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full ${
                        budget.percentage > 100
                          ? "bg-red-500"
                          : budget.percentage > 80
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min(budget.percentage, 100)}%`,
                      }}></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(budget.spent)} spent •{" "}
                    {formatCurrency(budget.remaining)} remaining
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Savings Goals */}
        <div
          className={`p-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Savings Goals</h3>
            <button
              onClick={() => setCurrentStep("add-goal")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              <PlusCircle size={16} className="mr-2" />
              Add Goal
            </button>
          </div>
          {savingsGoals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No savings goals yet. Add one to get started!
            </p>
          ) : (
            <div className="space-y-4">
              {savingsGoals.map((goal) => {
                const monthlyNeeded = calculateMonthlySavingsNeeded(
                  goal.targetAmount,
                  goal.timeframe
                );
                const isAffordable = monthlyNeeded <= disposableIncome;
                return (
                  <div
                    key={goal.id}
                    className={`border ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    } rounded-lg p-4`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{goal.name}</h4>
                        <p
                          className={`${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}>
                          {formatCurrency(goal.targetAmount)} goal
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Monthly needed:</p>
                        <p
                          className={`font-bold ${
                            isAffordable ? "text-green-600" : "text-red-600"
                          }`}>
                          {formatCurrency(monthlyNeeded)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      {isAffordable ? (
                        <CheckCircle
                          className="text-green-600 mr-2"
                          size={16}
                        />
                      ) : (
                        <AlertCircle className="text-red-600 mr-2" size={16} />
                      )}
                      <span
                        className={`text-sm ${
                          isAffordable ? "text-green-600" : "text-red-600"
                        }`}>
                        {isAffordable
                          ? "Achievable with current income"
                          : "Exceeds disposable income"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const FinancialCard = ({ title, value, icon, color, darkMode }) => {
    const bgColorMap = {
      blue: darkMode ? "bg-blue-900" : "bg-blue-50",
      red: darkMode ? "bg-red-900" : "bg-red-50",
      green: darkMode ? "bg-green-900" : "bg-green-50",
      purple: darkMode ? "bg-purple-900" : "bg-purple-50",
      orange: darkMode ? "bg-orange-900" : "bg-orange-50",
    };

    const textColorMap = {
      blue: darkMode ? "text-blue-300" : "text-blue-800",
      red: darkMode ? "text-red-300" : "text-red-800",
      green: darkMode ? "text-green-300" : "text-green-800",
      purple: darkMode ? "text-purple-300" : "text-purple-800",
      orange: darkMode ? "text-orange-300" : "text-orange-800",
    };

    const iconColorMap = {
      blue: darkMode ? "text-blue-400" : "text-blue-600",
      red: darkMode ? "text-red-400" : "text-red-600",
      green: darkMode ? "text-green-400" : "text-green-600",
      purple: darkMode ? "text-purple-400" : "text-purple-600",
      orange: darkMode ? "text-orange-400" : "text-orange-600",
    };

    return (
      <div
        className={`p-4 rounded-lg border ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm font-medium ${
                darkMode ? `${iconColorMap[color]}` : `${iconColorMap[color]}`
              }`}>
              {title}
            </p>
            <p className={`text-2xl font-bold ${textColorMap[color]}`}>
              {typeof value === "number" ? formatCurrency(value) : value}
            </p>
          </div>
          <div className={iconColorMap[color]}>{icon}</div>
        </div>
      </div>
    );
  };

  const AddGoalForm = () => {
    const [goalData, setGoalData] = useState({
      name: "",
      targetAmount: "",
      timeframe: "12",
      priority: "medium",
    });

    const handleSubmit = () => {
      addSavingsGoal(goalData);
      setCurrentStep("dashboard");
    };

    return (
      <div
        className={`max-w-md mx-auto p-6 rounded-lg shadow-md ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}>
        <h2 className="text-xl font-bold mb-4">Add Savings Goal</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Goal Name
            </label>
            <input
              type="text"
              required
              value={goalData.name}
              onChange={(e) =>
                setGoalData({ ...goalData, name: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Emergency Fund, Vacation, New Car"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Amount (€)
            </label>
            <input
              type="number"
              required
              value={goalData.targetAmount}
              onChange={(e) =>
                setGoalData({ ...goalData, targetAmount: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="5000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timeframe
            </label>
            <select
              value={goalData.timeframe}
              onChange={(e) =>
                setGoalData({ ...goalData, timeframe: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="12">1 year</option>
              <option value="24">2 years</option>
              <option value="36">3 years</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={goalData.priority}
              onChange={(e) =>
                setGoalData({ ...goalData, priority: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setCurrentStep("dashboard")}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
              Add Goal
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AppLayout = () => {
    return (
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-50"
        }`}>
        {/* Header */}
        <div
          className={`shadow-sm border-b ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
          }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <PiggyBank
                  className={darkMode ? "text-blue-400" : "text-blue-600"}
                  size={32}
                />
                <h1
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}>
                  FinanceTracker
                </h1>
              </div>
              {userProfile.isOnboarded && (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Welcome back, {userProfile.name}!
                  </span>
                  <button
                    onClick={() => setShowOnboarding(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm">
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {showOnboarding ? (
            <OnboardingFlow />
          ) : currentStep === "dashboard" ? (
            <Dashboard />
          ) : currentStep === "add-goal" ? (
            <AddGoalForm />
          ) : null}
        </div>
      </div>
    );
  };

  return <AppLayout />;
};

export default FinanceApp;
