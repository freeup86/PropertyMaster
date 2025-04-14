import React, { useState, useEffect } from 'react';
import { Property } from '../services/propertyService';
import { PropertyPerformance } from '../services/financialService';
import propertyService from '../services/propertyService';
import financialService from '../services/financialService';

interface PropertyComparisonToolProps {
  userId: string;
}

const PropertyComparisonTool: React.FC<PropertyComparisonToolProps> = ({ userId }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [performanceData, setPerformanceData] = useState<PropertyPerformance[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await propertyService.getProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
  
    fetchProperties();
  }, [userId]);

  const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValues = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedProperties(selectedValues);
  };

  const handleCompareProperties = async () => {
    try {
      const performancePromises = selectedProperties.map((propertyId) =>
        financialService.getPropertyPerformance(propertyId)
      );
      const performanceResults = await Promise.all(performancePromises);
      setPerformanceData(performanceResults);
    } catch (error) {
      console.error('Error fetching property performance data:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Property Comparison Tool</h2>
      <select
        multiple
        value={selectedProperties}
        onChange={handleSelectionChange}
        className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
      >
        {properties.map((property) => (
          <option key={property.id} value={property.id}>
            {property.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleCompareProperties}
        className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Compare Properties
      </button>
      <div className="mt-6">
        {performanceData.map((performance) => (
          <div key={performance.propertyId} className="mb-4">
            <h3 className="text-xl font-bold">{performance.propertyName}</h3>
            <p>Cash on Cash Return: {performance.cashOnCashReturn.toFixed(2)}%</p>
            <p>Annualized Return: {performance.annualizedReturn.toFixed(2)}%</p>
            {/* Add more performance metrics as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyComparisonTool;