import './ProcessCardInfo.css'
import { createPortal } from "react-dom";

export default function ProcessCardInfo() {
    return createPortal(
        <dialog className='process-main'>
            <div className='process-modal'>
                <div className='title-transaction'>
                    <p>Pagar tal vaina</p>
                </div>

                <form className='form-payment'>
                    <div className='form-field'>
                        <label htmlFor="">Email</label>
                        <input type="email" placeholder='email@example.com' required/>
                    </div>

                    <div className='form-credit-card-info'>
                        <label htmlFor="">Credit card Information</label>

                        <div className='form-card-data'>
                            <div className='form-29ef0569e044'>
                                <input type="text" />
                                <p>vec</p>
                            </div>
                            <div className='form-0992d97d7464'>
                                <div>
                                    <input type="text" placeholder='09/29' id='i-date'/>
                                </div>
                                <div>
                                    <input type="password" placeholder='CVV or CVC' id='i-code'/>
                                </div>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </dialog>,
        document.getElementById('modal-process-card-info')!
    )
}