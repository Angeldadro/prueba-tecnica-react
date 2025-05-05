import './ProcessCardInfo.css'
import { createPortal } from "react-dom";
import Button from '../common/Button/Button';
// svgs
import CardIcon from '../../../../assets/svgs/checkout/CardIcon';
import VisaIcon from '../../../../assets/svgs/checkout/VisaIcon';
import { Product } from '../../../dashboard/products/interfaces/Product';
import React, { useEffect, useState } from 'react';
// interfaces
import { ICreateOrderPayload } from './interfaces/CreateOrder';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../stores';
import { getAcceptenceToken, validatePayment } from '../../../../stores/CheckoutSlice';
import { addNotificationWithTimeout } from '../../../../stores/NotificationSlice';
// validator
import { isValidLuhn } from './services/CardValidator';
import MasterCardIcon from '../../../../assets/svgs/checkout/MasterCardIcon';
import DiscoverIcon from '../../../../assets/svgs/checkout/DiscoverIcon';
import DinnersClubIcon from '../../../../assets/svgs/checkout/DinnersClubIcon';
import JcbIcon from '../../../../assets/svgs/checkout/JcbIcon';

interface ProcessCardInfo {
    item: Product;
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    fee: number;
}

export default function ProcessCardInfo({ item, isOpen, setIsOpen, fee }: ProcessCardInfo) {
    const [transaction, setTransaction] = useState<ICreateOrderPayload>({
        id: '',
        paymentDetails: {
            cardHolder: '',
            expiryMonth: '',
            expiryYear: '',
            cardNumber: '',
            cvv: ''
        },
        shippingAddress: {
            street: '',
            state: '',
            zipCode: '',
            country: '',
            city: ''
        },
        items: [],
        acceptenceToken: ''
    })

    const [privacy, setPrivacy] = useState<{ terms: boolean, personalData: boolean }>({ terms: false, personalData: false })

    const dispatcher: AppDispatch = useDispatch();
    const { error, status } = useSelector((state: RootState) => state.checkout)
    const { acceptenceToken } = useSelector((state: RootState) => state.checkout)

    const handleCloseModal = () => {
        setIsOpen(false);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const id = crypto.randomUUID().split('-')[4]

        const NewOrder: ICreateOrderPayload = {
            id: id,
            items: [
                {
                    id: crypto.randomUUID(),
                    itemId: item.id,
                    quantity: 1
                }
            ],
            shippingAddress: transaction.shippingAddress,
            paymentDetails: transaction.paymentDetails,
            acceptenceToken: acceptenceToken?.data.presigned_acceptance.acceptance_token
        }

        if (transaction.shippingAddress.city === '' || transaction.shippingAddress.zipCode === '' || transaction.shippingAddress.country === ''
            || transaction.shippingAddress.state === '' || transaction.shippingAddress.street === ''
            || transaction.paymentDetails.cardNumber === '' || transaction.paymentDetails.cvv === '' 
            || transaction.paymentDetails.expiryMonth === '' || transaction.paymentDetails.expiryYear === ''
            || transaction.paymentDetails.cardHolder === ''
        ) {
            console.log('Dispatching notification...');
            try {
                await dispatcher(addNotificationWithTimeout({
                    message: 'All fields are required',
                    type: 'error'
                }));
                console.log('Notification dispatched');
            } catch (error) {
                console.error('Error dispatching notification:', error);
            }
            return;
        }

        if (transaction.paymentDetails.expiryMonth.length < 2 || transaction.paymentDetails.expiryYear.length < 2) {
            await dispatcher(addNotificationWithTimeout({
                message: 'Expiration date is invalid! Use 00/00 format instead.',
                type: 'warning'
            }))
            return
        }

        if (!isValidLuhn(transaction.paymentDetails.cardNumber)) {
            await dispatcher(addNotificationWithTimeout({
                message: 'The card is invalid!',
                type: 'warning'
            }))
            return
        }
        
        console.log(NewOrder)
        await dispatcher(validatePayment(NewOrder))
    }

    useEffect(() => {
        if (status === 'failed') {
            dispatcher(addNotificationWithTimeout({
                message: error ? error : 'An error has occurred.',
                type: 'error'
            }))
        }

        if (status === 'succeeded') {
            dispatcher(addNotificationWithTimeout({
                message: 'Order has been created successfully!',
                type: 'success'
            }))
        }
    }, [status, error])

    const handleCardDate = (dateCard: string) => {
        if (!dateCard) return
        if (dateCard.length === 5) {
            const splittedDate = dateCard.split('/')
            if (splittedDate[0].length == 2 && splittedDate[1].length === 2) {
                setTransaction({ ...transaction, paymentDetails: 
                    { 
                        cvv: transaction.paymentDetails.cvv,
                        cardNumber: transaction.paymentDetails.cardNumber,
                        expiryMonth: splittedDate[0],
                        expiryYear: splittedDate[1],
                        cardHolder: transaction.paymentDetails.cardHolder
                    }
                })
            }
        }
    }

    const isAccepted = () => {
        if (privacy.terms === false || privacy.personalData === false) {
            return 'active'
        }

        return ''
    } 

    const handleGetAcceptenceToken = () => {
        dispatcher(getAcceptenceToken())
        console.log(acceptenceToken?.data.presigned_acceptance.acceptance_token)
    }

    return createPortal(
        isOpen ? (
            <dialog 
                className={`process-main ${isOpen ? 'active' : ''}`} 
                onClick={handleCloseModal} 
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialog-title"
                open={isOpen}
            >
                <div className={`process-modal ${isOpen ? 'active' : ''}`} onClick={(e) => {e.stopPropagation()}}>
                    <div className='title-transaction'>
                        <p id="dialog-title">You're about to pay <strong>{(item.price ? item.price + fee : item.price)?.toFixed(2)} USD</strong></p>
                        <span onClick={handleCloseModal}>X</span>
                    </div>

                    <form className='form-payment' onSubmit={handleSubmit} role="form">
                        <div className='form-payment-cn'>
                            <div className='form-field'>
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" placeholder='email@example.com' required />
                            </div>

                            <div className='form-credit-card-info'>
                                <label htmlFor="credit-card">Credit card Information</label>
                                <div className='form-card-data'>
                                    <div className='form-29ef0569e044'>
                                        <input type="text" id="card-number" placeholder='1234 5678 9101 1123' name='card-number'
                                        onChange={(e) => 
                                            setTransaction({ ...transaction, 
                                            paymentDetails: { 
                                            cardNumber: e.target.value, 
                                            expiryMonth: transaction.paymentDetails.expiryMonth, 
                                            expiryYear: transaction.paymentDetails.expiryYear,
                                            cvv: transaction.paymentDetails.cvv,
                                            cardHolder: transaction.paymentDetails.cardHolder
                                        }})}
                                        value={transaction.paymentDetails.cardNumber}
                                        />
                                        <div className='card-icon-lil'>
                                            <CardIcon />
                                        </div>
                                    </div>
                                    
                                    <div className='form-0992d97d7464'>
                                        <div>
                                            <input type="text" placeholder='09/29' id='i-date' maxLength={5} name='date' 
                                            onChange={(e) => {handleCardDate(e.target.value)}}
                                            />
                                        </div>
                                        <div>
                                            <input type="password" placeholder='CVV' id='i-code' maxLength={4} name='code'
                                            onChange={(e) => 
                                                setTransaction({ ...transaction, 
                                                paymentDetails: { 
                                                cardNumber: transaction.paymentDetails.cardNumber, 
                                                expiryMonth: transaction.paymentDetails.expiryMonth, 
                                                expiryYear: transaction.paymentDetails.expiryYear,
                                                cvv: e.target.value,
                                                cardHolder: transaction.paymentDetails.cardHolder
                                            }})}
                                            value={transaction.paymentDetails.cvv}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='form-cards-logos'>
                                    <VisaIcon />
                                    <MasterCardIcon />
                                    <DiscoverIcon />
                                    <DinnersClubIcon />
                                    <JcbIcon />
                                </div>
                            </div>

                            <div className='form-field'>
                                <label htmlFor="card-holder">Card holder</label>
                                <input type="text" id="card-holder" required
                                onChange={(e) => 
                                    setTransaction({ ...transaction, 
                                    paymentDetails: { 
                                    cardNumber: transaction.paymentDetails.cardNumber, 
                                    expiryMonth: transaction.paymentDetails.expiryMonth, 
                                    expiryYear: transaction.paymentDetails.expiryYear,
                                    cvv: transaction.paymentDetails.cvv,
                                    cardHolder: e.target.value
                                }})}
                                value={transaction.paymentDetails.cardHolder}
                                />
                            </div>

                            <div className='form-field'>
                                <label htmlFor="zip-code">Zip code</label>
                                <input type="text" id="zip-code" required placeholder='00000'
                                onChange={(e) => 
                                    setTransaction({ ...transaction, 
                                        shippingAddress: {
                                            zipCode: e.target.value,
                                            state: transaction.shippingAddress.state,
                                            street: transaction.shippingAddress.street,
                                            city: transaction.shippingAddress.city,
                                            country: transaction.shippingAddress.country        
                                        }
                                    })}
                                    value={transaction.shippingAddress.zipCode}
                                />
                            </div>

                            <div className='form-field'>
                                <label htmlFor="street">Street</label>
                                <input type="text" id="street" required placeholder='Street, Apartment...' name='street'
                                onChange={(e) => 
                                    setTransaction({ ...transaction, 
                                        shippingAddress: {
                                            zipCode: transaction.shippingAddress.zipCode,
                                            state: transaction.shippingAddress.state,
                                            street: e.target.value,
                                            city: transaction.shippingAddress.city,
                                            country: transaction.shippingAddress.country        
                                        }
                                    })}
                                    value={transaction.shippingAddress.street}
                                />
                            </div>

                            <div className='form-field'>
                                <label htmlFor="city">City</label>
                                <input type="text" id="city" required name='city'
                                onChange={(e) => 
                                    setTransaction({ ...transaction, 
                                        shippingAddress: {
                                            zipCode: transaction.shippingAddress.zipCode,
                                            state: transaction.shippingAddress.state,
                                            street: transaction.shippingAddress.street,
                                            city: e.target.value,
                                            country: transaction.shippingAddress.country        
                                        }
                                    })}
                                    value={transaction.shippingAddress.city}
                                />
                            </div>

                            <div className='form-field'>
                                <label htmlFor="state">State</label>
                                <input type="text" id="state" required name='state'
                                onChange={(e) => 
                                    setTransaction({ ...transaction, 
                                        shippingAddress: {
                                            zipCode: transaction.shippingAddress.zipCode,
                                            state: e.target.value,
                                            street: transaction.shippingAddress.street,
                                            city: transaction.shippingAddress.city,
                                            country: transaction.shippingAddress.country        
                                        }
                                    })}
                                    value={transaction.shippingAddress.state}
                                />
                            </div>

                            <div className='form-field'>
                                <label htmlFor="country">Country</label>
                                <input type="text" id="country" required name='country'
                                onChange={(e) => 
                                    setTransaction({ ...transaction, 
                                        shippingAddress: {
                                            zipCode: transaction.shippingAddress.zipCode,
                                            state: transaction.shippingAddress.state,
                                            street: transaction.shippingAddress.street,
                                            city: transaction.shippingAddress.city,
                                            country: e.target.value        
                                        }
                                    })}
                                    value={transaction.shippingAddress.country}
                                />
                            </div>

                            <div className='form-privacy'>
                                <div className='form-terms-and-conditions'>
                                    <input 
                                        type="checkbox" 
                                        id="terms"
                                        aria-label="Terms and conditions"
                                        onChange={(e) => {
                                            setPrivacy({ ...privacy, terms: e.target.checked })
                                        }}
                                        onClick={handleGetAcceptenceToken}
                                    />
                                    <p>I agree that I have read the regulations and privacy policy to make this payment.</p>
                                </div>

                                <div className='form-terms-and-conditions'>
                                    <input 
                                        type="checkbox" 
                                        id="personal-data"
                                        aria-label="Personal data authorization"
                                        onChange={(e) => {
                                            setPrivacy({ ...privacy, personalData: e.target.checked })
                                        }}
                                    />
                                    <p>I accept the authorization for the management of personal data.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className='pay-button'>
                            {status === 'loading' ?
                            <div className='loading-spin'></div> 
                            : 
                            <Button type='submit' className={`pay-button-aw ${isAccepted()}`}>
                                Pay ${(item.price ? item.price + fee : item.price)?.toFixed(2)}
                            </Button>    
                            }
                        </div>
                    </form>
                </div>
            </dialog>
        ) : null,
        document.getElementById('modal-process-card-info')!
    )
}