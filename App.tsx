import React, {useState} from 'react';
import {View, StyleSheet, Dimensions, Platform, Text} from 'react-native';
import CalcButton from './app/components/CalcButton';

const {width} = Dimensions.get('screen');
const btnRatio = 4;
const btnGap = 5;
const paddingHorizontal = 5;
const btnWidth = (width - btnGap * btnRatio) / btnRatio - paddingHorizontal;

const buttons = ['7', '8', '9', '+', '4', '5', '6', '-', '1', '2', '3', '.'];

const evaluateExpression = (nums: string[]) => {
  const stack: number[] = [];
  let currentNumber = 0;
  let currentOperator = '+';

  for (let i = 0; i <= nums.length; i++) {
    const char = nums[i];

    // If the character is a number
    if (!isNaN(Number(char))) {
      // + - * / 1, 2, 3.4
      currentNumber = parseFloat(char); // "3.4" => 3.4
    }

    // If it's an operator or end of array
    if (isNaN(Number(char)) || i === nums.length) {
      switch (currentOperator) {
        case '+':
          stack.push(currentNumber);
          break;
        case '-':
          stack.push(-currentNumber);
          break;
        case '*':
          const multiplication = (stack.pop() || 1) * currentNumber;
          stack.push(multiplication);
          break;
        case '/':
          const division = (stack.pop() || 1) / currentNumber;
          stack.push(division);
          break;
      }

      currentOperator = char;
      currentNumber = 0;
    }
  }

  return stack.reduce((acc, currentValue) => (acc += currentValue), 0);
};

export default function App() {
  const [currentNums, setCurrentNums] = useState<string[]>([]);
  const [finalResult, setFinalResult] = useState(0);

  const resetCalculation = () => {
    setCurrentNums([]);
    setFinalResult(0);
  };

  const handleOnBtnPress = (value: string) => {
    const lastItem = currentNums[currentNums.length - 1] || '';
    const operators = ['+', '-', '/', '*'];

    // if we are adding multiple operators we are going to replace it
    if (operators.includes(lastItem) && operators.includes(value)) {
      currentNums.pop();
      return setCurrentNums([...currentNums, value]);
    }

    // if we have . and then we are pressing the operators we will add 0 after that .
    if (lastItem.endsWith('.') && operators.includes(value)) {
      return setCurrentNums([
        ...currentNums.slice(0, -1),
        lastItem + '0',
        value,
      ]);
    }

    if (value === '.') {
      // If the last item already has a decimal, ignore this input
      if (lastItem && lastItem.includes('.')) {
        return;
      }

      // If the last item is an operator or the array is empty, start with "0."
      if (!lastItem || isNaN(Number(lastItem))) {
        setCurrentNums([...currentNums, '0.']);
        return;
      }

      // Otherwise, add the decimal to the last number
      setCurrentNums([...currentNums.slice(0, -1), lastItem + '.']);
      return;
    }

    if (!isNaN(Number(value))) {
      // If the last item is a number, append the value to it
      if (lastItem && !isNaN(Number(lastItem))) {
        setCurrentNums([...currentNums.slice(0, -1), lastItem + value]);
      } else {
        // Otherwise, start a new number
        setCurrentNums([...currentNums, value]);
      }
    } else {
      // If it's an operator, add it directly
      setCurrentNums([...currentNums, value]);
    }
  };

  const handleOnLastItemRemove = () => {
    const oldItems = [...currentNums];
    oldItems.pop();
    setCurrentNums([...oldItems]);
  };

  return (
    <View style={styles.container}>
      {/* Result Area */}
      <View style={styles.resultsContainer}>
        {/* Calculation */}
        <Text style={styles.calculation}>{currentNums.join('')}</Text>

        {/* Calculated Result */}
        <Text style={styles.result}>{finalResult}</Text>
      </View>

      {/* Buttons Area */}
      <View style={styles.buttonsContainer}>
        <CalcButton
          title="AC"
          style={styles.calcBtn}
          onPress={resetCalculation}
        />
        <CalcButton
          onPress={() => handleOnBtnPress('*')}
          title="*"
          style={styles.calcBtn}
        />
        <CalcButton
          onPress={() => handleOnBtnPress('/')}
          title="/"
          style={styles.calcBtn}
        />
        <CalcButton
          onPress={handleOnLastItemRemove}
          title="DEL"
          style={styles.calcBtn}
        />

        {buttons.map(btn => {
          return (
            <CalcButton
              onPress={() => handleOnBtnPress(btn)}
              key={btn}
              title={btn}
              style={styles.calcBtn}
            />
          );
        })}

        <CalcButton
          onPress={() => handleOnBtnPress('0')}
          title="0"
          style={[styles.calcBtn, styles.zero]}
        />
        <CalcButton
          onPress={() => {
            const finalResult = evaluateExpression(currentNums);
            setFinalResult(finalResult);
          }}
          title="="
          style={styles.calcBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 30 : 0,
    // flexDirection: 'row',
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-end',
  },
  resultsContainer: {
    // flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 10,
    // backgroundColor: 'lightpink',
  },
  result: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'black',
    fontFamily: 'Orbitron',
  },
  calculation: {
    fontWeight: '700',
    fontSize: 25,
    color: 'black',
    opacity: 0.5,
    fontFamily: 'Orbitron',
  },
  buttonsContainer: {
    // flex: 4,
    // backgroundColor: 'lightblue',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: btnGap,
    paddingHorizontal,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'flex-end',
    paddingBottom: 10,
  },
  calcBtn: {
    width: btnWidth,
    height: 80,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 7,
  },
  zero: {
    width: btnWidth * 3 + paddingHorizontal + btnGap,
  },
});
