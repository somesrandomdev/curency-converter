// app/index.jsx
import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native';
import CurrencyPicker from '../components/CurrencyPicker';

export default function ConverterScreen() {
  // State for amount, currencies, rates, loading, and error
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('XOF');
  const [toCurrency, setToCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({});
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true for initial fetch
  const [error, setError] = useState('');

  // List of supported currencies
  const currencies = ['XOF', 'USD', 'EUR', 'GBP', 'JPY'];

  // Fetch exchange rates when component mounts or fromCurrency changes
  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const data = await response.json();
        if (response.ok) {
          setExchangeRates(data.rates);
        } else {
          setError('Failed to fetch exchange rates');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, [fromCurrency]);

  // Calculate converted amount when amount or currencies change
  useEffect(() => {
    if (amount && exchangeRates[toCurrency] && !isNaN(amount)) {
      const rate = exchangeRates[toCurrency];
      const result = (parseFloat(amount) * rate).toFixed(2);
      setConvertedAmount(result);
    } else {
      setConvertedAmount(null);
    }
  }, [amount, toCurrency, exchangeRates]);

  // Validate amount input (numbers only)
  const handleAmountChange = (text) => {
    if (/^\d*\.?\d*$/.test(text) || text === '') {
      setAmount(text);
    }
  };

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Currency Converter</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        value={amount}
        onChangeText={handleAmountChange}
        keyboardType="numeric"
      />
      <CurrencyPicker
        selectedValue={fromCurrency}
        onValueChange={setFromCurrency}
        currencies={currencies}
        label="From"
      />
      <CurrencyPicker
        selectedValue={toCurrency}
        onValueChange={setToCurrency}
        currencies={currencies}
        label="To"
      />
      <Button title="Swap Currencies" onPress={swapCurrencies} color="#007AFF" />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : convertedAmount ? (
        <View style={styles.resultContainer}>
          <Text style={styles.result}>
            {amount} {fromCurrency} = {convertedAmount} {toCurrency}
          </Text>
        </View>
      ) : (
        <Text style={styles.noResult}>Enter an amount to convert</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  loader: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  resultContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  result: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  noResult: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
});