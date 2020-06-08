import { ReactElement, useState, useRef, createRef } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import {
  IFetchResult,
} from "../../model/model.typing";
import * as utils from "../../utilities/utilities"

const TaskAdminSupport: React.FunctionComponent = (): ReactElement => {
  const nonceContactForm = useStoreState(store => store.components.task.nonceContactForm)
  const [isContactFormVisible, setContactFormVisibility] = useState(false)
  const [isMessageSent, setMessageSent] = useState(false)
  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    message: false,
  })
  const contactForm = createRef()

  const submitContactForm = () => {

    let name = contactForm.current.querySelector("input[name=name]").value
    let email = contactForm.current.querySelector("input[name=email]").value
    let message = contactForm.current.querySelector("textarea[name=message]").value

    setFormErrors({
      ...formErrors, 
      name: !name, 
      email: !email, 
      message: !message
    })

    if(!name || !email || !message) {
      return
    }

    var page_url;
    try {
      page_url = window.location.href;
    } catch(ex){}

    let formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('message', message)
    formData.append('page_url', page_url)
    formData.append('nonce', nonceContactForm)

    let action = 'add-message'
    fetch(utils.getAjaxUrl(action), {
        method: 'post',
        body: formData,
    })
    .then(res => {
        try {
            return res.json()
        } catch(ex) {
            utils.showAjaxError({action, error: ex})
            return {}
        }
    })
    .then(
        (result: IFetchResult) => {
            if(result.status == 'fail') {
                return utils.showAjaxError({message: result.message})
            }

            setMessageSent(true)
        },
        (error) => {
            utils.showAjaxError({action, error})
        }
    )

    setContactFormVisibility(false)
  }

  return (
    <div className="something-wrong-with-task">
      {!isContactFormVisible && !isMessageSent &&
      <a href="#" className="contact-admin" onClick={(e) => {
        e.preventDefault();
        setMessageSent(false)
        setContactFormVisibility(true)
      }}>
        Что-то не так с задачей? Напиши администратору
      </a>
      }

      {isMessageSent &&
      <div className="contact-admin">Сообщение отправлено</div>
      }

      {isContactFormVisible &&
      <div className="contact-form">
        <form ref={contactForm}>

          <div className="form-group">
            <input type="text" className={`form-control input-sm ${formErrors.name ? "error" : ""}`} name="name" placeholder="Ваше имя" />
          </div>

          <div className="form-group">
            <input type="text" className={`form-control input-sm ${formErrors.email ? "error" : ""}`} name="email" placeholder="Email" />
          </div>

          <div className="form-group">
            <label>Ваше сообщение:</label>
            <textarea className={`form-control input-sm ${formErrors.message ? "error" : ""}`} name="message"></textarea>
          </div>

          <div className="action-block">
            <a className="primary-button" href="#" onClick={(e) => {
              e.preventDefault();
              submitContactForm()
            }}>Отправить</a>

            <a className="secondary-button" href="#" onClick={(e) => {
              e.preventDefault();
              setContactFormVisibility(false)
            }}>Отменить</a>
          </div>

        </form>

        <div id="result-message" className="alert alert-info contact-form-result"></div>

      </div>
      }
    </div>
  );
};

export default TaskAdminSupport;
