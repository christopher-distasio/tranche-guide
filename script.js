let state = { accountType: null, level: null };

function setAccountType(type) {
  state.accountType = type;
  const levelSection = document.getElementById('level-section');
  const unsureMsg = document.getElementById('unsure-message');
  
  if (type === 'unsure') {
    levelSection.style.display = 'none';
    unsureMsg.style.display = 'block';
  } else {
    levelSection.style.display = 'block';
    unsureMsg.style.display = 'none';
  }
}

function setLevel(level) {
  state.level = level;
  const beginnerQ = document.getElementById('beginner-questions');
  const experiencedQ = document.getElementById('experienced-questions');
  
  if (level === 'beginner') {
    beginnerQ.style.display = 'block';
    experiencedQ.style.display = 'none';
  } else {
    beginnerQ.style.display = 'none';
    experiencedQ.style.display = 'block';
  }
}

function updateStockCount() {
  const count = parseInt(document.getElementById('stock-count').value) || 0;
  const guidance = document.getElementById('stock-count-guidance');
  let message = '';
  
  if (count === 0) {
    message = 'You\'re starting from scratch. For this calculator, assume you\'re building your first position.';
  } else if (count === 1) {
    message = 'You\'re in the building phase. Adding 1–2 more quality ideas is smart.';
  } else if (count === 2 || count === 3) {
    message = 'Good foundation. Make sure you understand each thesis deeply.';
  } else if (count >= 5) {
    message = 'You\'re managing a diversified portfolio. Before adding more, can you track all of these equally well?';
  }
  
  guidance.innerHTML = `<p>${message}</p>`;
  updateCalc();
}

function updateCalc() {
  if (state.level === 'beginner') {
    calcBeginner();
  } else if (state.level === 'experienced') {
    calcExperienced();
  }
}

function calcBeginner() {
  const available = parseFloat(document.getElementById('available-money').value) || 0;
  const dip = parseFloat(document.getElementById('dip-percent-beginner').value) || 0;
  const max = parseFloat(document.getElementById('max-position-beginner').value) || 0;
  const posType = document.querySelector('input[name="position-type"]:checked')?.value;
  
  if (available <= 0 || dip <= 0 || max <= 0 || !posType) return;
  
  const tranche = Math.min((dip / 100) * available, 0.20 * max);
  const resultCard = document.getElementById('result-card');
  const resultText = document.getElementById('result-text');
  const resultDetail = document.getElementById('result-detail');
  
  resultCard.style.display = 'block';
  resultText.textContent = `Add $${Math.round(tranche)}`;
  resultText.className = 'result-verdict success';
  resultDetail.textContent = `${dip}% dip × $${Math.round(available)} available = $${Math.round(tranche)}`;
}

function calcExperienced() {
  const cost = parseFloat(document.getElementById('cost-basis-exp').value) || 0;
  const dip = parseFloat(document.getElementById('dip-percent-exp').value) || 0;
  const dry = parseFloat(document.getElementById('dry-powder-exp').value) || 0;
  const max = parseFloat(document.getElementById('max-position-exp').value) || 0;
  
  if (cost <= 0 || dip <= 0 || dry <= 0 || max <= 0) return;
  
  const tranche = Math.min((dip / 100) * cost, 0.20 * cost);
  const afterCost = cost + tranche;
  const resultCard = document.getElementById('result-card');
  const resultText = document.getElementById('result-text');
  const resultDetail = document.getElementById('result-detail');
  
  resultCard.style.display = 'block';
  
  // Check for exceptions
  const anyException = Object.values(state.exceptions).some(v => v);
  
  if (afterCost > max) {
    resultText.textContent = 'Skip this dip';
    resultText.className = 'result-verdict danger';
    resultDetail.textContent = `Position would hit $${Math.round(afterCost)} (above $${Math.round(max)} max)`;
  } else {
    if (anyException) {
      resultText.textContent = `Add $${Math.round(tranche)} (review exceptions)`;
      resultText.className = 'result-verdict warning';
      resultDetail.textContent = `One or more exceptions triggered. Review before executing.`;
    } else {
      resultText.textContent = `Add $${Math.round(tranche)}`;
      resultText.className = 'result-verdict success';
      resultDetail.textContent = `${dip}% dip × $${Math.round(cost)} = $${Math.round(tranche)}`;
    }
  }
}

// TOGGLE EXCEPTION
function toggleException(num) {
  state.exceptions[num] = !state.exceptions[num];
  const btn = document.querySelector(`button[onclick="toggleException(${num})"]`);
  
  if (btn) {
    if (state.exceptions[num]) {
      btn.textContent = 'Yes';
      btn.classList.add('yes');
    } else {
      btn.textContent = 'No';
      btn.classList.remove('yes');
    }
  }
  
  calcExperienced();
}

// START CALCULATOR BUTTON
function startCalculator() {
  const calcSection = document.getElementById('calculator');
  const calcContent = document.getElementById('calculator-content');
  if (calcContent) {
    calcContent.style.display = 'block';
  }
  if (calcSection) {
    setTimeout(() => calcSection.scrollIntoView({ behavior: 'smooth' }), 100);
  }
}

// RESET BEGINNER
function resetBeginner() {
  document.getElementById('stock-name').value = '';
  document.getElementById('stock-count').value = '';
  document.getElementById('available-money').value = '';
  document.getElementById('dip-percent-beginner').value = '';
  document.getElementById('max-position-beginner').value = '';
  document.querySelector('input[name="position-type"]').checked = false;
  document.getElementById('stock-count-guidance').innerHTML = '';
  document.getElementById('result-card').style.display = 'none';
  updateCalc();
}

// RESET EXPERIENCED
function resetExperienced() {
  document.getElementById('stock-name-exp').value = '';
  document.getElementById('cost-basis-exp').value = '';
  document.getElementById('dip-percent-exp').value = '';
  document.getElementById('dry-powder-exp').value = '';
  document.getElementById('max-position-exp').value = '';
  
  // Reset all exception buttons
  for (let i = 1; i <= 6; i++) {
    state.exceptions[i] = false;
    const btn = document.querySelector(`button[onclick="toggleException(${i})"]`);
    if (btn) {
      btn.textContent = 'No';
      btn.classList.remove('yes');
    }
  }
  
  document.getElementById('result-card').style.display = 'none';
  updateCalc();
}
