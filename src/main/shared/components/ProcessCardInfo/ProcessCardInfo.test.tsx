import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProcessCardInfo from './ProcessCardInfo';
import checkoutReducer from '../../../../stores/CheckoutSlice';
import notificationReducer from '../../../../stores/NotificationSlice';
import authReducer from '../../../../stores/AuthSlice';
import productReducer from '../../../../stores/ProductSlice';
import { Product } from '../../../dashboard/products/interfaces/Product';
import { RootState } from '../../../../stores';

// Mock the crypto.randomUUID function
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'crypto', {
    value: {
      randomUUID: () => '123e4567-e89b-12d3-a456-426614174000'
    }
  });
}

// Create a mock store
const createMockStore = (initialState: Partial<RootState> = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer.reducer,
      products: productReducer.reducer,
      checkout: checkoutReducer.reducer,
      notifications: notificationReducer.reducer
    },
    preloadedState: initialState as RootState
  });
};

// Mock product data
const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  price: 100,
  description: 'Test Description',
  stock: 10
};

describe('ProcessCardInfo Component', () => {
  const defaultProps = {
    item: mockProduct,
    isOpen: true,
    setIsOpen: jest.fn(),
    fee: 10
  };

  const renderComponent = (props = {}) => {
    const store = createMockStore();
    return render(
      <Provider store={store}>
        <ProcessCardInfo {...defaultProps} {...props} />
      </Provider>
    );
  };

  beforeEach(() => {
    // Create a div with id 'modal-process-card-info' for the portal
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-process-card-info');
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    // Clean up
    const modalRoot = document.getElementById('modal-process-card-info');
    if (modalRoot) {
      document.body.removeChild(modalRoot);
    }
  });

  it('renders the payment modal when isOpen is true', () => {
    renderComponent();
    expect(screen.getByText(/You're about to pay/)).toBeInTheDocument();
  });

  it('does not render the payment modal when isOpen is false', () => {
    renderComponent({ isOpen: false });
    expect(screen.queryByText(/You're about to pay/)).not.toBeInTheDocument();
  });

  it('displays correct total price including fee', () => {
    renderComponent();
    expect(screen.getByText(/110.00 USD/)).toBeInTheDocument();
  });

  it('closes modal when clicking outside', () => {
    renderComponent();
    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);
    expect(defaultProps.setIsOpen).toHaveBeenCalledWith(false);
  });

  it('validates required fields before submission', async () => {
    renderComponent();
    const submitButton = screen.getByText(/Pay \$110.00/);
    fireEvent.click(submitButton);

    // Check if error notification is shown
    await waitFor(() => {
      expect(screen.getByText('All fields are required')).toBeInTheDocument();
    });
  });

  it('validates card number using Luhn algorithm', async () => {
    renderComponent();
    
    // Fill in a valid card number
    const cardNumberInput = screen.getByPlaceholderText('1234 5678 9101 1123');
    fireEvent.change(cardNumberInput, { target: { value: '4532015112830366' } });

    // Fill in other required fields
    const cardHolderInput = screen.getByLabelText('Card holder');
    fireEvent.change(cardHolderInput, { target: { value: 'John Doe' } });

    const dateInput = screen.getByPlaceholderText('09/29');
    fireEvent.change(dateInput, { target: { value: '12/25' } });

    const cvvInput = screen.getByPlaceholderText('CVV');
    fireEvent.change(cvvInput, { target: { value: '123' } });

    // Fill in address fields
    const zipInput = screen.getByPlaceholderText('00000');
    fireEvent.change(zipInput, { target: { value: '12345' } });

    const streetInput = screen.getByPlaceholderText('Street, Apartment...');
    fireEvent.change(streetInput, { target: { value: '123 Main St' } });

    const cityInput = screen.getByLabelText('City');
    fireEvent.change(cityInput, { target: { value: 'New York' } });

    const stateInput = screen.getByLabelText('State');
    fireEvent.change(stateInput, { target: { value: 'NY' } });

    const countryInput = screen.getByLabelText('Country');
    fireEvent.change(countryInput, { target: { value: 'USA' } });

    // Check privacy checkboxes
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => {
      fireEvent.click(checkbox);
    });

    const submitButton = screen.getByText(/Pay \$110.00/);
    fireEvent.click(submitButton);

    // The form should submit successfully with valid card number
    await waitFor(() => {
      expect(screen.queryByText('The card is invalid!')).not.toBeInTheDocument();
    });
  });
}); 