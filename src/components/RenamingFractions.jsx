import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const RenamingFractions = () => {
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [gcdSteps, setGcdSteps] = useState([]);
  const [currentGcdStepIndex, setCurrentGcdStepIndex] = useState(-1);
  const [showAllGcdSteps, setShowAllGcdSteps] = useState(false);
  const [warning, setWarning] = useState('');
  const [gcdInputs, setGcdInputs] = useState({});
  const [gcdInputErrors, setGcdInputErrors] = useState({});
  const [isNextStepLocked, setIsNextStepLocked] = useState(false);

  const validateInput = (num, den) => {
    return !isNaN(num) && !isNaN(den) && 
           Number.isInteger(num) && Number.isInteger(den) && 
           den !== 0 && num > 0 && den > 0 &&
           num <= 100 && den <= 100;
  };

  const gcdWithSteps = (a, b) => {
    const steps = [];
    let x = Math.abs(a);
    let y = Math.abs(b);
    
    while (y !== 0) {
      steps.push({
        x: x,
        y: y,
        quotient: Math.floor(x / y),
        remainder: x % y
      });
      [x, y] = [y, x % y];
    }
    
    return { gcd: x, steps: steps };
  };

  const handleSimplify = () => {
    const num = parseInt(numerator);
    const den = parseInt(denominator);
    
    if (!validateInput(num, den)) {
      setWarning('Please enter valid positive integers for both numerator and denominator between 1 and 100. Denominator cannot be zero.');
      setSteps([]);
      setCurrentStepIndex(0);
      setGcdInputErrors({});
      return;
    }

    setWarning('');
    setGcdInputs({});
    setGcdInputErrors({});
    const { gcd, steps: gcdCalcSteps } = gcdWithSteps(num, den);
    const simplifiedNum = num / gcd;
    const simplifiedDen = den / gcd;

    setSteps([
      `Step 1: Start with the fraction ${num}/${den}`,
      'Step 2: Find the Greatest Common Divisor (GCD)\nusing the division method:',
      `Step 3: Divide both the numerator and denominator by the GCD (${gcd})`,
      `Step 4: Write the simplified fraction:\n${simplifiedNum}/${simplifiedDen}`
    ]);
    
    setGcdSteps(gcdCalcSteps);
    setShowAllGcdSteps(false);
    setCurrentStepIndex(0);
    setCurrentGcdStepIndex(-1);
  };

  const handleGcdCheck = () => {
    if (currentGcdStepIndex >= gcdSteps.length - 1) return;

    const step = gcdSteps[currentGcdStepIndex + 1];
    const stepKey = `step${currentGcdStepIndex + 1}`;
    const userQuotient = gcdInputs[stepKey]?.quotient === '' ? null : parseInt(gcdInputs[stepKey]?.quotient);
    const userRemainder = gcdInputs[stepKey]?.remainder === '' ? null : parseInt(gcdInputs[stepKey]?.remainder);

    const errors = {
      quotient: userQuotient === null || userQuotient !== step.quotient,
      remainder: userRemainder === null || userRemainder !== step.remainder
    };
    
    setGcdInputErrors(prev => ({
      ...prev,
      [stepKey]: errors
    }));

    if (!errors.quotient && !errors.remainder) {
      setCurrentGcdStepIndex(prev => prev + 1);
      setGcdInputs(prev => ({
        ...prev,
        [`step${currentGcdStepIndex + 2}`]: { quotient: '', remainder: '' }
      }));

      if (currentGcdStepIndex + 1 === gcdSteps.length - 1) {
        setShowAllGcdSteps(true);
        setIsNextStepLocked(false);
      }
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1 && !isNextStepLocked) {
      setGcdInputErrors({});
      if (currentStepIndex === 1 && !showAllGcdSteps) {
        setShowAllGcdSteps(true);
      } else {
        setCurrentStepIndex(prev => prev + 1);
      }
    }
  };

  const generateRandomFraction = () => {
    setNumerator(Math.floor(Math.random() * 100) + 1);
    setDenominator(Math.floor(Math.random() * 100) + 1);
    setWarning('');
  };

  return (
    <div className="bg-gray-100 p-8 w-[780px] overflow-auto">
      <Card className="w-[748px] mx-auto shadow-md bg-white">
        <div className="bg-sky-50 p-6 rounded-t-lg w-[748px]">
          <h1 className="text-sky-900 text-2xl font-bold w-full">Fraction Simplifier</h1>
          <p className="text-sky-800 w-full">Simplify fractions to their lowest terms!</p>
        </div>

        <CardContent className="space-y-6 pt-6 w-[748px]">
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h2 className="text-blue-900 font-bold mb-2">Fraction Simplification Basics</h2>
            <p className="text-blue-600 mb-2">
              Simplifying a fraction (also known as renaming) means reducing it to its lowest terms by dividing both
              the numerator and denominator by their greatest common divisor (GCD).
            </p>
            <p className="text-blue-800 font-bold text-center my-4">
              Simplified Fraction = Numerator ÷ GCD / Denominator ÷ GCD
            </p>
            <p className="text-blue-600">
              We use the division method to find the GCD efficiently. This process
              doesn't change the value of the fraction but makes it simpler to understand
              and work with.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-gray-700 text-lg font-bold">Fraction to simplify:</h3>
            <div className="flex gap-2">
              <Input
                type="number"
                value={numerator}
                onChange={(e) => setNumerator(e.target.value)}
                placeholder="Numerator"
                className="border border-blue-300 rounded w-full"
                max="100"
              />
              <Input
                type="number"
                value={denominator}
                onChange={(e) => setDenominator(e.target.value)}
                placeholder="Denominator"
                className="border border-blue-300 rounded w-full"
                max="100"
              />
              <Button
                onClick={generateRandomFraction}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4"
              >
                🔄 Random
              </Button>
            </div>

            {warning && (
              <p className="text-red-600">{warning}</p>
            )}

            <Button
              onClick={handleSimplify}
              className="w-full bg-blue-950 hover:bg-blue-900 text-white py-3"
            >
              Simplify Fraction
            </Button>
          </div>

          {steps.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-purple-600 text-xl font-bold">Simplification Steps:</h3>
              
              {steps.slice(0, currentStepIndex + 1).map((step, index) => (
                <div key={index} className="bg-purple-50 p-4 rounded-lg">
                  <p className="whitespace-pre-line">{step}</p>
                  
                  {index === 1 && (
                    <div className="font-mono mt-2">
                      {showAllGcdSteps ? (
                        gcdSteps.map((gcdStep, i) => (
                          <p key={i} className="text-sm">
                            {gcdStep.x} ÷ {gcdStep.y} = {gcdStep.quotient} R {gcdStep.remainder}
                          </p>
                        ))
                      ) : (
                        <>
                          {gcdSteps.slice(0, currentGcdStepIndex + 1).map((gcdStep, i) => (
                            <p key={i} className="text-sm">
                              {gcdStep.x} ÷ {gcdStep.y} = {gcdStep.quotient} R {gcdStep.remainder}
                            </p>
                          ))}
                          {currentGcdStepIndex < gcdSteps.length - 1 && (
                            <div className="flex items-center space-x-1 mt-2">
                              <span className="text-sm">
                                {gcdSteps[currentGcdStepIndex + 1].x} ÷ {gcdSteps[currentGcdStepIndex + 1].y} =
                              </span>
                              <Input
                                type="number"
                                value={gcdInputs[`step${currentGcdStepIndex + 1}`]?.quotient || ''}
                                onChange={(e) => {
                                  const stepKey = `step${currentGcdStepIndex + 1}`;
                                  setGcdInputs(prev => ({
                                    ...prev,
                                    [stepKey]: { ...prev[stepKey], quotient: e.target.value }
                                  }));
                                  setGcdInputErrors(prev => ({
                                    ...prev,
                                    [stepKey]: { ...prev[stepKey], quotient: false }
                                  }));
                                }}
                                placeholder="Quotient"
                                style={{ width: '110px' }}
                                className={`text-xs px-1 ${
                                  gcdInputErrors[`step${currentGcdStepIndex + 1}`]?.quotient
                                    ? 'border-red-500 border-2'
                                    : 'border-blue-300'
                                }`}
                              />
                              <span className="text-sm">R</span>
                              <Input
                                type="number"
                                value={gcdInputs[`step${currentGcdStepIndex + 1}`]?.remainder || ''}
                                onChange={(e) => {
                                  const stepKey = `step${currentGcdStepIndex + 1}`;
                                  setGcdInputs(prev => ({
                                    ...prev,
                                    [stepKey]: { ...prev[stepKey], remainder: e.target.value }
                                  }));
                                  setGcdInputErrors(prev => ({
                                    ...prev,
                                    [stepKey]: { ...prev[stepKey], remainder: false }
                                  }));
                                }}
                                placeholder="Remainder"
                                style={{ width: '110px' }}
                                className={`text-xs px-1 ${
                                  gcdInputErrors[`step${currentGcdStepIndex + 1}`]?.remainder
                                    ? 'border-red-500 border-2'
                                    : 'border-blue-300'
                                }`}
                              />
                              <Button
                                onClick={handleGcdCheck}
                                className="bg-blue-400 hover:bg-blue-500 text-xs px-2 py-1"
                              >
                                Check
                              </Button>
                              <Button
                                onClick={() => {
                                  setGcdInputErrors({});
                                  setCurrentGcdStepIndex(prev => prev + 1);
                                  if (currentGcdStepIndex + 1 === gcdSteps.length - 1) {
                                    setShowAllGcdSteps(true);
                                    setIsNextStepLocked(false);
                                  }
                                }}
                                className="bg-gray-400 hover:bg-gray-500 text-xs px-2 py-1"
                              >
                                Skip
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {currentStepIndex < steps.length - 1 && (
                <Button
                  onClick={handleNextStep}
                  disabled={isNextStepLocked}
                  className={`px-6 py-2 font-bold ${
                    isNextStepLocked
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-950 text-white hover:bg-blue-900'
                  }`}
                >
                  Next Step
                </Button>
              )}

              {currentStepIndex === steps.length - 1 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-green-800 text-xl font-bold">Simplification Complete!</h3>
                  <p className="text-green-700">
                    You've successfully simplified the fraction to its lowest terms!
                  </p>
                </div>
              )}
            </div>
          )}
          
        </CardContent>
      </Card>
      <p className="text-center text-gray-600 mt-4">
        Fraction simplification is useful in mathematics, engineering, and everyday calculations
        for reducing fractions to their simplest form!
      </p>
    </div>
  );
};

export default RenamingFractions;