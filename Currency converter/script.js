const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const amount = document.getElementById("amount");
const resultDiv = document.getElementById("result");
const swapBtn = document.getElementById("swap");
const fromFlag = document.getElementById("from-flag");
const toFlag = document.getElementById("to-flag");

const currencyFlags = {
  "USD": "us", "EUR": "eu", "GBP": "gb", "INR": "in",
  "PKR": "pk", "TRY": "tr", "JPY": "jp", "CNY": "cn",
  "AUD": "au", "CAD": "ca"
};

// ✅ Load dropdowns manually (no API call needed)
function loadCurrencies() {
  const currencies = Object.keys(currencyFlags);

  currencies.forEach(currency => {
    let option1 = document.createElement("option");
    let option2 = document.createElement("option");

    option1.value = option2.value = currency;
    option1.text = currency;
    option2.text = currency;

    fromCurrency.add(option1);
    toCurrency.add(option2);
  });

  fromCurrency.value = "USD";
  toCurrency.value = "INR";
  updateFlag(fromCurrency, fromFlag);
  updateFlag(toCurrency, toFlag);
}

// ✅ Update flag images
function updateFlag(selectElement, flagElement) {
  const currencyCode = selectElement.value;
  if (currencyFlags[currencyCode]) {
    flagElement.src = `https://flagcdn.com/${currencyFlags[currencyCode]}.svg`;
  } else {
    flagElement.src = "https://flagcdn.com/un.svg"; 
  }
}

// ✅ Convert currency using backend
async function convertCurrency() {
  const from = fromCurrency.value;
  const to = toCurrency.value;
  const amt = amount.value;

  if (amt === "" || isNaN(amt)) {
    resultDiv.innerHTML = "Please enter a valid amount!";
    return;
  }

  try {
    const response = await fetch(`/api/convert?from=${from}&to=${to}&amount=${amt}`);
    const data = await response.json();

    if (data.rate) {
      const convertedAmount = (amt * data.rate).toFixed(2);
      resultDiv.innerHTML = `${amt} ${from} = ${convertedAmount} ${to}`;
    } else {
      resultDiv.innerHTML = "Error converting currency";
    }
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = "Error fetching data!";
  }
}

// ✅ Event listeners
document.getElementById("convert").addEventListener("click", convertCurrency);
fromCurrency.addEventListener("change", () => updateFlag(fromCurrency, fromFlag));
toCurrency.addEventListener("change", () => updateFlag(toCurrency, toFlag));
swapBtn.addEventListener("click", () => {
  let temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
  updateFlag(fromCurrency, fromFlag);
  updateFlag(toCurrency, toFlag);
  convertCurrency();
});

loadCurrencies();

