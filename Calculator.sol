// SPDX-License-Identifier: MIT
// compiler version must be greater than or equal to 0.8.26 and less than 0.9.0
pragma solidity ^0.8.26;

contract Calculator {
    int public initialNumber = 14;
    int public lastResult;  

    function add(int _number1, int _number2) public returns (int) {
        lastResult = _number1 + _number2;
        return lastResult;
    }

    function subtract(int _number1, int _number2) public returns (int) {
        lastResult = _number1 - _number2;
        return lastResult;
    }

    function multiply(int _number1, int _number2) public returns (int) {
        lastResult = _number1 * _number2;
        return lastResult;
    }

    function divide(int _number1, int _number2) public returns (int) {
        require(_number2 != 0, "No >:(");
        lastResult = _number1 / _number2;
        return lastResult;
    }

    function power(int _number1, int _number2) public returns (int) {
        int result = _number1;
        for (int i = 1; i < _number2; i++) {
            result = result * _number1;
        }
        lastResult = result;
        return lastResult;
    }

    function root(int _number1, int _number2) public returns (int) {
        require(_number1 >= 0 && _number2 > 1, "No >:(");

        if (_number1 == 0) return 0;
        if (_number1 == 1) return 1;

        int low = 0;
        int high = _number1;
        int result = 0;

        while (low <= high) {
            int mid = (low + high) / 2;
            int midToPower = power(mid, _number2);

            if (midToPower == _number1) {
                lastResult = mid;
                return lastResult;
            } else if (midToPower < _number1) {
                result = mid;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        lastResult = result;
        return lastResult;
    }

    function modulo(int _number1, int _number2) public returns (int) {
        require(_number2 != 0, "No >:(");
        lastResult = _number1 % _number2;
        return lastResult;
    }

    function factorial(int _number1) public returns (int) {
        require(_number1 >= 0, "No >:(");

        int result = 1;
        for (int i = 1; i <= _number1; i++) {
            result = i * result;
        }
        lastResult = result;
        return lastResult;
    }

    function clear() public {
        lastResult = 0;
    }
}
