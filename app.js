const BASE_URL = "https://api.exchangerate-api.com/v4/latest";

// Select DOM elements
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapIcon = document.querySelector("#swap-icon"); // Swap icon element

// Populate the dropdowns with currency options
for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to update the exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // Fetch exchange rates for the "from" currency
  const URL = `${BASE_URL}/${fromCurr.value}`;
  
  try {
    let response = await fetch(URL);
    if (!response.ok) throw new Error("Failed to fetch data");
    
    let data = await response.json();
    
    // Get the exchange rate for the "to" currency
    let rate = data.rates[toCurr.value];
    let finalAmount = amtVal * rate;
    
    // Update message with the conversion result
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    
  } catch (error) {
    msg.innerText = "Error fetching exchange rate. Please try again.";
    console.error(error);
  }
};

// Function to update the flag based on the selected currency
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Swap feature logic
const swapCurrencies = () => {
  // Swap the values of the "From" and "To" dropdowns
  let tempCurrency = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = tempCurrency;
  
  // Update the flags for both dropdowns
  updateFlag(fromCurr);
  updateFlag(toCurr);

  // Update the exchange rate after the swap
  updateExchangeRate();
};

// Event listeners
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

swapIcon.addEventListener("click", (evt) => {
  evt.preventDefault();
  swapCurrencies(); // Call the swap function when the icon is clicked
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
