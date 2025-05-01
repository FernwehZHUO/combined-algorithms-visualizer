const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

// Mock components
const Dropdown = ({ label, options, value, onChange }) => {
  return (
    <div>
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const Switch = ({ label, checked, onChange }) => {
  return (
    <div>
      <label>{label}</label>
      <input type="checkbox" checked={checked} onChange={onChange} />
    </div>
  );
};

const Checkbox = ({ label, checked, onChange }) => {
  return (
    <div>
      <label>{label}</label>
      <input type="checkbox" checked={checked} onChange={onChange} />
    </div>
  );
};

describe('UI Components', () => {
  describe('Dropdown Component', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' }
    ];
    const onChange = jest.fn();

    beforeEach(() => {
      onChange.mockClear();
    });

    test('renders the dropdown with options', () => {
      render(
        <Dropdown 
          label="Test Dropdown" 
          options={options} 
          value="option1" 
          onChange={onChange}
        />
      );
      
      expect(screen.getByText('Test Dropdown')).toBeInTheDocument();
      
      // Select dropdown and check options
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(select.value).toBe('option1');
      
      // Check if all options are in the document
      const optionElements = screen.getAllByRole('option');
      expect(optionElements.length).toBe(3);
      expect(optionElements[0].value).toBe('option1');
      expect(optionElements[1].value).toBe('option2');
      expect(optionElements[2].value).toBe('option3');
    });

    test('calls onChange when selecting an option', () => {
      render(
        <Dropdown 
          label="Test Dropdown" 
          options={options} 
          value="option1" 
          onChange={onChange}
        />
      );
      
      const select = screen.getByRole('combobox');
      
      // Change selection
      fireEvent.change(select, { target: { value: 'option2' } });
      
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('option2');
    });
  });

  describe('Switch Component', () => {
    const onChange = jest.fn();

    beforeEach(() => {
      onChange.mockClear();
    });

    test('renders with correct initial state', () => {
      render(
        <Switch 
          label="Test Switch" 
          checked={false} 
          onChange={onChange}
        />
      );
      
      expect(screen.getByText('Test Switch')).toBeInTheDocument();
      const switchElement = screen.getByRole('checkbox');
      expect(switchElement).not.toBeChecked();
    });

    test('renders checked when checked prop is true', () => {
      render(
        <Switch 
          label="Test Switch" 
          checked={true} 
          onChange={onChange}
        />
      );
      
      const switchElement = screen.getByRole('checkbox');
      expect(switchElement).toBeChecked();
    });

    test('calls onChange when clicked', () => {
      render(
        <Switch 
          label="Test Switch" 
          checked={false} 
          onChange={onChange}
        />
      );
      
      const switchElement = screen.getByRole('checkbox');
      
      // Click switch
      fireEvent.click(switchElement);
      
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('Checkbox Component', () => {
    const onChange = jest.fn();

    beforeEach(() => {
      onChange.mockClear();
    });

    test('renders with correct initial state', () => {
      render(
        <Checkbox 
          label="Test Checkbox" 
          checked={false} 
          onChange={onChange}
        />
      );
      
      expect(screen.getByText('Test Checkbox')).toBeInTheDocument();
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    test('renders checked when checked prop is true', () => {
      render(
        <Checkbox 
          label="Test Checkbox" 
          checked={true} 
          onChange={onChange}
        />
      );
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    test('calls onChange when clicked', () => {
      render(
        <Checkbox 
          label="Test Checkbox" 
          checked={false} 
          onChange={onChange}
        />
      );
      
      const checkbox = screen.getByRole('checkbox');
      
      // Click checkbox
      fireEvent.click(checkbox);
      
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(expect.any(Object));
    });
  });
}); 