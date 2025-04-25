async function fetchRecipe() {
    const foodItem = document.getElementById('foodInput').value.trim();
    const recipeOutput = document.getElementById('recipeOutput');
  
    if (!foodItem) {
      alert('Please enter a food name!');
      return;
    }
  
    // Loading spinner
    recipeOutput.innerHTML = `
      <div class="flex justify-center items-center h-48">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    `;
  
    try {
      const res = await fetch('/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodItem })
      });
      const data = await res.json();
  
      const { recipe } = data;
  
      // Build the menu card
      recipeOutput.innerHTML = `
        <div class="bg-white/70 rounded-2xl shadow-lg p-8 space-y-6">
          <h3 class="text-3xl font-bold text-center">${recipe.dish}</h3>
  
          <div>
            <h4 class="text-2xl font-semibold mb-2">📝 Ingredients</h4>
            <ul class="list-disc list-inside space-y-1 text-lg">
              ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
          </div>
  
          <div>
            <h4 class="text-2xl font-semibold mb-2">👨‍🍳 Instructions</h4>
            <div class="space-y-2 text-lg">
             ${recipe.instructions.map((step, index) => `<p><strong>Step ${index + 1}:</strong> ${step}</p>`).join('')}
            </div>
          </div>
        </div>
      `;
    } catch (error) {
      console.error(error);
      recipeOutput.innerHTML = `<p class="text-red-600 text-center">❌ Failed to fetch recipe. Try again later.</p>`;
    }
  }
  


  async function fetchFinance() {
    const income = document.getElementById('incomeInput').value.trim();
    const spending = document.getElementById('spendingInput').value.trim();
    const financeOutput = document.getElementById('financeOutput');
  
    if (!income || !spending) {
      alert('Please enter both income and monthly spending.');
      return;
    }
  
    // Show loading spinner
    financeOutput.innerHTML = `
      <div class="flex justify-center items-center h-48">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    `;
  
    try {
      const res = await fetch('/budget-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          annualIncome: income,
          monthlySpending: spending
        })
      });
  
      const data = await res.json();

      console.log(data);
  
      if (data.advice) {
        const dailySpendingLimit = data.advice.dailySpendingLimit;
        const recommendedMonthlyInvestment = data.advice.recommendedMonthlyInvestment;
        const reason = data.advice.reason;
  
        financeOutput.innerHTML = `
          <div class="bg-white/70 rounded-2xl shadow-lg p-8 space-y-6 text-black">
            <h3 class="text-3xl font-bold text-center">💰 Financial Summary</h3>
            <p class="text-lg"><strong>📅 Daily Spending Limit:</strong> ${dailySpendingLimit}</p>
            <p class="text-lg"><strong>📈 Suggested Monthly Investment:</strong> ${recommendedMonthlyInvestment}</p>
            <p class="text-lg"><strong>💡 Reason:</strong> ${reason}</p>
          </div>
        `;
      } else {
        financeOutput.innerHTML = `<p class="text-red-600 text-center">❌ No data received. Try again.</p>`;
      }
    } catch (error) {
      console.error(error);
      financeOutput.innerHTML = `<p class="text-red-600 text-center">❌ Failed to fetch financial suggestion. Try again later.</p>`;
    }
  }
  