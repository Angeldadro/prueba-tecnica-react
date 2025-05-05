import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
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

const mockDispatch = jest.fn().mockImplementation((action) => {
  if (typeof action === 'function') {
    return action(mockDispatch);
  }
  return action;
});

const mockAddNotification = jest.fn().mockImplementation((payload) => {
  console.log('Mock notification called with:', payload);
  return (dispatch: any) => {
    dispatch({
      type: 'notifications/addNotification',
      payload: payload
    });
    return Promise.resolve({
      type: 'notifications/addNotification',
      payload: payload
    });
  };
});

jest.mock('../../../../stores/NotificationSlice', () => ({
  ...jest.requireActual('../../../../stores/NotificationSlice') as any,
  addNotificationWithTimeout: mockAddNotification
}));

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'crypto', {
    value: {
      randomUUID: () => '123e4567-e89b-12d3-a456-426614174000'
    }
  });
}

const createMockStore = (initialState: Partial<RootState> = {}) => {
  const store = configureStore({
    reducer: {
      auth: authReducer.reducer,
      products: productReducer.reducer,
      checkout: checkoutReducer.reducer,
      notifications: notificationReducer.reducer
    },
    preloadedState: {
      notifications: {
        notifications: []
      },
      ...initialState
    } as RootState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        thunk: true
      })
  });

  if (typeof window !== 'undefined') {
    (window as any).store = store;
  }
  
  return store;
};

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

    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-process-card-info');
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {

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
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ProcessCardInfo {...defaultProps} />
      </Provider>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/You're about to pay/)).toBeInTheDocument();


    const termsCheckbox = screen.getByLabelText('Terms and conditions');
    const personalDataCheckbox = screen.getByLabelText('Personal data authorization');
    fireEvent.click(termsCheckbox);
    fireEvent.click(personalDataCheckbox);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      const state = store.getState();
      const notifications = state.notifications.notifications;
      expect(notifications.length).toBeGreaterThan(0);
      expect(notifications[0].message).toBe('All fields are required');
    }, { timeout: 3000 });
  });

  it('validates card number using Luhn algorithm - valid case', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ProcessCardInfo {...defaultProps} />
      </Provider>
    );

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const cardNumberInput = screen.getByPlaceholderText('1234 5678 9101 1123');
    fireEvent.change(cardNumberInput, { target: { value: '4532015112830366' } });

    const cardHolderInput = screen.getByLabelText('Card holder');
    fireEvent.change(cardHolderInput, { target: { value: 'John Doe' } });

    const dateInput = screen.getByPlaceholderText('09/29');
    fireEvent.change(dateInput, { target: { value: '12/25' } });

    const cvvInput = screen.getByPlaceholderText('CVV');
    fireEvent.change(cvvInput, { target: { value: '123' } });

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

    const termsCheckbox = screen.getByLabelText('Terms and conditions');
    const personalDataCheckbox = screen.getByLabelText('Personal data authorization');
    fireEvent.click(termsCheckbox);
    fireEvent.click(personalDataCheckbox);

    const form = screen.getByRole('form');
    fireEvent.submit(form);


    await waitFor(() => {
      const state = store.getState();
      const notifications = state.notifications.notifications;
      const hasInvalidCardNotification = notifications.some(
        n => n.message === 'The card is invalid!'
      );
      expect(hasInvalidCardNotification).toBe(false);
    }, { timeout: 3000 });
  });
  
  it('validates card number using Luhn algorithm - invalid case', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ProcessCardInfo {...defaultProps} />
      </Provider>
    );

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const cardNumberInput = screen.getByPlaceholderText('1234 5678 9101 1123');
    fireEvent.change(cardNumberInput, { target: { value: '1234567890123456' } });

    const cardHolderInput = screen.getByLabelText('Card holder');
    fireEvent.change(cardHolderInput, { target: { value: 'John Doe' } });

    const dateInput = screen.getByPlaceholderText('09/29');
    fireEvent.change(dateInput, { target: { value: '12/25' } });

    const cvvInput = screen.getByPlaceholderText('CVV');
    fireEvent.change(cvvInput, { target: { value: '123' } });

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


    const termsCheckbox = screen.getByLabelText('Terms and conditions');
    const personalDataCheckbox = screen.getByLabelText('Personal data authorization');
    fireEvent.click(termsCheckbox);
    fireEvent.click(personalDataCheckbox);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      const state = store.getState();
      const notifications = state.notifications.notifications;
      const hasInvalidCardNotification = notifications.some(
        n => n.message === 'The card is invalid!'
      );
      expect(hasInvalidCardNotification).toBe(true);
    }, { timeout: 3000 });
  });
});
